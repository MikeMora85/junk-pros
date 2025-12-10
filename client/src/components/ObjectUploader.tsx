// Simple file uploader component with image compression for object storage
import { useState, useRef } from "react";
import type { ReactNode, ChangeEvent } from "react";

interface ObjectUploaderProps {
  maxNumberOfFiles?: number;
  maxFileSize?: number;
  onGetUploadParameters: (file: File) => Promise<{
    method: "PUT";
    url: string;
  }>;
  onComplete?: (result: { successful: Array<{ name: string }> }) => void;
  buttonClassName?: string;
  children: ReactNode;
}

// Compress image to target size (default 500KB)
async function compressImage(file: File, maxSizeKB: number = 500): Promise<File> {
  // Skip if not an image
  if (!file.type.startsWith('image/')) {
    return file;
  }

  // Skip if already small enough
  const maxSizeBytes = maxSizeKB * 1024;
  if (file.size <= maxSizeBytes) {
    console.log(`Image already under ${maxSizeKB}KB, skipping compression`);
    return file;
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      // Calculate new dimensions (max 1920px on longest side for web)
      let { width, height } = img;
      const maxDimension = 1920;
      
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }

      canvas.width = width;
      canvas.height = height;
      
      if (!ctx) {
        resolve(file);
        return;
      }

      // Draw image on canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Try different quality levels to get under target size
      const tryCompress = (quality: number): void => {
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              resolve(file);
              return;
            }

            console.log(`Compressed to ${Math.round(blob.size / 1024)}KB at quality ${Math.round(quality * 100)}%`);

            // If still too large and quality can be reduced, try again
            if (blob.size > maxSizeBytes && quality > 0.3) {
              tryCompress(quality - 0.1);
              return;
            }

            // Create new file from blob
            const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });

            console.log(`Original: ${Math.round(file.size / 1024)}KB -> Compressed: ${Math.round(compressedFile.size / 1024)}KB`);
            resolve(compressedFile);
          },
          'image/jpeg',
          quality
        );
      };

      // Start with 80% quality
      tryCompress(0.8);
    };

    img.onerror = () => {
      console.error('Failed to load image for compression');
      resolve(file); // Return original on error
    };

    // Load image from file
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export function ObjectUploader({
  maxFileSize = 10485760, // 10MB default (before compression)
  onGetUploadParameters,
  onComplete,
  buttonClassName,
  children,
}: ObjectUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    
    if (file.size > maxFileSize) {
      alert(`File is too large. Maximum size is ${Math.round(maxFileSize / 1024 / 1024)}MB`);
      return;
    }

    setIsUploading(true);
    setUploadStatus('Compressing...');
    
    try {
      // Compress image if it's an image file
      const processedFile = await compressImage(file, 500);
      
      setUploadStatus('Uploading...');
      
      // Get the upload parameters with the processed file
      const uploadParams = await onGetUploadParameters(processedFile);
      
      const response = await fetch(uploadParams.url, {
        method: uploadParams.method,
        body: processedFile,
        headers: {
          'Content-Type': processedFile.type,
        },
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      onComplete?.({ successful: [{ name: processedFile.name }] });
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadStatus('');
      // Reset input so the same file can be selected again
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        style={{ display: 'none' }}
        data-testid="input-file-upload"
      />
      <button 
        onClick={handleClick} 
        className={buttonClassName} 
        type="button" 
        disabled={isUploading}
        data-testid="button-upload-logo"
      >
        {isUploading ? uploadStatus || 'Processing...' : children}
      </button>
    </div>
  );
}

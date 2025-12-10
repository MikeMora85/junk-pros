import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface OptimizedImageResult {
  thumbnailUrl: string;
  fullUrl: string;
  publicId: string;
}

export interface CloudinaryUploadOptions {
  folder?: string;
  publicId?: string;
}

export async function uploadOptimizedImage(
  fileBuffer: Buffer,
  options: CloudinaryUploadOptions = {}
): Promise<OptimizedImageResult> {
  const folder = options.folder || 'junk-pros';
  
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: options.publicId,
        resource_type: 'image',
        transformation: [
          { width: 1200, crop: 'limit' },
          { quality: 'auto:good', fetch_format: 'auto' }
        ],
        eager: [
          { width: 400, crop: 'limit', quality: 'auto:good', fetch_format: 'auto' }
        ],
        eager_async: false,
      },
      (error, result) => {
        if (error) {
          console.error('Cloudinary upload error:', error);
          reject(new Error(`Failed to upload image: ${error.message}`));
          return;
        }
        
        if (!result) {
          reject(new Error('No result from Cloudinary upload'));
          return;
        }

        const fullUrl = cloudinary.url(result.public_id, {
          transformation: [
            { width: 1200, crop: 'limit' },
            { quality: 'auto:good', fetch_format: 'auto' }
          ],
          secure: true,
        });

        const thumbnailUrl = result.eager?.[0]?.secure_url || 
          cloudinary.url(result.public_id, {
            transformation: [
              { width: 400, crop: 'limit' },
              { quality: 'auto:good', fetch_format: 'auto' }
            ],
            secure: true,
          });

        resolve({
          thumbnailUrl,
          fullUrl,
          publicId: result.public_id,
        });
      }
    );
    
    uploadStream.end(fileBuffer);
  });
}

export async function uploadOptimizedImageFromUrl(
  imageUrl: string,
  options: CloudinaryUploadOptions = {}
): Promise<OptimizedImageResult> {
  const folder = options.folder || 'junk-pros';
  
  try {
    const result: UploadApiResponse = await cloudinary.uploader.upload(imageUrl, {
      folder,
      public_id: options.publicId,
      resource_type: 'image',
      transformation: [
        { width: 1200, crop: 'limit' },
        { quality: 'auto:good', fetch_format: 'auto' }
      ],
      eager: [
        { width: 400, crop: 'limit', quality: 'auto:good', fetch_format: 'auto' }
      ],
      eager_async: false,
    });

    const fullUrl = cloudinary.url(result.public_id, {
      transformation: [
        { width: 1200, crop: 'limit' },
        { quality: 'auto:good', fetch_format: 'auto' }
      ],
      secure: true,
    });

    const thumbnailUrl = result.eager?.[0]?.secure_url || 
      cloudinary.url(result.public_id, {
        transformation: [
          { width: 400, crop: 'limit' },
          { quality: 'auto:good', fetch_format: 'auto' }
        ],
        secure: true,
      });

    return {
      thumbnailUrl,
      fullUrl,
      publicId: result.public_id,
    };
  } catch (error: any) {
    console.error('Cloudinary URL upload error:', error);
    throw new Error(`Failed to upload image from URL: ${error.message}`);
  }
}

export async function deleteImage(publicId: string): Promise<boolean> {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result.result === 'ok';
  } catch (error: any) {
    console.error('Cloudinary delete error:', error);
    return false;
  }
}

export function isCloudinaryUrl(url: string): boolean {
  return url.includes('cloudinary.com') || url.includes('res.cloudinary.com');
}

export function isLocalObjectStorageUrl(url: string): boolean {
  return url.startsWith('/objects/') || url.startsWith('data:image/');
}

export function getOptimizedUrl(publicIdOrUrl: string, width: number = 1200): string {
  if (isCloudinaryUrl(publicIdOrUrl)) {
    return publicIdOrUrl;
  }
  
  return cloudinary.url(publicIdOrUrl, {
    transformation: [
      { width, crop: 'limit' },
      { quality: 'auto:good', fetch_format: 'auto' }
    ],
    secure: true,
  });
}

export function getThumbnailUrl(publicIdOrUrl: string, width: number = 400): string {
  if (isCloudinaryUrl(publicIdOrUrl)) {
    const url = new URL(publicIdOrUrl);
    const pathParts = url.pathname.split('/upload/');
    if (pathParts.length === 2) {
      return `${url.origin}/image/upload/w_${width},c_limit,q_auto:good,f_auto/${pathParts[1]}`;
    }
    return publicIdOrUrl;
  }
  
  return cloudinary.url(publicIdOrUrl, {
    transformation: [
      { width, crop: 'limit' },
      { quality: 'auto:good', fetch_format: 'auto' }
    ],
    secure: true,
  });
}

export { cloudinary };

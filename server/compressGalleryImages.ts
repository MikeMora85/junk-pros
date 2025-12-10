// Script to compress all existing gallery images to under 500KB
import sharp from 'sharp';
import { db } from './db';
import { companies } from '@shared/schema';
import { isNotNull, sql } from 'drizzle-orm';
import { ObjectStorageService, objectStorageClient, parseObjectPath } from './objectStorage';

const TARGET_SIZE_KB = 500;
const TARGET_SIZE_BYTES = TARGET_SIZE_KB * 1024;

interface CompressionResult {
  path: string;
  originalSize: number;
  compressedSize: number;
  skipped: boolean;
  error?: string;
}

async function compressImage(buffer: Buffer, quality: number = 80): Promise<Buffer> {
  return sharp(buffer)
    .resize(1920, 1920, { 
      fit: 'inside', 
      withoutEnlargement: true 
    })
    .jpeg({ quality, mozjpeg: true })
    .toBuffer();
}

async function compressToTargetSize(buffer: Buffer): Promise<Buffer> {
  // If already small enough, return as-is
  if (buffer.length <= TARGET_SIZE_BYTES) {
    return buffer;
  }

  // Try different quality levels
  const qualities = [80, 70, 60, 50, 40, 30];
  
  for (const quality of qualities) {
    const compressed = await compressImage(buffer, quality);
    console.log(`  Quality ${quality}%: ${Math.round(compressed.length / 1024)}KB`);
    
    if (compressed.length <= TARGET_SIZE_BYTES) {
      return compressed;
    }
  }

  // Return lowest quality version even if still over target
  return compressImage(buffer, 30);
}

async function downloadObject(objectPath: string): Promise<Buffer> {
  const objectStorageService = new ObjectStorageService();
  const file = await objectStorageService.getObjectEntityFile(objectPath);
  const [contents] = await file.download();
  return contents;
}

async function uploadObject(objectPath: string, buffer: Buffer): Promise<void> {
  const objectStorageService = new ObjectStorageService();
  
  // Get the private dir and construct full path
  const privateDir = process.env.PRIVATE_OBJECT_DIR || '';
  const pathParts = objectPath.slice('/objects/'.length);
  const fullPath = `${privateDir}/${pathParts}`;
  
  const { bucketName, objectName } = parseObjectPath(fullPath);
  const bucket = objectStorageClient.bucket(bucketName);
  const file = bucket.file(objectName);
  
  await file.save(buffer, {
    contentType: 'image/jpeg',
    metadata: {
      cacheControl: 'public, max-age=31536000',
    },
  });
}

async function processGalleryImage(imagePath: string): Promise<CompressionResult> {
  const result: CompressionResult = {
    path: imagePath,
    originalSize: 0,
    compressedSize: 0,
    skipped: false,
  };

  try {
    // Download the image
    console.log(`Processing: ${imagePath}`);
    const originalBuffer = await downloadObject(imagePath);
    result.originalSize = originalBuffer.length;
    
    console.log(`  Original size: ${Math.round(result.originalSize / 1024)}KB`);

    // Skip if already small enough
    if (result.originalSize <= TARGET_SIZE_BYTES) {
      console.log(`  Already under ${TARGET_SIZE_KB}KB, skipping`);
      result.skipped = true;
      result.compressedSize = result.originalSize;
      return result;
    }

    // Compress the image
    const compressedBuffer = await compressToTargetSize(originalBuffer);
    result.compressedSize = compressedBuffer.length;

    // Upload the compressed version
    await uploadObject(imagePath, compressedBuffer);
    
    console.log(`  Compressed: ${Math.round(result.originalSize / 1024)}KB -> ${Math.round(result.compressedSize / 1024)}KB`);
    
    return result;
  } catch (error: any) {
    console.error(`  Error: ${error.message}`);
    result.error = error.message;
    return result;
  }
}

export async function compressAllGalleryImages(): Promise<{
  processed: number;
  compressed: number;
  skipped: number;
  failed: number;
  totalSavedKB: number;
  results: CompressionResult[];
}> {
  console.log('Starting gallery image compression...');
  
  // Get all companies with gallery images
  const companiesWithGallery = await db
    .select({ id: companies.id, name: companies.name, galleryImages: companies.galleryImages })
    .from(companies)
    .where(isNotNull(companies.galleryImages));

  const allImages: string[] = [];
  
  for (const company of companiesWithGallery) {
    if (company.galleryImages && Array.isArray(company.galleryImages)) {
      allImages.push(...company.galleryImages);
    }
  }

  console.log(`Found ${allImages.length} gallery images to process`);

  const results: CompressionResult[] = [];
  let compressed = 0;
  let skipped = 0;
  let failed = 0;
  let totalSavedBytes = 0;

  for (const imagePath of allImages) {
    const result = await processGalleryImage(imagePath);
    results.push(result);

    if (result.error) {
      failed++;
    } else if (result.skipped) {
      skipped++;
    } else {
      compressed++;
      totalSavedBytes += result.originalSize - result.compressedSize;
    }
  }

  const summary = {
    processed: allImages.length,
    compressed,
    skipped,
    failed,
    totalSavedKB: Math.round(totalSavedBytes / 1024),
    results,
  };

  console.log('\nCompression complete!');
  console.log(`  Processed: ${summary.processed}`);
  console.log(`  Compressed: ${summary.compressed}`);
  console.log(`  Skipped (already small): ${summary.skipped}`);
  console.log(`  Failed: ${summary.failed}`);
  console.log(`  Total saved: ${summary.totalSavedKB}KB`);

  return summary;
}

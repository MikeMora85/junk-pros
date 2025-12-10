import { db } from '../server/db';
import { companies } from '../shared/schema';
import { uploadOptimizedImageFromUrl, isCloudinaryUrl, isLocalObjectStorageUrl } from '../server/cloudinaryService';

async function migrateImages() {
  console.log('Starting image migration to Cloudinary...');
  
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('ERROR: Cloudinary environment variables not set.');
    console.error('Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET');
    process.exit(1);
  }

  const allCompanies = await db.select().from(companies);
  console.log(`Found ${allCompanies.length} companies to process`);

  let successCount = 0;
  let errorCount = 0;
  let skippedCount = 0;

  for (const company of allCompanies) {
    try {
      let updates: Partial<typeof companies.$inferInsert> = {};
      let hasUpdates = false;

      if (company.logoUrl && !isCloudinaryUrl(company.logoUrl)) {
        if (isLocalObjectStorageUrl(company.logoUrl) || company.logoUrl.startsWith('data:image/')) {
          console.log(`  Skipping logo for ${company.name} - local storage or data URL`);
          skippedCount++;
        } else {
          console.log(`  Migrating logo for ${company.name}...`);
          try {
            const result = await uploadOptimizedImageFromUrl(company.logoUrl, {
              folder: `junk-pros/logos/${company.id}`,
            });
            updates.logoUrl = result.fullUrl;
            updates.logoThumbnailUrl = result.thumbnailUrl;
            hasUpdates = true;
            console.log(`    Logo migrated successfully`);
          } catch (err: any) {
            console.error(`    Error migrating logo: ${err.message}`);
          }
        }
      }

      if (company.galleryImages && company.galleryImages.length > 0) {
        const newGalleryImages: string[] = [];
        const newGalleryThumbnails: string[] = [];
        let galleryHasUpdates = false;

        for (const imgUrl of company.galleryImages) {
          if (!imgUrl) continue;

          if (isCloudinaryUrl(imgUrl)) {
            newGalleryImages.push(imgUrl);
            newGalleryThumbnails.push(imgUrl);
          } else if (isLocalObjectStorageUrl(imgUrl) || imgUrl.startsWith('data:image/')) {
            newGalleryImages.push(imgUrl);
            newGalleryThumbnails.push(imgUrl);
            skippedCount++;
          } else {
            try {
              console.log(`  Migrating gallery image for ${company.name}...`);
              const result = await uploadOptimizedImageFromUrl(imgUrl, {
                folder: `junk-pros/gallery/${company.id}`,
              });
              newGalleryImages.push(result.fullUrl);
              newGalleryThumbnails.push(result.thumbnailUrl);
              galleryHasUpdates = true;
              console.log(`    Gallery image migrated successfully`);
            } catch (err: any) {
              console.error(`    Error migrating gallery image: ${err.message}`);
              newGalleryImages.push(imgUrl);
              newGalleryThumbnails.push(imgUrl);
            }
          }
        }

        if (galleryHasUpdates) {
          updates.galleryImages = newGalleryImages;
          updates.galleryThumbnails = newGalleryThumbnails;
          hasUpdates = true;
        }
      }

      if (hasUpdates) {
        await db.update(companies)
          .set(updates as any)
          .where(require('drizzle-orm').eq(companies.id, company.id));
        successCount++;
        console.log(`  Updated ${company.name}`);
      }

    } catch (error: any) {
      console.error(`Error processing company ${company.name}:`, error.message);
      errorCount++;
    }
  }

  console.log('\n=== Migration Summary ===');
  console.log(`Total companies: ${allCompanies.length}`);
  console.log(`Successfully migrated: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log(`Skipped (local storage): ${skippedCount}`);
  console.log('Migration complete!');
}

migrateImages().catch(console.error);

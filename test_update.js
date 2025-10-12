const { db } = require('./server/db');
const { companies } = require('./shared/schema');
const { eq } = require('drizzle-orm');

(async () => {
  try {
    const testData = {
      galleryImages: ['/test/path1.jpg', '/test/path2.jpg'],
      googleFeaturedReviews: [{id: 'test', reviewerName: 'Test', reviewText: 'Test review'}]
    };
    
    const [result] = await db.update(companies)
      .set(testData)
      .where(eq(companies.id, 5))
      .returning();
    
    console.log('Update successful!');
    console.log('galleryImages:', result.galleryImages);
    console.log('googleFeaturedReviews:', result.googleFeaturedReviews);
    process.exit(0);
  } catch (err) {
    console.error('Update failed:', err.message);
    process.exit(1);
  }
})();

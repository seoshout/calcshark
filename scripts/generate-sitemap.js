const fs = require('fs');
const path = require('path');

// Import the calculator data
const { calculatorCategories } = require('../lib/calculator-categories.ts');

// Configuration
const SITE_URL = 'https://calcshark.com';
const OUTPUT_PATH = path.join(__dirname, '../public/sitemap-static.xml');

// Get all calculators from categories
function getAllCalculators() {
  const allCalcs = [];
  calculatorCategories.forEach(category => {
    category.subcategories.forEach(subcategory => {
      allCalcs.push(...subcategory.calculators);
    });
  });
  return allCalcs;
}

// Generate sitemap XML
function generateSitemap() {
  const currentDate = '2025-09-01T00:00:00.000Z';
  const allCalculators = getAllCalculators();

  console.log(`📊 Generating sitemap with ${allCalculators.length} calculators...`);

  // Static pages
  const staticPages = [
    { url: '', priority: '1.0', changefreq: 'daily' },
    { url: '/all-online-calculators', priority: '0.9', changefreq: 'daily' },
    { url: '/categories', priority: '0.9', changefreq: 'weekly' },
    { url: '/popular', priority: '0.8', changefreq: 'daily' },
  ];

  // Category pages
  const categoryPages = calculatorCategories.map(category => ({
    url: `/category/${category.slug}`,
    priority: '0.8',
    changefreq: 'weekly'
  }));

  // Calculator pages
  const calculatorPages = allCalculators.map(calculator => ({
    url: `/calculator/${calculator.slug}`,
    priority: calculator.popular ? '0.9' : '0.7',
    changefreq: 'monthly'
  }));

  // Combine all URLs
  const allUrls = [...staticPages, ...categoryPages, ...calculatorPages];

  // Generate XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(({ url, priority, changefreq }) => 
    `  <url>
    <loc>${SITE_URL}${url}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  ).join('\n')}
</urlset>`;

  // Write to file
  fs.writeFileSync(OUTPUT_PATH, sitemap, 'utf8');
  
  console.log(`✅ Sitemap generated successfully!`);
  console.log(`📁 Output: ${OUTPUT_PATH}`);
  console.log(`📈 Total URLs: ${allUrls.length}`);
  console.log(`   - Static pages: ${staticPages.length}`);
  console.log(`   - Category pages: ${categoryPages.length}`);
  console.log(`   - Calculator pages: ${calculatorPages.length}`);
  console.log(`🔗 Access at: ${SITE_URL}/sitemap.xml`);
}

// Run the generator
if (require.main === module) {
  try {
    generateSitemap();
  } catch (error) {
    console.error('❌ Error generating sitemap:', error.message);
    process.exit(1);
  }
}

module.exports = { generateSitemap };
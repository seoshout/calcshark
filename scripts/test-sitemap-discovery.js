/**
 * Test script to verify sitemap route discovery
 * This helps debug what routes are being found vs what actually exists
 */

const fs = require('fs').promises;
const path = require('path');

// Simulate the route discovery logic from the sitemap
async function testRouteDiscovery() {
  console.log('🧪 Testing Sitemap Route Discovery');
  console.log('=' .repeat(50));

  try {
    // Test 1: Check what calculator components actually exist
    console.log('\n📊 1. Discovering Calculator Components:');
    await testCalculatorDiscovery();

    // Test 2: Check what pages actually exist
    console.log('\n📄 2. Discovering Static Pages:');
    await testStaticPageDiscovery();

    // Test 3: Test the actual sitemap endpoint (if server is running)
    console.log('\n🌐 3. Testing Sitemap Endpoint:');
    console.log('To test the actual sitemap:');
    console.log('1. Start your dev server: npm run dev');
    console.log('2. Visit: http://localhost:3000/sitemap.xml');
    console.log('3. Check browser network tab for sitemap response headers');

  } catch (error) {
    console.error('❌ Error during route discovery test:', error.message);
  }
}

async function testCalculatorDiscovery() {
  const calculatorsDir = path.join(process.cwd(), 'app', 'calculator', '[slug]', 'calculators');
  
  try {
    const files = await fs.readdir(calculatorsDir);
    const calculatorFiles = files.filter(file => file.endsWith('.tsx') && file !== 'index.tsx');
    
    console.log(`   Found ${calculatorFiles.length} calculator components:`);
    
    calculatorFiles.forEach(file => {
      const componentName = file.replace('.tsx', '');
      const slug = componentNameToSlug(componentName);
      const isPopular = isPopularCalculator(slug);
      
      console.log(`   ${isPopular ? '⭐' : '  '} ${componentName} → /calculator/${slug}`);
    });
    
    console.log('\n   ✅ These calculators will be included in sitemap');
  } catch (error) {
    console.log(`   ❌ Could not read calculators directory: ${error.message}`);
  }
}

async function testStaticPageDiscovery() {
  const appDir = path.join(process.cwd(), 'app');
  
  try {
    const entries = await fs.readdir(appDir, { withFileTypes: true });
    const staticPages = [];
    
    for (const entry of entries) {
      if (entry.isDirectory() && !entry.name.startsWith('[') && !entry.name.startsWith('_')) {
        const pagePath = path.join(appDir, entry.name, 'page.tsx');
        
        try {
          await fs.access(pagePath);
          const priority = getPagePriority(entry.name);
          staticPages.push({
            name: entry.name,
            url: `/${entry.name}`,
            priority,
            exists: true
          });
        } catch {
          staticPages.push({
            name: entry.name,
            url: `/${entry.name}`,
            priority: 0.5,
            exists: false
          });
        }
      }
    }
    
    console.log(`   Found ${staticPages.filter(p => p.exists).length} static pages:`);
    
    staticPages
      .filter(page => page.exists)
      .sort((a, b) => b.priority - a.priority)
      .forEach(page => {
        const stars = '⭐'.repeat(Math.floor(page.priority * 5));
        console.log(`   ${stars.padEnd(5)} ${page.url} (priority: ${page.priority})`);
      });
    
    const missingPages = staticPages.filter(p => !p.exists);
    if (missingPages.length > 0) {
      console.log('\n   ⚠️  Directories without page.tsx:');
      missingPages.forEach(page => {
        console.log(`      ${page.name}/`);
      });
    }
    
  } catch (error) {
    console.log(`   ❌ Could not read app directory: ${error.message}`);
  }
}

// Helper functions (matching the ones in route-discovery.ts)
function componentNameToSlug(componentName) {
  // Handle specific known mappings first
  const knownMappings = {
    'BMICalculator': 'bmi',
    'AdvancedBMICalculator': 'bmi',
    'AdvancedMortgageCalculator': 'mortgage-payment',
    'AdvancedCompoundInterestCalculator': 'compound-interest'
  };

  if (knownMappings[componentName]) {
    return knownMappings[componentName];
  }

  // Fallback to automatic conversion
  return componentName
    .replace(/Calculator$/, '')
    .replace(/Advanced/, '')
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^-/, '')
    .replace(/--+/g, '-');
}

function isPopularCalculator(slug) {
  const popularSlugs = [
    'bmi', 'mortgage-payment', 'loan-payment', 'compound-interest',
    'percentage', 'tip', 'calorie', 'gpa', 'age', 'discount'
  ];
  return popularSlugs.includes(slug);
}

function getPagePriority(pageName) {
  const priorities = {
    'all-online-calculators': 0.9,
    'categories': 0.9,
    'popular': 0.8,
    'about': 0.6,
    'contact': 0.6,
    'privacy': 0.5,
    'terms': 0.5
  };
  
  return priorities[pageName] || 0.6;
}

// Run the test if this file is executed directly
if (require.main === module) {
  testRouteDiscovery();
}

module.exports = { testRouteDiscovery };
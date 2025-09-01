const fs = require('fs');

const content = fs.readFileSync('calculator_list.txt', 'utf-8');
const lines = content.split('\n').map(line => line.trim()).filter(line => line);

let currentCategory = '';
let currentSubcategory = '';
let categories = {};
let totalCalculators = 0;

for (const line of lines) {
  if (line.startsWith('CATEGORY:')) {
    currentCategory = line.replace('CATEGORY:', '').trim();
    categories[currentCategory] = {};
  } else if (line.startsWith('Sub-category:')) {
    currentSubcategory = line.replace('Sub-category:', '').trim();
    categories[currentCategory][currentSubcategory] = 0;
  } else if (currentSubcategory && line) {
    // This is a calculator
    categories[currentCategory][currentSubcategory]++;
    totalCalculators++;
  }
}

console.log('Original calculator counts by subcategory:');
console.log('='.repeat(60));

let categoryIndex = 1;
Object.keys(categories).forEach(catName => {
  const subcategories = categories[catName];
  const categoryTotal = Object.values(subcategories).reduce((sum, count) => sum + count, 0);
  
  console.log(`\n${categoryIndex++}. ${catName.toUpperCase()}`);
  
  let subIndex = 1;
  Object.keys(subcategories).forEach(subName => {
    console.log(`   ${subIndex++}. ${subName}: ${subcategories[subName]} calculators`);
  });
  
  console.log(`   📊 Category Total: ${categoryTotal} calculators`);
});

console.log('\n' + '='.repeat(60));
console.log(`🎯 GRAND TOTAL: ${totalCalculators} calculators`);
console.log(`📁 Categories: ${Object.keys(categories).length}`);

let totalSubcategories = 0;
Object.values(categories).forEach(cat => {
  totalSubcategories += Object.keys(cat).length;
});
console.log(`📂 Total Subcategories: ${totalSubcategories}`);
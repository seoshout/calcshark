const fs = require('fs');

// Read the generated TypeScript file and parse the data
const content = fs.readFileSync('lib/calculator-categories.ts', 'utf-8');

// Extract the calculatorCategories array using regex
const match = content.match(/export const calculatorCategories: Category\[\] = (\[[\s\S]*?\]);/);
if (!match) {
  console.error('Could not find calculatorCategories array');
  process.exit(1);
}

// Parse the array (this is hacky but works for our data structure)
const arrayString = match[1];
const categories = eval(arrayString); // Using eval for simplicity - not recommended for production

console.log('Calculators per category:');
console.log('='.repeat(50));

let grandTotal = 0;
categories.forEach((cat, index) => {
  let categoryTotal = 0;
  console.log(`\n${index + 1}. ${cat.name.toUpperCase()}`);
  
  cat.subcategories.forEach((sub, subIndex) => {
    const subTotal = sub.calculators.length;
    categoryTotal += subTotal;
    console.log(`   ${subIndex + 1}. ${sub.name}: ${subTotal} calculators`);
  });
  
  console.log(`   📊 Category Total: ${categoryTotal} calculators`);
  grandTotal += categoryTotal;
});

console.log('\n' + '='.repeat(50));
console.log(`🎯 GRAND TOTAL: ${grandTotal} calculators`);
console.log(`📁 Categories: ${categories.length}`);
console.log(`📂 Total Subcategories: ${categories.reduce((sum, cat) => sum + cat.subcategories.length, 0)}`);
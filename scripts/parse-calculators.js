const fs = require('fs');
const path = require('path');

// Popular calculators list
const popularCalculatorNames = [
  'Mortgage Payment Calculator',
  'BMI Calculator', 
  'Loan Payment Calculator',
  'Percentage Calculator',
  'Tip Calculator',
  'Compound Interest Calculator',
  'Calorie Calculator',
  'GPA Calculator',
  'Age Calculator',
  'Discount Calculator',
  'Investment Return Calculator',
  'Retirement Savings Calculator',
  '401(k) Calculator',
  'Budget Calculator',
  'Savings Goal Calculator',
  'Final Grade Calculator',
  'SAT Score Calculator',
  'College Cost Calculator',
  'Target Heart Rate Calculator',
  'Running Pace Calculator',
  'Real Estate Investment Calculator',
  'Concrete Calculator',
  'Car Payment Calculator',
  'Gas Mileage Calculator',
  'Business Loan Calculator',
  'Scientific Calculator',
  'Area Calculator',
  'Triangle Calculator'
];

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function isPopular(calculatorName) {
  return popularCalculatorNames.some(popular => 
    calculatorName.toLowerCase().includes(popular.toLowerCase()) ||
    popular.toLowerCase().includes(calculatorName.toLowerCase())
  );
}

function getDifficulty(calculatorName) {
  const name = calculatorName.toLowerCase();
  
  if (name.includes('advanced') || name.includes('complex') || name.includes('professional')) {
    return 'advanced';
  }
  if (name.includes('amortization') || name.includes('analysis') || name.includes('optimization') || 
      name.includes('valuation') || name.includes('forecasting') || name.includes('modeling')) {
    return 'intermediate';
  }
  return 'basic';
}

function generateDescription(calculatorName, categoryName) {
  const descriptions = {
    'calculator': 'Quick and accurate calculations',
    'payment': 'Calculate monthly payments and costs',
    'interest': 'Calculate interest rates and earnings', 
    'loan': 'Calculate loan payments and terms',
    'mortgage': 'Calculate mortgage payments and costs',
    'budget': 'Plan and track your budget',
    'savings': 'Calculate savings goals and growth',
    'investment': 'Analyze investment returns and performance',
    'tax': 'Calculate taxes and deductions',
    'insurance': 'Estimate insurance costs and coverage',
    'gpa': 'Calculate academic performance',
    'grade': 'Calculate grades and scores',
    'bmi': 'Calculate body mass index',
    'calorie': 'Calculate calorie needs and intake',
    'fitness': 'Track fitness and health metrics',
    'construction': 'Calculate materials and quantities',
    'paint': 'Calculate paint and coverage needs',
    'flooring': 'Calculate flooring materials',
    'roofing': 'Calculate roofing materials',
    'car': 'Calculate vehicle costs and expenses',
    'fuel': 'Calculate fuel costs and efficiency',
    'business': 'Calculate business metrics and costs',
    'sales': 'Calculate sales performance',
    'payroll': 'Calculate employee costs',
    'percentage': 'Calculate percentages and ratios',
    'area': 'Calculate area and dimensions',
    'volume': 'Calculate volume and capacity'
  };
  
  const name = calculatorName.toLowerCase();
  for (const [key, desc] of Object.entries(descriptions)) {
    if (name.includes(key)) {
      return desc;
    }
  }
  
  return `Professional ${calculatorName.toLowerCase()} calculations`;
}

function getCategoryIcon(categoryName) {
  const iconMap = {
    'finance': 'DollarSign',
    'education': 'GraduationCap', 
    'health': 'Heart',
    'real estate': 'Home',
    'construction': 'Hammer',
    'automotive': 'Car',
    'business': 'Briefcase',
    'mathematics': 'Calculator',
    'pregnancy': 'Baby',
    'pet': 'Dog',
    'gaming': 'Gamepad2',
    'lifestyle': 'Clock',
    'cooking': 'ChefHat',
    'environmental': 'Leaf',
    'sports': 'Trophy',
    'gardening': 'Sprout',
    'wedding': 'Heart'
  };
  
  const name = categoryName.toLowerCase();
  for (const [key, icon] of Object.entries(iconMap)) {
    if (name.includes(key)) {
      return icon;
    }
  }
  return 'Calculator';
}

function getCategoryColor(categoryName) {
  const colors = [
    'from-blue-500 to-purple-600',
    'from-indigo-500 to-blue-600',
    'from-purple-500 to-indigo-600',
    'from-cyan-500 to-blue-600',
    'from-blue-600 to-indigo-700',
    'from-violet-500 to-purple-600',
    'from-pink-500 to-rose-600',
    'from-orange-500 to-red-600',
    'from-green-500 to-emerald-600',
    'from-teal-500 to-cyan-600',
    'from-yellow-500 to-orange-600',
    'from-rose-500 to-pink-600',
    'from-amber-500 to-yellow-600',
    'from-emerald-500 to-green-600',
    'from-sky-500 to-blue-600',
    'from-slate-500 to-gray-600',
    'from-lime-500 to-green-600'
  ];
  
  const hash = categoryName.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
  return colors[Math.abs(hash) % colors.length];
}

function parseCalculatorList() {
  try {
    const filePath = path.join(__dirname, '..', 'calculator_list.txt');
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split('\n').map(line => line.trim()).filter(line => line);
    
    const categories = [];
    let currentCategory = null;
    let currentSubcategory = null;
    
    for (const line of lines) {
      if (line.startsWith('CATEGORY:')) {
        // Save previous category if exists
        if (currentCategory && currentSubcategory) {
          currentCategory.subcategories.push(currentSubcategory);
          currentSubcategory = null;
        }
        if (currentCategory) {
          categories.push(currentCategory);
        }
        
        // Create new category
        const categoryName = line.replace('CATEGORY:', '').trim();
        currentCategory = {
          name: categoryName,
          slug: slugify(categoryName),
          description: `Comprehensive ${categoryName.toLowerCase()} calculators and tools`,
          icon: getCategoryIcon(categoryName),
          color: getCategoryColor(categoryName),
          subcategories: []
        };
      } else if (line.startsWith('Sub-category:')) {
        // Save previous subcategory if exists
        if (currentSubcategory && currentCategory) {
          currentCategory.subcategories.push(currentSubcategory);
        }
        
        // Create new subcategory
        const subcategoryName = line.replace('Sub-category:', '').trim();
        currentSubcategory = {
          name: subcategoryName,
          slug: slugify(subcategoryName),
          description: `${subcategoryName} calculators and planning tools`,
          calculators: []
        };
      } else if (currentSubcategory && currentCategory && line && !line.includes('CATEGORY:') && !line.includes('Sub-category:')) {
        // This is a calculator name
        let calculatorName = line.trim();
        if (calculatorName && !calculatorName.endsWith('Calculator')) {
          calculatorName = calculatorName + ' Calculator';
        }
        
        if (calculatorName) {
          const slug = slugify(calculatorName);
          const calculator = {
            id: slug,
            name: calculatorName,
            description: generateDescription(calculatorName, currentCategory.name),
            slug: slug,
            category: currentCategory.slug,
            subcategory: currentSubcategory.slug,
            tags: [currentCategory.name.toLowerCase(), currentSubcategory.name.toLowerCase(), calculatorName.toLowerCase()],
            icon: 'Calculator',
            difficulty: getDifficulty(calculatorName),
            popular: isPopular(calculatorName)
          };
          currentSubcategory.calculators.push(calculator);
        }
      }
    }
    
    // Save final category and subcategory
    if (currentCategory && currentSubcategory) {
      currentCategory.subcategories.push(currentSubcategory);
    }
    if (currentCategory) {
      categories.push(currentCategory);
    }
    
    return categories;
  } catch (error) {
    console.error('Error parsing calculator list:', error);
    return [];
  }
}

// Generate TypeScript file with calculator data
function generateCalculatorData() {
  const categories = parseCalculatorList();
  
  const allCalculators = categories
    .flatMap(cat => cat.subcategories)
    .flatMap(sub => sub.calculators);
  
  const popularSlugs = allCalculators
    .filter(calc => calc.popular)
    .slice(0, 20)
    .map(calc => calc.slug);
  
  const output = `// Auto-generated calculator data from calculator_list.txt
// Do not edit this file directly - regenerate using scripts/parse-calculators.js

export interface Calculator {
  id: string;
  name: string;
  description: string;
  slug: string;
  category: string;
  subcategory: string;
  tags: string[];
  icon: string;
  difficulty: 'basic' | 'intermediate' | 'advanced';
  popular?: boolean;
}

export interface Subcategory {
  name: string;
  slug: string;
  description: string;
  calculators: Calculator[];
}

export interface Category {
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  subcategories: Subcategory[];
}

export const calculatorCategories: Category[] = ${JSON.stringify(categories, null, 2)
  .replace(/"([^"]+)":/g, '$1:')
  .replace(/'/g, "\\'")
  .replace(/"/g, "'")
};

export const popularCalculators = ${JSON.stringify(popularSlugs, null, 2).replace(/"/g, "'")};

export const getAllCalculators = (): Calculator[] => {
  return calculatorCategories.flatMap(category => 
    category.subcategories.flatMap(subcategory => 
      subcategory.calculators.map(calc => ({
        ...calc,
        id: calc.slug
      }))
    )
  );
};

export const getCalculatorBySlug = (slug: string): Calculator | undefined => {
  return getAllCalculators().find(calc => calc.slug === slug);
};

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return calculatorCategories.find(category => category.slug === slug);
};

export const getSubcategoryBySlug = (categorySlug: string, subcategorySlug: string): Subcategory | undefined => {
  const category = getCategoryBySlug(categorySlug);
  return category?.subcategories.find(sub => sub.slug === subcategorySlug);
};

export const searchCalculators = (query: string): Calculator[] => {
  const allCalculators = getAllCalculators();
  const lowerQuery = query.toLowerCase();
  
  return allCalculators.filter(calc => 
    calc.name.toLowerCase().includes(lowerQuery) ||
    calc.description.toLowerCase().includes(lowerQuery) ||
    calc.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

export const getCalculatorsBySubcategory = (subcategorySlug: string): Calculator[] => {
  return getAllCalculators().filter(calc => calc.subcategory === subcategorySlug);
};
`;

  // Write the generated data to a new file
  const outputPath = path.join(__dirname, '..', 'lib', 'calculator-data-generated.ts');
  fs.writeFileSync(outputPath, output, 'utf-8');
  
  console.log(`Generated calculator data with ${categories.length} categories`);
  console.log(`Total calculators: ${allCalculators.length}`);
  console.log(`Popular calculators: ${popularSlugs.length}`);
  
  return categories;
}

// Run the generation
generateCalculatorData();
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

export const calculatorCategories: Category[] = [
  {
    name: "Finance & Personal Finance",
    slug: "finance",
    description: "Comprehensive financial calculators for loans, mortgages, investments, retirement planning, and budgeting",
    icon: "DollarSign",
    color: "from-blue-500 to-purple-600",
    subcategories: [
      {
        name: "Loans & Debt",
        slug: "loans-debt",
        description: "Calculate loan payments, debt payoff strategies, and interest calculations",
        calculators: []
      },
      {
        name: "Mortgages",
        slug: "mortgages", 
        description: "Mortgage calculators for payments, affordability, refinancing, and home equity",
        calculators: []
      },
      {
        name: "Investments",
        slug: "investments",
        description: "Investment return calculators, portfolio analysis, and trading tools",
        calculators: []
      },
      {
        name: "Retirement",
        slug: "retirement",
        description: "Retirement savings, 401(k), IRA, and pension calculators",
        calculators: []
      },
      {
        name: "Budgeting & Savings",
        slug: "budgeting-savings",
        description: "Budget planning, savings goals, and expense tracking tools",
        calculators: []
      }
    ]
  },
  {
    name: "Education & Academic",
    slug: "education",
    description: "Academic calculators for GPA, grades, test scores, and college planning",
    icon: "GraduationCap",
    color: "from-blue-500 to-indigo-600",
    subcategories: [
      {
        name: "GPA & Grades",
        slug: "gpa-grades",
        description: "Calculate GPA, grades, and academic performance metrics",
        calculators: []
      },
      {
        name: "Test Preparation", 
        slug: "test-preparation",
        description: "SAT, ACT, and standardized test score calculators",
        calculators: []
      },
      {
        name: "College Planning",
        slug: "college-planning",
        description: "College cost, student loans, and financial aid calculators",
        calculators: []
      }
    ]
  },
  {
    name: "Health & Fitness",
    slug: "health",
    description: "Health calculators for body metrics, nutrition, diet planning, and exercise performance",
    icon: "Heart",
    color: "from-red-500 to-pink-600",
    subcategories: [
      {
        name: "Body Metrics",
        slug: "body-metrics",
        description: "BMI, body fat, ideal weight, and body composition calculators",
        calculators: []
      },
      {
        name: "Nutrition & Diet",
        slug: "nutrition-diet",
        description: "Calorie, macro, nutrition, and meal planning calculators",
        calculators: []
      },
      {
        name: "Exercise & Performance",
        slug: "exercise-performance", 
        description: "Fitness, workout, and athletic performance calculators",
        calculators: []
      }
    ]
  },
  {
    name: "Real Estate & Property",
    slug: "real-estate",
    description: "Real estate investment, property management, and home buying calculators",
    icon: "Home",
    color: "from-orange-500 to-amber-600",
    subcategories: [
      {
        name: "Property Investment",
        slug: "property-investment",
        description: "Real estate investment analysis and profitability calculators",
        calculators: []
      },
      {
        name: "Property Management",
        slug: "property-management",
        description: "Rental property, tenant, and property management calculators",
        calculators: []
      },
      {
        name: "Home Buying & Selling",
        slug: "home-buying-selling",
        description: "Home affordability, selling costs, and real estate transaction calculators",
        calculators: []
      }
    ]
  },
  {
    name: "Construction & Home Improvement",
    slug: "construction",
    description: "Construction materials, quantities, and home improvement project calculators",
    icon: "Hammer",
    color: "from-yellow-500 to-orange-600",
    subcategories: [
      {
        name: "Materials & Quantities",
        slug: "materials-quantities",
        description: "Calculate concrete, lumber, and construction material quantities",
        calculators: []
      },
      {
        name: "Flooring",
        slug: "flooring",
        description: "Flooring materials, installation, and cost calculators",
        calculators: []
      },
      {
        name: "Roofing & Siding",
        slug: "roofing-siding",
        description: "Roofing materials, measurements, and siding calculators",
        calculators: []
      },
      {
        name: "Paint & Wall Covering",
        slug: "paint-wall-covering",
        description: "Paint coverage, wallpaper, and wall treatment calculators",
        calculators: []
      }
    ]
  },
  {
    name: "Automotive & Transportation",
    slug: "automotive",
    description: "Vehicle costs, fuel efficiency, maintenance, and automotive calculators",
    icon: "Car",
    color: "from-purple-500 to-violet-600",
    subcategories: [
      {
        name: "Vehicle Costs",
        slug: "vehicle-costs",
        description: "Car payments, loans, insurance, and ownership cost calculators",
        calculators: []
      },
      {
        name: "Fuel & Efficiency",
        slug: "fuel-efficiency",
        description: "Gas mileage, fuel costs, and efficiency calculators",
        calculators: []
      },
      {
        name: "Maintenance & Parts",
        slug: "maintenance-parts",
        description: "Vehicle maintenance, parts, and service cost calculators",
        calculators: []
      }
    ]
  },
  {
    name: "Business & Professional",
    slug: "business",
    description: "Business finance, sales, marketing, HR, and productivity calculators",
    icon: "Briefcase",
    color: "from-indigo-500 to-purple-600",
    subcategories: [
      {
        name: "Business Finance",
        slug: "business-finance",
        description: "Profit, ROI, cash flow, and business valuation calculators",
        calculators: []
      },
      {
        name: "Sales & Marketing",
        slug: "sales-marketing",
        description: "Sales metrics, marketing ROI, and conversion calculators",
        calculators: []
      },
      {
        name: "Human Resources",
        slug: "human-resources",
        description: "Payroll, salary, benefits, and HR cost calculators",
        calculators: []
      },
      {
        name: "Productivity & Efficiency",
        slug: "productivity-efficiency",
        description: "Time tracking, productivity, and operational efficiency calculators",
        calculators: []
      }
    ]
  },
  {
    name: "Mathematics & Science",
    slug: "mathematics",
    description: "Mathematical calculators for basic math, algebra, geometry, and statistics",
    icon: "Calculator",
    color: "from-pink-500 to-rose-600",
    subcategories: [
      {
        name: "Basic Math",
        slug: "basic-math",
        description: "Percentage, fraction, decimal, and basic arithmetic calculators",
        calculators: []
      },
      {
        name: "Algebra",
        slug: "algebra",
        description: "Equation solving, polynomial, and algebraic calculators",
        calculators: []
      },
      {
        name: "Geometry",
        slug: "geometry",
        description: "Area, volume, perimeter, and geometric shape calculators",
        calculators: []
      },
      {
        name: "Statistics",
        slug: "statistics",
        description: "Statistical analysis, probability, and data calculators",
        calculators: []
      }
    ]
  },
  {
    name: "Pregnancy & Parenting",
    slug: "pregnancy-parenting",
    description: "Pregnancy calculators, baby development, child care, and family planning tools",
    icon: "Baby",
    color: "from-rose-500 to-pink-600",
    subcategories: [
      {
        name: "Pregnancy",
        slug: "pregnancy",
        description: "Due dates, conception dates, pregnancy tracking, and maternal health calculators",
        calculators: []
      },
      {
        name: "Baby & Child Development",
        slug: "baby-child-development",
        description: "Growth charts, feeding schedules, milestone tracking, and development tools",
        calculators: []
      },
      {
        name: "Family Planning",
        slug: "family-planning",
        description: "Child costs, childcare expenses, education savings, and family budget tools",
        calculators: []
      }
    ]
  },
  {
    name: "Pet Care",
    slug: "pet-care",
    description: "Pet health, nutrition, costs, and care calculators for dogs, cats, and other pets",
    icon: "Dog",
    color: "from-amber-500 to-yellow-600",
    subcategories: [
      {
        name: "Pet Health & Nutrition",
        slug: "pet-health-nutrition",
        description: "Pet age, food requirements, calorie needs, and health metrics",
        calculators: []
      },
      {
        name: "Pet Care Costs",
        slug: "pet-care-costs",
        description: "Pet ownership costs, insurance, veterinary expenses, and budget planning",
        calculators: []
      }
    ]
  },
  {
    name: "Gaming & Entertainment",
    slug: "gaming-entertainment",
    description: "Gaming performance, character builds, stats, and entertainment calculators",
    icon: "Gamepad2",
    color: "from-violet-500 to-purple-600",
    subcategories: [
      {
        name: "Gaming Performance",
        slug: "gaming-performance",
        description: "FPS, DPS, win rates, and gaming performance metrics",
        calculators: []
      },
      {
        name: "Character & Build Planning",
        slug: "character-build-planning",
        description: "Character stats, skill points, gear optimization, and build calculators",
        calculators: []
      }
    ]
  },
  {
    name: "Lifestyle & Daily Life",
    slug: "lifestyle-daily-life",
    description: "Time, date, shopping, travel, and everyday life calculators",
    icon: "Clock",
    color: "from-teal-500 to-cyan-600",
    subcategories: [
      {
        name: "Time & Date",
        slug: "time-date",
        description: "Age, date differences, countdowns, and time zone calculators",
        calculators: []
      },
      {
        name: "Shopping & Savings",
        slug: "shopping-savings",
        description: "Discounts, price comparisons, tips, and shopping calculators",
        calculators: []
      },
      {
        name: "Travel",
        slug: "travel",
        description: "Travel costs, currency conversion, time differences, and trip planning",
        calculators: []
      }
    ]
  },
  {
    name: "Cooking & Food",
    slug: "cooking-food",
    description: "Recipe calculations, kitchen measurements, nutrition, and cooking tools",
    icon: "ChefHat",
    color: "from-orange-500 to-red-600",
    subcategories: [
      {
        name: "Recipe Calculations",
        slug: "recipe-calculations",
        description: "Recipe scaling, serving sizes, ingredient conversions, and cooking times",
        calculators: []
      },
      {
        name: "Kitchen Measurements",
        slug: "kitchen-measurements",
        description: "Unit conversions, measurement equivalents, and baking calculations",
        calculators: []
      }
    ]
  },
  {
    name: "Environmental & Sustainability",
    slug: "environmental-sustainability",
    description: "Energy efficiency, carbon footprint, waste reduction, and sustainability calculators",
    icon: "Leaf",
    color: "from-green-500 to-lime-600",
    subcategories: [
      {
        name: "Energy & Utilities",
        slug: "energy-utilities",
        description: "Energy consumption, solar savings, utility costs, and efficiency calculators",
        calculators: []
      },
      {
        name: "Carbon & Waste",
        slug: "carbon-waste",
        description: "Carbon footprint, recycling impact, waste reduction, and sustainability metrics",
        calculators: []
      }
    ]
  },
  {
    name: "Sports & Recreation",
    slug: "sports-recreation",
    description: "Sports performance, outdoor activities, fitness tracking, and recreation calculators",
    icon: "Trophy",
    color: "from-blue-500 to-sky-600",
    subcategories: [
      {
        name: "Sports Performance",
        slug: "sports-performance",
        description: "Sports statistics, performance metrics, and athletic calculators",
        calculators: []
      },
      {
        name: "Outdoor Activities",
        slug: "outdoor-activities",
        description: "Hiking, camping, fishing, and outdoor recreation calculators",
        calculators: []
      }
    ]
  },
  {
    name: "Gardening & Landscaping",
    slug: "gardening-landscaping",
    description: "Garden planning, lawn care, landscaping, and plant care calculators",
    icon: "Sprout",
    color: "from-emerald-500 to-green-600",
    subcategories: [
      {
        name: "Garden Planning",
        slug: "garden-planning",
        description: "Plant spacing, soil needs, garden bed planning, and crop calculators",
        calculators: []
      },
      {
        name: "Lawn & Landscaping",
        slug: "lawn-landscaping",
        description: "Lawn care, landscaping materials, and outdoor project calculators",
        calculators: []
      }
    ]
  },
  {
    name: "Wedding & Events",
    slug: "wedding-events",
    description: "Wedding planning, event budgets, party planning, and celebration calculators",
    icon: "Heart",
    color: "from-pink-500 to-rose-600",
    subcategories: [
      {
        name: "Wedding Planning",
        slug: "wedding-planning",
        description: "Wedding budget, guest lists, catering, and wedding planning tools",
        calculators: []
      },
      {
        name: "Party & Event Planning",
        slug: "party-event-planning",
        description: "Party budgets, event planning, supplies, and celebration calculators",
        calculators: []
      }
    ]
  }
];

export const popularCalculators = [
  "mortgage-payment",
  "bmi",
  "loan-payment",
  "percentage",
  "tip",
  "compound-interest",
  "calorie",
  "gpa",
  "age",
  "discount"
];

export const getAllCalculators = (): Calculator[] => {
  return calculatorCategories.flatMap(category => 
    category.subcategories.flatMap(subcategory => subcategory.calculators)
  );
};

export const getCalculatorBySlug = (slug: string): Calculator | undefined => {
  return getAllCalculators().find(calc => calc.slug === slug);
};

export const getCategoryBySlug = (slug: string): Category | undefined => {
  return calculatorCategories.find(category => category.slug === slug);
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
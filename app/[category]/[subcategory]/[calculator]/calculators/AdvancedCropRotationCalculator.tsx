'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Leaf, Sprout, TrendingUp, RotateCcw, BookOpen, Calculator, ChevronDown, ChevronUp, Info, CheckCircle, AlertCircle, Users, Clock, Target, Zap, HelpCircle, Plus, Minus, Search, Brain, Sparkles, BarChart3, LineChart, Award, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import FAQAccordion, { FAQItem } from '@/components/ui/faq-accordion';
import CalculatorReview from '@/components/ui/calculator-review';

// Add custom styles for dropdown borders and text visibility
const dropdownStyles = `
  .dropdown-container select {
    border: 1px solid rgb(209 213 219) !important;
    border-radius: 8px !important;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05) !important;
    background-color: hsl(var(--background)) !important;
    color: hsl(var(--foreground)) !important;
    position: relative !important;
    width: 100% !important;
    padding: 12px !important;
    font-size: 14px !important;
    line-height: 1.5 !important;
  }

  .dropdown-container select:focus {
    border-color: rgb(139 92 246) !important;
    outline: 2px solid rgb(139 92 246 / 0.2) !important;
    outline-offset: 2px !important;
    box-shadow: 0 0 0 3px rgb(139 92 246 / 0.1) !important;
  }

  .dropdown-container {
    overflow: visible !important;
    position: relative !important;
    z-index: 1 !important;
  }

  .dropdown-container select option {
    background-color: hsl(var(--background)) !important;
    color: hsl(var(--foreground)) !important;
    padding: 8px 12px !important;
    border: none !important;
  }

  /* Dark mode specific styles */
  [data-theme="dark"] .dropdown-container select option,
  .dark .dropdown-container select option {
    background-color: hsl(var(--background)) !important;
    color: hsl(var(--foreground)) !important;
  }

  /* Light mode specific styles */
  [data-theme="light"] .dropdown-container select option,
  .light .dropdown-container select option {
    background-color: white !important;
    color: black !important;
  }

  /* Ensure dropdown menus are fully visible */
  .dropdown-container select:focus,
  .dropdown-container select:active {
    z-index: 50 !important;
  }
`;

// Tooltip component
const Tooltip = ({ children, content }: { children: React.ReactNode; content: string }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div className="absolute z-50 px-3 py-2 text-sm bg-gray-900 text-white rounded-lg shadow-lg -top-2 left-full ml-2 w-64 transform -translate-y-full">
          {content}
          <div className="absolute top-full left-4 w-2 h-2 bg-gray-900 transform rotate-45 -translate-y-1"></div>
        </div>
      )}
    </div>
  );
};

// Plant families with their characteristics
const PLANT_FAMILIES = {
  'brassicas': {
    name: 'Brassicas (Cabbage Family)',
    plants: ['Broccoli', 'Cauliflower', 'Cabbage', 'Kale', 'Brussels Sprouts', 'Collards', 'Turnips', 'Radishes', 'Mustard Greens', 'Kohlrabi', 'Bok Choy', 'Watercress'],
    category: 'Medium Feeders',
    soilNeeds: 'Well-drained, fertile soil with pH 6.0-7.5',
    spacing: '12-18 inches apart',
    companions: ['Onions', 'Garlic', 'Dill', 'Chamomile', 'Marigolds', 'Nasturtiums'],
    antagonists: ['Tomatoes', 'Peppers', 'Strawberries', 'Pole Beans'],
    rotationNotes: 'Follow nitrogen-fixing legumes. Avoid planting after other brassicas for 3-4 years.',
    pests: ['Cabbage worms', 'Flea beetles', 'Aphids', 'Club root'],
    diseases: ['Black rot', 'Downy mildew', 'White rust'],
    season: 'Cool season',
    daysToMaturity: '50-100 days',
    color: '#10b981'
  },
  'nightshades': {
    name: 'Nightshades (Tomato Family)',
    plants: ['Tomatoes', 'Peppers', 'Eggplant', 'Potatoes', 'Tomatillos', 'Ground Cherries'],
    category: 'Heavy Feeders',
    soilNeeds: 'Rich, well-drained soil with pH 6.0-6.8',
    spacing: '18-36 inches apart',
    companions: ['Basil', 'Oregano', 'Parsley', 'Carrots', 'Onions', 'Marigolds'],
    antagonists: ['Fennel', 'Brassicas', 'Corn', 'Kohlrabi'],
    rotationNotes: 'Heavy feeders - plant after soil builders. Avoid same location for 3-4 years.',
    pests: ['Colorado potato beetle', 'Hornworms', 'Aphids', 'Whiteflies'],
    diseases: ['Blight', 'Verticillium wilt', 'Mosaic virus'],
    season: 'Warm season',
    daysToMaturity: '60-120 days',
    color: '#ef4444'
  },
  'legumes': {
    name: 'Legumes (Bean Family)',
    plants: ['Green Beans', 'Lima Beans', 'Peas', 'Snow Peas', 'Snap Peas', 'Soybeans', 'Chickpeas', 'Lentils', 'Peanuts', 'Clover', 'Alfalfa'],
    category: 'Soil Builders',
    soilNeeds: 'Well-drained soil with pH 6.0-7.0',
    spacing: '4-6 inches apart',
    companions: ['Corn', 'Carrots', 'Radishes', 'Cucumbers', 'Lettuce', 'Spinach'],
    antagonists: ['Onions', 'Garlic', 'Chives', 'Fennel'],
    rotationNotes: 'Nitrogen fixers - excellent soil builders. Follow with heavy feeders.',
    pests: ['Bean beetles', 'Aphids', 'Cutworms'],
    diseases: ['Bean mosaic', 'Bacterial blight', 'Root rot'],
    season: 'Warm/Cool season',
    daysToMaturity: '45-90 days',
    color: '#8b5cf6'
  },
  'cucurbits': {
    name: 'Cucurbits (Squash Family)',
    plants: ['Cucumbers', 'Zucchini', 'Summer Squash', 'Winter Squash', 'Pumpkins', 'Melons', 'Watermelons', 'Gourds'],
    category: 'Heavy Feeders',
    soilNeeds: 'Rich, well-drained soil with pH 6.0-6.8',
    spacing: '36-48 inches apart',
    companions: ['Corn', 'Beans', 'Radishes', 'Nasturtiums', 'Marigolds'],
    antagonists: ['Potatoes', 'Aromatic herbs'],
    rotationNotes: 'Heavy feeders requiring rich soil. Plant after legumes or soil amendments.',
    pests: ['Cucumber beetles', 'Squash bugs', 'Vine borers'],
    diseases: ['Powdery mildew', 'Downy mildew', 'Bacterial wilt'],
    season: 'Warm season',
    daysToMaturity: '50-120 days',
    color: '#f59e0b'
  },
  'alliums': {
    name: 'Alliums (Onion Family)',
    plants: ['Onions', 'Garlic', 'Leeks', 'Chives', 'Scallions', 'Shallots', 'Elephant Garlic'],
    category: 'Light Feeders',
    soilNeeds: 'Well-drained soil with pH 6.0-7.0',
    spacing: '4-6 inches apart',
    companions: ['Tomatoes', 'Peppers', 'Brassicas', 'Carrots', 'Lettuce'],
    antagonists: ['Beans', 'Peas', 'Asparagus'],
    rotationNotes: 'Natural pest deterrents. Good companions for most plants.',
    pests: ['Onion maggots', 'Thrips', 'Nematodes'],
    diseases: ['White rot', 'Downy mildew', 'Purple blotch'],
    season: 'Cool season',
    daysToMaturity: '90-120 days',
    color: '#ec4899'
  },
  'umbellifers': {
    name: 'Umbellifers (Carrot Family)',
    plants: ['Carrots', 'Parsnips', 'Celery', 'Parsley', 'Dill', 'Fennel', 'Cilantro', 'Celeriac'],
    category: 'Light Feeders',
    soilNeeds: 'Deep, loose soil with pH 6.0-6.8',
    spacing: '2-4 inches apart',
    companions: ['Tomatoes', 'Onions', 'Lettuce', 'Chives', 'Rosemary'],
    antagonists: ['Dill near carrots', 'Fennel near most plants'],
    rotationNotes: 'Light feeders that help break up soil. Good after heavy feeders.',
    pests: ['Carrot fly', 'Aphids', 'Wireworms'],
    diseases: ['Leaf blight', 'Root rot', 'Aster yellows'],
    season: 'Cool season',
    daysToMaturity: '70-120 days',
    color: '#06b6d4'
  },
  'leafy-greens': {
    name: 'Leafy Greens',
    plants: ['Lettuce', 'Spinach', 'Arugula', 'Swiss Chard', 'Endive', 'Chicory', 'Mizuna', 'Mache'],
    category: 'Light to Medium Feeders',
    soilNeeds: 'Rich, moist soil with pH 6.0-7.0',
    spacing: '6-12 inches apart',
    companions: ['Carrots', 'Radishes', 'Onions', 'Herbs'],
    antagonists: ['Broccoli', 'Sunflowers'],
    rotationNotes: 'Fast-growing crops good for succession planting and intercropping.',
    pests: ['Aphids', 'Flea beetles', 'Slugs', 'Leafminers'],
    diseases: ['Downy mildew', 'Lettuce mosaic', 'Bottom rot'],
    season: 'Cool season',
    daysToMaturity: '30-60 days',
    color: '#84cc16'
  },
  'perennials': {
    name: 'Perennial Vegetables',
    plants: ['Asparagus', 'Rhubarb', 'Artichokes', 'Perennial Onions', 'Perennial Herbs'],
    category: 'Variable',
    soilNeeds: 'Well-established, permanent beds',
    spacing: 'Variable by plant',
    companions: ['Varies by specific plant'],
    antagonists: ['Varies by specific plant'],
    rotationNotes: 'Permanent plantings - establish in dedicated areas outside rotation.',
    pests: ['Varies by plant'],
    diseases: ['Varies by plant'],
    season: 'Multi-season',
    daysToMaturity: 'Multi-year establishment',
    color: '#6366f1'
  }
};

// Cover crops for soil improvement
const COVER_CROPS = {
  'nitrogen-fixers': {
    name: 'Nitrogen-Fixing Cover Crops',
    plants: ['Crimson Clover', 'Red Clover', 'Winter Peas', 'Hairy Vetch', 'Cowpeas'],
    benefits: 'Add nitrogen to soil, improve soil structure',
    when: 'Fall/Winter planting',
    duration: '3-6 months'
  },
  'carbon-builders': {
    name: 'Carbon-Building Cover Crops',
    plants: ['Winter Rye', 'Oats', 'Buckwheat', 'Winter Wheat', 'Barley'],
    benefits: 'Add organic matter, prevent erosion',
    when: 'Fall/Winter planting',
    duration: '3-6 months'
  },
  'soil-breakers': {
    name: 'Soil-Breaking Cover Crops',
    plants: ['Daikon Radish', 'Turnips', 'Forage Radish'],
    benefits: 'Break up compacted soil, scavenge nutrients',
    when: 'Late summer/Fall',
    duration: '2-3 months'
  }
};

// Rotation plans
const ROTATION_PLANS = {
  3: {
    name: '3-Year Rotation',
    description: 'Basic rotation suitable for small gardens',
    schedule: [
      { year: 1, crops: ['Legumes'], focus: 'Soil building with nitrogen fixers' },
      { year: 2, crops: ['Brassicas', 'Leafy Greens'], focus: 'Medium feeders utilizing nitrogen' },
      { year: 3, crops: ['Nightshades', 'Cucurbits'], focus: 'Heavy feeders in enriched soil' }
    ]
  },
  4: {
    name: '4-Year Rotation',
    description: 'Balanced rotation with root vegetables',
    schedule: [
      { year: 1, crops: ['Legumes'], focus: 'Nitrogen fixation and soil building' },
      { year: 2, crops: ['Brassicas', 'Leafy Greens'], focus: 'Medium feeders' },
      { year: 3, crops: ['Nightshades', 'Cucurbits'], focus: 'Heavy feeders' },
      { year: 4, crops: ['Umbellifers', 'Alliums'], focus: 'Light feeders and soil loosening' }
    ]
  },
  5: {
    name: '5-Year Rotation',
    description: 'Extended rotation with cover crops',
    schedule: [
      { year: 1, crops: ['Legumes'], focus: 'Nitrogen fixation' },
      { year: 2, crops: ['Brassicas'], focus: 'Medium feeders' },
      { year: 3, crops: ['Nightshades'], focus: 'Heavy feeders' },
      { year: 4, crops: ['Cucurbits'], focus: 'Heavy feeders continued' },
      { year: 5, crops: ['Umbellifers', 'Cover Crops'], focus: 'Soil restoration' }
    ]
  }
};

// Succession planting intervals
const SUCCESSION_INTERVALS = {
  'lettuce': { interval: 10, totalWeeks: 16, notes: 'Plant every 10 days for continuous harvest' },
  'radishes': { interval: 7, totalWeeks: 12, notes: 'Fast-growing, plant weekly' },
  'carrots': { interval: 14, totalWeeks: 20, notes: 'Bi-weekly plantings recommended' },
  'beans': { interval: 14, totalWeeks: 16, notes: 'Plant every 2 weeks until mid-summer' },
  'peas': { interval: 10, totalWeeks: 12, notes: 'Cool season, spring and fall plantings' },
  'spinach': { interval: 10, totalWeeks: 14, notes: 'Cool weather crop, avoid summer heat' },
  'arugula': { interval: 7, totalWeeks: 16, notes: 'Fast-growing, weekly plantings' },
  'cilantro': { interval: 14, totalWeeks: 16, notes: 'Bolts quickly in heat' }
};

// Soil amendment calculations
const SOIL_AMENDMENTS = {
  'compost': { ratePerSqFt: 2, unit: 'inches', description: 'Well-aged compost for general soil improvement' },
  'manure': { ratePerSqFt: 1, unit: 'inches', description: 'Aged manure for heavy feeders' },
  'leaf-mold': { ratePerSqFt: 1.5, unit: 'inches', description: 'Decomposed leaves for soil structure' },
  'bone-meal': { ratePerSqFt: 2, unit: 'lbs per 100 sq ft', description: 'Slow-release phosphorus' },
  'blood-meal': { ratePerSqFt: 1, unit: 'lbs per 100 sq ft', description: 'Quick nitrogen boost' },
  'kelp-meal': { ratePerSqFt: 0.5, unit: 'lbs per 100 sq ft', description: 'Trace minerals and growth hormones' }
};

// Hardiness zone data with growing seasons and recommendations
const HARDINESS_ZONES = {
  '3a': { lastFrost: 'May 15-31', firstFrost: 'September 1-15', growingSeason: 105, coolSeasonExtended: true },
  '3b': { lastFrost: 'May 15-31', firstFrost: 'September 15-30', growingSeason: 120, coolSeasonExtended: true },
  '4a': { lastFrost: 'May 1-15', firstFrost: 'September 15-30', growingSeason: 135, coolSeasonExtended: true },
  '4b': { lastFrost: 'April 15-30', firstFrost: 'October 1-15', growingSeason: 150, coolSeasonExtended: true },
  '5a': { lastFrost: 'April 15-30', firstFrost: 'October 15-31', growingSeason: 165, coolSeasonExtended: false },
  '5b': { lastFrost: 'April 1-15', firstFrost: 'October 15-31', growingSeason: 180, coolSeasonExtended: false },
  '6a': { lastFrost: 'April 1-15', firstFrost: 'October 15-31', growingSeason: 195, coolSeasonExtended: false },
  '6b': { lastFrost: 'March 15-31', firstFrost: 'November 1-15', growingSeason: 210, coolSeasonExtended: false },
  '7a': { lastFrost: 'March 15-31', firstFrost: 'November 15-30', growingSeason: 225, coolSeasonExtended: false },
  '7b': { lastFrost: 'March 1-15', firstFrost: 'November 15-30', growingSeason: 240, coolSeasonExtended: false },
  '8a': { lastFrost: 'March 1-15', firstFrost: 'December 1-15', growingSeason: 270, coolSeasonExtended: false },
  '8b': { lastFrost: 'February 15-28', firstFrost: 'December 1-15', growingSeason: 285, coolSeasonExtended: false },
  '9a': { lastFrost: 'February 1-15', firstFrost: 'December 15-31', growingSeason: 300, coolSeasonExtended: false },
  '9b': { lastFrost: 'January 15-31', firstFrost: 'December 15-31', growingSeason: 330, coolSeasonExtended: false },
  '10a': { lastFrost: 'January 1-15', firstFrost: 'No frost', growingSeason: 365, coolSeasonExtended: false },
  '10b': { lastFrost: 'Rare frost', firstFrost: 'No frost', growingSeason: 365, coolSeasonExtended: false }
};

// Garden type configurations
const GARDEN_TYPES = {
  'traditional': {
    name: 'Traditional Rows',
    spacing: 'Wide rows (36-48 inches)',
    efficiency: 'Low',
    maintenance: 'Easy',
    description: 'Traditional single-row planting with wide walkways'
  },
  'raised': {
    name: 'Raised Beds',
    spacing: 'Intensive (12-18 inches)',
    efficiency: 'High',
    maintenance: 'Moderate',
    description: 'Raised beds allow for closer spacing and better soil control'
  },
  'square-foot': {
    name: 'Square Foot Garden',
    spacing: 'Grid-based (1-4 per square)',
    efficiency: 'Very High',
    maintenance: 'High',
    description: 'Maximum space efficiency with precise grid layout'
  },
  'container': {
    name: 'Container Garden',
    spacing: 'Individual containers',
    efficiency: 'Medium',
    maintenance: 'High',
    description: 'Perfect for small spaces and controlled growing conditions'
  }
};

// Comprehensive worldwide crop database organized by climate zones and regions
const CROP_DATABASE = {
  // TROPICAL ZONE CROPS (Year-round warm, high humidity)

  // Asian Tropical Leafy Greens
  'kangkung': {
    name: 'Kangkung (Water Spinach)',
    family: 'leafy-greens',
    region: 'Southeast Asia',
    climateZone: 'tropical',
    daysToMaturity: 30,
    spacing: '6 inches',
    plantingDepth: '0.5 inches',
    soilTemp: '75-85°F',
    season: 'Year-round in tropics',
    companions: ['Rice', 'Beans', 'Chili peppers'],
    antagonists: ['None known'],
    successionInterval: 14,
    plantingTimes: ['Year-round in tropical zones'],
    harvestTips: 'Cut stems 2 inches above water level',
    commonProblems: ['Aphids', 'Leaf miners'],
    nutrition: 'Light feeder - grows in aquatic environments',
    nativeRegion: 'Southeast Asia',
    hardinesszones: ['9b', '10a', '10b'],
    idealZones: ['10a', '10b']
  },

  'pak-choi': {
    name: 'Pak Choi (Bok Choy)',
    family: 'brassicas',
    region: 'East Asia',
    climateZone: 'temperate-tropical',
    daysToMaturity: 45,
    spacing: '8 inches',
    plantingDepth: '0.5 inches',
    soilTemp: '60-70°F',
    season: 'Cool season',
    companions: ['Carrots', 'Onions', 'Herbs'],
    antagonists: ['Tomatoes', 'Strawberries'],
    successionInterval: 21,
    plantingTimes: ['Spring', 'Fall', 'Winter in warm zones'],
    harvestTips: 'Cut at base when leaves are tender',
    commonProblems: ['Flea beetles', 'Aphids'],
    nutrition: 'Medium feeder',
    nativeRegion: 'China',
    hardinesszones: ['4a', '4b', '5a', '5b', '6a', '6b', '7a', '7b', '8a', '8b', '9a', '9b'],
    idealZones: ['6a', '6b', '7a', '7b']
  },

  'chinese-mustard': {
    name: 'Chinese Mustard Greens',
    family: 'brassicas',
    region: 'East Asia',
    climateZone: 'temperate-subtropical',
    daysToMaturity: 40,
    spacing: '12 inches',
    plantingDepth: '0.5 inches',
    soilTemp: '55-75°F',
    season: 'Cool season',
    companions: ['Radishes', 'Turnips', 'Cabbage'],
    antagonists: ['Tomatoes'],
    successionInterval: 14,
    plantingTimes: ['Spring', 'Fall'],
    harvestTips: 'Harvest young leaves for tender greens',
    commonProblems: ['Flea beetles', 'Aphids'],
    nutrition: 'Medium feeder',
    nativeRegion: 'China',
    hardinesszones: ['5a', '5b', '6a', '6b', '7a', '7b', '8a', '8b', '9a'],
    idealZones: ['6a', '6b', '7a']
  },

  'choy-sum': {
    name: 'Choy Sum (Chinese Flowering Cabbage)',
    family: 'brassicas',
    region: 'East Asia',
    climateZone: 'subtropical',
    daysToMaturity: 50,
    spacing: '8 inches',
    plantingDepth: '0.5 inches',
    soilTemp: '60-70°F',
    season: 'Cool season',
    companions: ['Lettuce', 'Spinach', 'Herbs'],
    antagonists: ['Hot peppers'],
    successionInterval: 21,
    plantingTimes: ['Spring', 'Fall', 'Winter in mild zones'],
    harvestTips: 'Harvest before flowers fully open',
    commonProblems: ['Aphids', 'Cabbage worms'],
    nutrition: 'Medium feeder',
    nativeRegion: 'Southern China',
    hardinesszones: ['6a', '6b', '7a', '7b', '8a', '8b', '9a', '9b'],
    idealZones: ['7a', '7b', '8a', '8b']
  },

  // African Indigenous Crops
  'african-spinach': {
    name: 'African Spinach (Amaranth)',
    family: 'leafy-greens',
    region: 'Africa',
    climateZone: 'tropical-subtropical',
    daysToMaturity: 45,
    spacing: '12 inches',
    plantingDepth: '0.25 inches',
    soilTemp: '70-85°F',
    season: 'Warm season',
    companions: ['Corn', 'Beans', 'Squash'],
    antagonists: ['None known'],
    successionInterval: 21,
    plantingTimes: ['After last frost', 'Summer'],
    harvestTips: 'Pick young leaves regularly',
    commonProblems: ['Aphids', 'Leaf miners'],
    nutrition: 'Light to medium feeder',
    nativeRegion: 'Central Africa',
    hardinesszones: ['8a', '8b', '9a', '9b', '10a', '10b'],
    idealZones: ['9a', '9b', '10a']
  },

  'okra': {
    name: 'Okra (Lady\'s Finger)',
    family: 'malvaceae',
    region: 'Africa/Asia',
    climateZone: 'tropical-subtropical',
    daysToMaturity: 60,
    spacing: '18 inches',
    plantingDepth: '1 inch',
    soilTemp: '75-85°F',
    season: 'Hot season',
    companions: ['Tomatoes', 'Peppers', 'Eggplant'],
    antagonists: ['None known'],
    successionInterval: null,
    plantingTimes: ['Late spring', 'Early summer'],
    harvestTips: 'Harvest pods when 3-4 inches long',
    commonProblems: ['Aphids', 'Corn earworm'],
    nutrition: 'Medium feeder',
    nativeRegion: 'Northeast Africa',
    hardinesszones: ['8a', '8b', '9a', '9b', '10a', '10b'],
    idealZones: ['9a', '9b', '10a', '10b']
  },

  // Tropical Root Vegetables
  'sweet-potato': {
    name: 'Sweet Potato',
    family: 'convolvulaceae',
    region: 'Americas/Global',
    climateZone: 'tropical-subtropical',
    daysToMaturity: 100,
    spacing: '24 inches',
    plantingDepth: 'Slips planted 4 inches deep',
    soilTemp: '70-80°F',
    season: 'Warm season',
    companions: ['Beans', 'Peas', 'Oregano'],
    antagonists: ['Tomatoes', 'Sunflowers'],
    successionInterval: null,
    plantingTimes: ['Late spring after soil warms'],
    harvestTips: 'Harvest before first frost',
    commonProblems: ['Sweet potato weevil', 'Wireworms'],
    nutrition: 'Light feeder - tolerates poor soil',
    nativeRegion: 'Central America',
    hardinesszones: ['8a', '8b', '9a', '9b', '10a', '10b'],
    idealZones: ['9a', '9b', '10a']
  },

  'cassava': {
    name: 'Cassava (Yuca)',
    family: 'euphorbiaceae',
    region: 'Tropical Americas/Africa',
    climateZone: 'tropical',
    daysToMaturity: 300,
    spacing: '36 inches',
    plantingDepth: 'Stem cuttings 6 inches deep',
    soilTemp: '75-85°F',
    season: 'Year-round in tropics',
    companions: ['Beans', 'Corn', 'Groundnuts'],
    antagonists: ['None known'],
    successionInterval: null,
    plantingTimes: ['Beginning of rainy season'],
    harvestTips: 'Harvest roots 8-24 months after planting',
    commonProblems: ['Cassava mosaic virus', 'Mealybugs'],
    nutrition: 'Light feeder - drought tolerant',
    nativeRegion: 'South America',
    hardinesszones: ['10a', '10b'],
    idealZones: ['10a', '10b']
  },

  // SUBTROPICAL ZONE CROPS

  // Asian Subtropical Vegetables
  'daikon': {
    name: 'Daikon Radish',
    family: 'brassicas',
    region: 'East Asia',
    climateZone: 'temperate-subtropical',
    daysToMaturity: 70,
    spacing: '6 inches',
    plantingDepth: '0.5 inches',
    soilTemp: '50-65°F',
    season: 'Cool season',
    companions: ['Carrots', 'Lettuce', 'Spinach'],
    antagonists: ['Hyssop'],
    successionInterval: 21,
    plantingTimes: ['Late summer', 'Fall', 'Winter'],
    harvestTips: 'Harvest when roots are 6-8 inches long',
    commonProblems: ['Flea beetles', 'Root maggots'],
    nutrition: 'Light feeder',
    nativeRegion: 'East Asia',
    hardinesszones: ['5a', '5b', '6a', '6b', '7a', '7b', '8a', '8b', '9a'],
    idealZones: ['6a', '6b', '7a', '7b']
  },

  'bitter-melon': {
    name: 'Bitter Melon (Bitter Gourd)',
    family: 'cucurbitaceae',
    region: 'Asia',
    climateZone: 'subtropical-tropical',
    daysToMaturity: 80,
    spacing: '48 inches',
    plantingDepth: '1 inch',
    soilTemp: '75-85°F',
    season: 'Hot season',
    companions: ['Beans', 'Corn', 'Nasturtiums'],
    antagonists: ['Potatoes'],
    successionInterval: null,
    plantingTimes: ['Late spring', 'Early summer'],
    harvestTips: 'Harvest when young and green',
    commonProblems: ['Aphids', 'Cucumber beetles'],
    nutrition: 'Heavy feeder',
    nativeRegion: 'Asia',
    hardinesszones: ['8a', '8b', '9a', '9b', '10a', '10b'],
    idealZones: ['9a', '9b', '10a']
  },

  'yard-long-beans': {
    name: 'Yard Long Beans (Snake Beans)',
    family: 'legumes',
    region: 'Southeast Asia',
    climateZone: 'subtropical-tropical',
    daysToMaturity: 70,
    spacing: '12 inches',
    plantingDepth: '1 inch',
    soilTemp: '70-80°F',
    season: 'Warm season',
    companions: ['Corn', 'Squash', 'Cucumber'],
    antagonists: ['Onions', 'Garlic'],
    successionInterval: 21,
    plantingTimes: ['Late spring', 'Summer'],
    harvestTips: 'Harvest when pods are young and tender',
    commonProblems: ['Bean beetles', 'Aphids'],
    nutrition: 'Nitrogen fixer',
    nativeRegion: 'Southeast Asia',
    hardinesszones: ['8a', '8b', '9a', '9b', '10a', '10b'],
    idealZones: ['9a', '9b', '10a']
  },

  // Mediterranean Crops
  'eggplant': {
    name: 'Eggplant (Aubergine)',
    family: 'nightshades',
    region: 'Mediterranean/Asia',
    climateZone: 'subtropical-warm temperate',
    daysToMaturity: 85,
    spacing: '24 inches',
    plantingDepth: '0.25 inches',
    soilTemp: '75-85°F',
    season: 'Warm season',
    companions: ['Tomatoes', 'Peppers', 'Basil'],
    antagonists: ['Fennel'],
    successionInterval: null,
    plantingTimes: ['Late spring after soil warms'],
    harvestTips: 'Harvest when skin is glossy',
    commonProblems: ['Flea beetles', 'Colorado potato beetle'],
    nutrition: 'Heavy feeder',
    nativeRegion: 'India',
    hardinesszones: ['7a', '7b', '8a', '8b', '9a', '9b', '10a'],
    idealZones: ['8a', '8b', '9a', '9b']
  },

  // TEMPERATE ZONE CROPS

  // European Classics
  'broccoli': {
    name: 'Broccoli',
    family: 'brassicas',
    region: 'Mediterranean/Europe',
    climateZone: 'temperate',
    daysToMaturity: 75,
    spacing: '18 inches',
    plantingDepth: '0.5 inches',
    soilTemp: '60-65°F',
    season: 'Cool season',
    companions: ['Onions', 'Carrots', 'Dill', 'Lettuce'],
    antagonists: ['Tomatoes', 'Strawberries'],
    successionInterval: 14,
    plantingTimes: ['Early spring', 'Late summer'],
    harvestTips: 'Cut central head, side shoots will develop',
    commonProblems: ['Cabbage worms', 'Aphids', 'Clubroot'],
    nutrition: 'Heavy feeder - needs nitrogen-rich soil',
    nativeRegion: 'Mediterranean',
    hardinesszones: ['3a', '3b', '4a', '4b', '5a', '5b', '6a', '6b', '7a', '7b'],
    idealZones: ['5a', '5b', '6a', '6b']
  },

  'cabbage': {
    name: 'Cabbage',
    family: 'brassicas',
    region: 'Europe/Global',
    climateZone: 'temperate',
    daysToMaturity: 90,
    spacing: '12-18 inches',
    plantingDepth: '0.5 inches',
    soilTemp: '60-65°F',
    season: 'Cool season',
    companions: ['Onions', 'Celery', 'Dill', 'Carrots'],
    antagonists: ['Tomatoes', 'Peppers'],
    successionInterval: 21,
    plantingTimes: ['Early spring', 'Mid-summer'],
    harvestTips: 'Harvest when heads feel firm and solid',
    commonProblems: ['Cabbage worms', 'Flea beetles', 'Split heads'],
    nutrition: 'Heavy feeder - benefits from compost'
  },
  'kale': {
    name: 'Kale',
    family: 'brassicas',
    region: 'Mediterranean/Europe',
    climateZone: 'temperate',
    daysToMaturity: 55,
    spacing: '12 inches',
    plantingDepth: '0.5 inches',
    soilTemp: '60-65°F',
    season: 'Cool season',
    companions: ['Onions', 'Carrots', 'Herbs'],
    antagonists: ['Tomatoes', 'Pole beans'],
    successionInterval: 14,
    plantingTimes: ['Early spring', 'Late summer', 'Fall'],
    harvestTips: 'Pick outer leaves, center continues growing',
    commonProblems: ['Aphids', 'Flea beetles'],
    nutrition: 'Medium feeder - tolerates poor soil',
    nativeRegion: 'Mediterranean',
    hardinesszones: ['3a', '3b', '4a', '4b', '5a', '5b', '6a', '6b', '7a', '7b', '8a'],
    idealZones: ['4a', '4b', '5a', '5b', '6a', '6b']
  },

  // COLD CLIMATE CROPS

  'turnip': {
    name: 'Turnip',
    family: 'brassicas',
    region: 'Northern Europe',
    climateZone: 'cold-temperate',
    daysToMaturity: 55,
    spacing: '4 inches',
    plantingDepth: '0.5 inches',
    soilTemp: '45-75°F',
    season: 'Cool season',
    companions: ['Peas', 'Beans', 'Carrots'],
    antagonists: ['Potatoes'],
    successionInterval: 21,
    plantingTimes: ['Early spring', 'Late summer'],
    harvestTips: 'Harvest when roots are 2-3 inches diameter',
    commonProblems: ['Flea beetles', 'Root maggots'],
    nutrition: 'Light feeder',
    nativeRegion: 'Northern Europe',
    hardinesszones: ['2a', '2b', '3a', '3b', '4a', '4b', '5a', '5b', '6a', '6b'],
    idealZones: ['3a', '3b', '4a', '4b', '5a']
  },

  'rutabaga': {
    name: 'Rutabaga (Swede)',
    family: 'brassicas',
    region: 'Scandinavia',
    climateZone: 'cold-temperate',
    daysToMaturity: 90,
    spacing: '8 inches',
    plantingDepth: '0.5 inches',
    soilTemp: '45-65°F',
    season: 'Cool season',
    companions: ['Peas', 'Beans', 'Onions'],
    antagonists: ['Tomatoes'],
    successionInterval: null,
    plantingTimes: ['Mid-summer for fall harvest'],
    harvestTips: 'Harvest after first frost for sweetness',
    commonProblems: ['Clubroot', 'Flea beetles'],
    nutrition: 'Medium feeder',
    nativeRegion: 'Scandinavia',
    hardinesszones: ['2a', '2b', '3a', '3b', '4a', '4b', '5a', '5b', '6a'],
    idealZones: ['3a', '3b', '4a', '4b']
  },

  'parsnip': {
    name: 'Parsnip',
    family: 'umbellifers',
    region: 'Northern Europe',
    climateZone: 'cold-temperate',
    daysToMaturity: 120,
    spacing: '4 inches',
    plantingDepth: '0.5 inches',
    soilTemp: '50-70°F',
    season: 'Cool season',
    companions: ['Carrots', 'Radishes', 'Onions'],
    antagonists: ['Carrots (competition)'],
    successionInterval: null,
    plantingTimes: ['Early spring'],
    harvestTips: 'Harvest after frost improves flavor',
    commonProblems: ['Carrot fly', 'Canker'],
    nutrition: 'Light feeder',
    nativeRegion: 'Northern Europe',
    hardinesszones: ['2a', '2b', '3a', '3b', '4a', '4b', '5a', '5b', '6a', '6b'],
    idealZones: ['3a', '3b', '4a', '4b', '5a']
  },

  // SOUTH AMERICAN CROPS

  'quinoa': {
    name: 'Quinoa',
    family: 'amaranthaceae',
    region: 'Andes',
    climateZone: 'high-altitude-temperate',
    daysToMaturity: 120,
    spacing: '12 inches',
    plantingDepth: '0.25 inches',
    soilTemp: '60-70°F',
    season: 'Cool season',
    companions: ['Beans', 'Corn', 'Potatoes'],
    antagonists: ['None known'],
    successionInterval: null,
    plantingTimes: ['Late spring'],
    harvestTips: 'Harvest when seeds rub off easily',
    commonProblems: ['Birds', 'Aphids'],
    nutrition: 'Light feeder - drought tolerant',
    nativeRegion: 'Bolivian Andes',
    hardinesszones: ['4a', '4b', '5a', '5b', '6a', '6b', '7a'],
    idealZones: ['5a', '5b', '6a', '6b']
  },

  'oca': {
    name: 'Oca (Wood Sorrel)',
    family: 'oxalidaceae',
    region: 'Andes',
    climateZone: 'high-altitude-temperate',
    daysToMaturity: 150,
    spacing: '12 inches',
    plantingDepth: '3 inches',
    soilTemp: '55-65°F',
    season: 'Cool season',
    companions: ['Potatoes', 'Quinoa', 'Beans'],
    antagonists: ['None known'],
    successionInterval: null,
    plantingTimes: ['Spring after frost danger'],
    harvestTips: 'Harvest tubers after foliage dies back',
    commonProblems: ['Colorado potato beetle'],
    nutrition: 'Light feeder',
    nativeRegion: 'Andes Mountains',
    hardinesszones: ['6a', '6b', '7a', '7b', '8a'],
    idealZones: ['6a', '6b', '7a', '7b']
  },

  // NORTH AMERICAN INDIGENOUS CROPS

  'jerusalem-artichoke': {
    name: 'Jerusalem Artichoke (Sunchoke)',
    family: 'asteraceae',
    region: 'North America',
    climateZone: 'temperate',
    daysToMaturity: 120,
    spacing: '18 inches',
    plantingDepth: '4 inches',
    soilTemp: '50-70°F',
    season: 'Full season',
    companions: ['Corn', 'Beans', 'Squash'],
    antagonists: ['None known'],
    successionInterval: null,
    plantingTimes: ['Early spring'],
    harvestTips: 'Harvest tubers after first frost',
    commonProblems: ['Can become invasive'],
    nutrition: 'Light feeder',
    nativeRegion: 'Eastern North America',
    hardinesszones: ['3a', '3b', '4a', '4b', '5a', '5b', '6a', '6b', '7a', '7b', '8a'],
    idealZones: ['4a', '4b', '5a', '5b', '6a', '6b']
  },

  'tepary-beans': {
    name: 'Tepary Beans',
    family: 'legumes',
    region: 'Southwestern North America',
    climateZone: 'arid-hot',
    daysToMaturity: 90,
    spacing: '6 inches',
    plantingDepth: '1 inch',
    soilTemp: '70-85°F',
    season: 'Hot season',
    companions: ['Corn', 'Squash', 'Amaranth'],
    antagonists: ['None known'],
    successionInterval: null,
    plantingTimes: ['Late spring'],
    harvestTips: 'Harvest when pods are dry',
    commonProblems: ['Bean beetles'],
    nutrition: 'Nitrogen fixer - drought tolerant',
    nativeRegion: 'Sonoran Desert',
    hardinesszones: ['8a', '8b', '9a', '9b', '10a'],
    idealZones: ['9a', '9b', '10a']
  },

  // MIDDLE EASTERN CROPS

  'za-atar': {
    name: 'Za\'atar (Wild Thyme)',
    family: 'herbs',
    region: 'Middle East',
    climateZone: 'mediterranean-arid',
    daysToMaturity: 75,
    spacing: '12 inches',
    plantingDepth: '0.25 inches',
    soilTemp: '65-75°F',
    season: 'Cool to warm season',
    companions: ['Rosemary', 'Oregano', 'Lavender'],
    antagonists: ['None known'],
    successionInterval: 21,
    plantingTimes: ['Spring', 'Fall'],
    harvestTips: 'Harvest leaves before flowering',
    commonProblems: ['Root rot in wet conditions'],
    nutrition: 'Light feeder - drought tolerant',
    nativeRegion: 'Eastern Mediterranean',
    hardinesszones: ['7a', '7b', '8a', '8b', '9a', '9b'],
    idealZones: ['8a', '8b', '9a', '9b']
  },

  'fava-beans': {
    name: 'Fava Beans (Broad Beans)',
    family: 'legumes',
    region: 'Mediterranean/Middle East',
    climateZone: 'cool-temperate',
    daysToMaturity: 85,
    spacing: '8 inches',
    plantingDepth: '2 inches',
    soilTemp: '50-65°F',
    season: 'Cool season',
    companions: ['Cabbage', 'Potatoes', 'Corn'],
    antagonists: ['Onions', 'Garlic'],
    successionInterval: null,
    plantingTimes: ['Early spring', 'Fall in mild climates'],
    harvestTips: 'Harvest when pods are plump but tender',
    commonProblems: ['Aphids', 'Chocolate spot'],
    nutrition: 'Nitrogen fixer',
    nativeRegion: 'Mediterranean',
    hardinesszones: ['4a', '4b', '5a', '5b', '6a', '6b', '7a', '7b', '8a'],
    idealZones: ['5a', '5b', '6a', '6b', '7a']
  },

  // AFRICAN CROPS

  'cowpeas': {
    name: 'Cowpeas (Black-eyed Peas)',
    family: 'legumes',
    region: 'West Africa',
    climateZone: 'tropical-subtropical',
    daysToMaturity: 75,
    spacing: '6 inches',
    plantingDepth: '1 inch',
    soilTemp: '70-85°F',
    season: 'Hot season',
    companions: ['Corn', 'Sorghum', 'Millet'],
    antagonists: ['None known'],
    successionInterval: 21,
    plantingTimes: ['Late spring', 'Summer'],
    harvestTips: 'Harvest young pods as vegetables or mature for beans',
    commonProblems: ['Aphids', 'Pod borers'],
    nutrition: 'Nitrogen fixer',
    nativeRegion: 'West Africa',
    hardinesszones: ['8a', '8b', '9a', '9b', '10a', '10b'],
    idealZones: ['9a', '9b', '10a', '10b']
  },

  'moringa': {
    name: 'Moringa (Drumstick Tree)',
    family: 'moringaceae',
    region: 'Africa/Asia',
    climateZone: 'tropical-subtropical',
    daysToMaturity: 120,
    spacing: '10 feet',
    plantingDepth: '1 inch',
    soilTemp: '75-85°F',
    season: 'Year-round in tropics',
    companions: ['Legumes', 'Grasses', 'Most vegetables'],
    antagonists: ['None known'],
    successionInterval: null,
    plantingTimes: ['Beginning of rainy season'],
    harvestTips: 'Harvest young leaves and pods regularly',
    commonProblems: ['Termites', 'Aphids'],
    nutrition: 'Light feeder - drought tolerant',
    nativeRegion: 'Northern Africa/India',
    hardinesszones: ['9b', '10a', '10b'],
    idealZones: ['10a', '10b']
  },

  'teff': {
    name: 'Teff',
    family: 'poaceae',
    region: 'Ethiopia',
    climateZone: 'high-altitude-tropical',
    daysToMaturity: 100,
    spacing: 'Broadcast seed',
    plantingDepth: '0.125 inches',
    soilTemp: '60-75°F',
    season: 'Warm season',
    companions: ['Legumes', 'Other grains'],
    antagonists: ['None known'],
    successionInterval: null,
    plantingTimes: ['Late spring'],
    harvestTips: 'Harvest when seeds shatter easily',
    commonProblems: ['Birds', 'Lodging'],
    nutrition: 'Light feeder',
    nativeRegion: 'Ethiopian Highlands',
    hardinesszones: ['7a', '7b', '8a', '8b', '9a', '9b'],
    idealZones: ['8a', '8b', '9a', '9b']
  },

  // NIGHTSHADES CONTINUED
  'tomatoes': {
    name: 'Tomatoes',
    family: 'nightshades',
    region: 'South America/Global',
    climateZone: 'warm-temperate-subtropical',
    daysToMaturity: 80,
    spacing: '24-36 inches',
    plantingDepth: '0.25 inches',
    soilTemp: '70-75°F',
    season: 'Warm season',
    companions: ['Basil', 'Carrots', 'Onions', 'Parsley'],
    antagonists: ['Brassicas', 'Fennel', 'Corn'],
    successionInterval: null,
    plantingTimes: ['Late spring after frost'],
    harvestTips: 'Pick when fully colored but still firm',
    commonProblems: ['Hornworms', 'Blight', 'Blossom end rot'],
    nutrition: 'Heavy feeder - consistent watering needed',
    nativeRegion: 'Andes Mountains',
    hardinesszones: ['6a', '6b', '7a', '7b', '8a', '8b', '9a', '9b', '10a'],
    idealZones: ['7a', '7b', '8a', '8b', '9a']
  },

  'peppers': {
    name: 'Peppers',
    family: 'nightshades',
    region: 'Central America/Global',
    climateZone: 'warm-temperate-subtropical',
    daysToMaturity: 75,
    spacing: '18 inches',
    plantingDepth: '0.25 inches',
    soilTemp: '75-80°F',
    season: 'Warm season',
    companions: ['Basil', 'Tomatoes', 'Onions'],
    antagonists: ['Fennel', 'Kohlrabi'],
    successionInterval: null,
    plantingTimes: ['Late spring after soil warms'],
    harvestTips: 'Harvest green or wait for full color',
    commonProblems: ['Aphids', 'Cutworms', 'Bacterial spot'],
    nutrition: 'Heavy feeder - loves warm, rich soil',
    nativeRegion: 'Central America',
    hardinesszones: ['6a', '6b', '7a', '7b', '8a', '8b', '9a', '9b', '10a'],
    idealZones: ['7a', '7b', '8a', '8b', '9a']
  },

  // ASIAN TROPICAL HERBS AND AROMATICS

  'lemongrass': {
    name: 'Lemongrass',
    family: 'herbs',
    region: 'Southeast Asia',
    climateZone: 'tropical-subtropical',
    daysToMaturity: 90,
    spacing: '24 inches',
    plantingDepth: '1 inch',
    soilTemp: '70-85°F',
    season: 'Warm season',
    companions: ['Citrus', 'Most vegetables', 'Other herbs'],
    antagonists: ['None known'],
    successionInterval: null,
    plantingTimes: ['Spring after frost danger'],
    harvestTips: 'Cut stalks near base when 12 inches tall',
    commonProblems: ['Rust', 'Leaf spot'],
    nutrition: 'Light feeder',
    nativeRegion: 'Southeast Asia',
    hardinesszones: ['8a', '8b', '9a', '9b', '10a', '10b'],
    idealZones: ['9a', '9b', '10a', '10b']
  },

  'thai-basil': {
    name: 'Thai Basil',
    family: 'herbs',
    region: 'Southeast Asia',
    climateZone: 'tropical-subtropical',
    daysToMaturity: 60,
    spacing: '12 inches',
    plantingDepth: '0.25 inches',
    soilTemp: '70-80°F',
    season: 'Warm season',
    companions: ['Tomatoes', 'Peppers', 'Eggplant'],
    antagonists: ['Rue'],
    successionInterval: 21,
    plantingTimes: ['Late spring', 'Summer'],
    harvestTips: 'Pinch flowers to keep leaves tender',
    commonProblems: ['Aphids', 'Japanese beetles'],
    nutrition: 'Light to medium feeder',
    nativeRegion: 'Southeast Asia',
    hardinesszones: ['8a', '8b', '9a', '9b', '10a', '10b'],
    idealZones: ['9a', '9b', '10a']
  },

  // MORE TRADITIONAL CROPS UPDATED

  'carrots': {
    name: 'Carrots',
    family: 'umbellifers',
    region: 'Central Asia/Global',
    climateZone: 'temperate',
    daysToMaturity: 75,
    spacing: '2 inches',
    plantingDepth: '0.25 inches',
    soilTemp: '55-65°F',
    season: 'Cool season',
    companions: ['Onions', 'Leeks', 'Rosemary', 'Tomatoes'],
    antagonists: ['Dill', 'Parsnips'],
    successionInterval: 14,
    plantingTimes: ['Early spring through late summer'],
    harvestTips: 'Harvest when 3/4 inch diameter at top',
    commonProblems: ['Carrot fly', 'Wireworms'],
    nutrition: 'Light feeder - loose, deep soil preferred',
    nativeRegion: 'Central Asia',
    hardinesszones: ['3a', '3b', '4a', '4b', '5a', '5b', '6a', '6b', '7a', '7b', '8a'],
    idealZones: ['4a', '4b', '5a', '5b', '6a', '6b']
  },

  'lettuce': {
    name: 'Lettuce',
    family: 'leafy-greens',
    region: 'Mediterranean/Global',
    climateZone: 'temperate',
    daysToMaturity: 45,
    spacing: '8 inches',
    plantingDepth: '0.25 inches',
    soilTemp: '60°F',
    season: 'Cool season',
    companions: ['Carrots', 'Radishes', 'Onions'],
    antagonists: ['Broccoli'],
    successionInterval: 10,
    plantingTimes: ['Early spring through fall'],
    harvestTips: 'Cut outer leaves or whole head',
    commonProblems: ['Aphids', 'Slugs', 'Bolt in heat'],
    nutrition: 'Light feeder - consistent moisture needed',
    nativeRegion: 'Mediterranean',
    hardinesszones: ['2a', '2b', '3a', '3b', '4a', '4b', '5a', '5b', '6a', '6b', '7a', '7b', '8a'],
    idealZones: ['4a', '4b', '5a', '5b', '6a', '6b']
  },

  'spinach': {
    name: 'Spinach',
    family: 'leafy-greens',
    region: 'Central Asia/Global',
    climateZone: 'temperate',
    daysToMaturity: 40,
    spacing: '6 inches',
    plantingDepth: '0.5 inches',
    soilTemp: '50-60°F',
    season: 'Cool season',
    companions: ['Strawberries', 'Radishes', 'Peas'],
    antagonists: ['Sunflowers'],
    successionInterval: 10,
    plantingTimes: ['Early spring', 'Late summer'],
    harvestTips: 'Cut outer leaves, center keeps growing',
    commonProblems: ['Leafminers', 'Downy mildew'],
    nutrition: 'Medium feeder - needs nitrogen',
    nativeRegion: 'Central Asia',
    hardinesszones: ['2a', '2b', '3a', '3b', '4a', '4b', '5a', '5b', '6a', '6b', '7a', '7b'],
    idealZones: ['3a', '3b', '4a', '4b', '5a', '5b']
  },

  'green-beans': {
    name: 'Green Beans',
    family: 'legumes',
    region: 'Central America/Global',
    climateZone: 'warm-temperate',
    daysToMaturity: 55,
    spacing: '6 inches',
    plantingDepth: '1 inch',
    soilTemp: '70°F',
    season: 'Warm season',
    companions: ['Corn', 'Carrots', 'Radishes', 'Cucumber'],
    antagonists: ['Onions', 'Garlic'],
    successionInterval: 14,
    plantingTimes: ['Late spring through mid-summer'],
    harvestTips: 'Pick regularly to keep plants producing',
    commonProblems: ['Bean beetles', 'Rust'],
    nutrition: 'Nitrogen fixer - improves soil',
    nativeRegion: 'Central America',
    hardinesszones: ['4a', '4b', '5a', '5b', '6a', '6b', '7a', '7b', '8a', '8b', '9a'],
    idealZones: ['5a', '5b', '6a', '6b', '7a', '7b']
  },

  'peas': {
    name: 'Peas',
    family: 'legumes',
    region: 'Mediterranean/Global',
    climateZone: 'temperate',
    daysToMaturity: 65,
    spacing: '4 inches',
    plantingDepth: '1-2 inches',
    soilTemp: '45-55°F',
    season: 'Cool season',
    companions: ['Carrots', 'Radishes', 'Lettuce'],
    antagonists: ['Onions', 'Garlic'],
    successionInterval: 10,
    plantingTimes: ['Early spring', 'Late summer'],
    harvestTips: 'Harvest snap peas when pods are plump',
    commonProblems: ['Aphids', 'Powdery mildew'],
    nutrition: 'Nitrogen fixer - enriches soil for next crop',
    nativeRegion: 'Mediterranean',
    hardinesszones: ['2a', '2b', '3a', '3b', '4a', '4b', '5a', '5b', '6a', '6b', '7a'],
    idealZones: ['3a', '3b', '4a', '4b', '5a', '5b']
  },

  'cucumbers': {
    name: 'Cucumbers',
    family: 'cucurbits',
    region: 'South Asia/Global',
    climateZone: 'warm-temperate-subtropical',
    daysToMaturity: 60,
    spacing: '36 inches',
    plantingDepth: '1 inch',
    soilTemp: '70°F',
    season: 'Warm season',
    companions: ['Beans', 'Corn', 'Radishes'],
    antagonists: ['Aromatic herbs'],
    successionInterval: 21,
    plantingTimes: ['Late spring after soil warms'],
    harvestTips: 'Pick daily when 6-8 inches long',
    commonProblems: ['Cucumber beetles', 'Powdery mildew'],
    nutrition: 'Heavy feeder - needs rich, well-drained soil',
    nativeRegion: 'Northern India',
    hardinesszones: ['5a', '5b', '6a', '6b', '7a', '7b', '8a', '8b', '9a', '9b'],
    idealZones: ['6a', '6b', '7a', '7b', '8a', '8b']
  },

  'zucchini': {
    name: 'Zucchini',
    family: 'cucurbits',
    region: 'Central America/Global',
    climateZone: 'warm-temperate-subtropical',
    daysToMaturity: 55,
    spacing: '48 inches',
    plantingDepth: '1 inch',
    soilTemp: '70°F',
    season: 'Warm season',
    companions: ['Beans', 'Corn', 'Nasturtiums'],
    antagonists: ['Potatoes'],
    successionInterval: 28,
    plantingTimes: ['Late spring through early summer'],
    harvestTips: 'Harvest when 6-8 inches for best flavor',
    commonProblems: ['Squash bugs', 'Vine borers'],
    nutrition: 'Heavy feeder - benefits from compost',
    nativeRegion: 'Central America',
    hardinesszones: ['5a', '5b', '6a', '6b', '7a', '7b', '8a', '8b', '9a', '9b'],
    idealZones: ['6a', '6b', '7a', '7b', '8a', '8b']
  },

  'onions': {
    name: 'Onions',
    family: 'alliums',
    region: 'Central Asia/Global',
    climateZone: 'temperate',
    daysToMaturity: 110,
    spacing: '4-6 inches',
    plantingDepth: '1 inch',
    soilTemp: '55°F',
    season: 'Cool season',
    companions: ['Tomatoes', 'Carrots', 'Brassicas'],
    antagonists: ['Beans', 'Peas'],
    successionInterval: null,
    plantingTimes: ['Early spring', 'Fall for overwintering'],
    harvestTips: 'Harvest when tops begin to fall over',
    commonProblems: ['Onion maggots', 'Thrips'],
    nutrition: 'Light feeder - grows in poor soil',
    nativeRegion: 'Central Asia',
    hardinesszones: ['3a', '3b', '4a', '4b', '5a', '5b', '6a', '6b', '7a', '7b', '8a', '8b'],
    idealZones: ['4a', '4b', '5a', '5b', '6a', '6b']
  },

  'garlic': {
    name: 'Garlic',
    family: 'alliums',
    region: 'Central Asia/Global',
    climateZone: 'temperate',
    daysToMaturity: 240,
    spacing: '6 inches',
    plantingDepth: '2 inches',
    soilTemp: '60°F',
    season: 'Fall planted',
    companions: ['Tomatoes', 'Roses', 'Fruit trees'],
    antagonists: ['Beans', 'Peas'],
    successionInterval: null,
    plantingTimes: ['Fall for spring harvest'],
    harvestTips: 'Harvest when lower leaves turn brown',
    commonProblems: ['White rot', 'Nematodes'],
    nutrition: 'Light feeder - prefers well-drained soil',
    nativeRegion: 'Central Asia',
    hardinesszones: ['3a', '3b', '4a', '4b', '5a', '5b', '6a', '6b', '7a', '7b', '8a'],
    idealZones: ['4a', '4b', '5a', '5b', '6a', '6b']
  },

  'radishes': {
    name: 'Radishes',
    family: 'brassicas',
    region: 'Southeast Asia/Global',
    climateZone: 'temperate',
    daysToMaturity: 30,
    spacing: '1 inch',
    plantingDepth: '0.5 inches',
    soilTemp: '50-65°F',
    season: 'Cool season',
    companions: ['Carrots', 'Spinach', 'Lettuce'],
    antagonists: ['Hyssop'],
    successionInterval: 7,
    plantingTimes: ['Early spring through fall'],
    harvestTips: 'Harvest when roots are 1 inch diameter',
    commonProblems: ['Flea beetles', 'Root maggots'],
    nutrition: 'Light feeder',
    nativeRegion: 'Southeast Asia',
    hardinesszones: ['2a', '2b', '3a', '3b', '4a', '4b', '5a', '5b', '6a', '6b', '7a', '7b', '8a'],
    idealZones: ['3a', '3b', '4a', '4b', '5a', '5b', '6a']
  },

  'basil': {
    name: 'Basil',
    family: 'herbs',
    region: 'India/Global',
    climateZone: 'warm-temperate-subtropical',
    daysToMaturity: 65,
    spacing: '12 inches',
    plantingDepth: '0.25 inches',
    soilTemp: '70-80°F',
    season: 'Warm season',
    companions: ['Tomatoes', 'Peppers', 'Oregano'],
    antagonists: ['Rue', 'Sage'],
    successionInterval: 21,
    plantingTimes: ['Late spring', 'Summer'],
    harvestTips: 'Pinch flowers to keep leaves tender',
    commonProblems: ['Aphids', 'Japanese beetles'],
    nutrition: 'Light to medium feeder',
    nativeRegion: 'Tropical Asia',
    hardinesszones: ['6a', '6b', '7a', '7b', '8a', '8b', '9a', '9b', '10a'],
    idealZones: ['7a', '7b', '8a', '8b', '9a']
  },

  // EUROPEAN SPECIALTY CROPS

  'fennel': {
    name: 'Fennel (Florence)',
    family: 'umbellifers',
    region: 'Mediterranean',
    climateZone: 'mediterranean-temperate',
    daysToMaturity: 85,
    spacing: '12 inches',
    plantingDepth: '0.5 inches',
    soilTemp: '60-70°F',
    season: 'Cool season',
    companions: ['Dill', 'Coriander'],
    antagonists: ['Tomatoes', 'Beans', 'Most vegetables'],
    successionInterval: null,
    plantingTimes: ['Late summer for fall harvest'],
    harvestTips: 'Harvest bulb when tennis ball size',
    commonProblems: ['Aphids', 'Carrot fly'],
    nutrition: 'Medium feeder',
    nativeRegion: 'Mediterranean',
    hardinesszones: ['6a', '6b', '7a', '7b', '8a', '8b', '9a'],
    idealZones: ['7a', '7b', '8a', '8b']
  },

  'radicchio': {
    name: 'Radicchio',
    family: 'leafy-greens',
    region: 'Northern Italy',
    climateZone: 'temperate',
    daysToMaturity: 85,
    spacing: '8 inches',
    plantingDepth: '0.25 inches',
    soilTemp: '60-65°F',
    season: 'Cool season',
    companions: ['Lettuce', 'Endive', 'Carrots'],
    antagonists: ['None known'],
    successionInterval: 21,
    plantingTimes: ['Mid-summer for fall harvest'],
    harvestTips: 'Cold weather improves color and flavor',
    commonProblems: ['Aphids', 'Tipburn'],
    nutrition: 'Medium feeder',
    nativeRegion: 'Northern Italy',
    hardinesszones: ['4a', '4b', '5a', '5b', '6a', '6b', '7a', '7b'],
    idealZones: ['5a', '5b', '6a', '6b']
  },

  'arugula': {
    name: 'Arugula (Rocket)',
    family: 'brassicas',
    region: 'Mediterranean',
    climateZone: 'temperate',
    daysToMaturity: 35,
    spacing: '6 inches',
    plantingDepth: '0.25 inches',
    soilTemp: '50-65°F',
    season: 'Cool season',
    companions: ['Lettuce', 'Spinach', 'Carrots'],
    antagonists: ['None known'],
    successionInterval: 7,
    plantingTimes: ['Early spring', 'Late summer', 'Fall'],
    harvestTips: 'Harvest young leaves before flowering',
    commonProblems: ['Flea beetles'],
    nutrition: 'Light feeder',
    nativeRegion: 'Mediterranean',
    hardinesszones: ['3a', '3b', '4a', '4b', '5a', '5b', '6a', '6b', '7a', '7b', '8a'],
    idealZones: ['4a', '4b', '5a', '5b', '6a', '6b']
  },

  // ===== EXPANSION: ASIAN CROPS =====

  // East Asian Vegetables
  'napa-cabbage': {
    name: 'Napa Cabbage (Chinese Cabbage)',
    family: 'brassicas',
    region: 'East Asia',
    climateZone: 'temperate-subtropical',
    daysToMaturity: 70,
    spacing: '12 inches',
    plantingDepth: '0.5 inches',
    soilTemp: '60-70°F',
    season: 'Cool season',
    companions: ['Carrots', 'Onions', 'Lettuce', 'Spinach'],
    antagonists: ['Tomatoes', 'Strawberries'],
    successionInterval: 21,
    plantingTimes: ['Early spring', 'Late summer', 'Fall'],
    harvestTips: 'Harvest when heads are firm and compact',
    commonProblems: ['Clubroot', 'Flea beetles', 'Aphids'],
    nutrition: 'Medium feeder',
    nativeRegion: 'Northern China',
    hardinesszones: ['4a', '4b', '5a', '5b', '6a', '6b', '7a', '7b', '8a'],
    idealZones: ['5a', '5b', '6a', '6b', '7a']
  },

  'mizuna': {
    name: 'Mizuna (Japanese Mustard)',
    family: 'brassicas',
    region: 'East Asia',
    climateZone: 'temperate',
    daysToMaturity: 40,
    spacing: '6 inches',
    plantingDepth: '0.25 inches',
    soilTemp: '50-70°F',
    season: 'Cool season',
    companions: ['Lettuce', 'Spinach', 'Radishes'],
    antagonists: ['None known'],
    successionInterval: 14,
    plantingTimes: ['Spring', 'Fall', 'Winter in mild climates'],
    harvestTips: 'Cut-and-come-again harvest',
    commonProblems: ['Flea beetles', 'Aphids'],
    nutrition: 'Light feeder',
    nativeRegion: 'Japan',
    hardinesszones: ['3a', '3b', '4a', '4b', '5a', '5b', '6a', '6b', '7a', '7b', '8a'],
    idealZones: ['4a', '4b', '5a', '5b', '6a', '6b']
  },

  'tatsoi': {
    name: 'Tatsoi (Spinach Mustard)',
    family: 'brassicas',
    region: 'East Asia',
    climateZone: 'temperate',
    daysToMaturity: 45,
    spacing: '6 inches',
    plantingDepth: '0.25 inches',
    soilTemp: '50-70°F',
    season: 'Cool season',
    companions: ['Lettuce', 'Carrots', 'Onions'],
    antagonists: ['None known'],
    successionInterval: 14,
    plantingTimes: ['Spring', 'Fall'],
    harvestTips: 'Harvest individual leaves or whole rosette',
    commonProblems: ['Flea beetles', 'Clubroot'],
    nutrition: 'Light to medium feeder',
    nativeRegion: 'China',
    hardinesszones: ['3a', '3b', '4a', '4b', '5a', '5b', '6a', '6b', '7a', '7b'],
    idealZones: ['4a', '4b', '5a', '5b', '6a']
  },

  'winter-melon': {
    name: 'Winter Melon (Wax Gourd)',
    family: 'cucurbits',
    region: 'Southeast Asia',
    climateZone: 'subtropical-tropical',
    daysToMaturity: 100,
    spacing: '48 inches',
    plantingDepth: '1 inch',
    soilTemp: '75-85°F',
    season: 'Warm season',
    companions: ['Beans', 'Corn', 'Radishes'],
    antagonists: ['Potatoes'],
    successionInterval: null,
    plantingTimes: ['Late spring', 'Early summer'],
    harvestTips: 'Harvest when waxy coating develops',
    commonProblems: ['Cucumber beetles', 'Squash bugs'],
    nutrition: 'Heavy feeder',
    nativeRegion: 'Southeast Asia',
    hardinesszones: ['8a', '8b', '9a', '9b', '10a', '10b'],
    idealZones: ['9a', '9b', '10a']
  },

  'luffa': {
    name: 'Luffa (Sponge Gourd)',
    family: 'cucurbits',
    region: 'Asia',
    climateZone: 'subtropical-tropical',
    daysToMaturity: 120,
    spacing: '36 inches',
    plantingDepth: '1 inch',
    soilTemp: '75-85°F',
    season: 'Hot season',
    companions: ['Beans', 'Corn', 'Nasturtiums'],
    antagonists: ['Potatoes'],
    successionInterval: null,
    plantingTimes: ['Late spring after soil warms'],
    harvestTips: 'Young fruits for eating, mature for sponges',
    commonProblems: ['Cucumber beetles', 'Aphids'],
    nutrition: 'Medium to heavy feeder',
    nativeRegion: 'South Asia',
    hardinesszones: ['8b', '9a', '9b', '10a', '10b'],
    idealZones: ['9a', '9b', '10a', '10b']
  },

  'bottle-gourd': {
    name: 'Bottle Gourd (Calabash)',
    family: 'cucurbits',
    region: 'Asia/Africa',
    climateZone: 'tropical-subtropical',
    daysToMaturity: 100,
    spacing: '48 inches',
    plantingDepth: '1 inch',
    soilTemp: '75-85°F',
    season: 'Warm season',
    companions: ['Beans', 'Corn', 'Squash'],
    antagonists: ['Potatoes'],
    successionInterval: null,
    plantingTimes: ['Late spring', 'Early summer'],
    harvestTips: 'Harvest young for food, mature for containers',
    commonProblems: ['Fruit flies', 'Powdery mildew'],
    nutrition: 'Medium feeder',
    nativeRegion: 'Africa/Asia',
    hardinesszones: ['8b', '9a', '9b', '10a', '10b'],
    idealZones: ['9a', '9b', '10a']
  },

  'turmeric': {
    name: 'Turmeric',
    family: 'zingiberaceae',
    region: 'South Asia',
    climateZone: 'tropical-subtropical',
    daysToMaturity: 300,
    spacing: '12 inches',
    plantingDepth: '2 inches',
    soilTemp: '70-85°F',
    season: 'Warm season',
    companions: ['Ginger', 'Beans', 'Corn'],
    antagonists: ['None known'],
    successionInterval: null,
    plantingTimes: ['Spring after last frost'],
    harvestTips: 'Harvest rhizomes after foliage dies back',
    commonProblems: ['Root rot', 'Leaf spot'],
    nutrition: 'Medium feeder',
    nativeRegion: 'Southeast Asia',
    hardinesszones: ['8b', '9a', '9b', '10a', '10b'],
    idealZones: ['9a', '9b', '10a', '10b']
  },

  'yard-long-bean-varieties': {
    name: 'Yard Long Bean Varieties',
    family: 'legumes',
    region: 'Southeast Asia',
    climateZone: 'subtropical-tropical',
    daysToMaturity: 70,
    spacing: '12 inches',
    plantingDepth: '1 inch',
    soilTemp: '70-85°F',
    season: 'Warm season',
    companions: ['Corn', 'Squash', 'Cucumber'],
    antagonists: ['Onions', 'Garlic'],
    successionInterval: 21,
    plantingTimes: ['Late spring', 'Summer'],
    harvestTips: 'Harvest when pods are tender',
    commonProblems: ['Bean flies', 'Aphids'],
    nutrition: 'Nitrogen fixer - soil builder',
    nativeRegion: 'Southeast Asia',
    hardinesszones: ['8a', '8b', '9a', '9b', '10a', '10b'],
    idealZones: ['9a', '9b', '10a']
  },

  // ===== EXPANSION: AFRICAN CROPS =====

  'spider-plant': {
    name: 'Spider Plant (Cleome)',
    family: 'capparaceae',
    region: 'Africa',
    climateZone: 'tropical-subtropical',
    daysToMaturity: 60,
    spacing: '12 inches',
    plantingDepth: '0.25 inches',
    soilTemp: '70-85°F',
    season: 'Warm season',
    companions: ['Corn', 'Beans', 'Amaranth'],
    antagonists: ['None known'],
    successionInterval: 21,
    plantingTimes: ['After last frost', 'Rainy season'],
    harvestTips: 'Harvest young leaves and shoots',
    commonProblems: ['Aphids', 'Leaf miners'],
    nutrition: 'Light feeder - drought tolerant',
    nativeRegion: 'Tropical Africa',
    hardinesszones: ['8b', '9a', '9b', '10a', '10b'],
    idealZones: ['9a', '9b', '10a', '10b']
  },

  'jute-mallow': {
    name: 'Jute Mallow (Molokhia)',
    family: 'malvaceae',
    region: 'Africa/Middle East',
    climateZone: 'tropical-subtropical',
    daysToMaturity: 60,
    spacing: '8 inches',
    plantingDepth: '0.25 inches',
    soilTemp: '70-85°F',
    season: 'Warm season',
    companions: ['Okra', 'Amaranth', 'Beans'],
    antagonists: ['None known'],
    successionInterval: 21,
    plantingTimes: ['Late spring', 'Summer'],
    harvestTips: 'Harvest young leaves before flowering',
    commonProblems: ['Aphids', 'Whiteflies'],
    nutrition: 'Medium feeder',
    nativeRegion: 'North Africa',
    hardinesszones: ['8a', '8b', '9a', '9b', '10a', '10b'],
    idealZones: ['9a', '9b', '10a']
  },

  'finger-millet': {
    name: 'Finger Millet (Ragi)',
    family: 'poaceae',
    region: 'Africa/Asia',
    climateZone: 'tropical-subtropical',
    daysToMaturity: 120,
    spacing: 'Broadcast or 6 inches',
    plantingDepth: '0.5 inches',
    soilTemp: '70-85°F',
    season: 'Warm season',
    companions: ['Legumes', 'Groundnuts'],
    antagonists: ['None known'],
    successionInterval: null,
    plantingTimes: ['Beginning of rainy season'],
    harvestTips: 'Harvest when grains are hard',
    commonProblems: ['Birds', 'Blast disease'],
    nutrition: 'Light feeder - drought tolerant',
    nativeRegion: 'East Africa',
    hardinesszones: ['8a', '8b', '9a', '9b', '10a', '10b'],
    idealZones: ['9a', '9b', '10a']
  },

  // ===== EXPANSION: EUROPEAN/MEDITERRANEAN CROPS =====

  'artichoke': {
    name: 'Globe Artichoke',
    family: 'asteraceae',
    region: 'Mediterranean',
    climateZone: 'mediterranean',
    daysToMaturity: 180,
    spacing: '48 inches',
    plantingDepth: '1 inch',
    soilTemp: '60-70°F',
    season: 'Cool season',
    companions: ['Sunflowers', 'Tarragon'],
    antagonists: ['None known'],
    successionInterval: null,
    plantingTimes: ['Early spring', 'Fall in mild climates'],
    harvestTips: 'Harvest before flowers open',
    commonProblems: ['Aphids', 'Snails'],
    nutrition: 'Heavy feeder',
    nativeRegion: 'Mediterranean',
    hardinesszones: ['7a', '7b', '8a', '8b', '9a', '9b', '10a'],
    idealZones: ['8a', '8b', '9a', '9b']
  },

  'kohlrabi': {
    name: 'Kohlrabi',
    family: 'brassicas',
    region: 'Northern Europe',
    climateZone: 'temperate',
    daysToMaturity: 60,
    spacing: '6 inches',
    plantingDepth: '0.5 inches',
    soilTemp: '60-70°F',
    season: 'Cool season',
    companions: ['Onions', 'Cucumbers', 'Beets'],
    antagonists: ['Tomatoes', 'Pole beans'],
    successionInterval: 14,
    plantingTimes: ['Early spring', 'Late summer'],
    harvestTips: 'Harvest when bulbs are 2-3 inches',
    commonProblems: ['Cabbage worms', 'Flea beetles'],
    nutrition: 'Medium feeder',
    nativeRegion: 'Northern Europe',
    hardinesszones: ['3a', '3b', '4a', '4b', '5a', '5b', '6a', '6b', '7a', '7b'],
    idealZones: ['4a', '4b', '5a', '5b', '6a', '6b']
  },

  // ===== EXPANSION: AMERICAN INDIGENOUS CROPS =====

  'quinoa-white': {
    name: 'White Quinoa',
    family: 'amaranthaceae',
    region: 'Andes',
    climateZone: 'high-altitude-temperate',
    daysToMaturity: 120,
    spacing: '12 inches',
    plantingDepth: '0.25 inches',
    soilTemp: '60-70°F',
    season: 'Cool season',
    companions: ['Beans', 'Corn', 'Potatoes'],
    antagonists: ['None known'],
    successionInterval: null,
    plantingTimes: ['Late spring'],
    harvestTips: 'Harvest when seeds come off easily',
    commonProblems: ['Birds', 'Downy mildew'],
    nutrition: 'Light feeder - salt tolerant',
    nativeRegion: 'Bolivian Andes',
    hardinesszones: ['4a', '4b', '5a', '5b', '6a', '6b', '7a', '7b'],
    idealZones: ['5a', '5b', '6a', '6b']
  },

  'amaranth-grain': {
    name: 'Grain Amaranth',
    family: 'amaranthaceae',
    region: 'Central America',
    climateZone: 'temperate-subtropical',
    daysToMaturity: 100,
    spacing: '12 inches',
    plantingDepth: '0.25 inches',
    soilTemp: '70-85°F',
    season: 'Warm season',
    companions: ['Corn', 'Beans', 'Squash'],
    antagonists: ['None known'],
    successionInterval: null,
    plantingTimes: ['After last frost'],
    harvestTips: 'Harvest seeds when mature and dry',
    commonProblems: ['Birds', 'Aphids'],
    nutrition: 'Light feeder - drought tolerant',
    nativeRegion: 'Central Mexico',
    hardinesszones: ['6a', '6b', '7a', '7b', '8a', '8b', '9a', '9b'],
    idealZones: ['7a', '7b', '8a', '8b']
  },

  'chia': {
    name: 'Chia',
    family: 'lamiaceae',
    region: 'Central America',
    climateZone: 'subtropical-arid',
    daysToMaturity: 120,
    spacing: '18 inches',
    plantingDepth: '0.125 inches',
    soilTemp: '70-85°F',
    season: 'Warm season',
    companions: ['Herbs', 'Drought-tolerant plants'],
    antagonists: ['None known'],
    successionInterval: null,
    plantingTimes: ['Late spring'],
    harvestTips: 'Harvest seeds when flowers have dried',
    commonProblems: ['Birds', 'Slugs on young plants'],
    nutrition: 'Light feeder - drought tolerant',
    nativeRegion: 'Central and Southern Mexico',
    hardinesszones: ['8a', '8b', '9a', '9b', '10a', '10b'],
    idealZones: ['9a', '9b', '10a']
  },

  'nopal-pads': {
    name: 'Nopal (Prickly Pear Cactus Pads)',
    family: 'cactaceae',
    region: 'North America',
    climateZone: 'arid-desert',
    daysToMaturity: 60,
    spacing: '36 inches',
    plantingDepth: 'Pad cuttings planted edge down',
    soilTemp: '70-90°F',
    season: 'Warm season',
    companions: ['Agave', 'Desert plants'],
    antagonists: ['Water-loving plants'],
    successionInterval: 30,
    plantingTimes: ['Spring', 'Early summer'],
    harvestTips: 'Harvest young tender pads',
    commonProblems: ['Root rot from overwatering', 'Scale insects'],
    nutrition: 'Very light feeder - extremely drought tolerant',
    nativeRegion: 'Mexico/Southwestern US',
    hardinesszones: ['8a', '8b', '9a', '9b', '10a', '10b'],
    idealZones: ['9a', '9b', '10a', '10b']
  },

  'wild-rice': {
    name: 'Wild Rice (Manoomin)',
    family: 'poaceae',
    region: 'North America',
    climateZone: 'temperate-wetland',
    daysToMaturity: 120,
    spacing: 'Aquatic - broadcast in shallow water',
    plantingDepth: 'Seeds sink to muddy bottom',
    soilTemp: '60-75°F',
    season: 'Full season',
    companions: ['Wetland plants', 'Waterfowl habitat'],
    antagonists: ['Drought conditions'],
    successionInterval: null,
    plantingTimes: ['Late spring in wetlands'],
    harvestTips: 'Traditional canoe harvest in fall',
    commonProblems: ['Water level fluctuations', 'Waterfowl damage'],
    nutrition: 'Aquatic - nutrient uptake from water',
    nativeRegion: 'Great Lakes region',
    hardinesszones: ['3a', '3b', '4a', '4b', '5a', '5b', '6a', '6b'],
    idealZones: ['4a', '4b', '5a', '5b']
  },

  // ===== EXPANSION: OCEANIC CROPS =====

  'taro-varieties': {
    name: 'Taro Varieties (Kalo)',
    family: 'araceae',
    region: 'Pacific Islands',
    climateZone: 'tropical-subtropical',
    daysToMaturity: 300,
    spacing: '24 inches',
    plantingDepth: 'Corms planted at soil level',
    soilTemp: '75-85°F',
    season: 'Year-round in tropics',
    companions: ['Ginger', 'Sweet potatoes'],
    antagonists: ['None known'],
    successionInterval: null,
    plantingTimes: ['Beginning of rainy season'],
    harvestTips: 'Harvest corms when leaves yellow',
    commonProblems: ['Taro leaf blight', 'Aphids'],
    nutrition: 'Heavy feeder - requires consistent moisture',
    nativeRegion: 'Southeast Asia/Pacific',
    hardinesszones: ['9a', '9b', '10a', '10b'],
    idealZones: ['10a', '10b']
  },

  // ===== EXPANSION: SPECIALTY & ANCIENT CROPS =====

  'emmer-wheat': {
    name: 'Emmer Wheat (Ancient Wheat)',
    family: 'poaceae',
    region: 'Middle East',
    climateZone: 'mediterranean-temperate',
    daysToMaturity: 240,
    spacing: 'Broadcast seeding',
    plantingDepth: '1 inch',
    soilTemp: '50-70°F',
    season: 'Cool season winter crop',
    companions: ['Legumes in rotation'],
    antagonists: ['None known'],
    successionInterval: null,
    plantingTimes: ['Fall'],
    harvestTips: 'Harvest when grain is hard and dry',
    commonProblems: ['Rust diseases', 'Birds'],
    nutrition: 'Medium feeder - drought tolerant',
    nativeRegion: 'Fertile Crescent',
    hardinesszones: ['5a', '5b', '6a', '6b', '7a', '7b', '8a', '8b'],
    idealZones: ['6a', '6b', '7a', '7b']
  },

  'buckwheat': {
    name: 'Buckwheat',
    family: 'polygonaceae',
    region: 'Central Asia',
    climateZone: 'temperate',
    daysToMaturity: 75,
    spacing: 'Broadcast seeding',
    plantingDepth: '0.5 inches',
    soilTemp: '60-70°F',
    season: 'Warm season',
    companions: ['Legumes', 'Vegetables'],
    antagonists: ['None known'],
    successionInterval: null,
    plantingTimes: ['Late spring', 'Early summer'],
    harvestTips: 'Harvest when 75% of seeds are brown',
    commonProblems: ['Birds', 'Frost damage'],
    nutrition: 'Light feeder - improves soil',
    nativeRegion: 'Central Asia',
    hardinesszones: ['3a', '3b', '4a', '4b', '5a', '5b', '6a', '6b', '7a', '7b'],
    idealZones: ['4a', '4b', '5a', '5b', '6a', '6b']
  },

  'sorghum': {
    name: 'Sorghum (Grain Sorghum)',
    family: 'poaceae',
    region: 'Africa',
    climateZone: 'arid-hot',
    daysToMaturity: 120,
    spacing: '6 inches',
    plantingDepth: '1 inch',
    soilTemp: '70-90°F',
    season: 'Hot season',
    companions: ['Legumes', 'Cowpeas'],
    antagonists: ['None known'],
    successionInterval: null,
    plantingTimes: ['Late spring', 'Early summer'],
    harvestTips: 'Harvest when seeds are hard',
    commonProblems: ['Birds', 'Aphids'],
    nutrition: 'Light feeder - extremely drought tolerant',
    nativeRegion: 'Africa',
    hardinesszones: ['7a', '7b', '8a', '8b', '9a', '9b', '10a', '10b'],
    idealZones: ['8a', '8b', '9a', '9b']
  },

  'millet-pearl': {
    name: 'Pearl Millet',
    family: 'poaceae',
    region: 'Africa',
    climateZone: 'arid-tropical',
    daysToMaturity: 90,
    spacing: '6 inches',
    plantingDepth: '0.5 inches',
    soilTemp: '70-85°F',
    season: 'Hot season',
    companions: ['Legumes', 'Groundnuts'],
    antagonists: ['None known'],
    successionInterval: null,
    plantingTimes: ['Beginning of rainy season'],
    harvestTips: 'Harvest when grains are mature',
    commonProblems: ['Birds', 'Downy mildew'],
    nutrition: 'Light feeder - drought and heat tolerant',
    nativeRegion: 'West Africa',
    hardinesszones: ['8a', '8b', '9a', '9b', '10a', '10b'],
    idealZones: ['9a', '9b', '10a']
  },

  'lablab-beans': {
    name: 'Lablab Beans (Hyacinth Bean)',
    family: 'legumes',
    region: 'Africa/Asia',
    climateZone: 'tropical-subtropical',
    daysToMaturity: 90,
    spacing: '18 inches',
    plantingDepth: '1 inch',
    soilTemp: '70-85°F',
    season: 'Warm season',
    companions: ['Corn', 'Sorghum', 'Millet'],
    antagonists: ['None known'],
    successionInterval: null,
    plantingTimes: ['Late spring', 'Early summer'],
    harvestTips: 'Harvest young pods and leaves',
    commonProblems: ['Pod borers', 'Aphids'],
    nutrition: 'Nitrogen fixer - drought tolerant',
    nativeRegion: 'Africa',
    hardinesszones: ['8a', '8b', '9a', '9b', '10a', '10b'],
    idealZones: ['9a', '9b', '10a']
  },

  'bambara-groundnut': {
    name: 'Bambara Groundnut',
    family: 'legumes',
    region: 'Africa',
    climateZone: 'tropical-subtropical',
    daysToMaturity: 120,
    spacing: '12 inches',
    plantingDepth: '1 inch',
    soilTemp: '70-85°F',
    season: 'Warm season',
    companions: ['Millet', 'Sorghum', 'Cassava'],
    antagonists: ['None known'],
    successionInterval: null,
    plantingTimes: ['Beginning of rainy season'],
    harvestTips: 'Harvest when pods are mature',
    commonProblems: ['Aphids', 'Thrips'],
    nutrition: 'Nitrogen fixer - drought tolerant',
    nativeRegion: 'West Africa',
    hardinesszones: ['9a', '9b', '10a', '10b'],
    idealZones: ['10a', '10b']
  },

  'jicama': {
    name: 'Jicama (Mexican Turnip)',
    family: 'legumes',
    region: 'Central America',
    climateZone: 'subtropical-tropical',
    daysToMaturity: 150,
    spacing: '12 inches',
    plantingDepth: '1 inch',
    soilTemp: '70-85°F',
    season: 'Warm season',
    companions: ['Corn', 'Beans', 'Squash'],
    antagonists: ['None known'],
    successionInterval: null,
    plantingTimes: ['Late spring'],
    harvestTips: 'Harvest tubers before first frost',
    commonProblems: ['Nematodes', 'Aphids'],
    nutrition: 'Light feeder - heat tolerant',
    nativeRegion: 'Central America',
    hardinesszones: ['8b', '9a', '9b', '10a', '10b'],
    idealZones: ['9a', '9b', '10a', '10b']
  },

  'malabar-spinach': {
    name: 'Malabar Spinach (Ceylon Spinach)',
    family: 'basellaceae',
    region: 'South Asia',
    climateZone: 'tropical-subtropical',
    daysToMaturity: 70,
    spacing: '12 inches',
    plantingDepth: '0.5 inches',
    soilTemp: '70-85°F',
    season: 'Hot season',
    companions: ['Beans', 'Okra', 'Peppers'],
    antagonists: ['None known'],
    successionInterval: 21,
    plantingTimes: ['Late spring', 'Summer'],
    harvestTips: 'Harvest leaves continuously',
    commonProblems: ['Aphids', 'Leaf miners'],
    nutrition: 'Medium feeder - heat and humidity tolerant',
    nativeRegion: 'South Asia',
    hardinesszones: ['8b', '9a', '9b', '10a', '10b'],
    idealZones: ['9a', '9b', '10a', '10b']
  },

  'new-zealand-spinach': {
    name: 'New Zealand Spinach',
    family: 'aizoaceae',
    region: 'Oceania',
    climateZone: 'temperate-subtropical',
    daysToMaturity: 60,
    spacing: '18 inches',
    plantingDepth: '0.5 inches',
    soilTemp: '60-75°F',
    season: 'Warm season',
    companions: ['Tomatoes', 'Peppers', 'Herbs'],
    antagonists: ['None known'],
    successionInterval: 21,
    plantingTimes: ['Late spring', 'Summer'],
    harvestTips: 'Harvest leaves continuously',
    commonProblems: ['Aphids', 'Slugs'],
    nutrition: 'Light feeder - salt tolerant',
    nativeRegion: 'New Zealand/Australia',
    hardinesszones: ['6a', '6b', '7a', '7b', '8a', '8b', '9a', '9b'],
    idealZones: ['7a', '7b', '8a', '8b']
  },

  'ground-cherry': {
    name: 'Ground Cherry (Physalis)',
    family: 'nightshades',
    region: 'Americas',
    climateZone: 'temperate-subtropical',
    daysToMaturity: 75,
    spacing: '24 inches',
    plantingDepth: '0.25 inches',
    soilTemp: '65-75°F',
    season: 'Warm season',
    companions: ['Tomatoes', 'Peppers', 'Basil'],
    antagonists: ['Black walnut'],
    successionInterval: null,
    plantingTimes: ['After last frost'],
    harvestTips: 'Harvest when husks turn brown',
    commonProblems: ['Flea beetles', 'Aphids'],
    nutrition: 'Medium feeder',
    nativeRegion: 'Central America',
    hardinesszones: ['6a', '6b', '7a', '7b', '8a', '8b', '9a', '9b'],
    idealZones: ['7a', '7b', '8a', '8b']
  }
};

export default function AdvancedCropRotationCalculator() {
  // State management
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const [selectedCropDetail, setSelectedCropDetail] = useState<string | null>(null);
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [cropSearchTerm, setCropSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedClimateZone, setSelectedClimateZone] = useState<string>('all');
  const [gardenBeds, setGardenBeds] = useState([
    { id: 1, name: 'Bed 1', size: 100, currentCrop: '', year: 1 },
    { id: 2, name: 'Bed 2', size: 100, currentCrop: '', year: 1 },
    { id: 3, name: 'Bed 3', size: 100, currentCrop: '', year: 1 },
    { id: 4, name: 'Bed 4', size: 100, currentCrop: '', year: 1 }
  ]);
  const [rotationYears, setRotationYears] = useState(4);
  const [showAllCrops, setShowAllCrops] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState('lettuce');
  const [plantingDate, setPlantingDate] = useState('');
  const [gardenZone, setGardenZone] = useState('6a');
  const [gardenType, setGardenType] = useState('traditional');
  const [soilAmendment, setSoilAmendment] = useState('compost');
  const [amendmentArea, setAmendmentArea] = useState(100);
  const [showCompanions, setShowCompanions] = useState(false);
  const [showSuccession, setShowSuccession] = useState(false);
  const [showSoilCalc, setShowSoilCalc] = useState(false);
  const [activeTab, setActiveTab] = useState('planner');

  // Helper functions
  const addCropToSelection = (cropKey: string) => {
    if (!selectedCrops.includes(cropKey)) {
      setSelectedCrops([...selectedCrops, cropKey]);
    }
  };

  const removeCropFromSelection = (cropKey: string) => {
    setSelectedCrops(selectedCrops.filter(crop => crop !== cropKey));
  };

  const getFilteredCrops = () => {
    return Object.entries(CROP_DATABASE).filter(([key, crop]) => {
      // Text search filter
      const matchesSearch = crop.name.toLowerCase().includes(cropSearchTerm.toLowerCase()) ||
                           crop.family.toLowerCase().includes(cropSearchTerm.toLowerCase()) ||
                           ((crop as any).region && (crop as any).region.toLowerCase().includes(cropSearchTerm.toLowerCase()));

      // Region filter
      const matchesRegion = selectedRegion === 'all' ||
                           ((crop as any).region && (crop as any).region.toLowerCase().includes(selectedRegion.toLowerCase()));

      // Climate zone filter
      const matchesClimate = selectedClimateZone === 'all' ||
                             ((crop as any).climateZone && (crop as any).climateZone.toLowerCase().includes(selectedClimateZone.toLowerCase())) ||
                             ((crop as any).hardinesszones && (crop as any).hardinesszones.includes(gardenZone));

      return matchesSearch && matchesRegion && matchesClimate;
    });
  };

  const generateCropRotationPlan = () => {
    const cropsByFamily: { [family: string]: string[] } = {};

    selectedCrops.forEach(cropKey => {
      const crop = CROP_DATABASE[cropKey as keyof typeof CROP_DATABASE];
      if (!cropsByFamily[crop.family]) {
        cropsByFamily[crop.family] = [];
      }
      cropsByFamily[crop.family].push(cropKey);
    });

    return cropsByFamily;
  };

  // Calculate succession planting dates
  const calculateSuccessionDates = () => {
    if (!plantingDate || !SUCCESSION_INTERVALS[selectedCrop as keyof typeof SUCCESSION_INTERVALS]) return [];

    const startDate = new Date(plantingDate);
    const { interval, totalWeeks } = SUCCESSION_INTERVALS[selectedCrop as keyof typeof SUCCESSION_INTERVALS];
    const dates = [];

    for (let week = 0; week < totalWeeks; week += (interval / 7)) {
      const plantDate = new Date(startDate);
      plantDate.setDate(startDate.getDate() + (week * 7));
      dates.push({
        plantingDate: plantDate.toLocaleDateString(),
        harvestWeek: Math.floor(week + 6), // Approximate harvest time
      });
    }

    return dates;
  };

  // Calculate soil amendment needs
  const calculateSoilAmendment = () => {
    const amendment = SOIL_AMENDMENTS[soilAmendment as keyof typeof SOIL_AMENDMENTS];
    if (!amendment) return null;

    const amount = (amendmentArea / 100) * amendment.ratePerSqFt;

    return {
      amount: Math.round(amount * 100) / 100,
      unit: amendment.unit,
      description: amendment.description
    };
  };

  // Generate rotation schedule for beds
  const generateRotationSchedule = () => {
    const plan = ROTATION_PLANS[rotationYears as keyof typeof ROTATION_PLANS];
    if (!plan) return [];

    const zoneData = HARDINESS_ZONES[gardenZone as keyof typeof HARDINESS_ZONES];
    const gardenTypeData = GARDEN_TYPES[gardenType as keyof typeof GARDEN_TYPES];

    return gardenBeds.map(bed => {
      const schedule = [];
      for (let year = 0; year < rotationYears; year++) {
        const yearIndex = (bed.id - 1 + year) % rotationYears;
        const yearData = plan.schedule[yearIndex];

        // Generate zone and garden type specific recommendations
        const recommendations = [];

        if (zoneData) {
          recommendations.push(`Growing season: ${zoneData.growingSeason} days`);
          recommendations.push(`Last frost: ${zoneData.lastFrost}`);
          if (zoneData.firstFrost !== 'No frost') {
            recommendations.push(`First frost: ${zoneData.firstFrost}`);
          }
        }

        if (gardenTypeData) {
          recommendations.push(`Spacing: ${gardenTypeData.spacing}`);
          recommendations.push(`Efficiency: ${gardenTypeData.efficiency}`);
        }

        schedule.push({
          year: year + 1,
          crops: yearData.crops,
          focus: yearData.focus,
          zoneInfo: zoneData,
          gardenInfo: gardenTypeData,
          recommendations: recommendations
        });
      }
      return { ...bed, schedule };
    });
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-background">
      {/* Custom styles for dropdown borders */}
      <style jsx>{dropdownStyles}</style>

      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl">
            <RotateCcw className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Advanced Crop Rotation Calculator</h1>
            <p className="text-muted-foreground">Plan your garden for maximum soil health and yield</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-muted rounded-lg p-1 gap-1">
            {[
              {
                id: 'planner',
                label: 'Rotation Planner',
                shortLabel: 'Rotation',
                icon: Calendar,
                tooltip: 'Plan multi-year crop rotations by plant families and garden beds'
              },
              {
                id: 'crops',
                label: 'Crop Selection',
                shortLabel: 'Crops',
                icon: Sprout,
                tooltip: 'Choose specific vegetables and get detailed growing information'
              },
              {
                id: 'families',
                label: 'Plant Families',
                shortLabel: 'Families',
                icon: Leaf,
                tooltip: 'Learn about plant families and their rotation requirements'
              },
              {
                id: 'succession',
                label: 'Succession',
                shortLabel: 'Succession',
                icon: Clock,
                tooltip: 'Calculate succession planting schedules for continuous harvests'
              },
              {
                id: 'soil',
                label: 'Soil Calculator',
                shortLabel: 'Soil',
                icon: Calculator,
                tooltip: 'Calculate soil amendments and cover crop requirements'
              }
            ].map(tab => (
              <Tooltip key={tab.id} content={tab.tooltip}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 rounded-md text-sm font-medium transition-all min-w-[80px] sm:min-w-[120px]",
                    activeTab === tab.id
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  )}
                >
                  <tab.icon className="h-4 w-4 flex-shrink-0" />
                  <span className="text-xs sm:text-sm text-center leading-tight">
                    <span className="hidden sm:inline">{tab.label}</span>
                    <span className="sm:hidden">{tab.shortLabel}</span>
                  </span>
                </button>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>

      {/* Rotation Planner Tab */}
      {activeTab === 'planner' && (
        <div className="space-y-6">
          {/* Configuration */}
          <div className="bg-card border rounded-xl p-6 dropdown-container">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Rotation Configuration
              <Tooltip content="Configure your garden's basic parameters to get customized rotation recommendations">
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </Tooltip>
            </h3>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  Rotation Years
                  <Tooltip content="Number of years in your rotation cycle. Longer rotations provide better pest and disease control but require more planning.">
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </Tooltip>
                </label>
                <select
                  value={rotationYears}
                  onChange={(e) => setRotationYears(Number(e.target.value))}
                  className="w-full p-3 border rounded-lg bg-background text-foreground"
                >
                  <option value={3}>3-Year Rotation (Basic)</option>
                  <option value={4}>4-Year Rotation (Recommended)</option>
                  <option value={5}>5-Year Rotation (Advanced)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  Hardiness Zone
                  <Tooltip content="Your USDA Hardiness Zone determines frost dates and planting schedules. Find your zone at usda.gov">
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </Tooltip>
                </label>
                <select
                  value={gardenZone}
                  onChange={(e) => setGardenZone(e.target.value)}
                  className="w-full p-3 border rounded-lg bg-background text-foreground"
                >
                  <option value="3a">Zone 3a (-40 to -35°F)</option>
                  <option value="3b">Zone 3b (-35 to -30°F)</option>
                  <option value="4a">Zone 4a (-30 to -25°F)</option>
                  <option value="4b">Zone 4b (-25 to -20°F)</option>
                  <option value="5a">Zone 5a (-20 to -15°F)</option>
                  <option value="5b">Zone 5b (-15 to -10°F)</option>
                  <option value="6a">Zone 6a (-10 to -5°F)</option>
                  <option value="6b">Zone 6b (-5 to 0°F)</option>
                  <option value="7a">Zone 7a (0 to 5°F)</option>
                  <option value="7b">Zone 7b (5 to 10°F)</option>
                  <option value="8a">Zone 8a (10 to 15°F)</option>
                  <option value="8b">Zone 8b (15 to 20°F)</option>
                  <option value="9a">Zone 9a (20 to 25°F)</option>
                  <option value="9b">Zone 9b (25 to 30°F)</option>
                  <option value="10a">Zone 10a (30 to 35°F)</option>
                  <option value="10b">Zone 10b (35 to 40°F)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  Garden Type
                  <Tooltip content="Your garden layout affects spacing recommendations and rotation planning. Choose the style that best matches your setup.">
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </Tooltip>
                </label>
                <select
                  value={gardenType}
                  onChange={(e) => setGardenType(e.target.value)}
                  className="w-full p-3 border rounded-lg bg-background text-foreground relative z-10"
                >
                  <option value="traditional">Traditional Rows</option>
                  <option value="raised">Raised Beds</option>
                  <option value="container">Container Garden</option>
                  <option value="square-foot">Square Foot Garden</option>
                </select>
              </div>
            </div>

            {/* Zone & Garden Type Summary */}
            {(gardenZone !== '6a' || gardenType !== 'traditional') && (
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-2">
                      <span className="text-blue-600">🌡️</span>
                      Zone {gardenZone}
                    </h4>
                    <div className="text-sm space-y-1">
                      <div>Last Frost: {HARDINESS_ZONES[gardenZone as keyof typeof HARDINESS_ZONES]?.lastFrost}</div>
                      <div>First Frost: {HARDINESS_ZONES[gardenZone as keyof typeof HARDINESS_ZONES]?.firstFrost}</div>
                      <div>Growing Season: {HARDINESS_ZONES[gardenZone as keyof typeof HARDINESS_ZONES]?.growingSeason} days</div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold flex items-center gap-2 mb-2">
                      <span className="text-green-600">🌱</span>
                      {GARDEN_TYPES[gardenType as keyof typeof GARDEN_TYPES]?.name}
                    </h4>
                    <div className="text-sm space-y-1">
                      <div>Spacing: {GARDEN_TYPES[gardenType as keyof typeof GARDEN_TYPES]?.spacing}</div>
                      <div>Efficiency: {GARDEN_TYPES[gardenType as keyof typeof GARDEN_TYPES]?.efficiency}</div>
                      <div className="text-muted-foreground">{GARDEN_TYPES[gardenType as keyof typeof GARDEN_TYPES]?.description}</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Rotation Schedule */}
          <div className="bg-card border rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Rotation Schedule
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {generateRotationSchedule().map(bed => (
                <div key={bed.id} className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-3 text-center bg-muted px-3 py-1 rounded">
                    {bed.name} ({bed.size} sq ft)
                  </h4>

                  <div className="space-y-2">
                    {bed.schedule.map((year, index) => (
                      <div key={index} className="p-3 rounded-lg bg-muted/50 border">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                            {year.year}
                          </div>
                          <div>
                            <div className="font-medium">{year.crops.join(', ')}</div>
                            <div className="text-sm text-muted-foreground">{year.focus}</div>
                          </div>
                        </div>

                        {/* Zone and Garden Type Recommendations */}
                        {year.recommendations && year.recommendations.length > 0 && (
                          <div className="mt-3 pt-2 border-t border-muted">
                            <div className="text-xs font-medium text-muted-foreground mb-1">Zone & Garden Tips:</div>
                            <div className="text-xs space-y-1">
                              {year.recommendations.map((rec, recIndex) => (
                                <div key={recIndex} className="flex items-center gap-1">
                                  <div className="w-1 h-1 bg-primary rounded-full flex-shrink-0" />
                                  <span>{rec}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rotation Benefits */}
          <div className="bg-card border rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Rotation Benefits
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  icon: <Leaf className="h-8 w-8 text-green-500" />,
                  title: 'Soil Health',
                  description: 'Improves soil structure and fertility through diverse root systems and organic matter'
                },
                {
                  icon: <Target className="h-8 w-8 text-blue-500" />,
                  title: 'Pest Control',
                  description: 'Breaks pest and disease cycles by removing host plants from the environment'
                },
                {
                  icon: <Zap className="h-8 w-8 text-yellow-500" />,
                  title: 'Nutrient Management',
                  description: 'Balances soil nutrients by alternating heavy feeders with soil builders'
                },
                {
                  icon: <TrendingUp className="h-8 w-8 text-purple-500" />,
                  title: 'Increased Yield',
                  description: 'Maximizes productivity through optimized soil conditions and reduced competition'
                }
              ].map((benefit, index) => (
                <div key={index} className="text-center p-4 rounded-lg border">
                  <div className="flex justify-center mb-3">{benefit.icon}</div>
                  <h4 className="font-semibold mb-2">{benefit.title}</h4>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Crop Selection Tab */}
      {activeTab === 'crops' && (
        <div className="space-y-6">
          {/* Crop Search and Selection */}
          <div className="bg-card border rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Sprout className="h-5 w-5 text-primary" />
              Choose Your Crops
              <Tooltip content="Select individual vegetables you want to grow. Get specific planting, spacing, and companion information for each crop.">
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </Tooltip>
            </h3>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search crops by name or family..."
                value={cropSearchTerm}
                onChange={(e) => setCropSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border rounded-lg bg-background text-foreground"
              />
            </div>

            {/* Region and Climate Zone Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  Filter by Region
                  <Tooltip content="Filter crops by their native region or where they grow best">
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </Tooltip>
                </label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="w-full p-3 border rounded-lg bg-background text-foreground"
                >
                  <option value="all">All Regions</option>
                  <option value="southeast asia">Southeast Asia</option>
                  <option value="africa">Africa</option>
                  <option value="europe">Europe</option>
                  <option value="mediterranean">Mediterranean</option>
                  <option value="south america">South America</option>
                  <option value="central america">Central America</option>
                  <option value="south asia">South Asia</option>
                  <option value="global">Global/Worldwide</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  Filter by Climate Zone
                  <Tooltip content="Filter crops by their preferred climate conditions">
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </Tooltip>
                </label>
                <select
                  value={selectedClimateZone}
                  onChange={(e) => setSelectedClimateZone(e.target.value)}
                  className="w-full p-3 border rounded-lg bg-background text-foreground"
                >
                  <option value="all">All Climate Zones</option>
                  <option value="tropical">Tropical</option>
                  <option value="subtropical">Subtropical</option>
                  <option value="temperate">Temperate</option>
                  <option value="cold">Cold</option>
                  <option value="mediterranean">Mediterranean</option>
                  <option value="arid">Arid</option>
                  <option value="warm">Warm Season</option>
                </select>
              </div>
            </div>

            {/* Filter Summary */}
            <div className="mb-4 p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <span className="font-medium">
                    Showing {getFilteredCrops().length} of 89 crops
                  </span>
                  {selectedRegion !== 'all' && (
                    <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                      Region: {selectedRegion}
                    </span>
                  )}
                  {selectedClimateZone !== 'all' && (
                    <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                      Climate: {selectedClimateZone}
                    </span>
                  )}
                </div>
                {(selectedRegion !== 'all' || selectedClimateZone !== 'all' || cropSearchTerm) && (
                  <button
                    onClick={() => {
                      setSelectedRegion('all');
                      setSelectedClimateZone('all');
                      setCropSearchTerm('');
                    }}
                    className="text-xs text-muted-foreground hover:text-foreground"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>

            {/* Crop Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 max-h-96 overflow-y-auto">
              {getFilteredCrops().map(([key, crop]) => (
                <div
                  key={key}
                  className={cn(
                    "p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md",
                    selectedCrops.includes(key) ? "ring-2 ring-primary bg-primary/5" : ""
                  )}
                  onClick={() => selectedCrops.includes(key) ? removeCropFromSelection(key) : addCropToSelection(key)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{crop.name}</h4>
                    <div className="flex items-center gap-1">
                      {selectedCrops.includes(key) ? (
                        <CheckCircle className="h-4 w-4 text-primary" />
                      ) : (
                        <Plus className="h-4 w-4 text-muted-foreground" />
                      )}
                      <Tooltip content={`Days to maturity: ${crop.daysToMaturity} | Season: ${crop.season} | Family: ${crop.family}`}>
                        <Info className="h-3 w-3 text-muted-foreground" />
                      </Tooltip>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    <div>{crop.season} • {crop.daysToMaturity} days</div>
                    <div className="mt-1 px-2 py-1 bg-muted rounded text-xs">{crop.family}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Selected Crops Display */}
          {selectedCrops.length > 0 && (
            <div className="bg-card border rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Your Selected Crops ({selectedCrops.length})
                <Tooltip content="These are the crops you've selected. Click on any crop to see detailed growing information.">
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </Tooltip>
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Selected Crops List */}
                <div className="space-y-2">
                  {selectedCrops.map(cropKey => {
                    const crop = CROP_DATABASE[cropKey as keyof typeof CROP_DATABASE];
                    return (
                      <div
                        key={cropKey}
                        className={cn(
                          "p-3 border rounded-lg cursor-pointer transition-all hover:bg-accent",
                          selectedCropDetail === cropKey ? "ring-2 ring-primary bg-primary/5" : ""
                        )}
                        onClick={() => setSelectedCropDetail(selectedCropDetail === cropKey ? null : cropKey)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{crop.name}</div>
                            <div className="text-sm text-muted-foreground">{crop.season} • {crop.spacing}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Tooltip content={`Remove ${crop.name} from selection`}>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  removeCropFromSelection(cropKey);
                                }}
                                className="p-1 hover:bg-red-100 rounded"
                              >
                                <Minus className="h-4 w-4 text-red-500" />
                              </button>
                            </Tooltip>
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: PLANT_FAMILIES[crop.family as keyof typeof PLANT_FAMILIES]?.color || '#gray' }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Crop Details */}
                {selectedCropDetail && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      {CROP_DATABASE[selectedCropDetail as keyof typeof CROP_DATABASE].name}
                      <Tooltip content="Detailed growing information for this specific crop">
                        <Info className="h-4 w-4 text-muted-foreground" />
                      </Tooltip>
                    </h4>

                    {(() => {
                      const crop = CROP_DATABASE[selectedCropDetail as keyof typeof CROP_DATABASE];
                      return (
                        <div className="space-y-3 text-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <strong>Days to Maturity:</strong> {crop.daysToMaturity}
                            </div>
                            <div>
                              <strong>Spacing:</strong> {crop.spacing}
                            </div>
                            <div>
                              <strong>Planting Depth:</strong> {crop.plantingDepth}
                            </div>
                            <div>
                              <strong>Soil Temp:</strong> {crop.soilTemp}
                            </div>
                          </div>

                          <div>
                            <strong>Planting Times:</strong> {crop.plantingTimes.join(', ')}
                          </div>

                          <div>
                            <strong>Good Companions:</strong>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {crop.companions.map((companion, index) => (
                                <span key={index} className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">
                                  {companion}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <strong>Avoid Near:</strong>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {crop.antagonists.map((antagonist, index) => (
                                <span key={index} className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">
                                  {antagonist}
                                </span>
                              ))}
                            </div>
                          </div>

                          <div>
                            <strong>Harvest Tips:</strong> {crop.harvestTips}
                          </div>

                          <div>
                            <strong>Common Problems:</strong> {crop.commonProblems.join(', ')}
                          </div>

                          <div>
                            <strong>Nutrition:</strong> {crop.nutrition}
                          </div>

                          {crop.successionInterval && (
                            <div className="bg-blue-50 p-2 rounded">
                              <strong>Succession Planting:</strong> Plant every {crop.successionInterval} days for continuous harvest
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Crop Rotation Suggestions */}
          {selectedCrops.length > 0 && (
            <div className="bg-card border rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-primary" />
                Rotation Plan for Your Crops
                <Tooltip content="Based on your selected crops, here's how to organize them by plant families for optimal rotation">
                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                </Tooltip>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(generateCropRotationPlan()).map(([family, crops]) => (
                  <div key={family} className="border rounded-lg p-4">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: PLANT_FAMILIES[family as keyof typeof PLANT_FAMILIES]?.color || '#gray' }}
                      />
                      {PLANT_FAMILIES[family as keyof typeof PLANT_FAMILIES]?.name || family}
                    </h4>
                    <div className="space-y-1">
                      {crops.map(cropKey => {
                        const crop = CROP_DATABASE[cropKey as keyof typeof CROP_DATABASE];
                        return (
                          <div key={cropKey} className="text-sm p-2 bg-muted/50 rounded">
                            {crop.name}
                          </div>
                        );
                      })}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      {PLANT_FAMILIES[family as keyof typeof PLANT_FAMILIES]?.category}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h4 className="font-semibold mb-2">Rotation Tips:</h4>
                <ul className="text-sm space-y-1">
                  <li>• Rotate by plant families, not individual crops</li>
                  <li>• Follow heavy feeders with light feeders or soil builders</li>
                  <li>• Use legumes (beans, peas) to add nitrogen for following crops</li>
                  <li>• Wait 3-4 years before replanting the same family in the same location</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Plant Families Tab */}
      {activeTab === 'families' && (
        <div className="space-y-6">
          {/* Family Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(PLANT_FAMILIES).map(([key, family]) => (
              <div
                key={key}
                onClick={() => setSelectedFamily(selectedFamily === key ? null : key)}
                className={cn(
                  "p-4 border rounded-xl cursor-pointer transition-all hover:shadow-md",
                  selectedFamily === key ? "ring-2 ring-primary" : ""
                )}
                style={{ borderColor: family.color }}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold" style={{ color: family.color }}>{family.name}</h3>
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: family.color }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mb-2">{family.category}</p>
                <p className="text-sm">{family.season} • {family.daysToMaturity}</p>
              </div>
            ))}
          </div>

          {/* Family Details */}
          {selectedFamily && PLANT_FAMILIES[selectedFamily as keyof typeof PLANT_FAMILIES] && (
            <div className="bg-card border rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ backgroundColor: PLANT_FAMILIES[selectedFamily as keyof typeof PLANT_FAMILIES].color }}
                />
                <h3 className="text-xl font-semibold">{PLANT_FAMILIES[selectedFamily as keyof typeof PLANT_FAMILIES].name}</h3>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <Sprout className="h-4 w-4" />
                      Plants in Family
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {PLANT_FAMILIES[selectedFamily as keyof typeof PLANT_FAMILIES].plants.map((plant, index) => (
                        <span key={index} className="px-2 py-1 bg-muted rounded text-sm">
                          {plant}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Soil Requirements</h4>
                    <p className="text-sm text-muted-foreground">{PLANT_FAMILIES[selectedFamily as keyof typeof PLANT_FAMILIES].soilNeeds}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Spacing</h4>
                    <p className="text-sm text-muted-foreground">{PLANT_FAMILIES[selectedFamily as keyof typeof PLANT_FAMILIES].spacing}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      Good Companions
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {PLANT_FAMILIES[selectedFamily as keyof typeof PLANT_FAMILIES].companions.map((companion, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-700 rounded text-sm">
                          {companion}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 flex items-center gap-2 text-red-600">
                      <AlertCircle className="h-4 w-4" />
                      Poor Companions
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {PLANT_FAMILIES[selectedFamily as keyof typeof PLANT_FAMILIES].antagonists.map((antagonist, index) => (
                        <span key={index} className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm">
                          {antagonist}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Rotation Notes</h4>
                    <p className="text-sm text-muted-foreground">{PLANT_FAMILIES[selectedFamily as keyof typeof PLANT_FAMILIES].rotationNotes}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Common Issues</h4>
                    <div className="text-sm text-muted-foreground">
                      <p><strong>Pests:</strong> {PLANT_FAMILIES[selectedFamily as keyof typeof PLANT_FAMILIES].pests.join(', ')}</p>
                      <p><strong>Diseases:</strong> {PLANT_FAMILIES[selectedFamily as keyof typeof PLANT_FAMILIES].diseases.join(', ')}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Succession Planting Tab */}
      {activeTab === 'succession' && (
        <div className="space-y-6">
          {/* Succession Calculator */}
          <div className="bg-card border rounded-xl p-6 dropdown-container">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Succession Planting Calculator
              <Tooltip content="Plan staggered plantings for continuous harvests throughout the growing season">
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </Tooltip>
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  Select Crop
                  <Tooltip content="Choose a crop that benefits from succession planting. The interval shows recommended time between plantings.">
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </Tooltip>
                </label>
                <select
                  value={selectedCrop}
                  onChange={(e) => setSelectedCrop(e.target.value)}
                  className="w-full p-3 border rounded-lg bg-background text-foreground"
                >
                  {Object.entries(SUCCESSION_INTERVALS).map(([crop, data]) => (
                    <option key={crop} value={crop}>
                      {crop.charAt(0).toUpperCase() + crop.slice(1)} - Every {data.interval} days
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  First Planting Date
                  <Tooltip content="Choose your first planting date based on your local frost dates and growing season">
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </Tooltip>
                </label>
                <input
                  type="date"
                  value={plantingDate}
                  onChange={(e) => setPlantingDate(e.target.value)}
                  className="w-full p-3 border rounded-lg bg-background text-foreground"
                />
              </div>
            </div>

            {plantingDate && (
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-semibold mb-3">Succession Planting Schedule</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto">
                  {calculateSuccessionDates().map((date, index) => (
                    <div key={index} className="bg-background border rounded p-3">
                      <div className="text-sm font-medium">{date.plantingDate}</div>
                      <div className="text-xs text-muted-foreground">
                        Harvest: Week {date.harvestWeek}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Succession Tips */}
          <div className="bg-card border rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              Succession Planting Tips
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Quick Succession Crops (7-10 days)</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Lettuce, Spinach, Arugula</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Radishes, Turnips</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>Fresh herbs (Cilantro, Dill)</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Medium Succession Crops (14-21 days)</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span>Bush beans, Peas</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span>Carrots, Beets</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span>Swiss chard, Kale</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Soil Calculator Tab */}
      {activeTab === 'soil' && (
        <div className="space-y-6">
          {/* Soil Amendment Calculator */}
          <div className="bg-card border rounded-xl p-6 dropdown-container">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Sprout className="h-5 w-5 text-primary" />
              Soil Amendment Calculator
              <Tooltip content="Calculate the right amount of organic matter and fertilizers needed for your garden beds">
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </Tooltip>
            </h3>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  Amendment Type
                  <Tooltip content="Different amendments serve different purposes. Compost improves soil structure, while fertilizers provide specific nutrients.">
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </Tooltip>
                </label>
                <select
                  value={soilAmendment}
                  onChange={(e) => setSoilAmendment(e.target.value)}
                  className="w-full p-3 border rounded-lg bg-background text-foreground"
                >
                  {Object.entries(SOIL_AMENDMENTS).map(([key, amendment]) => (
                    <option key={key} value={key}>
                      {key.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())} - {amendment.unit}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                  Garden Area (sq ft)
                  <Tooltip content="Measure length × width of your garden beds. For irregularly shaped beds, break into sections and add together.">
                    <HelpCircle className="h-3 w-3 text-muted-foreground" />
                  </Tooltip>
                </label>
                <input
                  type="number"
                  value={amendmentArea}
                  onChange={(e) => setAmendmentArea(Number(e.target.value))}
                  className="w-full p-3 border rounded-lg bg-background text-foreground"
                  placeholder="Enter area in square feet"
                />
              </div>
            </div>

            {calculateSoilAmendment() && (
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Amendment Calculation</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-2xl font-bold text-primary">
                      {calculateSoilAmendment()?.amount} {calculateSoilAmendment()?.unit}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      For {amendmentArea} square feet
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Purpose:</div>
                    <div className="text-sm text-muted-foreground">
                      {calculateSoilAmendment()?.description}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cover Crops */}
          <div className="bg-card border rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Leaf className="h-5 w-5 text-primary" />
              Cover Crops for Soil Health
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(COVER_CROPS).map(([key, crop]) => (
                <div key={key} className="border rounded-lg p-4">
                  <h4 className="font-semibold mb-2">{crop.name}</h4>
                  <div className="text-sm space-y-2">
                    <div>
                      <strong>Plants:</strong> {crop.plants.join(', ')}
                    </div>
                    <div>
                      <strong>Benefits:</strong> {crop.benefits}
                    </div>
                    <div>
                      <strong>Timing:</strong> {crop.when}
                    </div>
                    <div>
                      <strong>Duration:</strong> {crop.duration}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Soil Testing Reminder */}
          <div className="bg-card border rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              Soil Testing Recommendations
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Essential Tests</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>pH Level (6.0-7.0 ideal for most vegetables)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Nitrogen, Phosphorus, Potassium (NPK)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Organic Matter Content (3-5% ideal)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Trace Elements (Iron, Magnesium, etc.)</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Testing Schedule</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span>Annual testing in early spring</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span>Mid-season check for pH</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span>Test after significant amendments</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-500" />
                    <span>Fall testing for winter preparation</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Educational Content */}
      <div className="mt-16 space-y-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Understanding Crop Rotation Science
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Master the art and science of crop rotation with evidence-based insights from agricultural research worldwide.
          </p>
        </div>

        {/* Scientific Method Overview */}
        <div className="bg-background border rounded-xl p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center">
            <Sparkles className="h-5 w-5 mr-2 text-primary" />
            The Science Behind Crop Rotation
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="font-semibold mb-3 text-foreground">Core Principles</h4>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium">Nutrient Cycling</p>
                    <p className="text-xs text-muted-foreground">Different plant families have varying nutrient requirements and contributions</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium">Pest & Disease Management</p>
                    <p className="text-xs text-muted-foreground">Breaking pathogen life cycles through host plant diversity</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm font-medium">Soil Structure</p>
                    <p className="text-xs text-muted-foreground">Root diversity improves soil aggregation and water retention</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4 overflow-hidden">
              <div className="bg-white dark:bg-indigo-950/50 border border-indigo-300 dark:border-indigo-700 rounded-lg p-3">
                <p className="text-xs text-indigo-600 dark:text-indigo-400 font-medium mb-1">Plant Family Rotation Formula:</p>
                <p className="text-indigo-800 dark:text-indigo-200 font-mono text-sm">
                  Year 1: Legumes → Year 2: Brassicas → Year 3: Nightshades → Year 4: Root Vegetables
                </p>
                <p className="text-xs text-indigo-600 dark:text-indigo-400 mt-2">
                  Each family contributes unique benefits to soil health and pest management
                </p>
              </div>
            </div>
          </div>

          {/* Research Components */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center mr-3">
                  <Leaf className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <h4 className="font-bold text-green-900 dark:text-green-100">Nitrogen Fixation Research</h4>
              </div>
              <p className="text-sm text-green-800 dark:text-green-200">
                Studies show legumes can fix 40-300 kg of nitrogen per hectare annually, reducing fertilizer needs for subsequent crops by up to 50%.
              </p>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 overflow-hidden">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/50 rounded-lg flex items-center justify-center mr-3">
                  <Shield className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <h4 className="font-bold text-amber-900 dark:text-amber-100">Pest Reduction Studies</h4>
              </div>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                4-year rotations reduce soil-borne diseases by 60-80% and pest populations by 40-70% compared to monoculture systems.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center mr-3">
                  <BarChart3 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h4 className="font-bold text-blue-900 dark:text-blue-100">Yield Improvement Data</h4>
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Proper crop rotation increases yields by 10-25% while improving soil organic matter by 0.1-0.3% annually.
              </p>
            </div>
          </div>
        </div>

        {/* Global Crop Database Information */}
        <div className="bg-background border rounded-xl p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-primary" />
            Worldwide Crop Database
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h4 className="font-semibold mb-4">89 Crops from 6 Continents</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">25</div>
                  <div className="text-xs text-green-700 dark:text-green-300">Asian Crops</div>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-orange-600 dark:text-orange-400">15</div>
                  <div className="text-xs text-orange-700 dark:text-orange-300">African Crops</div>
                </div>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-blue-600 dark:text-blue-400">18</div>
                  <div className="text-xs text-blue-700 dark:text-blue-300">European Crops</div>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-purple-600 dark:text-purple-400">20</div>
                  <div className="text-xs text-purple-700 dark:text-purple-300">American Crops</div>
                </div>
                <div className="bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-teal-600 dark:text-teal-400">8</div>
                  <div className="text-xs text-teal-700 dark:text-teal-300">Climate Zones</div>
                </div>
                <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-lg p-3 text-center">
                  <div className="text-lg font-bold text-rose-600 dark:text-rose-400">11</div>
                  <div className="text-xs text-rose-700 dark:text-rose-300">Plant Families</div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Our database includes traditional crops from indigenous agriculture, modern hybrids, ancient grains, and specialty varieties suitable for every climate zone from tropical to arctic conditions.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Featured Crop Categories</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Ancient Grains (Quinoa, Teff, Emmer)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Asian Specialties (Tatsoi, Mizuna, Luffa)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Drought-Resistant (Sorghum, Pearl Millet)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Nitrogen Fixers (Lablab, Tepary Beans)</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-rose-500 rounded-full"></div>
                  <span className="text-sm">Indigenous Vegetables (Spider Plant, Jicama)</span>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* How to Use Section */}
        <div className="bg-background border rounded-xl p-6 mb-6">
          <h3 className="text-xl font-bold mb-6 flex items-center">
            <HelpCircle className="h-5 w-5 mr-2 text-primary" />
            How to Use the Crop Rotation Calculator
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border border-green-200 dark:border-green-800 rounded-lg p-5">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm font-bold text-green-600 dark:text-green-300">🌱</span>
                </div>
                <h4 className="font-bold text-green-900 dark:text-green-100">Step-by-Step Instructions</h4>
              </div>
              <div className="space-y-3">
                {[
                  "Start by selecting your garden type (traditional rows, raised beds, square foot, or container)",
                  "Choose your preferred rotation cycle (3-year, 4-year, or 5-year system)",
                  "Add your garden beds/sections using the 'Add Bed' button",
                  "Name each bed and specify its size for better organization",
                  "Select crops from our comprehensive 89+ crop database for each bed",
                  "Use the plant family filter to ensure proper rotation sequencing",
                  "Set your hardiness zone for location-specific recommendations",
                  "Click 'Generate Rotation Plan' to create your multi-year schedule",
                  "Review the detailed rotation timeline and planting recommendations"
                ].map((step, index) => (
                  <div key={index} className="flex items-start">
                    <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </div>
                    <p className="text-sm text-green-800 dark:text-green-200">{step}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10 border border-orange-200 dark:border-orange-800 rounded-lg p-5">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-800 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm font-bold text-orange-600 dark:text-orange-300">📈</span>
                </div>
                <h4 className="font-bold text-orange-900 dark:text-orange-100">Understanding Results</h4>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Rotation Timeline", desc: "Year-by-year crop placement for each bed" },
                  { label: "Family Groups", desc: "Plant families organized for optimal rotation" },
                  { label: "Companion Plants", desc: "Beneficial plant combinations and companions" },
                  { label: "Soil Health", desc: "Nitrogen-fixing and soil improvement indicators" },
                  { label: "Season Planning", desc: "Cool vs warm season crop scheduling" },
                  { label: "Growth Requirements", desc: "Space, depth, and care recommendations" },
                  { label: "Harvest Windows", desc: "Expected maturity dates and succession planting" }
                ].map((item, index) => (
                  <div key={index} className="flex items-start">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <div>
                      <p className="text-sm font-medium text-orange-800 dark:text-orange-200">{item.label}</p>
                      <p className="text-xs text-orange-600 dark:text-orange-300">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Comprehensive Crops Database Section */}
          <div className="mt-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 border border-green-200 dark:border-green-800 rounded-lg p-6">
            <div className="flex items-center mb-6">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mr-3">
                <span className="text-sm font-bold text-green-600 dark:text-green-300">🌱</span>
              </div>
              <div>
                <h4 className="font-bold text-green-900 dark:text-green-100 text-lg">Comprehensive Global Crop Database</h4>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Our calculator supports over <span className="font-semibold text-green-700 dark:text-green-300">89 crops</span> with
                  detailed growing data, companion planting information, and rotation requirements for optimal garden planning.
                </p>
              </div>
            </div>

            {/* Crop Categories */}
            <div className="mb-4">
              <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 mb-4">
                <div className="flex items-center justify-center px-2 sm:px-3 py-1 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded-full text-xs">
                  <span className="mr-1">🍅</span>
                  <span className="text-red-800 dark:text-red-200 font-medium">Nightshades</span>
                </div>
                <div className="flex items-center justify-center px-2 sm:px-3 py-1 bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 rounded-full text-xs">
                  <span className="mr-1">🥬</span>
                  <span className="text-green-800 dark:text-green-200 font-medium">Brassicas</span>
                </div>
                <div className="flex items-center justify-center px-2 sm:px-3 py-1 bg-purple-100 dark:bg-purple-900/30 border border-purple-300 dark:border-purple-700 rounded-full text-xs">
                  <span className="mr-1">🫘</span>
                  <span className="text-purple-800 dark:text-purple-200 font-medium">Legumes</span>
                </div>
                <div className="flex items-center justify-center px-2 sm:px-3 py-1 bg-orange-100 dark:bg-orange-900/30 border border-orange-300 dark:border-orange-700 rounded-full text-xs">
                  <span className="mr-1">🥕</span>
                  <span className="text-orange-800 dark:text-orange-200 font-medium">Root Vegetables</span>
                </div>
                <div className="flex items-center justify-center px-2 sm:px-3 py-1 bg-blue-100 dark:bg-blue-900/30 border border-blue-300 dark:border-blue-700 rounded-full text-xs">
                  <span className="mr-1">🥒</span>
                  <span className="text-blue-800 dark:text-blue-200 font-medium">Cucurbits</span>
                </div>
                <div className="flex items-center justify-center px-2 sm:px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 border border-yellow-300 dark:border-yellow-700 rounded-full text-xs">
                  <span className="mr-1">🧄</span>
                  <span className="text-yellow-800 dark:text-yellow-200 font-medium">Alliums</span>
                </div>
              </div>
            </div>

            {/* Crops Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 text-sm">
              {[
                // Nightshades (Red theme)
                { name: 'Tomatoes', family: 'nightshades', maturity: '75-90 days', icon: '🍅', color: 'red' },
                { name: 'Peppers', family: 'nightshades', maturity: '70-90 days', icon: '🌶️', color: 'red' },
                { name: 'Eggplant', family: 'nightshades', maturity: '80-100 days', icon: '🍆', color: 'red' },

                // Brassicas (Green theme)
                { name: 'Broccoli', family: 'brassicas', maturity: '70-80 days', icon: '🥦', color: 'green' },
                { name: 'Cabbage', family: 'brassicas', maturity: '70-90 days', icon: '🥬', color: 'green' },
                { name: 'Kale', family: 'brassicas', maturity: '55-75 days', icon: '🥬', color: 'green' },
                { name: 'Cauliflower', family: 'brassicas', maturity: '75-85 days', icon: '🥒', color: 'green' },

                // Legumes (Purple theme)
                { name: 'Green Beans', family: 'legumes', maturity: '50-60 days', icon: '🫘', color: 'purple' },
                { name: 'Peas', family: 'legumes', maturity: '60-70 days', icon: '🟢', color: 'purple' },
                { name: 'Fava Beans', family: 'legumes', maturity: '80-90 days', icon: '🫘', color: 'purple' },

                // Root Vegetables (Orange theme)
                { name: 'Carrots', family: 'umbellifers', maturity: '70-80 days', icon: '🥕', color: 'orange' },
                { name: 'Radishes', family: 'brassicas', maturity: '25-35 days', icon: '🔴', color: 'orange' },
                { name: 'Turnips', family: 'brassicas', maturity: '50-60 days', icon: '🟣', color: 'orange' },
                { name: 'Parsnips', family: 'umbellifers', maturity: '100-120 days', icon: '🥕', color: 'orange' },

                // Cucurbits (Blue theme)
                { name: 'Cucumbers', family: 'cucurbits', maturity: '50-70 days', icon: '🥒', color: 'blue' },
                { name: 'Zucchini', family: 'cucurbits', maturity: '50-60 days', icon: '🥒', color: 'blue' },
                { name: 'Winter Squash', family: 'cucurbits', maturity: '100-120 days', icon: '🎃', color: 'blue' },

                // Alliums (Yellow theme)
                { name: 'Onions', family: 'alliums', maturity: '90-120 days', icon: '🧅', color: 'yellow' },
                { name: 'Garlic', family: 'alliums', maturity: '240 days', icon: '🧄', color: 'yellow' },
                { name: 'Leeks', family: 'alliums', maturity: '120-150 days', icon: '🧅', color: 'yellow' },

                // Leafy Greens (Green theme)
                { name: 'Lettuce', family: 'leafy-greens', maturity: '45-65 days', icon: '🥬', color: 'green' },
                { name: 'Spinach', family: 'leafy-greens', maturity: '40-50 days', icon: '🍃', color: 'green' },
                { name: 'Arugula', family: 'brassicas', maturity: '30-40 days', icon: '🥬', color: 'green' },

                // Global Specialty Crops
                { name: 'Pak Choi', family: 'brassicas', maturity: '45-60 days', icon: '🥬', color: 'green' },
                { name: 'Daikon', family: 'brassicas', maturity: '60-70 days', icon: '⚪', color: 'orange' },
                { name: 'Bitter Melon', family: 'cucurbits', maturity: '80-100 days', icon: '🥒', color: 'blue' },
                { name: 'Okra', family: 'malvaceae', maturity: '60-70 days', icon: '🟢', color: 'green' },
                { name: 'Sweet Potato', family: 'convolvulaceae', maturity: '90-120 days', icon: '🍠', color: 'orange' },

                // Additional Popular Crops
                { name: 'Potatoes', family: 'nightshades', maturity: '70-90 days', icon: '🥔', color: 'red' },
                { name: 'Brussels Sprouts', family: 'brassicas', maturity: '90-120 days', icon: '🥬', color: 'green' },
                { name: 'Lima Beans', family: 'legumes', maturity: '75-90 days', icon: '🫘', color: 'purple' },
                { name: 'Beets', family: 'amaranthaceae', maturity: '50-70 days', icon: '🟣', color: 'orange' },
                { name: 'Summer Squash', family: 'cucurbits', maturity: '50-60 days', icon: '🥒', color: 'blue' },
                { name: 'Shallots', family: 'alliums', maturity: '100-120 days', icon: '🧅', color: 'yellow' },
                { name: 'Chard', family: 'amaranthaceae', maturity: '50-60 days', icon: '🥬', color: 'green' },
                { name: 'Celery', family: 'umbellifers', maturity: '120-130 days', icon: '🥬', color: 'orange' },
                { name: 'Melons', family: 'cucurbits', maturity: '80-100 days', icon: '🍈', color: 'blue' },
                { name: 'Chives', family: 'alliums', maturity: '80-90 days', icon: '🌿', color: 'yellow' },

                // Herbs & Global Crops
                { name: 'Basil', family: 'lamiaceae', maturity: '60-75 days', icon: '🌿', color: 'emerald' },
                { name: 'Thai Basil', family: 'lamiaceae', maturity: '60-75 days', icon: '🌿', color: 'emerald' },
                { name: 'Cilantro', family: 'umbellifers', maturity: '40-50 days', icon: '🌿', color: 'orange' },
                { name: 'Parsley', family: 'umbellifers', maturity: '70-90 days', icon: '🌿', color: 'orange' },
                { name: 'Oregano', family: 'lamiaceae', maturity: '80-90 days', icon: '🌿', color: 'emerald' },
                { name: 'Thyme', family: 'lamiaceae', maturity: '75-90 days', icon: '🌿', color: 'emerald' },
                { name: 'Rosemary', family: 'lamiaceae', maturity: '90-120 days', icon: '🌿', color: 'emerald' },
                { name: 'Mint', family: 'lamiaceae', maturity: '60-90 days', icon: '🌿', color: 'emerald' },
                { name: 'Lemongrass', family: 'poaceae', maturity: '90-120 days', icon: '🌿', color: 'emerald' },
                { name: 'Turmeric', family: 'zingiberaceae', maturity: '300 days', icon: '🟡', color: 'emerald' },

                // Asian & Global Specialty Crops
                { name: 'Pak Choi', family: 'brassicas', maturity: '45-60 days', icon: '🥬', color: 'green' },
                { name: 'Mustard Greens', family: 'brassicas', maturity: '40-50 days', icon: '🥬', color: 'green' },
                { name: 'Napa Cabbage', family: 'brassicas', maturity: '70-80 days', icon: '🥬', color: 'green' },
                { name: 'Mizuna', family: 'brassicas', maturity: '40-50 days', icon: '🥬', color: 'green' },
                { name: 'Tatsoi', family: 'brassicas', maturity: '45-50 days', icon: '🥬', color: 'green' },
                { name: 'Kangkung', family: 'convolvulaceae', maturity: '45-60 days', icon: '🥬', color: 'emerald' },
                { name: 'Okra', family: 'malvaceae', maturity: '60-70 days', icon: '🟢', color: 'emerald' },
                { name: 'Bitter Melon', family: 'cucurbits', maturity: '80-100 days', icon: '🥒', color: 'blue' },
                { name: 'Winter Melon', family: 'cucurbits', maturity: '120-150 days', icon: '🥒', color: 'blue' },
                { name: 'Luffa', family: 'cucurbits', maturity: '150-200 days', icon: '🥒', color: 'blue' },
                { name: 'Yard Long Beans', family: 'legumes', maturity: '60-80 days', icon: '🫘', color: 'purple' },
                { name: 'Sweet Potato', family: 'convolvulaceae', maturity: '90-120 days', icon: '🍠', color: 'orange' },
                { name: 'Cassava', family: 'euphorbiaceae', maturity: '300-365 days', icon: '🥔', color: 'orange' },
                { name: 'Taro', family: 'araceae', maturity: '200-300 days', icon: '🥔', color: 'orange' },
                { name: 'Jicama', family: 'fabaceae', maturity: '150-180 days', icon: '🥔', color: 'orange' },

                // Ancient Grains & Heritage
                { name: 'Quinoa', family: 'amaranthaceae', maturity: '90-120 days', icon: '🌾', color: 'amber' },
                { name: 'Amaranth', family: 'amaranthaceae', maturity: '100-130 days', icon: '🌾', color: 'amber' },
                { name: 'Teff', family: 'poaceae', maturity: '90-120 days', icon: '🌾', color: 'amber' },
                { name: 'Chia', family: 'lamiaceae', maturity: '100-130 days', icon: '🌱', color: 'amber' },
                { name: 'Buckwheat', family: 'polygonaceae', maturity: '70-90 days', icon: '🌾', color: 'amber' },
                { name: 'Sorghum', family: 'poaceae', maturity: '100-120 days', icon: '🌾', color: 'amber' },
                { name: 'Pearl Millet', family: 'poaceae', maturity: '75-90 days', icon: '🌾', color: 'amber' },
                { name: 'Finger Millet', family: 'poaceae', maturity: '120-150 days', icon: '🌾', color: 'amber' },
                { name: 'Emmer Wheat', family: 'poaceae', maturity: '100-120 days', icon: '🌾', color: 'amber' },
                { name: 'Wild Rice', family: 'poaceae', maturity: '120-140 days', icon: '🌾', color: 'amber' },

                // Legumes & Protein Crops
                { name: 'Chickpeas', family: 'legumes', maturity: '90-120 days', icon: '🫘', color: 'purple' },
                { name: 'Lentils', family: 'legumes', maturity: '100-110 days', icon: '🟤', color: 'purple' },
                { name: 'Black Beans', family: 'legumes', maturity: '100-120 days', icon: '🫘', color: 'purple' },
                { name: 'Cowpeas', family: 'legumes', maturity: '60-90 days', icon: '🫘', color: 'purple' },
                { name: 'Tepary Beans', family: 'legumes', maturity: '60-90 days', icon: '🫘', color: 'purple' },
                { name: 'Lablab Beans', family: 'legumes', maturity: '90-120 days', icon: '🫘', color: 'purple' },
                { name: 'Bambara Nuts', family: 'legumes', maturity: '120-150 days', icon: '🥜', color: 'purple' },

                // Squash & Gourd Family
                { name: 'Pumpkins', family: 'cucurbits', maturity: '100-120 days', icon: '🎃', color: 'blue' },
                { name: 'Watermelons', family: 'cucurbits', maturity: '80-100 days', icon: '🍉', color: 'blue' },
                { name: 'Bottle Gourd', family: 'cucurbits', maturity: '150-180 days', icon: '🥒', color: 'blue' },

                // Leafy Greens & Specialty
                { name: 'African Spinach', family: 'amaranthaceae', maturity: '40-60 days', icon: '🍃', color: 'green' },
                { name: 'Malabar Spinach', family: 'basellaceae', maturity: '70-85 days', icon: '🍃', color: 'emerald' },
                { name: 'New Zealand Spinach', family: 'aizoaceae', maturity: '55-65 days', icon: '🍃', color: 'emerald' },
                { name: 'Watercress', family: 'brassicas', maturity: '30-50 days', icon: '🌿', color: 'green' },

                // Perennials & Long-term Crops
                { name: 'Asparagus', family: 'asparagaceae', maturity: '2-3 years', icon: '🌿', color: 'teal' },
                { name: 'Artichoke', family: 'asteraceae', maturity: '150-180 days', icon: '🌿', color: 'teal' },
                { name: 'Rhubarb', family: 'polygonaceae', maturity: '2-3 years', icon: '🌿', color: 'teal' },
                { name: 'Jerusalem Artichoke', family: 'asteraceae', maturity: '120-150 days', icon: '🌻', color: 'teal' },
                { name: 'Moringa', family: 'moringaceae', maturity: '365 days', icon: '🌿', color: 'teal' },

                // Unique & Exotic Crops
                { name: 'Nopal Cactus', family: 'cactaceae', maturity: '365+ days', icon: '🌵', color: 'violet' },
                { name: 'Oca', family: 'oxalidaceae', maturity: '200-240 days', icon: '🥔', color: 'violet' },
                { name: 'Za\'atar', family: 'lamiaceae', maturity: '90-120 days', icon: '🌿', color: 'violet' },
                { name: 'Jute Mallow', family: 'malvaceae', maturity: '60-80 days', icon: '🌿', color: 'violet' },
                { name: 'Spider Plant', family: 'cleomaceae', maturity: '50-70 days', icon: '🌿', color: 'violet' },
                { name: 'Ground Cherry', family: 'nightshades', maturity: '70-90 days', icon: '🍒', color: 'red' },
              ].slice(0, showAllCrops ? undefined : 32).map((crop, index) => {
                const getColorClasses = (color: string) => {
                  const colorMap: { [key: string]: { bg: string; border: string; text: string } } = {
                    red: { bg: 'bg-red-50 dark:bg-red-900/20', border: 'border-red-200 dark:border-red-800', text: 'text-red-800 dark:text-red-200' },
                    green: { bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800', text: 'text-green-800 dark:text-green-200' },
                    purple: { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800', text: 'text-purple-800 dark:text-purple-200' },
                    orange: { bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800', text: 'text-orange-800 dark:text-orange-200' },
                    blue: { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-800 dark:text-blue-200' },
                    yellow: { bg: 'bg-yellow-50 dark:bg-yellow-900/20', border: 'border-yellow-200 dark:border-yellow-800', text: 'text-yellow-800 dark:text-yellow-200' },
                    amber: { bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', text: 'text-amber-800 dark:text-amber-200' },
                    emerald: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800', text: 'text-emerald-800 dark:text-emerald-200' },
                    teal: { bg: 'bg-teal-50 dark:bg-teal-900/20', border: 'border-teal-200 dark:border-teal-800', text: 'text-teal-800 dark:text-teal-200' },
                    violet: { bg: 'bg-violet-50 dark:bg-violet-900/20', border: 'border-violet-200 dark:border-violet-800', text: 'text-violet-800 dark:text-violet-200' },
                  };
                  return colorMap[color] || colorMap.green;
                };

                const colors = getColorClasses(crop.color);

                return (
                  <div key={index} className={`${colors.bg} border ${colors.border} rounded-lg p-2.5 sm:p-3 hover:shadow-md transition-all duration-200 cursor-pointer group min-h-[90px] sm:min-h-[100px] flex flex-col justify-between`}>
                    <div className="flex items-start sm:items-center mb-1.5 sm:mb-2">
                      <span className="text-base sm:text-lg mr-1.5 sm:mr-2 group-hover:scale-110 transition-transform duration-200 flex-shrink-0 mt-0.5 sm:mt-0">
                        {crop.icon}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className={`font-semibold text-xs sm:text-sm leading-tight ${colors.text}`}>
                          {crop.name}
                        </div>
                      </div>
                    </div>
                    <div className="mt-auto text-center">
                      <div className={`text-xs opacity-75 capitalize mb-0.5 sm:mb-1 ${colors.text}`}>
                        {crop.family.replace('-', ' ')}
                      </div>
                      <div className={`text-xs opacity-60 font-medium ${colors.text}`}>
                        {crop.maturity}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Show More Button */}
            <div className="mt-4 text-center">
              <button
                onClick={() => setShowAllCrops(!showAllCrops)}
                className="px-4 py-2 bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-900/50 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-700 rounded-lg text-sm font-medium transition-colors"
              >
                {showAllCrops ? 'Show Less' : 'View All 89+ Crops'}
              </button>
            </div>

            {/* Crop Statistics */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { family: 'nightshades', count: 12, icon: '🍅', color: 'red' },
                { family: 'brassicas', count: 18, icon: '🥬', color: 'green' },
                { family: 'legumes', count: 15, icon: '🫘', color: 'purple' },
                { family: 'cucurbits', count: 8, icon: '🥒', color: 'blue' },
              ].map((stat) => (
                <div key={stat.family} className={`bg-${stat.color}-50 dark:bg-${stat.color}-900/20 border border-${stat.color}-200 dark:border-${stat.color}-800 rounded-lg p-3 text-center`}>
                  <div className="text-lg mb-1">{stat.icon}</div>
                  <div className={`text-lg font-bold text-${stat.color}-800 dark:text-${stat.color}-200`}>{stat.count}</div>
                  <div className={`text-xs text-${stat.color}-600 dark:text-${stat.color}-400 capitalize`}>{stat.family}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-green-200 dark:border-green-700">
              <div className="flex items-start space-x-3">
                <Info className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-green-800 dark:text-green-200 font-medium mb-1">Global Agricultural Knowledge</p>
                  <p className="text-xs text-green-700 dark:text-green-300">
                    Our database includes crops from every continent, traditional varieties, modern hybrids, and heritage seeds with detailed information on growing zones, companion planting, succession timing, and harvest periods for successful crop rotation planning.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scientific References & Data Sources */}
        <div className="bg-background border rounded-xl p-6 mb-6">
          <h3 className="text-xl font-bold mb-6 flex items-center">
            <Brain className="h-5 w-5 mr-2 text-primary" />
            Scientific References & Data Sources
          </h3>

          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/10 dark:to-purple-900/10 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4 mb-6">
            <p className="text-sm text-indigo-800 dark:text-indigo-200 flex items-start">
              <span className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
              Our crop rotation calculator is based on the latest scientific research and comprehensive databases from leading agricultural institutions worldwide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border border-indigo-200 dark:border-indigo-800 rounded-lg p-4 overflow-hidden">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center mr-3">
                  <BookOpen className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h4 className="font-bold text-indigo-900 dark:text-indigo-100">Primary Research Sources</h4>
              </div>
              <div className="space-y-2">
                <div className="flex items-start overflow-hidden min-w-0">
                  <span className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <a
                    href="https://www.fao.org/3/cb4654en/cb4654en.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-800 dark:text-indigo-200 hover:underline break-all word-break-break-all overflow-wrap-anywhere min-w-0 flex-1"
                  >
                    https://www.fao.org/3/cb4654en/cb4654en.pdf
                  </a>
                </div>
                <div className="flex items-start overflow-hidden min-w-0">
                  <span className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <a
                    href="https://www.nrcs.usda.gov/conservation/practices/crop-rotation"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-800 dark:text-indigo-200 hover:underline break-all word-break-break-all overflow-wrap-anywhere min-w-0 flex-1"
                  >
                    https://www.nrcs.usda.gov/conservation/practices/crop-rotation
                  </a>
                </div>
                <div className="flex items-start overflow-hidden min-w-0">
                  <span className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <a
                    href="https://www.nature.com/articles/s41598-021-96334-1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-800 dark:text-indigo-200 hover:underline break-all word-break-break-all overflow-wrap-anywhere min-w-0 flex-1"
                  >
                    https://www.nature.com/articles/s41598-021-96334-1
                  </a>
                </div>
                <div className="flex items-start overflow-hidden min-w-0">
                  <span className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <a
                    href="https://onlinelibrary.wiley.com/journal/17447348"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-800 dark:text-indigo-200 hover:underline break-all word-break-break-all overflow-wrap-anywhere min-w-0 flex-1"
                  >
                    https://onlinelibrary.wiley.com/journal/17447348
                  </a>
                </div>
                <div className="flex items-start overflow-hidden min-w-0">
                  <span className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <a
                    href="https://www.crops.org/publications/cssa"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-indigo-800 dark:text-indigo-200 hover:underline break-all word-break-break-all overflow-wrap-anywhere min-w-0 flex-1"
                  >
                    https://www.crops.org/publications/cssa
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 overflow-hidden">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-amber-100 dark:bg-amber-900/50 rounded-lg flex items-center justify-center mr-3">
                  <LineChart className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                </div>
                <h4 className="font-bold text-amber-900 dark:text-amber-100">Additional Data Sources</h4>
              </div>
              <div className="space-y-2">
                <div className="flex items-start overflow-hidden min-w-0">
                  <span className="w-2 h-2 bg-amber-600 dark:bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <a
                    href="https://www.irri.org/where-we-work/countries/philippines/research"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-amber-800 dark:text-amber-200 hover:underline break-all word-break-break-all overflow-wrap-anywhere min-w-0 flex-1"
                  >
                    https://www.irri.org/where-we-work/countries/philippines/research
                  </a>
                </div>
                <div className="flex items-start overflow-hidden min-w-0">
                  <span className="w-2 h-2 bg-amber-600 dark:bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <a
                    href="https://www.worldagroforestry.org/research/crop-tree-diversification"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-amber-800 dark:text-amber-200 hover:underline break-all word-break-break-all overflow-wrap-anywhere min-w-0 flex-1"
                  >
                    https://www.worldagroforestry.org/research/crop-tree-diversification
                  </a>
                </div>
                <div className="flex items-start overflow-hidden min-w-0">
                  <span className="w-2 h-2 bg-amber-600 dark:bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <a
                    href="https://www.cgiar.org/research/crop-systems/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-amber-800 dark:text-amber-200 hover:underline break-all word-break-break-all overflow-wrap-anywhere min-w-0 flex-1"
                  >
                    https://www.cgiar.org/research/crop-systems/
                  </a>
                </div>
                <div className="flex items-start overflow-hidden min-w-0">
                  <span className="w-2 h-2 bg-amber-600 dark:bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <a
                    href="https://www.frontiersin.org/journals/sustainable-food-systems"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-amber-800 dark:text-amber-200 hover:underline break-all word-break-break-all overflow-wrap-anywhere min-w-0 flex-1"
                  >
                    https://www.frontiersin.org/journals/sustainable-food-systems
                  </a>
                </div>
                <div className="flex items-start overflow-hidden min-w-0">
                  <span className="w-2 h-2 bg-amber-600 dark:bg-amber-400 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                  <a
                    href="https://www.sciencedirect.com/journal/agricultural-systems"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-amber-800 dark:text-amber-200 hover:underline break-all word-break-break-all overflow-wrap-anywhere min-w-0 flex-1"
                  >
                    https://www.sciencedirect.com/journal/agricultural-systems
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-muted">
            <div className="flex items-start space-x-3">
              <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mb-1">Research Validation</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  This calculator uses peer-reviewed scientific research including the latest studies on crop rotation benefits, soil health improvements, and sustainable farming practices from institutions worldwide.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": cropRotationFAQs.map((faq) => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer
                }
              }))
            })
          }}
        />
        <FAQAccordion faqs={cropRotationFAQs} />

        {/* Review Section */}
        <CalculatorReview
          calculatorName="Crop Rotation Calculator"
          className="mt-6"
        />
      </div>

      {/* Footer Info */}
      <div className="bg-muted/30 border rounded-xl p-6 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="flex flex-col items-center">
            <Users className="h-8 w-8 text-primary mb-2" />
            <h4 className="font-semibold">Community Proven</h4>
            <p className="text-sm text-muted-foreground">
              Based on traditional farming wisdom and modern research
            </p>
          </div>
          <div className="flex flex-col items-center">
            <Target className="h-8 w-8 text-primary mb-2" />
            <h4 className="font-semibold">Maximize Yield</h4>
            <p className="text-sm text-muted-foreground">
              Optimize soil health for better harvests year after year
            </p>
          </div>
          <div className="flex flex-col items-center">
            <Leaf className="h-8 w-8 text-primary mb-2" />
            <h4 className="font-semibold">Sustainable Growing</h4>
            <p className="text-sm text-muted-foreground">
              Build soil naturally without synthetic inputs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// FAQ Data
const cropRotationFAQs: FAQItem[] = [
  {
    question: "How does crop rotation improve soil health?",
    answer: "Crop rotation enhances soil health through multiple mechanisms: Different root depths access various soil layers, diverse root exudates feed beneficial microorganisms, legumes fix atmospheric nitrogen (40-300 kg/hectare annually), and varied organic matter from different plant families improves soil structure. Studies show properly managed rotations increase soil organic matter by 0.1-0.3% annually and improve water retention by 15-25%."
  },
  {
    question: "What's the difference between 3-year and 4-year rotations?",
    answer: "4-year rotations provide superior pest and disease control by extending the break between host plants for pathogens. While 3-year rotations are suitable for smaller gardens, 4-year systems allow for more plant family diversity, better nutrient cycling, and the inclusion of cover crops. Research shows 4-year rotations reduce soil-borne diseases by 60-80% compared to 40-50% for 3-year systems."
  },
  {
    question: "Why are plant families important in rotation planning?",
    answer: "Plant families share similar nutrient requirements, attract the same pests, and are susceptible to related diseases. Rotating by family breaks pest life cycles, prevents soil nutrient depletion, and reduces disease buildup. For example, nightshades (tomatoes, peppers) shouldn't follow each other due to shared susceptibility to verticillium wilt and similar nitrogen demands."
  },
  {
    question: "How do I choose crops for my specific climate zone?",
    answer: "Our database includes crops organized by climate zones from tropical to arctic conditions. Use your USDA Hardiness Zone (3a-10b) as a starting point, then consider local factors like rainfall, humidity, and growing season length. Each crop listing includes ideal zones, native regions, and climate adaptations. Cool-season crops like brassicas thrive in zones 3a-7b, while tropical crops like taro need zones 9a-10b."
  },
  {
    question: "What are companion plants and how do they work?",
    answer: "Companion plants benefit each other through various mechanisms: pest deterrence (basil repels aphids from tomatoes), nutrient sharing (legumes provide nitrogen to heavy feeders), soil improvement (deep-rooted plants bring nutrients to shallow-rooted ones), and physical support (corn provides structure for climbing beans). Our database includes scientifically-verified companion relationships for all 89 crops."
  },
  {
    question: "Can I grow traditional crops from other continents in my area?",
    answer: "Many traditional crops are surprisingly adaptable! Our global database includes climate zone information for crops from Asia (tatsoi, mizuna), Africa (spider plant, finger millet), and the Americas (quinoa, amaranth). Check the hardiness zones and growing requirements - for example, Ethiopian teff thrives in zones 4a-7b, while Asian winter melon needs zones 8a-10b. Start with small test plantings to evaluate local adaptation."
  },
  {
    question: "How often should I change my rotation plan?",
    answer: "Stick to your rotation cycle for at least 3-4 years to see full benefits. However, you can make minor adjustments each season based on: soil test results, pest pressure observations, climate changes, and crop performance. Major changes should align with your rotation cycle completion. Document what works well in your specific conditions - local adaptation often takes 2-3 growing seasons."
  },
  {
    question: "What should I do if I have limited garden space?",
    answer: "Small gardens can still benefit from rotation principles: Use container gardening to physically move crop families, practice succession planting within seasons, grow quick-maturing crops between main seasons, utilize vertical growing for climbing varieties, and focus on 2-3 plant families rather than trying to fit everything. Even a simple tomato-lettuce-beans rotation in containers provides benefits."
  },
  {
    question: "How do I handle crops that need to stay in the same location?",
    answer: "Perennial crops (asparagus, rhubarb, fruit trees) and long-season crops require special consideration: Designate permanent beds for perennials, use these areas as 'anchors' around which to rotate annual crops, interplant compatible annuals around perennials, and focus rotation on remaining garden areas. You can still practice rotation principles in 70-80% of your garden space."
  },
  {
    question: "What are the signs that my rotation plan is working?",
    answer: "Successful crop rotation shows these indicators: Reduced pest and disease pressure over time, improved soil structure and water retention, decreased need for external fertilizers (especially nitrogen), increased earthworm activity and beneficial insects, more consistent yields across years, and easier soil cultivation. Soil tests should show gradual increases in organic matter and balanced nutrients after 2-3 rotation cycles."
  }
];
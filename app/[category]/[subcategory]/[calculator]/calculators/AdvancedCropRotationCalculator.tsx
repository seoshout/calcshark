'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Leaf, Sprout, TrendingUp, RotateCcw, BookOpen, Calculator, ChevronDown, ChevronUp, Info, CheckCircle, AlertCircle, Users, Clock, Target, Zap, HelpCircle, Plus, Minus, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

// Add custom styles for dropdown borders
const dropdownStyles = `
  .dropdown-container select {
    border: 1px solid rgb(209 213 219) !important;
    border-radius: 8px !important;
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05) !important;
    background-color: hsl(var(--background)) !important;
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
    background-color: white !important;
    padding: 8px 12px !important;
    border: none !important;
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

// Individual crop database
const CROP_DATABASE = {
  // Brassicas
  'broccoli': {
    name: 'Broccoli',
    family: 'brassicas',
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
    nutrition: 'Heavy feeder - needs nitrogen-rich soil'
  },
  'cabbage': {
    name: 'Cabbage',
    family: 'brassicas',
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
    nutrition: 'Medium feeder - tolerates poor soil'
  },

  // Nightshades
  'tomatoes': {
    name: 'Tomatoes',
    family: 'nightshades',
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
    nutrition: 'Heavy feeder - needs consistent watering'
  },
  'peppers': {
    name: 'Peppers',
    family: 'nightshades',
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
    nutrition: 'Heavy feeder - loves warm, rich soil'
  },

  // Legumes
  'green-beans': {
    name: 'Green Beans',
    family: 'legumes',
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
    nutrition: 'Nitrogen fixer - improves soil'
  },
  'peas': {
    name: 'Peas',
    family: 'legumes',
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
    nutrition: 'Nitrogen fixer - enriches soil for next crop'
  },

  // Cucurbits
  'cucumbers': {
    name: 'Cucumbers',
    family: 'cucurbits',
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
    nutrition: 'Heavy feeder - needs rich, well-drained soil'
  },
  'zucchini': {
    name: 'Zucchini',
    family: 'cucurbits',
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
    nutrition: 'Heavy feeder - benefits from compost'
  },

  // Alliums
  'onions': {
    name: 'Onions',
    family: 'alliums',
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
    nutrition: 'Light feeder - grows in poor soil'
  },
  'garlic': {
    name: 'Garlic',
    family: 'alliums',
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
    nutrition: 'Light feeder - prefers well-drained soil'
  },

  // Umbellifers
  'carrots': {
    name: 'Carrots',
    family: 'umbellifers',
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
    nutrition: 'Light feeder - loose, deep soil preferred'
  },

  // Leafy Greens
  'lettuce': {
    name: 'Lettuce',
    family: 'leafy-greens',
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
    nutrition: 'Light feeder - consistent moisture needed'
  },
  'spinach': {
    name: 'Spinach',
    family: 'leafy-greens',
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
    nutrition: 'Medium feeder - needs nitrogen'
  }
};

export default function AdvancedCropRotationCalculator() {
  // State management
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
  const [selectedCropDetail, setSelectedCropDetail] = useState<string | null>(null);
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [cropSearchTerm, setCropSearchTerm] = useState('');
  const [gardenBeds, setGardenBeds] = useState([
    { id: 1, name: 'Bed 1', size: 100, currentCrop: '', year: 1 },
    { id: 2, name: 'Bed 2', size: 100, currentCrop: '', year: 1 },
    { id: 3, name: 'Bed 3', size: 100, currentCrop: '', year: 1 },
    { id: 4, name: 'Bed 4', size: 100, currentCrop: '', year: 1 }
  ]);
  const [rotationYears, setRotationYears] = useState(4);
  const [selectedCrop, setSelectedCrop] = useState('lettuce');
  const [plantingDate, setPlantingDate] = useState('');
  const [gardenZone, setGardenZone] = useState('6a');
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
    return Object.entries(CROP_DATABASE).filter(([key, crop]) =>
      crop.name.toLowerCase().includes(cropSearchTerm.toLowerCase()) ||
      crop.family.toLowerCase().includes(cropSearchTerm.toLowerCase())
    );
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

    return gardenBeds.map(bed => {
      const schedule = [];
      for (let year = 0; year < rotationYears; year++) {
        const yearIndex = (bed.id - 1 + year) % rotationYears;
        const yearData = plan.schedule[yearIndex];
        schedule.push({
          year: year + 1,
          crops: yearData.crops,
          focus: yearData.focus
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
          <div className="flex bg-muted rounded-lg p-1">
            {[
              {
                id: 'planner',
                label: 'Rotation Planner',
                icon: Calendar,
                tooltip: 'Plan multi-year crop rotations by plant families and garden beds'
              },
              {
                id: 'crops',
                label: 'Crop Selection',
                icon: Sprout,
                tooltip: 'Choose specific vegetables and get detailed growing information'
              },
              {
                id: 'families',
                label: 'Plant Families',
                icon: Leaf,
                tooltip: 'Learn about plant families and their rotation requirements'
              },
              {
                id: 'succession',
                label: 'Succession',
                icon: Clock,
                tooltip: 'Calculate succession planting schedules for continuous harvests'
              },
              {
                id: 'soil',
                label: 'Soil Calculator',
                icon: Calculator,
                tooltip: 'Calculate soil amendments and cover crop requirements'
              }
            ].map(tab => (
              <Tooltip key={tab.id} content={tab.tooltip}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-md transition-all",
                    activeTab === tab.id
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
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
                  className="w-full p-3 border rounded-lg bg-background"
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
                  className="w-full p-3 border rounded-lg bg-background"
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
                <select className="w-full p-3 border rounded-lg bg-background relative z-10">
                  <option value="traditional">Traditional Rows</option>
                  <option value="raised">Raised Beds</option>
                  <option value="container">Container Garden</option>
                  <option value="square-foot">Square Foot Garden</option>
                </select>
              </div>
            </div>
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
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                            {year.year}
                          </div>
                          <div>
                            <div className="font-medium">{year.crops.join(', ')}</div>
                            <div className="text-sm text-muted-foreground">{year.focus}</div>
                          </div>
                        </div>
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
                className="w-full pl-10 pr-4 py-3 border rounded-lg bg-background"
              />
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
                  className="w-full p-3 border rounded-lg bg-background"
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
                  className="w-full p-3 border rounded-lg bg-background"
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
                  className="w-full p-3 border rounded-lg bg-background"
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
                  className="w-full p-3 border rounded-lg bg-background"
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
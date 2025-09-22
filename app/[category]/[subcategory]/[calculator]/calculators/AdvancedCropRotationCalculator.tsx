'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Leaf, Sprout, TrendingUp, RotateCcw, BookOpen, Calculator, ChevronDown, ChevronUp, Info, CheckCircle, AlertCircle, Users, Clock, Target, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

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

export default function AdvancedCropRotationCalculator() {
  // State management
  const [selectedFamily, setSelectedFamily] = useState<string | null>(null);
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
              { id: 'planner', label: 'Rotation Planner', icon: Calendar },
              { id: 'families', label: 'Plant Families', icon: Leaf },
              { id: 'succession', label: 'Succession', icon: Clock },
              { id: 'soil', label: 'Soil Calculator', icon: Sprout }
            ].map(tab => (
              <button
                key={tab.id}
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
            ))}
          </div>
        </div>
      </div>

      {/* Rotation Planner Tab */}
      {activeTab === 'planner' && (
        <div className="space-y-6">
          {/* Configuration */}
          <div className="bg-card border rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Rotation Configuration
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Rotation Years</label>
                <select
                  value={rotationYears}
                  onChange={(e) => setRotationYears(Number(e.target.value))}
                  className="w-full p-3 border rounded-lg bg-background"
                >
                  <option value={3}>3-Year Rotation</option>
                  <option value={4}>4-Year Rotation</option>
                  <option value={5}>5-Year Rotation</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Hardiness Zone</label>
                <select
                  value={gardenZone}
                  onChange={(e) => setGardenZone(e.target.value)}
                  className="w-full p-3 border rounded-lg bg-background"
                >
                  <option value="3a">Zone 3a</option>
                  <option value="3b">Zone 3b</option>
                  <option value="4a">Zone 4a</option>
                  <option value="4b">Zone 4b</option>
                  <option value="5a">Zone 5a</option>
                  <option value="5b">Zone 5b</option>
                  <option value="6a">Zone 6a</option>
                  <option value="6b">Zone 6b</option>
                  <option value="7a">Zone 7a</option>
                  <option value="7b">Zone 7b</option>
                  <option value="8a">Zone 8a</option>
                  <option value="8b">Zone 8b</option>
                  <option value="9a">Zone 9a</option>
                  <option value="9b">Zone 9b</option>
                  <option value="10a">Zone 10a</option>
                  <option value="10b">Zone 10b</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Garden Type</label>
                <select className="w-full p-3 border rounded-lg bg-background">
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
          <div className="bg-card border rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              Succession Planting Calculator
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Select Crop</label>
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
                <label className="block text-sm font-medium mb-2">First Planting Date</label>
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
          <div className="bg-card border rounded-xl p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Sprout className="h-5 w-5 text-primary" />
              Soil Amendment Calculator
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium mb-2">Amendment Type</label>
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
                <label className="block text-sm font-medium mb-2">Garden Area (sq ft)</label>
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
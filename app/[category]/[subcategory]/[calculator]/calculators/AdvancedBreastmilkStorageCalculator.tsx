'use client';

import React, { useState, useRef } from 'react';
import { Calculator, Droplet, Clock, AlertTriangle, CheckCircle, Thermometer, Calendar, Info, RefreshCw, X, Check, Home, Snowflake, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';
import { RefrigeratorIcon as Fridge } from 'lucide-react';
import { cn } from '@/lib/utils';
import CalculatorReview from '@/components/ui/calculator-review';
import FAQAccordion, { FAQItem } from '@/components/ui/faq-accordion';

type StorageLocation = 'room' | 'refrigerator' | 'freezer' | 'deepFreezer' | 'cooler';
type MilkState = 'fresh' | 'thawed' | 'warmed';

interface StorageInputs {
  expressedDate: string;
  expressedTime: string;
  storageLocation: StorageLocation;
  milkState: MilkState;
  roomTemp: string;

  // Advanced options
  containerType: 'glass' | 'plastic' | 'storage-bag';
  milkAmount: string;
  cleanlinessLevel: 'standard' | 'very-clean';
  babyAge: string; // in weeks
  specialNeeds: boolean;
}

interface StorageResult {
  expirationDate: string;
  expirationTime: string;
  hoursRemaining: number;
  daysRemaining: number;
  safetyStatus: 'safe' | 'caution' | 'expired';
  recommendations: string[];
  storageDetails: {
    maxDuration: string;
    optimalDuration: string;
    temperature: string;
    safetyTips: string[];
  };
  containerRecommendations: string[];
  qualityIndicators: string[];
}

export default function AdvancedBreastmilkStorageCalculator() {
  const resultsRef = useRef<HTMLDivElement>(null);
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showReferences, setShowReferences] = useState(false);

  const [inputs, setInputs] = useState<StorageInputs>({
    expressedDate: new Date().toISOString().split('T')[0],
    expressedTime: new Date().toTimeString().slice(0, 5),
    storageLocation: 'refrigerator',
    milkState: 'fresh',
    roomTemp: '72',
    containerType: 'storage-bag',
    milkAmount: '4',
    cleanlinessLevel: 'standard',
    babyAge: '8',
    specialNeeds: false,
  });

  const [result, setResult] = useState<StorageResult | null>(null);

  const getStorageDuration = (location: StorageLocation, state: MilkState, roomTemp?: number, cleanlinessLevel?: string): number => {
    // Returns duration in hours
    if (state === 'warmed') {
      return 2; // Warmed milk: 2 hours maximum
    }

    if (state === 'thawed') {
      if (location === 'refrigerator') {
        return 24; // Previously frozen, thawed in fridge: 24 hours
      }
      return 2; // Thawed at room temp: 1-2 hours
    }

    // Fresh milk
    switch (location) {
      case 'room':
        if (cleanlinessLevel === 'very-clean' && roomTemp && roomTemp <= 77) {
          return 6; // Very clean conditions: up to 6 hours
        }
        if (roomTemp && roomTemp <= 77) {
          return 4; // Room temp (≤77°F): 4 hours optimal
        }
        return 2; // Warmer room temp: 2 hours
      case 'refrigerator':
        return cleanlinessLevel === 'very-clean' ? 192 : 96; // 8 days vs 4 days
      case 'freezer':
        return 4320; // 6 months optimal (180 days × 24 hours)
      case 'deepFreezer':
        return 8760; // 12 months (365 days × 24 hours)
      case 'cooler':
        return 24; // Insulated cooler with ice packs: 24 hours
      default:
        return 4;
    }
  };

  const getOptimalDuration = (location: StorageLocation, state: MilkState, cleanlinessLevel?: string): string => {
    if (state === 'warmed') return '2 hours';
    if (state === 'thawed' && location === 'refrigerator') return '24 hours';
    if (state === 'thawed') return '1-2 hours';

    switch (location) {
      case 'room':
        return '4 hours';
      case 'refrigerator':
        return '4 days';
      case 'freezer':
        return '6 months';
      case 'deepFreezer':
        return '12 months';
      case 'cooler':
        return '24 hours';
      default:
        return '4 hours';
    }
  };

  const getMaxDuration = (location: StorageLocation, state: MilkState, cleanlinessLevel?: string): string => {
    if (state === 'warmed') return '2 hours maximum';
    if (state === 'thawed' && location === 'refrigerator') return '24 hours maximum';
    if (state === 'thawed') return '2 hours maximum';

    switch (location) {
      case 'room':
        return cleanlinessLevel === 'very-clean' ? '6-8 hours (very clean)' : '6 hours';
      case 'refrigerator':
        return cleanlinessLevel === 'very-clean' ? '5-8 days (very clean)' : '5 days';
      case 'freezer':
        return '12 months acceptable';
      case 'deepFreezer':
        return '12 months';
      case 'cooler':
        return '24 hours';
      default:
        return '6 hours';
    }
  };

  const getTemperatureInfo = (location: StorageLocation): string => {
    switch (location) {
      case 'room':
        return '77°F (25°C) or colder';
      case 'refrigerator':
        return '40°F (4°C) or colder';
      case 'freezer':
        return '0°F (-18°C) or colder';
      case 'deepFreezer':
        return '-4°F (-20°C) or colder';
      case 'cooler':
        return 'With frozen ice packs';
      default:
        return 'Room temperature';
    }
  };

  const getSafetyTips = (location: StorageLocation, state: MilkState): string[] => {
    const tips: string[] = [];

    if (state === 'warmed') {
      tips.push('Never refreeze or refrigerate warmed breast milk');
      tips.push('Discard any milk left after feeding within 2 hours');
      tips.push('Do not reheat breast milk more than once');
      tips.push('Warm milk under warm running water or in a bowl of warm water');
    }

    if (state === 'thawed') {
      tips.push('Never refreeze breast milk after thawing');
      tips.push('Use thawed milk within 24 hours if refrigerated');
      tips.push('Thaw milk in refrigerator overnight for best quality');
      tips.push('Can thaw quickly under warm running water');
    }

    switch (location) {
      case 'room':
        tips.push('Store in a cool, dry place away from direct sunlight');
        tips.push('Keep milk covered and in a clean container');
        tips.push('Do not store near heat sources or windows');
        tips.push('Mark with date and time of expression');
        break;
      case 'refrigerator':
        tips.push('Store milk in the back of the refrigerator, not the door');
        tips.push('Maintain consistent temperature at 40°F (4°C) or below');
        tips.push('Label containers with date and time of expression');
        tips.push('Store in breast milk storage bags or clean glass/BPA-free plastic containers');
        tips.push('Place on a shelf, not in door compartment');
        break;
      case 'freezer':
      case 'deepFreezer':
        tips.push('Store in the back of the freezer, not the door');
        tips.push('Leave space at top of container for expansion');
        tips.push('Store in 2-4 oz portions to reduce waste');
        tips.push('Label with date and time of expression');
        tips.push('Use oldest milk first (first in, first out)');
        tips.push('Lay storage bags flat for efficient freezing');
        break;
      case 'cooler':
        tips.push('Use insulated cooler bag with frozen ice packs');
        tips.push('Keep cooler closed as much as possible');
        tips.push('Transfer to refrigerator or freezer within 24 hours');
        tips.push('Surround milk containers with ice packs');
        break;
    }

    return tips;
  };

  const getContainerRecommendations = (containerType: string): string[] => {
    const recs: string[] = [];

    switch (containerType) {
      case 'glass':
        recs.push('Excellent choice - preserves nutrients and immune factors');
        recs.push('Easy to clean and sterilize');
        recs.push('No chemical leaching concerns');
        recs.push('Can break if dropped - handle with care');
        break;
      case 'plastic':
        recs.push('Use BPA-free hard plastic containers only');
        recs.push('Ensure tight-fitting lids to prevent contamination');
        recs.push('Replace if scratched or cloudy');
        recs.push('Good for refrigerator and freezer storage');
        break;
      case 'storage-bag':
        recs.push('Use bags specifically designed for breast milk storage');
        recs.push('Pre-sterilized bags are most convenient');
        recs.push('Remove excess air before sealing');
        recs.push('Lay flat in freezer for space efficiency');
        recs.push('Double-bag if bag quality is uncertain');
        break;
    }

    return recs;
  };

  const getQualityIndicators = (location: StorageLocation, state: MilkState): string[] => {
    const indicators: string[] = [];

    indicators.push('Milk separation is normal - cream rises to top');
    indicators.push('Gently swirl (don\'t shake) to mix before feeding');
    indicators.push('Fresh milk may smell slightly sweet or soapy (lipase)');
    indicators.push('Discard if milk smells sour or rancid');
    indicators.push('Check for unusual colors - pink/brown may indicate blood traces');

    if (location === 'freezer' || location === 'deepFreezer') {
      indicators.push('Frozen milk may have slightly different smell when thawed');
      indicators.push('Thawed milk may have more pronounced soapy smell');
      indicators.push('Some babies accept frozen milk better if used regularly');
    }

    return indicators;
  };

  const calculateStorage = () => {
    const expressedDateTime = new Date(`${inputs.expressedDate}T${inputs.expressedTime}`);
    const now = new Date();
    const roomTemp = parseFloat(inputs.roomTemp);

    const durationHours = getStorageDuration(
      inputs.storageLocation,
      inputs.milkState,
      roomTemp,
      inputs.cleanlinessLevel
    );
    const expirationDateTime = new Date(expressedDateTime.getTime() + durationHours * 60 * 60 * 1000);

    const hoursRemaining = Math.max(0, (expirationDateTime.getTime() - now.getTime()) / (1000 * 60 * 60));
    const daysRemaining = hoursRemaining / 24;

    let safetyStatus: 'safe' | 'caution' | 'expired' = 'safe';
    if (hoursRemaining <= 0) {
      safetyStatus = 'expired';
    } else if (hoursRemaining < durationHours * 0.2) {
      safetyStatus = 'caution';
    }

    const recommendations: string[] = [];

    if (safetyStatus === 'expired') {
      recommendations.push('⚠️ This milk has expired and should be discarded for safety');
      recommendations.push('Never use breast milk past its safe storage duration');
      recommendations.push('When in doubt, throw it out - safety first');
      recommendations.push('Pour expired milk on plants - it makes excellent fertilizer');
    } else if (safetyStatus === 'caution') {
      recommendations.push('⚠️ Use this milk soon - it is nearing expiration');
      recommendations.push('Smell and visually inspect milk before feeding');
      recommendations.push('If milk smells sour or looks unusual, discard it');
      if (inputs.storageLocation === 'room') {
        recommendations.push('Move to refrigerator if not using immediately');
      }
    } else {
      recommendations.push('✓ This milk is safe to use within the recommended timeframe');

      if (inputs.storageLocation === 'room') {
        recommendations.push('Consider refrigerating or freezing if not using soon');
        recommendations.push('Fresh milk has more anti-infective properties than frozen');
      }

      if (inputs.storageLocation === 'freezer' && daysRemaining > 180) {
        recommendations.push('For best quality, use within 6 months');
        recommendations.push('Milk stored beyond 6 months is safe but may have reduced nutrients');
      }

      if (inputs.milkState === 'fresh' && inputs.storageLocation === 'refrigerator') {
        recommendations.push('Refrigerated milk retains more nutrients than frozen milk');
        recommendations.push('Separate layers are normal - gently swirl to mix');
      }

      if (inputs.specialNeeds) {
        recommendations.push('⚠️ For premature or hospitalized babies, use stricter guidelines');
        recommendations.push('Consult your NICU or pediatrician for specific storage times');
      }
    }

    // Add CDC-based recommendations
    recommendations.push('Always wash hands before handling breast milk');
    recommendations.push('Label all milk containers with date and time');

    if (inputs.storageLocation !== 'room' && inputs.milkState === 'fresh') {
      recommendations.push('Store milk immediately after expression for best quality');
    }

    // Advanced mode recommendations
    if (isAdvancedMode) {
      const milkAmount = parseFloat(inputs.milkAmount);
      if (milkAmount > 5) {
        recommendations.push('Consider storing in smaller 2-4 oz portions to reduce waste');
      }

      const babyAge = parseInt(inputs.babyAge);
      if (babyAge < 4) {
        recommendations.push('Newborns may feed more frequently - store in 2-3 oz portions');
      }
    }

    setResult({
      expirationDate: expirationDateTime.toLocaleDateString(),
      expirationTime: expirationDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      hoursRemaining,
      daysRemaining,
      safetyStatus,
      recommendations,
      storageDetails: {
        maxDuration: getMaxDuration(inputs.storageLocation, inputs.milkState, inputs.cleanlinessLevel),
        optimalDuration: getOptimalDuration(inputs.storageLocation, inputs.milkState, inputs.cleanlinessLevel),
        temperature: getTemperatureInfo(inputs.storageLocation),
        safetyTips: getSafetyTips(inputs.storageLocation, inputs.milkState),
      },
      containerRecommendations: getContainerRecommendations(inputs.containerType),
      qualityIndicators: getQualityIndicators(inputs.storageLocation, inputs.milkState),
    });

    setShowModal(true);
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleInputChange = (field: keyof StorageInputs, value: string | boolean) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  const resetCalculator = () => {
    setInputs({
      expressedDate: new Date().toISOString().split('T')[0],
      expressedTime: new Date().toTimeString().slice(0, 5),
      storageLocation: 'refrigerator',
      milkState: 'fresh',
      roomTemp: '72',
      containerType: 'storage-bag',
      milkAmount: '4',
      cleanlinessLevel: 'standard',
      babyAge: '8',
      specialNeeds: false,
    });
    setResult(null);
    setShowModal(false);
  };

  const getLocationIcon = (location: StorageLocation) => {
    switch (location) {
      case 'room':
        return <Home className="h-5 w-5" />;
      case 'refrigerator':
        return <Fridge className="h-5 w-5" />;
      case 'freezer':
      case 'deepFreezer':
        return <Snowflake className="h-5 w-5" />;
      case 'cooler':
        return <Thermometer className="h-5 w-5" />;
    }
  };

  const faqItems: FAQItem[] = [
    {
      question: "How long can breast milk stay at room temperature?",
      answer: "According to CDC guidelines, freshly expressed breast milk can safely stay at room temperature (77°F/25°C or colder) for up to 4 hours optimally. Under very clean conditions, it may be kept for 6-8 hours, but 4 hours is the recommended safe duration."
    },
    {
      question: "How long is breast milk good in the refrigerator?",
      answer: "Freshly expressed breast milk can be stored in the refrigerator at 40°F (4°C) or colder for up to 4 days optimally. The CDC notes that under very clean conditions, it may be stored for 5-8 days, but 4 days is the safest recommendation for most situations."
    },
    {
      question: "Can I refreeze thawed breast milk?",
      answer: "No, you should never refreeze breast milk after it has been thawed. Once breast milk is thawed from frozen, it must be used within 24 hours if kept in the refrigerator, or within 1-2 hours if kept at room temperature. Refreezing can compromise milk quality and safety."
    },
    {
      question: "How long does thawed breast milk last?",
      answer: "Previously frozen breast milk that has been thawed can be stored in the refrigerator for up to 24 hours. Once thawed, it should be used within this timeframe and never refrozen. If thawed milk is brought to room temperature, use it within 1-2 hours."
    },
    {
      question: "Where should I store breast milk in the refrigerator?",
      answer: "Always store breast milk in the back of the refrigerator where the temperature is most consistent, never in the door. The door experiences temperature fluctuations every time it opens, which can affect milk quality and safety. Store at 40°F (4°C) or colder."
    },
    {
      question: "How long can breast milk be frozen?",
      answer: "Breast milk can be stored in a standard freezer (0°F/-18°C) for 6 months optimally, with up to 12 months being acceptable. In a deep freezer (-4°F/-20°C or colder), it can be stored for up to 12 months. Always store in the back of the freezer, not the door."
    },
    {
      question: "What containers are best for storing breast milk?",
      answer: "Use breast milk storage bags specifically designed for freezing, or clean food-grade glass or BPA-free plastic containers with tight-fitting lids. Never use disposable bottle liners or plastic bags not intended for breast milk storage. Always label containers with the date and time of expression."
    },
    {
      question: "Can I combine breast milk from different pumping sessions?",
      answer: "Yes, you can combine breast milk from different pumping sessions, but cool freshly expressed milk in the refrigerator first before adding it to already-cooled or frozen milk. Never add warm milk to frozen milk. Always use the date of the first milk expressed when labeling the combined container."
    },
    {
      question: "How do I know if breast milk has gone bad?",
      answer: "Fresh breast milk may have a soapy smell due to lipase enzyme, which is normal. However, if milk smells truly sour or rancid, or appears clumpy (not just separated layers), it should be discarded. When in doubt, throw it out. Trust your senses - safety first."
    },
    {
      question: "Can I use breast milk after my baby has drunk from the bottle?",
      answer: "If your baby did not finish the bottle, the leftover milk should be used within 2 hours of when the baby began feeding. After 2 hours, any remaining milk should be discarded, as bacteria from your baby's mouth can contaminate the milk and grow over time."
    }
  ];

  const referenceLinks = [
    {
      title: "CDC - Breast Milk Storage and Preparation",
      url: "https://www.cdc.gov/breastfeeding/breast-milk-preparation-and-storage/handling-breastmilk.html",
      description: "Official CDC guidelines for proper breast milk storage and handling"
    },
    {
      title: "La Leche League - Storing Human Milk",
      url: "https://llli.org/breastfeeding-info/storing-human-milk/",
      description: "Comprehensive breastmilk storage information from La Leche League International"
    },
    {
      title: "Mayo Clinic - Breast Milk Storage: Do's and Don'ts",
      url: "https://www.mayoclinic.org/healthy-lifestyle/infant-and-toddler-health/in-depth/breast-milk-storage/art-20046350",
      description: "Expert advice on breast milk storage best practices"
    },
    {
      title: "AAP - Milk Storage Guidelines",
      url: "https://www.aap.org/en/patient-care/breastfeeding/milk-storage-guidelines/",
      description: "American Academy of Pediatrics guidelines for human milk storage"
    }
  ];

  return (
    <div className="w-full space-y-8">
      {/* Mode Toggle */}
      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Droplet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Breastmilk Storage Calculator</h2>
              <p className="text-muted-foreground">Calculate safe storage duration based on CDC guidelines</p>
            </div>
          </div>
        </div>

        {/* Mode Selector */}
        <div className="flex gap-2 mb-6 p-1 bg-muted rounded-lg w-fit">
          <button
            onClick={() => setIsAdvancedMode(false)}
            className={cn(
              "px-6 py-2 rounded-md font-medium transition-all",
              !isAdvancedMode
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Simple Mode
          </button>
          <button
            onClick={() => setIsAdvancedMode(true)}
            className={cn(
              "px-6 py-2 rounded-md font-medium transition-all",
              isAdvancedMode
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Advanced Mode
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Milk Expression Date */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <Calendar className="h-4 w-4 inline mr-2" />
              Expression Date *
            </label>
            <input
              type="date"
              value={inputs.expressedDate}
              onChange={(e) => handleInputChange('expressedDate', e.target.value)}
              max={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Milk Expression Time */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <Clock className="h-4 w-4 inline mr-2" />
              Expression Time *
            </label>
            <input
              type="time"
              value={inputs.expressedTime}
              onChange={(e) => handleInputChange('expressedTime', e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Storage Location */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <Fridge className="h-4 w-4 inline mr-2" />
              Storage Location *
            </label>
            <select
              value={inputs.storageLocation}
              onChange={(e) => handleInputChange('storageLocation', e.target.value as StorageLocation)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="room">Room Temperature (Countertop)</option>
              <option value="refrigerator">Refrigerator</option>
              <option value="freezer">Freezer (Standard)</option>
              <option value="deepFreezer">Deep Freezer</option>
              <option value="cooler">Insulated Cooler with Ice Packs</option>
            </select>
          </div>

          {/* Milk State */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <Info className="h-4 w-4 inline mr-2" />
              Milk State *
            </label>
            <select
              value={inputs.milkState}
              onChange={(e) => handleInputChange('milkState', e.target.value as MilkState)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="fresh">Freshly Expressed</option>
              <option value="thawed">Previously Frozen (Thawed)</option>
              <option value="warmed">Warmed for Feeding</option>
            </select>
          </div>

          {/* Room Temperature (conditional) */}
          {inputs.storageLocation === 'room' && (
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-foreground mb-2">
                <Thermometer className="h-4 w-4 inline mr-2" />
                Room Temperature (°F)
              </label>
              <input
                type="number"
                value={inputs.roomTemp}
                onChange={(e) => handleInputChange('roomTemp', e.target.value)}
                min="60"
                max="85"
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-sm text-muted-foreground mt-1">
                CDC recommends 77°F (25°C) or colder for safe storage
              </p>
            </div>
          )}

          {/* Advanced Mode Fields */}
          {isAdvancedMode && (
            <>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Container Type
                </label>
                <select
                  value={inputs.containerType}
                  onChange={(e) => handleInputChange('containerType', e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="glass">Glass Bottle</option>
                  <option value="plastic">BPA-Free Plastic Container</option>
                  <option value="storage-bag">Breast Milk Storage Bag</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Milk Amount (oz)
                </label>
                <input
                  type="number"
                  value={inputs.milkAmount}
                  onChange={(e) => handleInputChange('milkAmount', e.target.value)}
                  min="0.5"
                  max="12"
                  step="0.5"
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Cleanliness Level
                </label>
                <select
                  value={inputs.cleanlinessLevel}
                  onChange={(e) => handleInputChange('cleanlinessLevel', e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="standard">Standard Clean</option>
                  <option value="very-clean">Very Clean (Sterilized)</option>
                </select>
                <p className="text-sm text-muted-foreground mt-1">
                  Very clean conditions allow slightly longer storage
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Baby Age (weeks)
                </label>
                <input
                  type="number"
                  value={inputs.babyAge}
                  onChange={(e) => handleInputChange('babyAge', e.target.value)}
                  min="0"
                  max="104"
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={inputs.specialNeeds}
                    onChange={(e) => handleInputChange('specialNeeds', e.target.checked)}
                    className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-foreground">
                    Baby has special needs (premature, hospitalized, health concerns)
                  </span>
                </label>
              </div>
            </>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={calculateStorage}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 font-medium"
          >
            <Calculator className="h-5 w-5" />
            Calculate Storage Safety
          </button>
          <button
            onClick={resetCalculator}
            className="px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-2"
          >
            <RefreshCw className="h-5 w-5" />
            Reset
          </button>
        </div>
      </div>

      {/* Results Modal */}
      {showModal && result && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-background border rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                {result.safetyStatus === 'expired' ? (
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                ) : result.safetyStatus === 'caution' ? (
                  <AlertTriangle className="h-6 w-6 text-yellow-500" />
                ) : (
                  <CheckCircle className="h-6 w-6 text-green-500" />
                )}
                Storage Safety Results
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Expiration Date</div>
                  <div className="text-lg font-bold text-foreground">{result.expirationDate}</div>
                  <div className="text-sm text-muted-foreground">{result.expirationTime}</div>
                </div>

                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="text-sm text-muted-foreground mb-1">Time Remaining</div>
                  {result.hoursRemaining > 0 ? (
                    <>
                      <div className="text-lg font-bold text-foreground">
                        {result.daysRemaining >= 1
                          ? `${Math.floor(result.daysRemaining)} day${Math.floor(result.daysRemaining) !== 1 ? 's' : ''}`
                          : `${Math.round(result.hoursRemaining)} hour${Math.round(result.hoursRemaining) !== 1 ? 's' : ''}`
                        }
                      </div>
                      {result.daysRemaining >= 1 && (
                        <div className="text-sm text-muted-foreground">
                          ({Math.round(result.hoursRemaining)} hours)
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="text-lg font-bold text-red-500">Expired</div>
                  )}
                </div>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Storage Details</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-muted-foreground">Optimal:</span>
                    <span className="font-semibold ml-2">{result.storageDetails.optimalDuration}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Maximum:</span>
                    <span className="font-semibold ml-2">{result.storageDetails.maxDuration}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Key Recommendations:</h4>
                <ul className="space-y-1">
                  {result.recommendations.slice(0, 5).map((rec, index) => (
                    <li key={index} className="text-sm text-foreground flex items-start gap-2">
                      {rec.startsWith('⚠️') ? (
                        <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                      ) : (
                        <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      )}
                      <span>{rec.replace('⚠️ ', '').replace('✓ ', '')}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                View Full Results Below
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Results Section */}
      {result && (
        <div ref={resultsRef} className={`bg-background border rounded-xl p-6 shadow-sm ${
          result.safetyStatus === 'expired' ? 'border-red-500' :
          result.safetyStatus === 'caution' ? 'border-yellow-500' :
          'border-green-500'
        }`}>
          <div className="flex items-center gap-3 mb-6">
            {result.safetyStatus === 'expired' ? (
              <AlertTriangle className="h-8 w-8 text-red-500" />
            ) : result.safetyStatus === 'caution' ? (
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
            ) : (
              <CheckCircle className="h-8 w-8 text-green-500" />
            )}
            <div>
              <h3 className="text-2xl font-bold text-foreground">Complete Storage Analysis</h3>
              <p className="text-muted-foreground">
                {result.safetyStatus === 'expired' ? 'Milk has expired - discard safely' :
                 result.safetyStatus === 'caution' ? 'Use soon - nearing expiration' :
                 'Milk is safe to use'}
              </p>
            </div>
          </div>

          {/* Expiration Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">Expiration Date</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{result.expirationDate}</p>
              <p className="text-lg text-muted-foreground">{result.expirationTime}</p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="font-semibold text-foreground">Time Remaining</span>
              </div>
              {result.hoursRemaining > 0 ? (
                <>
                  <p className="text-2xl font-bold text-foreground">
                    {result.daysRemaining >= 1
                      ? `${Math.floor(result.daysRemaining)} day${Math.floor(result.daysRemaining) !== 1 ? 's' : ''}`
                      : `${Math.round(result.hoursRemaining)} hour${Math.round(result.hoursRemaining) !== 1 ? 's' : ''}`
                    }
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {result.daysRemaining >= 1 && `(${Math.round(result.hoursRemaining)} hours)`}
                  </p>
                </>
              ) : (
                <p className="text-2xl font-bold text-red-500">Expired</p>
              )}
            </div>
          </div>

          {/* Storage Details */}
          <div className="bg-muted/30 p-5 rounded-lg mb-6">
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              {getLocationIcon(inputs.storageLocation)}
              Storage Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Optimal Duration:</span>
                <p className="font-semibold text-foreground">{result.storageDetails.optimalDuration}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Maximum Duration:</span>
                <p className="font-semibold text-foreground">{result.storageDetails.maxDuration}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Temperature:</span>
                <p className="font-semibold text-foreground">{result.storageDetails.temperature}</p>
              </div>
            </div>
          </div>

          {/* All Recommendations */}
          <div className="mb-6">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Info className="h-5 w-5 text-primary" />
              All Recommendations
            </h4>
            <ul className="space-y-2">
              {result.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                  {rec.startsWith('⚠️') ? (
                    <AlertTriangle className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  ) : (
                    <Check className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  )}
                  <span>{rec.replace('⚠️ ', '').replace('✓ ', '')}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Safety Tips */}
          <div className="mb-6">
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              Safety Tips for {inputs.storageLocation === 'room' ? 'Room Temperature' : inputs.storageLocation === 'refrigerator' ? 'Refrigerator' : 'Freezer'} Storage
            </h4>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {result.storageDetails.safetyTips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                  <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Container Recommendations (Advanced Mode) */}
          {isAdvancedMode && (
            <>
              <div className="mb-6">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Droplet className="h-5 w-5 text-primary" />
                  Container Recommendations
                </h4>
                <ul className="space-y-2">
                  {result.containerRecommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Info className="h-5 w-5 text-primary" />
                  Quality Indicators
                </h4>
                <ul className="space-y-2">
                  {result.qualityIndicators.map((indicator, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-foreground">
                      <Check className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
                      <span>{indicator}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>
      )}

      {/* Quick Reference Guide */}
      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-foreground mb-4">Quick Reference Guide (CDC Guidelines)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Storage Location</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Temperature</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Freshly Expressed</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Thawed (Previously Frozen)</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 flex items-center gap-2">
                  <Home className="h-4 w-4 text-primary" />
                  <span className="font-medium">Room Temperature</span>
                </td>
                <td className="py-3 px-4 text-muted-foreground">77°F (25°C) or colder</td>
                <td className="py-3 px-4">Up to 4 hours</td>
                <td className="py-3 px-4">1-2 hours</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 flex items-center gap-2">
                  <Fridge className="h-4 w-4 text-primary" />
                  <span className="font-medium">Refrigerator</span>
                </td>
                <td className="py-3 px-4 text-muted-foreground">40°F (4°C) or colder</td>
                <td className="py-3 px-4">Up to 4 days</td>
                <td className="py-3 px-4">Up to 24 hours</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 flex items-center gap-2">
                  <Snowflake className="h-4 w-4 text-primary" />
                  <span className="font-medium">Freezer</span>
                </td>
                <td className="py-3 px-4 text-muted-foreground">0°F (-18°C) or colder</td>
                <td className="py-3 px-4">Up to 6 months (best)</td>
                <td className="py-3 px-4 text-muted-foreground italic">Do not refreeze</td>
              </tr>
              <tr className="hover:bg-muted/50">
                <td className="py-3 px-4 flex items-center gap-2">
                  <Snowflake className="h-4 w-4 text-primary" />
                  <span className="font-medium">Deep Freezer</span>
                </td>
                <td className="py-3 px-4 text-muted-foreground">-4°F (-20°C) or colder</td>
                <td className="py-3 px-4">Up to 12 months</td>
                <td className="py-3 px-4 text-muted-foreground italic">Do not refreeze</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-xs text-muted-foreground mt-4">
          * Times shown are optimal durations. Under very clean conditions, refrigerated milk may last 5-8 days and room temperature milk 6-8 hours.
        </p>
      </div>

      {/* Reference URLs */}
      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <button
          onClick={() => setShowReferences(!showReferences)}
          className="w-full flex items-center justify-between text-left mb-4"
        >
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <ExternalLink className="h-5 w-5 text-primary" />
            Reference Sources & Guidelines
          </h3>
          {showReferences ? (
            <ChevronUp className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          )}
        </button>

        {showReferences && (
          <div className="space-y-4">
            {referenceLinks.map((link, index) => (
              <div key={index} className="border border-border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 group"
                >
                  <ExternalLink className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {link.title}
                    </h4>
                    <p className="text-sm text-muted-foreground mt-1">{link.description}</p>
                    <p className="text-xs text-muted-foreground mt-2 break-all">{link.url}</p>
                  </div>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* How to Use Section */}
      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-foreground mb-4">How to Use This Free Online Breastmilk Storage Calculator</h3>
        <div className="space-y-4 text-foreground">
          <div className="flex items-start gap-3">
            <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">1</div>
            <div>
              <h4 className="font-semibold mb-1">Enter Expression Date and Time</h4>
              <p className="text-muted-foreground">Input when you expressed or pumped the breast milk. This helps calculate exactly how long the milk has been stored.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">2</div>
            <div>
              <h4 className="font-semibold mb-1">Select Storage Location</h4>
              <p className="text-muted-foreground">Choose where the milk is being stored: room temperature, refrigerator, standard freezer, deep freezer, or insulated cooler. Each location has different safe storage durations based on CDC guidelines.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">3</div>
            <div>
              <h4 className="font-semibold mb-1">Specify Milk State</h4>
              <p className="text-muted-foreground">Indicate whether the milk is freshly expressed, previously frozen and thawed, or warmed for feeding. This significantly affects safe storage time.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">4</div>
            <div>
              <h4 className="font-semibold mb-1">Enable Advanced Mode (Optional)</h4>
              <p className="text-muted-foreground">Switch to advanced mode for additional options like container type, milk amount, cleanliness level, baby age, and special needs considerations for more personalized recommendations.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold flex-shrink-0">5</div>
            <div>
              <h4 className="font-semibold mb-1">Calculate and Review Results</h4>
              <p className="text-muted-foreground">Click calculate to see the expiration date, time remaining, safety status, and comprehensive recommendations. A popup will show key information, with full details available below.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Understanding Breastmilk Storage */}
      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-foreground mb-4">Understanding Breastmilk Storage Safety</h3>
        <div className="prose prose-sm max-w-none text-foreground space-y-4">
          <div>
            <h4 className="font-semibold text-lg mb-2">Why Storage Guidelines Matter</h4>
            <p className="text-muted-foreground leading-relaxed">
              Proper breast milk storage is crucial for maintaining the nutritional and immunological properties of your milk while ensuring your baby's safety. The Centers for Disease Control and Prevention (CDC), World Health Organization (WHO), and Academy of Breastfeeding Medicine have established evidence-based guidelines to help parents safely store expressed breast milk. These guidelines balance the need to preserve milk quality with the prevention of bacterial growth that could harm infants.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-2">Factors Affecting Storage Duration</h4>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Several factors influence how long breast milk remains safe for your baby:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li><strong className="text-foreground">Temperature:</strong> Colder temperatures slow bacterial growth significantly. Room temperature milk lasts 4 hours, refrigerated milk lasts 4 days, and frozen milk lasts 6-12 months.</li>
              <li><strong className="text-foreground">Cleanliness:</strong> Proper hand hygiene (washing for 20 seconds with soap) and sterilized containers prevent contamination and can extend storage time.</li>
              <li><strong className="text-foreground">Milk state:</strong> Fresh milk lasts longer than thawed milk. Never refreeze thawed milk as the freeze-thaw cycle damages milk components.</li>
              <li><strong className="text-foreground">Container type:</strong> Use breast milk storage bags or BPA-free containers with tight-fitting lids. Glass is ideal as it doesn't leach chemicals.</li>
              <li><strong className="text-foreground">Storage location:</strong> Back of refrigerator/freezer maintains more consistent temperature (-18°C/0°F) than doors which experience frequent temperature fluctuations.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-2">The Science Behind Storage Times</h4>
            <p className="text-muted-foreground leading-relaxed">
              Breast milk contains living cells, antibodies, and beneficial bacteria that help protect your baby from infection. However, these same protective properties don't prevent all bacterial growth in stored milk. Research shows that bacterial counts in milk increase over time, even when refrigerated. The CDC's recommendations are based on studies showing that bacterial levels remain safe for 4 days in the refrigerator, after which the risk of harmful bacteria increases. The 4-hour room temperature guideline is based on research demonstrating that harmful bacteria can multiply rapidly at temperatures above 77°F (25°C).
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-2">Optimal vs. Maximum Storage Times</h4>
            <p className="text-muted-foreground leading-relaxed">
              The guidelines provide both optimal and maximum storage durations. <strong className="text-foreground">Optimal times (4 hours at room temp, 4 days refrigerated, 6 months frozen)</strong> represent the best balance of safety and nutritional quality. Maximum times (6-8 hours room temp, 5-8 days refrigerated, 12 months frozen) apply under very clean conditions with proper hygiene practices but should be used with caution. Milk quality—including vitamin C content, fat composition, and antibody levels—decreases the longer it's stored. When storing milk, aim for optimal durations to ensure the highest nutritional quality and safety for your baby.
          </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-2">Special Considerations for Thawed Milk</h4>
            <p className="text-muted-foreground leading-relaxed">
              Previously frozen breast milk that has been thawed requires special attention due to changes in milk composition. Once thawed in the refrigerator, use within 24 hours - never refreeze. Thawed milk brought to room temperature should be used within 1-2 hours. The freeze-thaw process changes milk composition: fat globules become smaller, some proteins denature slightly, and the milk becomes more susceptible to bacterial growth. This is why storage times are significantly shorter than fresh milk. Always thaw milk in the refrigerator overnight for best quality, or under warm running water if needed quickly.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-2">Best Practices for Safe Storage</h4>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Always wash hands thoroughly with soap for at least 20 seconds before expressing or handling breast milk</li>
              <li>Label every container with the date and time of expression using waterproof labels or permanent markers</li>
              <li>Store milk in 2-4 oz portions to reduce waste—babies' feeding amounts vary and you can always thaw more</li>
              <li>Cool fresh milk in refrigerator for 30-60 minutes before adding to already-cooled or frozen milk</li>
              <li>Store in the back of refrigerator/freezer where temperature is most stable (40°F/4°C for fridge, 0°F/-18°C for freezer)</li>
              <li>Use oldest milk first using the FIFO method (first in, first out) to prevent milk from expiring</li>
              <li>Leave 1 inch of space at top of container when freezing as breast milk expands during freezing</li>
              <li>Never microwave breast milk—it creates hot spots that can burn baby's mouth and destroys beneficial antibodies and enzymes</li>
              <li>Trust your senses—if milk smells sour, rancid, or looks clumpy (beyond normal separation), discard it immediately</li>
              <li>When in doubt, throw it out—your baby's safety comes first, and breast milk makes excellent plant fertilizer if expired</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-2">Nutritional Quality Across Storage Methods</h4>
            <p className="text-muted-foreground leading-relaxed">
              Fresh refrigerated breast milk retains the most anti-infective properties, living cells, and heat-sensitive nutrients (like vitamin C) compared to frozen milk. Research shows that freezing reduces some immune factors by 10-30% and vitamin C by up to 40% after 3 months. However, frozen milk still maintains most nutritional value and antibodies that make breast milk superior to formula. While freezing is safe and maintains most benefits, refrigerate milk when possible for maximum nutritional quality. Room temperature storage is acceptable for short periods but refrigerate or freeze milk promptly (within 4 hours) to preserve maximum nutritional quality and minimize bacterial growth.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-2">Normal Appearance Changes</h4>
            <p className="text-muted-foreground leading-relaxed">
              Breast milk naturally separates into layers when stored, with cream (fat) rising to the top and a bluish-white watery layer at the bottom. This is completely normal—breast milk is not homogenized like cow's milk. Simply swirl gently (avoid vigorous shaking as it can damage proteins and break down fat molecules) to mix before feeding. Fresh milk may have a soapy or metallic smell due to lipase enzyme breaking down fats, which is safe and normal. Some mothers produce milk with high lipase that causes a stronger soapy smell when frozen—this milk is safe but some babies may refuse it. However, truly sour or rancid smells (like spoiled cow's milk) indicate spoilage and the milk should be discarded. Color can range from bluish-white to yellowish to creamy depending on diet, stage of lactation (colostrum is more yellow), and fat content.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-2">Container Selection Guide</h4>
            <p className="text-muted-foreground leading-relaxed mb-3">
              Choosing the right container impacts both milk safety and convenience:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li><strong className="text-foreground">Glass containers:</strong> Best for preserving nutrients and antibodies. Easy to clean and sterilize. No chemical leaching. Can break if dropped. Ideal for refrigerator storage.</li>
              <li><strong className="text-foreground">BPA-free plastic containers:</strong> Lightweight and durable. Use food-grade, BPA-free hard plastic only. Good for refrigerator and freezer. Replace if scratched (bacteria harbor in scratches).</li>
              <li><strong className="text-foreground">Breast milk storage bags:</strong> Most convenient for freezer storage. Pre-sterilized options available. Space-efficient when laid flat. Remove excess air before sealing. Double-bag if bag quality uncertain.</li>
              <li><strong className="text-foreground">Never use:</strong> Disposable bottle liners (not designed for storage), regular plastic bags, containers that aren't food-grade, or containers with scratches/cracks.</li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-2">Traveling with Breast Milk</h4>
            <p className="text-muted-foreground leading-relaxed">
              When traveling, use an insulated cooler bag with frozen ice packs to keep milk cold. Breast milk can remain in a properly packed cooler for up to 24 hours. TSA allows breast milk in carry-on luggage in quantities greater than 3.4 ounces—inform the TSA officer at security screening. For longer trips, consider shipping frozen milk on dry ice in insulated containers. Upon arrival, immediately transfer milk to a refrigerator or freezer. If ice packs have completely thawed and milk feels warm, use within 2 hours or refrigerate and use within 24 hours.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-2">Special Circumstances</h4>
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">For premature infants:</strong> NICUs often require stricter storage guidelines (24-48 hours refrigerated, 3 months frozen) due to immature immune systems. Always follow your NICU's specific protocols.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-2">
              <strong className="text-foreground">For hospitalized infants:</strong> Hospital-grade storage may require 48-hour refrigerated limits and monthly frozen limits. Consult your healthcare team.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-2">
              <strong className="text-foreground">For infants with health conditions:</strong> Immunocompromised babies may need freshly expressed milk only. Consult your pediatrician for personalized guidelines.
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mt-4">
            <p className="text-sm text-foreground">
              <strong>Medical Disclaimer:</strong> This calculator provides guidance based on CDC, WHO, and La Leche League International guidelines for healthy, full-term infants. If your baby was born prematurely (before 37 weeks), is currently hospitalized, has special health needs, or is immunocompromised, consult your pediatrician, neonatologist, or IBCLC lactation consultant for specific storage guidelines. These may be more strict than general recommendations. The information provided is for educational purposes and does not replace professional medical advice.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <FAQAccordion faqs={faqItems} />

      {/* Review Section */}
      <div id="calculator-review-section">
        <CalculatorReview calculatorName="Breastmilk Storage Calculator" />
      </div>
    </div>
  );
}

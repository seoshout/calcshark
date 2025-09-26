# Wedding Alcohol Calculator - Formulas & Methodology

## Core Calculation Framework

### Base Consumption Formula
```
Total Drinks = Guests × Duration × Consumption Rate × Demographic Multiplier × Event Multiplier
```

### Industry Standard Consumption Rates

#### Hourly Consumption Patterns
- **Hour 1**: 2.0 drinks per person (peak consumption)
- **Hours 2-4**: 1.25 drinks per person per hour
- **Hours 5+**: 1.0 drinks per person per hour

#### Alternative Simplified Model
- **Consistent Rate**: 1.5 drinks per person per hour

### Demographic Multipliers

#### Age Group Adjustments
```javascript
const ageMultipliers = {
  young_adults: 1.3,      // 21-30 years (higher consumption)
  mixed_ages: 1.0,        // 25-60 years (baseline)
  mature_adults: 0.8      // 40+ years (lower consumption)
};
```

#### Drinking Level Adjustments
```javascript
const drinkingLevelMultipliers = {
  light: 0.7,             // 1-2 drinks total
  moderate: 1.0,          // 3-4 drinks total (baseline)
  heavy: 1.4              // 5+ drinks total
};
```

### Event Type Multipliers

#### Time of Day Adjustments
```javascript
const timeMultipliers = {
  morning: 0.3,           // Brunch events (minimal alcohol)
  afternoon: 0.7,         // Lunch/afternoon events
  evening: 1.0,           // Standard dinner reception (baseline)
  late_night: 1.2         // Party continues late
};
```

#### Seasonal Adjustments
```javascript
const seasonalMultipliers = {
  summer: { beer: 1.3, wine: 0.9, liquor: 0.9 },
  fall: { beer: 1.0, wine: 1.1, liquor: 1.0 },
  winter: { beer: 0.8, wine: 1.2, liquor: 1.1 },
  spring: { beer: 1.1, wine: 1.0, liquor: 1.0 }
};
```

### Food Service Impact
```javascript
const foodServiceMultipliers = {
  no_food: 1.2,           // Higher alcohol consumption
  cocktail_apps: 1.0,     // Baseline
  full_dinner: 0.85,      // Lower alcohol, higher wine during dinner
  buffet_style: 0.9       // Continuous eating reduces alcohol
};
```

## Alcohol Distribution Formulas

### Standard Distribution Ratios
```javascript
const standardRatios = {
  conservative: { beer: 0.33, wine: 0.33, liquor: 0.34 },
  popular: { beer: 0.25, wine: 0.25, liquor: 0.50 },
  wine_focused: { beer: 0.20, wine: 0.50, liquor: 0.30 },
  beer_focused: { beer: 0.50, wine: 0.30, liquor: 0.20 }
};
```

### Dynamic Ratio Calculation
```javascript
function calculateDynamicRatios(eventType, season, guestAge) {
  let ratios = { beer: 0.33, wine: 0.33, liquor: 0.34 };

  // Adjust for event type
  if (eventType === 'brunch') {
    ratios = { beer: 0.15, wine: 0.60, liquor: 0.25 }; // More mimosas, wine
  } else if (eventType === 'cocktail_party') {
    ratios = { beer: 0.20, wine: 0.30, liquor: 0.50 }; // More cocktails
  }

  // Seasonal adjustments
  if (season === 'summer') {
    ratios.beer *= 1.3;
    ratios.wine *= 0.9;
    ratios.liquor *= 0.9;
  }

  // Age adjustments
  if (guestAge === 'young_adults') {
    ratios.beer *= 1.2;
    ratios.liquor *= 1.1;
    ratios.wine *= 0.8;
  }

  // Normalize to ensure sum = 1
  const total = ratios.beer + ratios.wine + ratios.liquor;
  return {
    beer: ratios.beer / total,
    wine: ratios.wine / total,
    liquor: ratios.liquor / total
  };
}
```

## Serving Size & Bottle Calculations

### Standard Serving Sizes
```javascript
const servingSizes = {
  wine: 5,                // 5 oz per serving
  beer: 12,               // 12 oz per serving
  liquor: 1.5,            // 1.5 oz per cocktail
  champagne: 4            // 4 oz per toast
};
```

### Bottle Yield Calculations
```javascript
const bottleYields = {
  wine_bottle: 25.36,     // 750ml = 25.36 oz → 5 servings
  beer_bottle: 12,        // 12 oz bottle = 1 serving
  liquor_bottle: 25.36,   // 750ml = 25.36 oz → 17 cocktails
  champagne_bottle: 25.36 // 750ml = 25.36 oz → 6 servings
};

function calculateBottles(totalOunces, bottleSize) {
  return Math.ceil(totalOunces / bottleSize);
}
```

### Package Optimization
```javascript
function optimizePackaging(bottles, packageSizes) {
  const packages = [];
  let remaining = bottles;

  // Sort package sizes by efficiency (largest first)
  const sortedSizes = packageSizes.sort((a, b) => b.size - a.size);

  for (const pkg of sortedSizes) {
    const count = Math.floor(remaining / pkg.size);
    if (count > 0) {
      packages.push({ type: pkg.type, count: count, totalUnits: count * pkg.size });
      remaining -= count * pkg.size;
    }
  }

  // Handle remaining bottles as individual purchases
  if (remaining > 0) {
    packages.push({ type: 'individual', count: remaining, totalUnits: remaining });
  }

  return packages;
}
```

## Advanced Calculations

### Non-Alcoholic Requirements
```javascript
function calculateNonAlcoholic(guests, duration, nonDrinkerPercentage = 0.2) {
  const nonDrinkers = Math.ceil(guests * nonDrinkerPercentage);
  const totalDrinks = nonDrinkers * duration * 1.5; // 1.5 non-alcoholic drinks per hour

  return {
    water: Math.ceil(totalDrinks * 0.4),      // 40% water
    sodas: Math.ceil(totalDrinks * 0.35),     // 35% soft drinks
    juices: Math.ceil(totalDrinks * 0.15),    // 15% juices
    coffee_tea: Math.ceil(totalDrinks * 0.1)  // 10% coffee/tea
  };
}
```

### Toast & Special Moment Planning
```javascript
function calculateToastNeeds(guests, toastCount = 1) {
  // Assume 80% of guests participate in toasts
  const participatingGuests = Math.ceil(guests * 0.8);
  const champagneNeeded = participatingGuests * toastCount * 4; // 4 oz per toast
  return Math.ceil(champagneNeeded / 25.36); // Convert to bottles
}
```

### Buffer & Safety Calculations
```javascript
function calculateBuffer(totalQuantity, confidence = 0.9) {
  const bufferMultipliers = {
    0.8: 1.25,  // 25% buffer for 80% confidence
    0.9: 1.15,  // 15% buffer for 90% confidence
    0.95: 1.10  // 10% buffer for 95% confidence
  };

  return Math.ceil(totalQuantity * (bufferMultipliers[confidence] || 1.15));
}
```

### Cost Estimation Formulas
```javascript
const averagePrices = {
  beer: { budget: 1.5, mid: 2.5, premium: 4.0 },      // Per bottle/can
  wine: { budget: 12, mid: 20, premium: 35 },         // Per bottle
  liquor: { budget: 20, mid: 35, premium: 60 },       // Per bottle
  champagne: { budget: 15, mid: 25, premium: 50 }     // Per bottle
};

function estimateCost(quantities, priceLevel = 'mid', region = 'us_average') {
  const regionalMultipliers = {
    us_northeast: 1.15,
    us_west: 1.12,
    us_south: 0.95,
    us_midwest: 0.92,
    us_average: 1.0
  };

  const multiplier = regionalMultipliers[region] || 1.0;
  let totalCost = 0;

  for (const [type, quantity] of Object.entries(quantities)) {
    if (averagePrices[type]) {
      totalCost += quantity * averagePrices[type][priceLevel] * multiplier;
    }
  }

  return {
    subtotal: totalCost,
    tax: totalCost * 0.08, // Average 8% tax
    total: totalCost * 1.08
  };
}
```

## Validation Rules & Constraints

### Input Validation
```javascript
const validationRules = {
  guests: { min: 10, max: 500, default: 100 },
  duration: { min: 1, max: 12, default: 5 },
  nonDrinkerPercentage: { min: 0, max: 0.5, default: 0.2 },
  alcoholRatios: {
    sum: 1.0,
    individual: { min: 0.1, max: 0.8 }
  }
};

function validateInputs(inputs) {
  const errors = [];

  if (inputs.guests < validationRules.guests.min || inputs.guests > validationRules.guests.max) {
    errors.push(`Guest count must be between ${validationRules.guests.min} and ${validationRules.guests.max}`);
  }

  if (inputs.duration < validationRules.duration.min || inputs.duration > validationRules.duration.max) {
    errors.push(`Duration must be between ${validationRules.duration.min} and ${validationRules.duration.max} hours`);
  }

  const ratioSum = (inputs.beerRatio || 0) + (inputs.wineRatio || 0) + (inputs.liquorRatio || 0);
  if (Math.abs(ratioSum - 1.0) > 0.01) {
    errors.push('Alcohol preference ratios must sum to 100%');
  }

  return errors;
}
```

## Complete Calculation Example

```javascript
function calculateWeddingAlcohol(inputs) {
  // Validate inputs
  const validationErrors = validateInputs(inputs);
  if (validationErrors.length > 0) {
    return { errors: validationErrors };
  }

  // Extract inputs
  const {
    guests, duration, ageGroup, drinkingLevel, eventType,
    season, nonDrinkerPercentage, customRatios, budgetLevel
  } = inputs;

  // Calculate base consumption
  let totalDrinks = 0;
  for (let hour = 1; hour <= duration; hour++) {
    const hourlyRate = hour === 1 ? 2.0 : (hour <= 4 ? 1.25 : 1.0);
    totalDrinks += guests * hourlyRate;
  }

  // Apply demographic multipliers
  totalDrinks *= ageMultipliers[ageGroup] || 1.0;
  totalDrinks *= drinkingLevelMultipliers[drinkingLevel] || 1.0;
  totalDrinks *= timeMultipliers[eventType] || 1.0;

  // Calculate alcohol distribution
  const ratios = customRatios || calculateDynamicRatios(eventType, season, ageGroup);
  const alcoholNeeds = {
    beer: totalDrinks * ratios.beer,
    wine: totalDrinks * ratios.wine,
    liquor: totalDrinks * ratios.liquor
  };

  // Convert to bottles with buffer
  const bottles = {
    beer: calculateBuffer(Math.ceil(alcoholNeeds.beer)),
    wine: calculateBuffer(Math.ceil(alcoholNeeds.wine / 5)),
    liquor: calculateBuffer(Math.ceil(alcoholNeeds.liquor / 17)),
    champagne: calculateToastNeeds(guests)
  };

  // Calculate non-alcoholic needs
  const nonAlcoholic = calculateNonAlcoholic(guests, duration, nonDrinkerPercentage);

  // Estimate costs
  const costs = estimateCost(bottles, budgetLevel);

  // Generate shopping list
  const shoppingList = optimizePackaging(bottles, [
    { type: '24-pack', size: 24 },
    { type: '12-pack', size: 12 },
    { type: '6-pack', size: 6 }
  ]);

  return {
    summary: {
      totalGuests: guests,
      drinkingGuests: Math.ceil(guests * (1 - nonDrinkerPercentage)),
      totalDrinks: Math.ceil(totalDrinks),
      estimatedCost: costs.total
    },
    alcoholic: bottles,
    nonAlcoholic: nonAlcoholic,
    shoppingList: shoppingList,
    costs: costs,
    recommendations: generateRecommendations(inputs, bottles)
  };
}
```

## Sources & References

### Industry Standards
- **National Restaurant Association**: Beverage service guidelines
- **Professional Bartenders Association**: Standard serving sizes
- **Wedding Industry Association**: Event consumption patterns

### Academic Sources
- **Journal of Hospitality Management**: Event beverage consumption studies
- **Food Service Research**: Demographic consumption patterns
- **Event Planning Institute**: Wedding reception analysis

### Validation Methods
- **A/B Testing**: Compare predictions with actual consumption
- **User Feedback**: Post-event consumption surveys
- **Industry Expert Review**: Professional event planner validation

### Assumptions & Limitations
1. **Regional Variations**: Formulas based on US consumption patterns
2. **Cultural Factors**: Limited adjustment for ethnic/cultural preferences
3. **Individual Variations**: Cannot account for personal drinking habits
4. **Venue Policies**: Does not consider venue-specific restrictions
5. **Weather Impact**: Limited seasonal adjustments
6. **Economic Factors**: Basic pricing estimates only

### Recommended Updates
- **Quarterly**: Price data updates
- **Annually**: Consumption pattern reviews
- **Ongoing**: User feedback integration
- **Seasonal**: Weather impact analysis
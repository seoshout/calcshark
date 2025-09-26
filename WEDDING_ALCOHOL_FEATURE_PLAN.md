# Wedding Alcohol Calculator - Feature Priority & Design

## MVP Features (Phase 1) - Core Functionality

### 1. Basic Event Configuration
- **Guest Count** (with validation 10-500 guests)
- **Event Duration** (1-12 hours, with preset options)
- **Event Type** (Cocktail Hour, Reception, Brunch, All Day)
- **Time of Day** (Morning, Afternoon, Evening, Late Night)

### 2. Guest Demographics (Simplified)
- **Age Distribution**: Young (21-30), Mixed (All Ages), Mature (40+)
- **Drinking Level**: Light, Moderate, Heavy
- **Special Considerations**: Includes Non-Drinkers checkbox

### 3. Core Alcohol Calculation
- **Beer Calculation** (12 oz servings)
- **Wine Calculation** (5 oz servings, red/white split)
- **Liquor Calculation** (1.5 oz per cocktail)
- **Champagne** (for toasts, 4 oz servings)

### 4. Basic Output
- **Total quantities** by alcohol type
- **Bottle counts** (750ml wine, 12-pack beer, 750ml spirits)
- **Estimated total cost** (basic pricing)
- **Serving recommendations** per hour

### 5. Essential Validations
- Input range validation
- Logic warnings (e.g., 1 guest for 8 hours)
- Required field indicators

## Enhanced Features (Phase 2) - Advanced Options

### 6. Detailed Beverage Preferences
- **Custom ratios** (beer/wine/liquor percentages)
- **Wine type preferences** (red, white, sparkling split)
- **Beer type options** (light, regular, craft percentages)
- **Popular cocktail selections** (2-3 signature drinks)

### 7. Seasonal & Environmental Factors
- **Season adjustment** (summer = more beer, winter = more wine)
- **Temperature considerations** (outdoor events)
- **Food service timing** (affects consumption patterns)

### 8. Budget & Shopping Features
- **Regional pricing** (basic US regions)
- **Package optimization** (match store packaging)
- **Shopping list generator** (organized by beverage type)
- **Budget breakdown** (cost per guest, per drink type)

### 9. Non-Alcoholic Options
- **Non-alcoholic guest percentage**
- **Mocktail ingredients**
- **Soft drinks, water, coffee**
- **Special dietary options**

## Premium Features (Phase 3) - Professional Tools

### 10. Advanced Demographics
- **Detailed age brackets** with custom consumption rates
- **Cultural/regional drinking preferences**
- **Professional vs casual event adjustments**

### 11. Smart Optimization
- **Multi-scenario planning** (conservative vs optimistic)
- **Leftover prediction** and planning
- **Waste buffer calculations**
- **Emergency shortage planning**

### 12. Professional Export Options
- **Detailed shopping lists** with store locations
- **Budget tracking spreadsheets**
- **Timeline planning guides**
- **Printable bar setup guides**

### 13. Integration Features
- **Calendar integration** for purchase timing
- **Vendor contact management**
- **Real-time price comparison**
- **Inventory tracking**

## User Interface Wireframe Design

### Input Flow Structure
```
1. Event Basics
   ├── Guest Count [slider/input: 10-500]
   ├── Event Duration [preset buttons: 2h, 4h, 6h, 8h, custom]
   ├── Event Type [dropdown: Reception, Cocktail, Brunch, etc.]
   └── Time of Day [radio: Morning, Afternoon, Evening]

2. Guest Profile
   ├── Age Distribution [three-slider: Young/Mixed/Mature %]
   ├── Drinking Level [radio: Light, Moderate, Heavy]
   ├── Non-Drinkers [checkbox + percentage]
   └── Special Considerations [checkboxes]

3. Beverage Preferences (Collapsible Advanced)
   ├── Alcohol Split [three-slider: Beer/Wine/Liquor %]
   ├── Wine Types [slider: Red/White/Sparkling %]
   ├── Beer Types [checkboxes: Light, Regular, Craft]
   └── Signature Cocktails [dropdown selections]

4. Budget & Location (Optional)
   ├── Budget Range [slider: $200-$5000+]
   ├── Location [dropdown: state/region]
   └── Shopping Preference [radio: Budget, Premium, Mixed]
```

### Output Display Structure
```
Results Dashboard
├── Quick Summary Card
│   ├── Total Guests Served
│   ├── Total Drinks Needed
│   ├── Estimated Cost Range
│   └── Confidence Level
│
├── Detailed Breakdown Tabs
│   ├── By Beverage Type
│   │   ├── Beer (bottles/cans needed)
│   │   ├── Wine (bottles by type)
│   │   ├── Liquor (bottles by type)
│   │   └── Non-Alcoholic
│   │
│   ├── Shopping List
│   │   ├── Organized by store section
│   │   ├── Package quantities
│   │   ├── Estimated costs
│   │   └── Priority items
│   │
│   ├── Timeline & Serving
│   │   ├── Hourly consumption chart
│   │   ├── Bar setup recommendations
│   │   ├── Serving staff suggestions
│   │   └── Ice & garnish needs
│   │
│   └── Budget Analysis
│       ├── Cost per guest breakdown
│       ├── Alternative scenarios
│       ├── Money-saving tips
│       └── Leftover value estimate
```

### Responsive Design Considerations
- **Mobile-first approach** with touch-friendly controls
- **Progressive disclosure** - basic options first, advanced collapsible
- **Visual feedback** - real-time calculation updates
- **Clear hierarchy** - most important info prominently displayed

## Key UX Principles

### 1. Progressive Complexity
- Start with simple, required inputs
- Reveal advanced options as needed
- Provide smart defaults for everything

### 2. Confidence Building
- Show calculation methodology
- Provide ranges, not just single numbers
- Include confidence indicators

### 3. Practical Outputs
- Focus on actionable shopping lists
- Match real-world packaging
- Include backup planning

### 4. Educational Approach
- Explain serving sizes visually
- Provide context for recommendations
- Include responsible serving guidance

## Implementation Priority

### Week 1: MVP Core
- Basic input form with validation
- Core calculation engine
- Simple output display
- Mobile responsive design

### Week 2: Enhanced Features
- Advanced demographics options
- Seasonal adjustments
- Shopping list generation
- Budget calculations

### Week 3: Premium Polish
- Export functionality
- Advanced visualizations
- Comprehensive help system
- Performance optimization

## Success Metrics
- **User Completion Rate**: >85% complete all required fields
- **Accuracy Feedback**: Self-reported satisfaction >4.5/5
- **Feature Usage**: Advanced options used by >40% users
- **Mobile Usage**: >60% mobile-friendly interaction
- **Return Usage**: >30% users return for multiple calculations
'use client';

import React, { useState, useRef } from 'react';
import {
  Calculator, Heart, DollarSign, Scale, Calendar, MapPin, Building2,
  Shield, AlertTriangle, CheckCircle, X, ChevronDown, ChevronUp, Info,
  Lightbulb, TrendingDown, Percent, Stethoscope, Users, RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import CalculatorReview from '@/components/ui/calculator-review';
import FAQAccordion, { FAQItem } from '@/components/ui/faq-accordion';

// Type Definitions
type PetType = 'dog' | 'cat' | 'rabbit';
type Gender = 'male' | 'female';
type WeightCategory = '<10' | '10-25' | '25-50' | '50-75' | '75-100' | '100+';
type AreaType = 'urban' | 'suburban' | 'rural';
type ClinicType = 'low-cost-nonprofit' | 'low-cost-mobile' | 'private-practice' | 'specialty-clinic';
type ProcedureType = 'traditional' | 'laparoscopic';
type CalculationMode = 'basic' | 'comprehensive' | 'clinic-comparison' | 'budget-planner' | 'break-even-analysis';

interface SpayNeuterInputs {
  // Basic inputs
  petType: PetType;
  gender: Gender;
  weightCategory: WeightCategory;
  ageInMonths: string;

  // Location
  state: string;
  areaType: AreaType;

  // Clinic type
  clinicType: ClinicType;

  // Special conditions
  isPregnantOrInHeat: boolean;
  isCryptorchid: boolean;
  isBrachycephalic: boolean;
  isObese: boolean;

  // Procedure preferences
  procedureType: ProcedureType;

  // Additional services
  includePreOpBloodwork: boolean;
  includeIVFluids: boolean;
  includePainMedication: boolean;
  includeECollar: boolean;
  includeMicrochip: boolean;
  includeAntibiotics: boolean;
  includePostOpExam: boolean;

  // Insurance/financial
  hasWellnessPlan: boolean;
  wellnessPlanReimbursement: string;
  numberOfPets: string;

  // Advanced options
  calculationMode: CalculationMode;
  showRegionalComparison: boolean;
  showRecoveryComparison: boolean;
}

interface CostBreakdownItem {
  item: string;
  cost: number;
  notes: string;
}

interface ClinicComparisonItem {
  clinicType: string;
  estimatedCost: number;
  prosAndCons: string[];
}

interface ProcedureComparisonItem {
  procedureType: string;
  cost: number;
  painReduction: string;
  recoveryTime: string;
  benefits: string[];
}

interface SpayNeuterResult {
  baseProcedureCost: number;
  specialConditionTotal: number;
  additionalServicesCost: number;
  totalEstimatedCost: number;
  costBreakdown: CostBreakdownItem[];
  clinicComparison?: ClinicComparisonItem[];
  procedureComparison?: ProcedureComparisonItem[];
  insuranceReimbursement: number;
  outOfPocketCost: number;
  multiPetDiscount: number;
  nationalAverageCost: number;
  regionalAverageCost: number;
  savingsVsNationalAverage: number;
  recommendations: string[];
  tips: string[];
  warningsAndConsiderations: string[];
  nextSteps: string[];
  ageRecommendation: string;
}

const AdvancedSpayNeuterCalculator = () => {
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [result, setResult] = useState<SpayNeuterResult | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const [inputs, setInputs] = useState<SpayNeuterInputs>({
    petType: 'dog',
    gender: 'female',
    weightCategory: '10-25',
    ageInMonths: '6',
    state: 'National Average',
    areaType: 'suburban',
    clinicType: 'private-practice',
    isPregnantOrInHeat: false,
    isCryptorchid: false,
    isBrachycephalic: false,
    isObese: false,
    procedureType: 'traditional',
    includePreOpBloodwork: false,
    includeIVFluids: false,
    includePainMedication: true,
    includeECollar: true,
    includeMicrochip: false,
    includeAntibiotics: false,
    includePostOpExam: false,
    hasWellnessPlan: false,
    wellnessPlanReimbursement: '150',
    numberOfPets: '1',
    calculationMode: 'comprehensive',
    showRegionalComparison: false,
    showRecoveryComparison: false
  });

  // Calculation constants
  const baseCosts = {
    dog: { male: 487, female: 455 },
    cat: { male: 212, female: 322 },
    rabbit: { male: 150, female: 200 }
  };

  const clinicMultipliers = {
    'low-cost-nonprofit': 0.25,
    'low-cost-mobile': 0.35,
    'private-practice': 1.0,
    'specialty-clinic': 2.0
  };

  const weightAdjustments = {
    '<10': -50,
    '10-25': 0,
    '25-50': 20,
    '50-75': 30,
    '75-100': 50,
    '100+': 75
  };

  const regionalMultipliers: { [key: string]: number } = {
    'National Average': 1.0,
    'California': 1.3,
    'New York': 1.25,
    'Massachusetts': 1.2,
    'Washington': 1.15,
    'Oregon': 1.1,
    'Texas': 0.9,
    'Florida': 0.95,
    'Georgia': 0.85,
    'Ohio': 0.9,
    'Pennsylvania': 1.0
  };

  const areaTypeAdjustments = {
    'urban': 1.1,
    'suburban': 1.0,
    'rural': 0.85
  };

  const specialConditionFees = {
    pregnantOrInHeat: 85,
    cryptorchid: 125,
    brachycephalic: 125,
    obese: 40
  };

  const additionalServices = {
    preOpBloodwork: 80,
    ivFluids: 45,
    painMedication: 15,
    eCollar: 12,
    microchip: 18,
    antibiotics: 15,
    postOpExam: 30
  };

  const laparoscopicPremium = 225;

  // Handle input changes
  const handleInputChange = (field: keyof SpayNeuterInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
  };

  // Calculate cost
  const calculateCost = () => {
    // Base cost
    const baseGenderCost = baseCosts[inputs.petType][inputs.gender];
    const clinicMultiplier = clinicMultipliers[inputs.clinicType];
    const regionalMultiplier = regionalMultipliers[inputs.state] || 1.0;
    const areaMultiplier = areaTypeAdjustments[inputs.areaType];

    // Weight adjustment (dogs only)
    const weightAdjustment = inputs.petType === 'dog' ? weightAdjustments[inputs.weightCategory] : 0;

    // Calculate base procedure cost
    let baseProcedureCost = (baseGenderCost + weightAdjustment) * clinicMultiplier * regionalMultiplier * areaMultiplier;

    // Laparoscopic premium (female dogs only)
    if (inputs.gender === 'female' && inputs.petType === 'dog' && inputs.procedureType === 'laparoscopic') {
      baseProcedureCost += laparoscopicPremium;
    }

    // Special conditions
    let specialConditionTotal = 0;
    const specialConditions: CostBreakdownItem[] = [];

    if (inputs.isPregnantOrInHeat && inputs.gender === 'female') {
      specialConditionTotal += specialConditionFees.pregnantOrInHeat;
      specialConditions.push({
        item: 'Pregnant/In Heat Fee',
        cost: specialConditionFees.pregnantOrInHeat,
        notes: 'Additional complexity for surgery'
      });
    }

    if (inputs.isCryptorchid && inputs.gender === 'male') {
      specialConditionTotal += specialConditionFees.cryptorchid;
      specialConditions.push({
        item: 'Cryptorchid Fee',
        cost: specialConditionFees.cryptorchid,
        notes: 'Undescended testicle requires more complex surgery'
      });
    }

    if (inputs.isBrachycephalic) {
      specialConditionTotal += specialConditionFees.brachycephalic;
      specialConditions.push({
        item: 'Brachycephalic Fee',
        cost: specialConditionFees.brachycephalic,
        notes: 'Extra anesthesia precautions required'
      });
    }

    if (inputs.isObese && inputs.gender === 'female') {
      specialConditionTotal += specialConditionFees.obese;
      specialConditions.push({
        item: 'Obesity Fee',
        cost: specialConditionFees.obese,
        notes: 'Increased surgical difficulty'
      });
    }

    // Additional services
    let additionalServicesCost = 0;
    const additionalServicesBreakdown: CostBreakdownItem[] = [];

    if (inputs.includePreOpBloodwork) {
      additionalServicesCost += additionalServices.preOpBloodwork;
      additionalServicesBreakdown.push({
        item: 'Pre-Op Bloodwork',
        cost: additionalServices.preOpBloodwork,
        notes: 'Required for pets 7+ years old'
      });
    }

    if (inputs.includeIVFluids) {
      additionalServicesCost += additionalServices.ivFluids;
      additionalServicesBreakdown.push({
        item: 'IV Catheter & Fluids',
        cost: additionalServices.ivFluids,
        notes: 'Helps regulate blood pressure and recovery'
      });
    }

    if (inputs.includePainMedication) {
      additionalServicesCost += additionalServices.painMedication;
      additionalServicesBreakdown.push({
        item: 'Take-Home Pain Medication',
        cost: additionalServices.painMedication,
        notes: 'Recommended for all procedures'
      });
    }

    if (inputs.includeECollar) {
      additionalServicesCost += additionalServices.eCollar;
      additionalServicesBreakdown.push({
        item: 'E-Collar (Cone)',
        cost: additionalServices.eCollar,
        notes: 'Required to prevent licking incision'
      });
    }

    if (inputs.includeMicrochip) {
      additionalServicesCost += additionalServices.microchip;
      additionalServicesBreakdown.push({
        item: 'Microchip',
        cost: additionalServices.microchip,
        notes: 'Permanent pet identification'
      });
    }

    if (inputs.includeAntibiotics) {
      additionalServicesCost += additionalServices.antibiotics;
      additionalServicesBreakdown.push({
        item: 'Antibiotics',
        cost: additionalServices.antibiotics,
        notes: 'If infection risk exists'
      });
    }

    if (inputs.includePostOpExam) {
      additionalServicesCost += additionalServices.postOpExam;
      additionalServicesBreakdown.push({
        item: 'Post-Op Exam',
        cost: additionalServices.postOpExam,
        notes: 'Follow-up checkup after surgery'
      });
    }

    // Total cost
    const totalEstimatedCost = baseProcedureCost + specialConditionTotal + additionalServicesCost;

    // Insurance/wellness reimbursement
    const wellnessReimbursement = inputs.hasWellnessPlan ? parseFloat(inputs.wellnessPlanReimbursement) || 0 : 0;

    // Multi-pet discount (5% per additional pet, up to 20%)
    const numberOfPets = parseInt(inputs.numberOfPets) || 1;
    const discountPercentage = numberOfPets > 1 ? Math.min((numberOfPets - 1) * 5, 20) : 0;
    const multiPetDiscount = totalEstimatedCost * (discountPercentage / 100);

    // Final out-of-pocket cost
    const outOfPocketCost = Math.max(0, totalEstimatedCost - wellnessReimbursement - multiPetDiscount);

    // National and regional averages
    const nationalAverageCost = baseCosts[inputs.petType][inputs.gender];
    const regionalAverageCost = nationalAverageCost * regionalMultipliers[inputs.state];
    const savingsVsNationalAverage = nationalAverageCost - baseProcedureCost;

    // Build cost breakdown
    const costBreakdown: CostBreakdownItem[] = [
      {
        item: `${inputs.gender === 'male' ? 'Neuter' : 'Spay'} Procedure (${inputs.petType})`,
        cost: baseProcedureCost,
        notes: `${getClinicTypeName(inputs.clinicType)}, ${inputs.state}`
      },
      ...specialConditions,
      ...additionalServicesBreakdown
    ];

    if (wellnessReimbursement > 0) {
      costBreakdown.push({
        item: 'Wellness Plan Reimbursement',
        cost: -wellnessReimbursement,
        notes: 'Insurance wellness plan coverage'
      });
    }

    if (multiPetDiscount > 0) {
      costBreakdown.push({
        item: `Multi-Pet Discount (${discountPercentage}%)`,
        cost: -multiPetDiscount,
        notes: `${numberOfPets} pets total`
      });
    }

    // Generate recommendations
    const recommendations = generateRecommendations();
    const tips = generateTips();
    const warnings = generateWarnings();
    const nextSteps = generateNextSteps();
    const ageRecommendation = generateAgeRecommendation();

    // Clinic comparison (if mode selected)
    const clinicComparison = inputs.calculationMode === 'clinic-comparison' || inputs.calculationMode === 'comprehensive'
      ? generateClinicComparison()
      : undefined;

    // Procedure comparison (if applicable)
    const procedureComparison = inputs.gender === 'female' && inputs.petType === 'dog' && inputs.showRecoveryComparison
      ? generateProcedureComparison()
      : undefined;

    const calculatedResult: SpayNeuterResult = {
      baseProcedureCost,
      specialConditionTotal,
      additionalServicesCost,
      totalEstimatedCost,
      costBreakdown,
      clinicComparison,
      procedureComparison,
      insuranceReimbursement: wellnessReimbursement,
      outOfPocketCost,
      multiPetDiscount,
      nationalAverageCost,
      regionalAverageCost,
      savingsVsNationalAverage,
      recommendations,
      tips,
      warningsAndConsiderations: warnings,
      nextSteps,
      ageRecommendation
    };

    setResult(calculatedResult);
    setShowModal(true);

    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Helper functions
  const getClinicTypeName = (type: ClinicType): string => {
    const names = {
      'low-cost-nonprofit': 'Low-Cost Nonprofit Clinic',
      'low-cost-mobile': 'Low-Cost Mobile Clinic',
      'private-practice': 'Private Veterinary Practice',
      'specialty-clinic': 'Specialty/Emergency Clinic'
    };
    return names[type];
  };

  const getPetTypeLabel = (type: PetType): string => {
    return type.charAt(0).toUpperCase() + type.slice(1);
  };

  const generateRecommendations = (): string[] => {
    const recs: string[] = [];

    // Age-based recommendations
    const age = parseInt(inputs.ageInMonths) || 6;
    if (inputs.petType === 'cat' && age > 5) {
      recs.push('Cats should ideally be spayed/neutered before 5 months of age to prevent unwanted litters and health issues.');
    }
    if (inputs.petType === 'dog' && inputs.weightCategory === '100+' && age < 12) {
      recs.push('Giant breed dogs may benefit from waiting until 12-18 months of age. Consult your veterinarian.');
    }

    // Clinic type recommendations
    if (inputs.clinicType === 'specialty-clinic' && !inputs.isBrachycephalic && !inputs.isCryptorchid) {
      recs.push('Consider a private practice or low-cost clinic for standard procedures to save costs.');
    }
    if (inputs.clinicType === 'private-practice' && inputs.gender === 'female' && inputs.petType === 'dog') {
      recs.push('Ask your vet about laparoscopic spay for 65% less pain and faster recovery (3-5 days vs 10-14 days).');
    }

    // Additional services recommendations
    if (age >= 84 && !inputs.includePreOpBloodwork) { // 7 years = 84 months
      recs.push('Pre-operative bloodwork is highly recommended for pets 7 years and older to identify potential risks.');
    }
    if (!inputs.includeECollar) {
      recs.push('An E-collar is strongly recommended to prevent your pet from licking the incision site.');
    }
    if (!inputs.includePainMedication) {
      recs.push('Take-home pain medication significantly improves your pet\'s comfort during recovery.');
    }

    return recs;
  };

  const generateTips = (): string[] => {
    return [
      'Low-cost clinics offer the same safety and quality standards as private practices, often at 50-75% lower cost',
      'Many states offer free or subsidized spay/neuter vouchers for low-income pet owners',
      'Pet wellness plans typically reimburse $135-150 for spay/neuter procedures',
      'Spaying before the first heat cycle reduces mammary cancer risk by 90%',
      'Recovery is typically faster in younger, healthy-weight pets',
      'Keep your pet calm and restrict activity for 10-14 days after surgery',
      'Check the incision daily for redness, swelling, or discharge'
    ];
  };

  const generateWarnings = (): string[] => {
    const warnings: string[] = [];

    if (inputs.isBrachycephalic) {
      warnings.push('Brachycephalic breeds have increased anesthesia risks. Ensure your vet uses specialized protocols.');
    }
    if (inputs.isPregnantOrInHeat) {
      warnings.push('Spaying during pregnancy or heat increases surgical complexity and bleeding risk.');
    }
    if (inputs.isCryptorchid) {
      warnings.push('Cryptorchid testicles have 10x higher cancer risk and must be removed surgically.');
    }
    if (inputs.isObese) {
      warnings.push('Obesity increases surgical difficulty, anesthesia risk, and recovery time.');
    }

    const age = parseInt(inputs.ageInMonths) || 6;
    if (age >= 84) {
      warnings.push('Senior pets have higher anesthesia risks. Bloodwork and cardiac evaluation are essential.');
    }

    return warnings;
  };

  const generateNextSteps = (): string[] => {
    return [
      'Research and compare local veterinary clinics and spay/neuter programs',
      'Schedule a pre-operative exam to assess your pet\'s health',
      'Ask about what\'s included in the quoted price (exam, pain meds, e-collar, etc.)',
      'Inquire about payment plans or financial assistance programs',
      'Prepare your pet by withholding food for 12 hours before surgery',
      'Arrange a quiet recovery space at home away from other pets',
      'Keep your vet\'s emergency contact information readily available'
    ];
  };

  const generateAgeRecommendation = (): string => {
    const age = parseInt(inputs.ageInMonths) || 6;

    if (inputs.petType === 'cat') {
      if (age < 5) return 'Perfect timing! Cats should be spayed/neutered before 5 months of age.';
      if (age < 12) return 'Good timing. While earlier is ideal, spaying/neutering now still provides health benefits.';
      return 'It\'s not too late! Spaying/neutering adult cats still prevents health issues and unwanted litters.';
    }

    if (inputs.petType === 'dog') {
      if (inputs.weightCategory === '<10' || inputs.weightCategory === '10-25') {
        if (age >= 4 && age <= 6) return 'Ideal timing for small/toy breed dogs (4-6 months).';
        if (age < 4) return 'Consider waiting until 4 months for optimal development.';
        return 'Adult spay/neuter still provides health and behavioral benefits.';
      }
      if (inputs.weightCategory === '100+') {
        if (age >= 12 && age <= 18) return 'Good timing for giant breeds (12-18 months recommended).';
        if (age < 12) return 'Giant breeds may benefit from waiting until 12-18 months. Consult your vet.';
        return 'Adult spay/neuter is still beneficial. Discuss with your veterinarian.';
      }
      if (age >= 6 && age <= 9) return 'Good timing for medium to large breed dogs (6-9 months).';
      return 'Consult your veterinarian for breed-specific age recommendations.';
    }

    return 'Consult your veterinarian for pet-specific age recommendations.';
  };

  const generateClinicComparison = (): ClinicComparisonItem[] => {
    const baseGenderCost = baseCosts[inputs.petType][inputs.gender];
    const regionalMultiplier = regionalMultipliers[inputs.state] || 1.0;
    const areaMultiplier = areaTypeAdjustments[inputs.areaType];
    const weightAdjustment = inputs.petType === 'dog' ? weightAdjustments[inputs.weightCategory] : 0;

    const types: ClinicType[] = ['low-cost-nonprofit', 'low-cost-mobile', 'private-practice', 'specialty-clinic'];

    return types.map(type => {
      const cost = (baseGenderCost + weightAdjustment) * clinicMultipliers[type] * regionalMultiplier * areaMultiplier;

      const prosAndCons: { [key in ClinicType]: string[] } = {
        'low-cost-nonprofit': [
          '✓ Most affordable option (50-75% savings)',
          '✓ Same safety and quality standards',
          '✓ Often includes pain meds and e-collar',
          '✗ Limited appointment availability',
          '✗ May have income requirements',
          '✗ Less personalized care'
        ],
        'low-cost-mobile': [
          '✓ Affordable pricing (40-60% savings)',
          '✓ Convenient mobile service',
          '✓ Often visits underserved areas',
          '✗ Limited services and hours',
          '✗ Less facility amenities',
          '✗ May not handle complications'
        ],
        'private-practice': [
          '✓ Full-service veterinary care',
          '✓ Established relationship with vet',
          '✓ Comprehensive pre-op evaluation',
          '✓ Personalized aftercare support',
          '✗ Higher cost',
          '✗ May require separate visits'
        ],
        'specialty-clinic': [
          '✓ Advanced equipment and expertise',
          '✓ Best for high-risk cases',
          '✓ 24/7 emergency support',
          '✓ Board-certified specialists',
          '✗ Most expensive option (2-4x cost)',
          '✗ May be unnecessary for routine cases'
        ]
      };

      return {
        clinicType: getClinicTypeName(type),
        estimatedCost: cost,
        prosAndCons: prosAndCons[type]
      };
    });
  };

  const generateProcedureComparison = (): ProcedureComparisonItem[] => {
    const baseGenderCost = baseCosts[inputs.petType][inputs.gender];
    const clinicMultiplier = clinicMultipliers[inputs.clinicType];
    const regionalMultiplier = regionalMultipliers[inputs.state] || 1.0;
    const areaMultiplier = areaTypeAdjustments[inputs.areaType];
    const weightAdjustment = weightAdjustments[inputs.weightCategory];

    const traditionalCost = (baseGenderCost + weightAdjustment) * clinicMultiplier * regionalMultiplier * areaMultiplier;
    const laparoscopicCost = traditionalCost + laparoscopicPremium;

    return [
      {
        procedureType: 'Traditional Spay',
        cost: traditionalCost,
        painReduction: 'Baseline',
        recoveryTime: '10-14 days',
        benefits: [
          'Well-established procedure',
          'Most affordable option',
          'Available at all veterinary clinics',
          'Removes both ovaries and uterus',
          'Proven safe and effective'
        ]
      },
      {
        procedureType: 'Laparoscopic Spay',
        cost: laparoscopicCost,
        painReduction: '65% less pain',
        recoveryTime: '3-5 days',
        benefits: [
          '65% reduction in post-operative pain',
          'Smaller incisions (1-2 inches vs 3-5 inches)',
          'Faster recovery (3-5 days vs 10-14 days)',
          'Reduced risk of complications',
          'Magnified view for precision',
          'Less bleeding and trauma',
          'Especially beneficial for larger dogs'
        ]
      }
    ];
  };

  const resetCalculator = () => {
    setInputs({
      petType: 'dog',
      gender: 'female',
      weightCategory: '10-25',
      ageInMonths: '6',
      state: 'National Average',
      areaType: 'suburban',
      clinicType: 'private-practice',
      isPregnantOrInHeat: false,
      isCryptorchid: false,
      isBrachycephalic: false,
      isObese: false,
      procedureType: 'traditional',
      includePreOpBloodwork: false,
      includeIVFluids: false,
      includePainMedication: true,
      includeECollar: true,
      includeMicrochip: false,
      includeAntibiotics: false,
      includePostOpExam: false,
      hasWellnessPlan: false,
      wellnessPlanReimbursement: '150',
      numberOfPets: '1',
      calculationMode: 'comprehensive',
      showRegionalComparison: false,
      showRecoveryComparison: false
    });
    setResult(null);
    setShowModal(false);
  };

  const faqItems: FAQItem[] = [
    {
      question: "Why does spaying cost more than neutering?",
      answer: "Spaying is generally more expensive than neutering, typically costing $10-200 more, because it's a more complex surgical procedure. While neutering involves removing the testicles through a small external incision, spaying requires internal abdominal surgery to remove the ovaries and often the uterus. This involves a larger incision, more surgical time, increased complexity, and greater anesthesia requirements. The procedure requires the veterinarian to work inside the abdominal cavity, identify and ligate blood vessels, and ensure proper closure of multiple tissue layers. This increased complexity translates to higher costs for surgical time, anesthesia monitoring, and post-operative care requirements."
    },
    {
      question: "How much does it cost to spay a dog?",
      answer: "The cost to spay a dog varies widely from $250 to $2,000 depending on multiple factors. The national average is approximately $455, with a typical range of $361-829. Low-cost nonprofit clinics charge $50-150, mobile clinics charge $100-250, private veterinary practices charge $200-600, and specialty clinics may charge $500-2,000 or more. Costs increase with dog size (larger dogs cost $20-75 more), age (senior dogs require bloodwork adding $60-100), special conditions (pregnancy adds $15-150, obesity adds $40), geographic location (urban areas and states like California cost 20-30% more), and procedure type (laparoscopic spay adds $200-250 but offers 65% less pain and faster recovery). Additional services like pain medication ($10-20), e-collar ($10-15), microchip ($15-20), and IV fluids ($45) are often extra."
    },
    {
      question: "How much does it cost to neuter a dog?",
      answer: "Neutering a dog typically costs $250-885, with a national average of $487. The cost depends on several factors: clinic type (low-cost nonprofit clinics charge $50-150, while private practices charge $200-600), dog size (larger dogs cost $20-75 more due to increased anesthesia and surgical complexity), age (senior dogs over 7 years require pre-operative bloodwork adding $60-100), geographic location (costs are 20-30% higher in urban areas and states like California and New York), and special conditions (cryptorchidism, where one or both testicles haven't descended, adds $50-199 due to increased surgical difficulty; brachycephalic breeds like Bulldogs and Pugs incur an extra $50-200 for specialized anesthesia protocols). Additional services such as pain medication, e-collar, microchip, and post-op exam add $37-95 to the total cost. Many communities offer low-cost options and financial assistance programs to make neutering more affordable."
    },
    {
      question: "What's included in the spay/neuter cost?",
      answer: "What's included in spay/neuter costs varies significantly by clinic type and pricing structure. Basic packages typically include the surgical procedure itself, anesthesia and monitoring during surgery, a mandatory green tattoo mark (indicating the pet is spayed/neutered), and a brief post-operative recovery period. However, many additional costs may be separate: pre-operative exam and bloodwork ($60-100, often required for pets over 5-7 years), pain medication for home care ($10-20), e-collar/cone ($10-15, often required to prevent licking), IV catheter and fluids ($45), microchip ($15-20), antibiotics if needed ($10-20), and post-operative follow-up exam ($0-50). Low-cost clinics often include pain medication and e-collar in their base price as an all-inclusive package, while private practices may charge separately for each service. Always ask \"What exactly is included in your quoted price?\" when comparing costs, as a seemingly higher quote that includes pain meds, e-collar, and exam may actually be more economical than a lower base price with multiple add-ons."
    },
    {
      question: "Are low-cost clinics safe and high-quality?",
      answer: "Yes, low-cost spay/neuter clinics are safe and provide the same quality of care as private veterinary practices. These clinics are staffed by licensed veterinarians and must meet the same state licensing requirements, safety standards, and surgical protocols as private practices. The lower costs are achieved through several factors: high-volume operations that allow economies of scale, streamlined procedures focused specifically on spay/neuter surgeries (rather than full-service care), subsidies from government agencies, animal welfare organizations, or private donors, use of volunteers for non-medical tasks, and basic facility overhead compared to full-service hospitals. Low-cost clinics use the same surgical techniques, anesthesia protocols, and sterile procedures. The main differences are typically less appointment flexibility, basic facility amenities rather than luxury waiting rooms, less personalized one-on-one time with the veterinarian, and focus on routine, healthy pets rather than complicated cases. If your pet has health complications, is a high-risk breed, or is very young/old, discuss with the clinic whether they're equipped to handle your specific case or if referral to a private practice would be safer."
    },
    {
      question: "Does pet insurance cover spaying and neutering?",
      answer: "Standard pet insurance policies typically do NOT cover spaying and neutering because it's considered an elective preventive procedure rather than treatment for illness or injury. However, many pet insurance companies offer optional wellness plans (also called preventive care riders or routine care add-ons) that help cover spay/neuter costs. These wellness plans typically cost $24-50 per month and reimburse $135-150 toward spay/neuter procedures, though some companies cap reimbursement lower than the monthly premiums paid over time. Examples include: ASPCA Pet Insurance Prime wellness plan ($24.95/month) reimburses up to $150; Pets Best BestWellness plan ($26/month) reimburses up to $150; Lemonade wellness plan ($40-50/month) reimburses up to $135; and Embrace Wellness Rewards (with $300-700 annual allowance) has no sublimit for spay/neuter. You pay upfront for the procedure and submit a claim for reimbursement. To determine if a wellness plan is cost-effective, calculate: (monthly premium × 12 months) vs. spay/neuter reimbursement + other covered preventive care (vaccines, dental cleaning, wellness exams). Often, wellness plans make financial sense only if you utilize multiple covered services throughout the year."
    },
    {
      question: "How can I reduce spay/neuter costs?",
      answer: "There are numerous ways to reduce spay/neuter costs: 1) Use low-cost nonprofit clinics operated by humane societies, SPCAs, and animal welfare organizations (saves 50-75%, typically $50-150 vs $200-600); 2) Look for mobile spay/neuter clinics that visit underserved areas with reduced pricing; 3) Check for state and local voucher programs - many states offer free or subsidized spay/neuter vouchers for low-income residents (California, Massachusetts, Maryland, and others have statewide programs); 4) Contact local animal shelters and rescues, which often have lists of financial assistance programs and low-cost providers; 5) Ask about multi-pet discounts if you have multiple animals (typically 5% per additional pet); 6) Consider wellness plan coverage if you have pet insurance - it may reimburse $135-150 toward the procedure; 7) Ask about payment plans through CareCredit or veterinary practice financing; 8) Look for special events - many communities hold free or deeply discounted spay/neuter events during certain times of the year; 9) Check with veterinary schools, which often offer reduced-cost services performed by students under supervision; 10) Time the procedure appropriately - don't wait until pregnancy or heat, which adds $15-150 in complexity fees. Remember that the lowest upfront cost isn't always the best value - ensure the clinic is licensed and uses proper anesthesia protocols and pain management."
    },
    {
      question: "What is the best age to spay or neuter my pet?",
      answer: "The optimal age for spaying or neutering depends on your pet's species, size, and breed. For cats, current veterinary guidelines recommend spaying or neutering BEFORE 5 months of age (16-20 weeks). The \"Five Months Saves Lives\" campaign and scientific evidence show no medical or behavioral reasons to delay past 5 months, and early spaying prevents unwanted litters and health issues. Shelters often perform pediatric spay/neuter as early as 8 weeks. For dogs, the timing is more nuanced: Small/toy breeds (<25 lbs): 4-6 months is ideal; Medium breeds (25-50 lbs): 6-9 months; Large breeds (50-75 lbs): 9-12 months; Giant breeds (75+ lbs): 12-18 months, as they benefit from waiting for growth plate closure. Some breeds, particularly large and giant breeds, may have slightly increased risk of certain orthopedic issues if spayed/neutered very early, so many veterinarians recommend waiting until skeletal maturity. For female dogs, spaying before the first heat cycle (typically 6-9 months) reduces mammary cancer risk by 90%. Consult your veterinarian for breed-specific recommendations, as certain breeds (e.g., Golden Retrievers, German Shepherds) may benefit from different timing. Pediatric spay/neuter (6-16 weeks) is safe, with studies showing no long-term adverse effects and faster recovery than adult procedures."
    },
    {
      question: "What is pediatric spay/neuter?",
      answer: "Pediatric spay/neuter, also called early-age spay/neuter, refers to performing the surgery between 6 and 16 weeks of age (before 4 months old). This is significantly earlier than the traditional timing of 6-9 months. Pediatric spay/neuter is commonly performed by animal shelters and rescues before adoption to prevent unwanted litters and ensure every adopted pet is already sterilized. Research and 30+ years of practice have demonstrated that pediatric spay/neuter is safe and effective. Benefits include: faster surgery time (15-20 minutes vs 30-45 minutes for adults), quicker recovery (pets often resume normal activity within 24 hours), less pain and tissue trauma due to smaller size, reduced surgical complications, lower cost at some facilities, and prevention of pet overpopulation. Studies tracking cats and dogs for up to 3 years after early spaying/neutering show no adverse effects on physical development, behavior, or long-term health. The procedure uses the same surgical techniques and anesthesia protocols as adult surgeries, adjusted for the smaller size. Pediatric spay/neuter is especially recommended for cats before 5 months of age. For dogs, consult your veterinarian, as some larger breeds may benefit from waiting until skeletal maturity. Virtually all major veterinary associations, including the American Veterinary Medical Association (AVMA) and American Animal Hospital Association (AAHA), endorse pediatric spay/neuter as safe when performed by trained professionals."
    },
    {
      question: "Is it safe to spay a pregnant dog?",
      answer: "Yes, it is medically safe to spay a pregnant dog, a procedure called spay-abortion, though it is more complex and carries higher risks than spaying a non-pregnant dog. Many veterinarians and shelters perform spay-abortions to prevent unwanted litters and reduce pet overpopulation. The procedure involves removing the uterus with the developing fetuses, along with the ovaries. Risks and considerations: 1) Increased surgical complexity - the uterus is enlarged and has significantly increased blood supply, requiring more careful surgical technique; 2) Higher cost - expect to pay an additional $15-150 or more due to increased surgery time and complexity; 3) Greater bleeding risk - the uterus has much more blood flow during pregnancy; 4) Longer recovery - healing may take a few extra days; 5) Ethical considerations - discuss with your veterinarian whether spay-abortion is the right choice for your situation. The safest time to spay is before the first heat cycle. If your dog is pregnant and you're considering spay-abortion, have the procedure done as early in pregnancy as possible (ideally within the first 3-4 weeks) when risks are lower and the uterus is less enlarged. Some low-cost clinics will not perform spay-abortions or charge significantly more. If pregnancy is discovered during a planned spay surgery, you'll typically be given the option to proceed or postpone. Always discuss options, risks, timing, and costs with your veterinarian to make an informed decision."
    },
    {
      question: "What is cryptorchidism and how does it affect cost?",
      answer: "Cryptorchidism is a condition in male animals where one or both testicles fail to descend from the abdomen into the scrotum by the normal developmental timeframe (typically by 6-8 months of age in dogs). Instead, the testicle(s) remain in the abdominal cavity or inguinal canal (groin area). Cryptorchidism occurs in approximately 10% of male dogs and is less common in cats. It's often hereditary, and affected males should not be used for breeding. Cryptorchidism significantly increases the cost of neutering by $50-199 or more, with some clinics charging $375-725 depending on whether the retained testicle is inguinal (in the groin, easier to access) or abdominal (inside the body cavity, more complex surgery). The higher cost reflects increased surgical complexity, longer surgery time (may require abdominal incision to locate and remove the retained testicle), greater anesthesia requirements, and potential need for ultrasound or imaging to locate the undescended testicle. Medical importance: Cryptorchid testicles have a 10 times higher risk of developing cancer (testicular tumors) compared to normally descended testicles, and they continue producing testosterone, so the dog will still display male behaviors. Surgical removal of cryptorchid testicles is strongly recommended for health reasons. Diagnosis is typically made during a routine veterinary exam when one or both testicles cannot be felt in the scrotum. Always inform your veterinarian if your pet has cryptorchidism before scheduling neutering surgery, as specialized surgical planning may be required."
    },
    {
      question: "Why do brachycephalic breeds cost more?",
      answer: "Brachycephalic breeds (dogs and cats with short, flat faces such as Bulldogs, French Bulldogs, Pugs, Boston Terriers, Boxers, Persian cats, and Himalayan cats) typically incur an additional $50-200 fee for spay/neuter surgery due to increased anesthesia risks and specialized care requirements. These breeds have anatomical abnormalities including narrowed nostrils (stenotic nares), elongated soft palate, collapsed trachea, and narrowed airways - collectively called Brachycephalic Obstructive Airway Syndrome (BOAS). These airway abnormalities create significant anesthesia challenges: 1) Higher risk of respiratory complications during and after anesthesia; 2) Increased risk of airway obstruction when sedated; 3) Greater chance of aspiration (inhaling stomach contents), nausea, and vomiting; 4) Difficulty intubating (placing breathing tube) due to anatomical differences; 5) Need for extended monitoring during recovery until fully alert. To manage these risks, veterinarians use specialized protocols: anti-nausea medications (antiemetics) to reduce vomiting risk ($15-30), propofol or other specific anesthesia drugs, extended recovery monitoring with oxygen therapy, slower induction and recovery periods, and immediate intervention capability if breathing issues arise. Some brachycephalic dogs benefit from BOAS corrective surgery (nostril widening, soft palate resection) performed at the same time as spaying/neutering, which further increases costs but dramatically improves breathing and quality of life. The extra fees reflect additional medications, extended anesthesia time, closer monitoring, specialized equipment, and higher risk requiring experienced staff. These precautions are essential for safety - brachycephalic breeds have significantly higher anesthesia-related mortality rates without proper protocols."
    },
    {
      question: "What is laparoscopic spay and is it worth it?",
      answer: "Laparoscopic spay (also called minimally invasive spay or keyhole surgery) is an advanced surgical technique that uses small incisions (1-2 inches) and a camera to remove a dog's ovaries, rather than the traditional 3-5 inch abdominal incision. The laparoscopic technique costs $200-250 more than traditional spay but offers significant benefits: 65% reduction in post-operative pain (research-proven), faster recovery time (3-5 days vs 10-14 days), smaller incisions (one or two 1-2 inch incisions vs one 3-5 inch incision), magnified high-definition view of internal organs for increased precision, reduced bleeding and tissue trauma, lower complication rates, and less infection risk. The procedure uses specialized equipment including a high-definition camera (laparoscope), video monitor for visualization, and specialized surgical instruments inserted through small ports. Who benefits most: Larger dogs (50+ lbs) benefit significantly because traditional spays require pulling enlarged ovaries through the incision, causing considerable pain; active dogs return to normal activity much faster; and pets with lower pain tolerance. Considerations: Not all veterinarians offer laparoscopic spay - it requires specialized training and expensive equipment; very small dogs (<3 kg) may not be good candidates; and it typically only removes ovaries (ovariectomy), not the uterus, though this is medically equivalent for healthy dogs. Is it worth the extra cost? If your budget allows, yes - the pain reduction and recovery benefits are substantial. The extra $200-250 cost is offset by your pet's significantly improved comfort and the value of cutting recovery time in half. Ask your veterinarian if they offer laparoscopic spay and whether your dog is a good candidate."
    },
    {
      question: "How long does the spay/neuter procedure take?",
      answer: "The actual surgery time for spay/neuter procedures varies by procedure type, pet size, and complexity. For standard cases: neutering a dog takes 15-30 minutes, neutering a cat takes 5-15 minutes, spaying a dog takes 30-60 minutes, and spaying a cat takes 15-30 minutes. However, your pet will be at the veterinary clinic for several hours (typically 4-8 hours total) for the complete process: pre-operative exam and preparation (30-60 minutes), pre-anesthetic sedation (15-30 minutes to take effect), induction of general anesthesia and intubation (5-10 minutes), the surgical procedure itself, and post-operative recovery and monitoring (1-3 hours until awake and stable). Laparoscopic spays are often faster than traditional spays (20-40 minutes vs 30-60 minutes) despite the advanced technique. Complicating factors that increase surgery time include: cryptorchidism (undescended testicles) adds 15-45 minutes depending on location, pregnancy or heat adds 10-30 minutes, obesity increases difficulty and time, larger dogs take longer than smaller pets, senior pets may require extra monitoring time, and brachycephalic breeds need extended recovery monitoring (additional 30-60 minutes). Most clinics operate on a drop-off schedule where you bring your pet in the morning and pick them up in the late afternoon, even though the actual surgery is brief. This allows for pre-operative assessment, surgery when your pet is properly prepared, and sufficient recovery time. Some clinics offer appointment-style scheduling where you wait at the facility. Always ask about the expected timeline when scheduling your appointment."
    },
    {
      question: "What is the recovery time after spay/neuter surgery?",
      answer: "Recovery time after spay/neuter surgery varies by procedure type and individual pet. Initial recovery (pet is awake and able to go home): 2-4 hours after surgery. Return to normal behavior: Neutered males typically within 24-48 hours; spayed females typically 3-5 days. Full recovery with incision healing: Neuter: 5-7 days; traditional spay: 10-14 days; laparoscopic spay: 3-5 days. During recovery, expect: Day 1-2: Grogginess, disorientation from anesthesia, lack of appetite, reluctance to move, whimpering or discomfort. Day 3-5: Increased energy and mobility, return of appetite, attempts to lick incision (use e-collar!), gradual improvement in comfort. Day 7-10: Near-normal activity level, incision healing well, much less pain. Day 10-14: Full recovery for most pets, incision fully healed, return to completely normal activity. Activity restrictions during recovery (critical for proper healing): NO running, jumping, or rough play; NO stairs if possible (especially for spayed females); NO swimming or bathing until vet approval (typically 10-14 days); NO off-leash outdoor activity; Use leash for bathroom breaks only; Restrict play with other pets; Provide a quiet, comfortable recovery space. Pain management: Administer prescribed pain medication as directed; Most pets need pain medication for 3-5 days; Signs of pain include reluctance to move, hunched posture, whimpering, panting, or aggression when touched. E-collar use: CRITICAL - must wear 24/7 until incision heals; Prevents licking/chewing that can cause infection or dehiscence (opening of incision); Typically required for 10-14 days. When to call your veterinarian: Excessive swelling, redness, or discharge from incision; incision opening or bleeding; vomiting or diarrhea lasting more than 24 hours; refusal to eat for more than 24-48 hours; lethargy beyond day 3; or difficulty urinating or defecating."
    },
    {
      question: "What are the risks of spay/neuter surgery?",
      answer: "Spay and neuter surgeries are among the most common veterinary procedures and are generally very safe, with complication rates of less than 5% and serious complication rates under 1%. However, as with any surgery involving general anesthesia, risks exist. Anesthesia risks: Adverse reactions to anesthesia (rare but more common in brachycephalic breeds, very young pets, senior pets, and pets with heart/lung conditions); difficulty breathing or respiratory depression; cardiac complications; allergic reactions to medications. Surgical risks: Bleeding during or after surgery (more common in pets in heat, pregnant, or obese); infection at the incision site (2-3% of cases, usually treatable with antibiotics); poor wound healing or incision dehiscence (incision opening, often due to pet licking/chewing); damage to surrounding organs (extremely rare with experienced surgeons); hernias (uncommon). Post-operative complications: Swelling or bruising at incision site (usually minor and temporary); seroma formation (fluid pocket under incision, usually resolves on its own); pain or discomfort (managed with medication); lethargy or behavioral changes (typically temporary). Long-term considerations: Weight gain if caloric intake isn't adjusted (metabolism decreases by 25-30%); rare urinary incontinence in spayed females (1-5%, more common in larger dogs spayed very young); very slight increased risk of certain cancers in some large breeds when spayed/neutered very early (ongoing research, benefits typically outweigh risks). Risk factors that increase complications: Age (very young puppies/kittens under 8 weeks, or senior pets over 7 years); obesity (increases surgical difficulty and anesthesia risk); pre-existing health conditions (heart disease, kidney disease, clotting disorders); brachycephalic breeds (airway complications); pregnancy or heat (increased bleeding risk). Risk reduction: Choose an experienced veterinarian; ensure pre-operative exam and bloodwork for senior pets; follow pre-operative fasting instructions; use e-collar to prevent licking; administer pain medication as prescribed; follow all activity restrictions; and monitor incision daily. The health benefits of spaying/neutering (cancer prevention, behavioral improvements, population control) far outweigh the risks for the vast majority of pets."
    },
    {
      question: "Do I need to do anything before the surgery?",
      answer: "Yes, proper pre-operative preparation is essential for your pet's safety and successful surgery. Follow these pre-surgery requirements: Fasting: Withhold food for 12 hours before surgery (typically from midnight the night before a morning procedure); this prevents vomiting and aspiration (inhaling stomach contents) during anesthesia. Water is usually allowed until 2-3 hours before surgery (confirm with your vet). Puppies, kittens, and small pets may have shorter fasting requirements to prevent hypoglycemia (low blood sugar) - typically 6-8 hours; always follow your vet's specific instructions. Pre-operative health check: Ensure your pet is healthy and up-to-date on vaccinations (some clinics require proof); inform your vet of any recent illness, medications, or health concerns; complete any required pre-operative bloodwork (especially for senior pets 7+ years); and disclose any previous anesthetic reactions or health conditions. Scheduling and logistics: Schedule surgery for a day when you can be home to monitor your pet afterward; arrange transportation - your pet should not walk long distances after surgery; bring your pet on a leash (dogs) or in a carrier (cats); and confirm appointment time and drop-off/pick-up schedule. What to bring: Current vaccination records if required; any paperwork or forms provided by the clinic; payment or payment plan information (most clinics require payment at time of service); and your phone number for updates during the procedure. What NOT to do: Do not give any medications without veterinarian approval (some can interfere with anesthesia); do not use flea/tick treatments immediately before surgery; do not allow rough play that could cause injuries before surgery; and do not feed or give treats the morning of surgery (even if your pet begs!). Morning of surgery: Take your pet out for a bathroom break before drop-off; keep your pet calm and quiet; arrive on time for your appointment; and ask any last-minute questions. The clinic will typically: Perform a pre-anesthetic physical exam; place an IV catheter; administer pre-anesthetic sedation; and proceed with anesthesia and surgery when your pet is properly prepared."
    },
    {
      question: "How do I care for my pet after surgery?",
      answer: "Proper post-operative care is crucial for your pet's recovery and healing. Follow these comprehensive aftercare guidelines: E-collar use (MOST IMPORTANT): Keep e-collar on 24/7 for 10-14 days or until your vet confirms incision is healed; even one lick can cause infection, irritation, or incision dehiscence (opening); remove only for supervised meals if your pet cannot eat with it on. Pain medication: Administer all prescribed pain medications exactly as directed; never skip doses - staying ahead of pain aids healing; never give human pain medications (ibuprofen, acetaminophen, aspirin) as they're toxic to pets; signs your pet needs pain relief: reluctance to move, hunched posture, whimpering, hiding, or aggression when touched. Activity restrictions (10-14 days): NO running, jumping, rough play, or climbing stairs; keep your pet in a quiet, comfortable room away from other pets; use leash for bathroom breaks only (no off-leash time); NO dog parks, hiking, or vigorous exercise; prevent jumping on/off furniture - use ramps or lift your pet; limit stair use, especially for spayed females. Incision monitoring (check daily): Normal: Slight redness, mild swelling, small amount of bruising, tight stitches or surgical glue. Concerning (call vet): Excessive swelling or redness spreading from incision; discharge (yellow, green, or bloody); foul odor; incision opening or gaps in stitches; excessive bleeding; severe bruising or discoloration. Feeding and hydration: Offer small amounts of water 2-4 hours after arriving home; offer small portions of regular food that evening (¼ to ½ normal amount); if vomiting occurs, wait and try again later; return to normal feeding schedule the next day if no vomiting occurs; decreased appetite for 24 hours is normal; not eating for more than 24-48 hours requires vet call. Bathroom habits: Bathroom habits may be affected by anesthesia and pain medication; constipation is common for first 1-2 days; difficulty urinating, straining, or blood in urine requires immediate vet call; male cats should be monitored closely for urinary blockage (life-threatening emergency). Bathing and grooming: NO baths for 10-14 days until incision fully healed; no swimming; avoid wet grass if possible; spot clean only if necessary, avoiding incision area. Medications and supplements: Give all prescribed antibiotics for full course, even if pet seems better; continue pain medication for recommended duration; avoid supplements or medications not approved by your vet. Follow-up care: Attend scheduled follow-up appointment (typically 10-14 days); some clinics include follow-up exam in surgery cost; suture removal if non-dissolvable stitches were used (10-14 days); confirm when your pet can return to normal activity. Emergency signs (call vet immediately): Difficulty breathing; pale gums; excessive bleeding; vomiting or diarrhea lasting more than 24 hours; collapse or extreme lethargy; seizures; incision opening; or refusal to eat/drink for more than 24-48 hours."
    },
    {
      question: "When can my pet return to normal activity?",
      answer: "The timeline for returning to normal activity depends on the procedure type and your pet's individual healing. General timeline: Neutered males (dogs and cats): 5-7 days - incisions are small and external, healing is typically faster. Spayed females (traditional spay): 10-14 days - abdominal surgery requires more healing time. Spayed females (laparoscopic spay): 3-5 days - minimally invasive technique allows much faster recovery. Gradual return to activity: Days 1-3: Strict rest, minimal movement, leash-only bathroom breaks, no stairs if avoidable. Days 4-7: Slightly increased activity, short leashed walks (5-10 minutes), still no running/jumping/playing. Days 8-10: Moderate activity, longer walks permitted, gradual reintroduction to stairs, still no rough play. Days 10-14: Near-normal activity for neutered males and laparoscopic spay, continued restriction for traditional spay until vet clearance. After day 14 (with vet approval): Return to completely normal activity, off-leash play permitted, running and jumping allowed, dog parks and playdates with other pets okay, swimming and bathing permitted. Signs your pet is ready to increase activity: Incision is fully healed (no redness, swelling, or scabbing); pet is moving comfortably without signs of pain; eating and bathroom habits have returned to normal; energy level is back to baseline; and veterinarian has given clearance at follow-up exam. Warning signs to slow down: Favoring the surgical area; increased swelling or redness at incision; whimpering or signs of discomfort; lethargy or decreased appetite; or any changes to the incision appearance. Activity considerations by procedure type: Neutering male dogs: Most can return to normal activity around day 7, though some veterinarians recommend waiting until day 10-14 for very active dogs. Spaying female dogs (traditional): Full 14 days of restriction is critical because internal sutures need time to heal; abdominal muscles must heal completely before strenuous activity. Laparoscopic spay: Pets can often return to normal activity around day 5-7, but confirm with your veterinarian. Cats (both spay and neuter): Cats often feel good quickly and attempt to jump/climb within 2-3 days; strict confinement to a small room may be necessary to enforce activity restriction. High-energy dogs: May require crate rest or confinement to prevent overactivity; mental enrichment (puzzle toys, training, sniffing games) can help prevent boredom. Always follow your veterinarian's specific instructions and obtain clearance before returning to full activity. Pushing activity too soon risks incision dehiscence (opening), internal bleeding, or hernia formation."
    }
  ];

  return (
    <div className="w-full space-y-8">
      {/* Calculator Card */}
      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <Heart className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Spay/Neuter Cost Calculator</h1>
            <p className="text-muted-foreground mt-1">
              Estimate spay and neuter surgery costs for your pet
            </p>
          </div>
        </div>

        {/* Advanced Mode Toggle */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">
              {isAdvancedMode ? 'Advanced Mode' : 'Simple Mode'}
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
              {isAdvancedMode
                ? 'Access all calculation modes, special conditions, and comparison features'
                : 'Quick cost estimate with basic options'}
            </p>
          </div>
          <button
            onClick={() => setIsAdvancedMode(!isAdvancedMode)}
            className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors whitespace-nowrap"
          >
            {isAdvancedMode ? (
              <>
                <ChevronUp className="h-4 w-4 mr-2" />
                Switch to Simple
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-2" />
                Advanced Options
              </>
            )}
          </button>
        </div>

        {/* Calculation Mode Selection (Advanced) */}
        {isAdvancedMode && (
          <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <label className="block text-sm font-medium text-purple-900 dark:text-purple-100 mb-2">
              Calculation Mode
            </label>
            <select
              value={inputs.calculationMode}
              onChange={(e) => handleInputChange('calculationMode', e.target.value as CalculationMode)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="basic">Basic Estimator - Quick cost estimate</option>
              <option value="comprehensive">Comprehensive Calculator - All factors included</option>
              <option value="clinic-comparison">Clinic Type Comparison - Compare costs across clinics</option>
              <option value="budget-planner">Budget Planner - Include insurance & multi-pet discounts</option>
              <option value="break-even-analysis">Break-Even Analysis - Wellness plan comparison</option>
            </select>
          </div>
        )}

        {/* Basic Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Pet Type */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Pet Type
            </label>
            <select
              value={inputs.petType}
              onChange={(e) => handleInputChange('petType', e.target.value as PetType)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="dog">Dog</option>
              <option value="cat">Cat</option>
              <option value="rabbit">Rabbit</option>
            </select>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Gender
            </label>
            <select
              value={inputs.gender}
              onChange={(e) => handleInputChange('gender', e.target.value as Gender)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="female">Female (Spay)</option>
              <option value="male">Male (Neuter)</option>
            </select>
          </div>

          {/* Weight Category (Dogs only) */}
          {inputs.petType === 'dog' && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Weight Category
              </label>
              <select
                value={inputs.weightCategory}
                onChange={(e) => handleInputChange('weightCategory', e.target.value as WeightCategory)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="<10">Under 10 lbs (Toy breeds)</option>
                <option value="10-25">10-25 lbs (Small breeds)</option>
                <option value="25-50">25-50 lbs (Medium breeds)</option>
                <option value="50-75">50-75 lbs (Large breeds)</option>
                <option value="75-100">75-100 lbs (X-Large breeds)</option>
                <option value="100+">Over 100 lbs (Giant breeds)</option>
              </select>
            </div>
          )}

          {/* Age */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Age in Months
            </label>
            <input
              type="number"
              value={inputs.ageInMonths}
              onChange={(e) => handleInputChange('ageInMonths', e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="e.g., 6"
              min="1"
              max="300"
            />
          </div>

          {/* State/Region */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              State/Region
            </label>
            <select
              value={inputs.state}
              onChange={(e) => handleInputChange('state', e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="National Average">National Average (US)</option>
              <option value="California">California</option>
              <option value="New York">New York</option>
              <option value="Massachusetts">Massachusetts</option>
              <option value="Washington">Washington</option>
              <option value="Oregon">Oregon</option>
              <option value="Texas">Texas</option>
              <option value="Florida">Florida</option>
              <option value="Georgia">Georgia</option>
              <option value="Ohio">Ohio</option>
              <option value="Pennsylvania">Pennsylvania</option>
            </select>
          </div>

          {/* Area Type */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Area Type
            </label>
            <select
              value={inputs.areaType}
              onChange={(e) => handleInputChange('areaType', e.target.value as AreaType)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="urban">Urban (City)</option>
              <option value="suburban">Suburban</option>
              <option value="rural">Rural</option>
            </select>
          </div>

          {/* Clinic Type */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Clinic Type
            </label>
            <select
              value={inputs.clinicType}
              onChange={(e) => handleInputChange('clinicType', e.target.value as ClinicType)}
              className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="low-cost-nonprofit">Low-Cost Nonprofit Clinic ($)</option>
              <option value="low-cost-mobile">Low-Cost Mobile Clinic ($$)</option>
              <option value="private-practice">Private Veterinary Practice ($$$)</option>
              <option value="specialty-clinic">Specialty/Emergency Clinic ($$$$)</option>
            </select>
          </div>

          {/* Procedure Type (Female dogs only) */}
          {inputs.gender === 'female' && inputs.petType === 'dog' && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                <Stethoscope className="h-4 w-4" />
                Procedure Type
              </label>
              <select
                value={inputs.procedureType}
                onChange={(e) => handleInputChange('procedureType', e.target.value as ProcedureType)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="traditional">Traditional Spay</option>
                <option value="laparoscopic">Laparoscopic Spay (+$225, 65% less pain, 3-5 day recovery)</option>
              </select>
            </div>
          )}
        </div>

        {/* Special Conditions */}
        {isAdvancedMode && (
          <div className="mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Special Conditions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inputs.gender === 'female' && (
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inputs.isPregnantOrInHeat}
                    onChange={(e) => handleInputChange('isPregnantOrInHeat', e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-sm">Pregnant or In Heat</div>
                    <div className="text-xs text-muted-foreground">Adds $85 (increased complexity)</div>
                  </div>
                </label>
              )}

              {inputs.gender === 'male' && (
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inputs.isCryptorchid}
                    onChange={(e) => handleInputChange('isCryptorchid', e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-sm">Cryptorchid (Undescended Testicle)</div>
                    <div className="text-xs text-muted-foreground">Adds $125 (more complex surgery)</div>
                  </div>
                </label>
              )}

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inputs.isBrachycephalic}
                  onChange={(e) => handleInputChange('isBrachycephalic', e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-sm">Brachycephalic Breed</div>
                  <div className="text-xs text-muted-foreground">Adds $125 (extra anesthesia precautions)</div>
                </div>
              </label>

              {inputs.gender === 'female' && (
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={inputs.isObese}
                    onChange={(e) => handleInputChange('isObese', e.target.checked)}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-sm">Obese</div>
                    <div className="text-xs text-muted-foreground">Adds $40 (increased difficulty)</div>
                  </div>
                </label>
              )}
            </div>
          </div>
        )}

        {/* Additional Services */}
        <div className="mb-6 p-4 bg-cyan-50 dark:bg-cyan-900/20 rounded-lg border border-cyan-200 dark:border-cyan-800">
          <h3 className="font-semibold text-cyan-900 dark:text-cyan-100 mb-4">Additional Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={inputs.includePreOpBloodwork}
                onChange={(e) => handleInputChange('includePreOpBloodwork', e.target.checked)}
                className="mt-1"
              />
              <div>
                <div className="font-medium text-sm">Pre-Op Bloodwork</div>
                <div className="text-xs text-muted-foreground">$80 (required for pets 7+ years)</div>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={inputs.includeIVFluids}
                onChange={(e) => handleInputChange('includeIVFluids', e.target.checked)}
                className="mt-1"
              />
              <div>
                <div className="font-medium text-sm">IV Catheter & Fluids</div>
                <div className="text-xs text-muted-foreground">$45 (better blood pressure & recovery)</div>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={inputs.includePainMedication}
                onChange={(e) => handleInputChange('includePainMedication', e.target.checked)}
                className="mt-1"
              />
              <div>
                <div className="font-medium text-sm">Take-Home Pain Medication</div>
                <div className="text-xs text-muted-foreground">$15 (recommended for all)</div>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={inputs.includeECollar}
                onChange={(e) => handleInputChange('includeECollar', e.target.checked)}
                className="mt-1"
              />
              <div>
                <div className="font-medium text-sm">E-Collar (Cone)</div>
                <div className="text-xs text-muted-foreground">$12 (required to prevent licking)</div>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={inputs.includeMicrochip}
                onChange={(e) => handleInputChange('includeMicrochip', e.target.checked)}
                className="mt-1"
              />
              <div>
                <div className="font-medium text-sm">Microchip</div>
                <div className="text-xs text-muted-foreground">$18 (permanent ID)</div>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={inputs.includeAntibiotics}
                onChange={(e) => handleInputChange('includeAntibiotics', e.target.checked)}
                className="mt-1"
              />
              <div>
                <div className="font-medium text-sm">Antibiotics</div>
                <div className="text-xs text-muted-foreground">$15 (if infection risk)</div>
              </div>
            </label>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={inputs.includePostOpExam}
                onChange={(e) => handleInputChange('includePostOpExam', e.target.checked)}
                className="mt-1"
              />
              <div>
                <div className="font-medium text-sm">Post-Op Follow-Up Exam</div>
                <div className="text-xs text-muted-foreground">$30 (checkup after surgery)</div>
              </div>
            </label>
          </div>
        </div>

        {/* Insurance/Financial (Advanced or Budget Planner mode) */}
        {isAdvancedMode && (inputs.calculationMode === 'budget-planner' || inputs.calculationMode === 'break-even-analysis' || inputs.calculationMode === 'comprehensive') && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Insurance & Financial Planning
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inputs.hasWellnessPlan}
                  onChange={(e) => handleInputChange('hasWellnessPlan', e.target.checked)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <div className="font-medium text-sm">I Have a Pet Wellness Plan</div>
                  <div className="text-xs text-muted-foreground mb-2">Typical reimbursement: $135-150</div>
                  {inputs.hasWellnessPlan && (
                    <input
                      type="number"
                      value={inputs.wellnessPlanReimbursement}
                      onChange={(e) => handleInputChange('wellnessPlanReimbursement', e.target.value)}
                      className="w-full px-3 py-2 border border-input rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Reimbursement amount"
                      min="0"
                    />
                  )}
                </div>
              </label>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Number of Pets (Multi-Pet Discount)
                </label>
                <input
                  type="number"
                  value={inputs.numberOfPets}
                  onChange={(e) => handleInputChange('numberOfPets', e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="e.g., 1"
                  min="1"
                  max="10"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  5% discount per additional pet (up to 20%)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Comparison Options (Advanced) */}
        {isAdvancedMode && inputs.gender === 'female' && inputs.petType === 'dog' && (
          <div className="mb-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
            <h3 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-4">Comparison Options</h3>
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inputs.showRecoveryComparison}
                  onChange={(e) => handleInputChange('showRecoveryComparison', e.target.checked)}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-sm">Show Traditional vs Laparoscopic Comparison</div>
                  <div className="text-xs text-muted-foreground">Compare costs, pain reduction, and recovery times</div>
                </div>
              </label>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mt-6">
          <button
            onClick={calculateCost}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2 font-medium"
          >
            <Calculator className="h-5 w-5" />
            Calculate Cost
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

      {/* About This Calculator - Introduction Section */}
      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <div className="flex items-start gap-4 mb-6">
          <div className="flex-shrink-0">
            <div className="p-3 bg-primary/10 rounded-lg">
              <Info className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">About This Calculator</h2>
            <p className="text-muted-foreground mt-1">Comprehensive spay/neuter cost estimator for dogs, cats, and rabbits</p>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-foreground leading-relaxed">
            Calculate spay and neuter surgery costs for <strong>dogs, cats, and rabbits</strong> with the most comprehensive
            cost estimator available. Our advanced calculator considers <strong>15+ cost factors</strong> to provide highly
            accurate estimates tailored to your specific situation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <Calculator className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">5 Calculation Modes</h3>
                <p className="text-sm text-muted-foreground">
                  Basic, Comprehensive, Clinic Comparison, Budget Planner, and Break-Even Analysis
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-200 dark:border-indigo-800">
              <Building2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Clinic Comparison</h3>
                <p className="text-sm text-muted-foreground">
                  Compare costs across nonprofit, mobile, private practice, and specialty clinics
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <MapPin className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Regional Pricing</h3>
                <p className="text-sm text-muted-foreground">
                  Cost adjustments for 11 states and urban/suburban/rural areas
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg border border-pink-200 dark:border-pink-800">
              <Stethoscope className="h-5 w-5 text-pink-600 dark:text-pink-400 mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Procedure Analysis</h3>
                <p className="text-sm text-muted-foreground">
                  Traditional vs laparoscopic spay (65% less pain, 3-5 day recovery)
                </p>
              </div>
            </div>
          </div>

          <p className="text-foreground leading-relaxed">
            Get <strong>personalized recommendations</strong> based on your pet&apos;s age, size, breed, and location.
            Our calculator includes special conditions (pregnancy, cryptorchidism, brachycephalic breeds, obesity),
            additional services (bloodwork, pain medication, e-collar, microchip), insurance reimbursements, and
            multi-pet discounts. Make informed decisions about your pet&apos;s surgical care with detailed breakdowns,
            <strong>money-saving tips</strong>, and <strong>evidence-based recommendations</strong> from veterinary professionals.
          </p>
        </div>
      </div>

      {/* Results Modal */}
      {showModal && result && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-background rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="sticky top-0 bg-background border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                Cost Estimate Results
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
              {/* Total Cost */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-lg border-2 border-green-300 dark:border-green-700">
                <div className="text-center">
                  <div className="text-sm font-medium text-green-800 dark:text-green-200 mb-2">
                    Total Estimated Cost
                  </div>
                  <div className="text-5xl font-bold text-green-600 dark:text-green-400 mb-2">
                    ${result.totalEstimatedCost.toFixed(2)}
                  </div>
                  {result.outOfPocketCost < result.totalEstimatedCost && (
                    <div className="text-lg font-semibold text-green-700 dark:text-green-300">
                      Out-of-Pocket: ${result.outOfPocketCost.toFixed(2)}
                    </div>
                  )}
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Cost Breakdown
                </h4>
                <div className="space-y-2">
                  {result.costBreakdown.map((item, index) => (
                    <div key={index} className="flex justify-between items-start gap-4 py-2 border-b border-blue-100 dark:border-blue-800 last:border-0">
                      <div className="flex-1">
                        <div className="font-medium text-sm">{item.item}</div>
                        <div className="text-xs text-muted-foreground">{item.notes}</div>
                      </div>
                      <div className={cn(
                        "font-semibold whitespace-nowrap",
                        item.cost < 0 ? "text-green-600 dark:text-green-400" : ""
                      )}>
                        {item.cost < 0 ? '-' : ''}${Math.abs(item.cost).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Clinic Comparison */}
              {result.clinicComparison && result.clinicComparison.length > 0 && (
                <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
                  <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Clinic Type Comparison
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.clinicComparison.map((clinic, index) => (
                      <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-purple-100 dark:border-purple-800">
                        <div className="font-semibold mb-2">{clinic.clinicType}</div>
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-3">
                          ${clinic.estimatedCost.toFixed(2)}
                        </div>
                        <div className="space-y-1 text-xs">
                          {clinic.prosAndCons.map((item, i) => (
                            <div key={i} className={cn(
                              item.startsWith('✓') ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'
                            )}>
                              {item}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Procedure Comparison */}
              {result.procedureComparison && result.procedureComparison.length > 0 && (
                <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-lg border border-amber-200 dark:border-amber-800">
                  <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-4 flex items-center gap-2">
                    <Stethoscope className="h-5 w-5" />
                    Procedure Comparison
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {result.procedureComparison.map((proc, index) => (
                      <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-amber-100 dark:border-amber-800">
                        <div className="font-semibold mb-2">{proc.procedureType}</div>
                        <div className="text-2xl font-bold text-amber-600 dark:text-amber-400 mb-2">
                          ${proc.cost.toFixed(2)}
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                          <div>
                            <div className="text-xs text-muted-foreground">Pain Reduction</div>
                            <div className="font-medium">{proc.painReduction}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Recovery</div>
                            <div className="font-medium">{proc.recoveryTime}</div>
                          </div>
                        </div>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          {proc.benefits.map((benefit, i) => (
                            <div key={i}>• {benefit}</div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {result.recommendations.length > 0 && (
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5" />
                    Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {result.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Warnings */}
              {result.warningsAndConsiderations.length > 0 && (
                <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h4 className="font-semibold text-orange-900 dark:text-orange-100 mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Important Considerations
                  </h4>
                  <ul className="space-y-2">
                    {result.warningsAndConsiderations.map((warning, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                        <span>{warning}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Age Recommendation */}
              <div className="bg-cyan-50 dark:bg-cyan-900/20 p-4 rounded-lg border border-cyan-200 dark:border-cyan-800">
                <div className="flex items-start gap-2">
                  <Calendar className="h-5 w-5 text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium text-cyan-900 dark:text-cyan-100 mb-1">Age Recommendation</div>
                    <div className="text-sm text-cyan-800 dark:text-cyan-200">{result.ageRecommendation}</div>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg border border-indigo-200 dark:border-indigo-800">
                <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-4">Next Steps</h4>
                <ol className="space-y-2 list-decimal list-inside">
                  {result.nextSteps.map((step, index) => (
                    <li key={index} className="text-sm text-indigo-800 dark:text-indigo-200">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FAQ Section */}
      <div className="bg-background border rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
        <FAQAccordion faqs={faqItems} />
      </div>

      {/* Review Section */}
      <div className="bg-background border rounded-xl p-6 sm:p-8">
        <CalculatorReview calculatorName="Spay/Neuter Cost Calculator" />
      </div>
    </div>
  );
};

export default AdvancedSpayNeuterCalculator;

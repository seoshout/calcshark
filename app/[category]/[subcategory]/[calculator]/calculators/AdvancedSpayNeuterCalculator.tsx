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
            <h2 className="text-2xl font-bold text-foreground">Spay/Neuter Cost Calculator</h2>
            <p className="text-muted-foreground">Estimate spay and neuter surgery costs for your pet</p>
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

        <div className="prose prose-sm max-w-none">
          <p className="text-base text-foreground leading-relaxed mb-4">
            Calculate spay and neuter surgery costs for <strong>dogs, cats, and rabbits</strong> with the most comprehensive
            cost estimator available. Our advanced calculator considers <strong>15+ cost factors</strong> to provide highly
            accurate estimates tailored to your specific situation.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
            <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                  <Calculator className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="font-semibold text-foreground">5 Calculation Modes</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Basic, Comprehensive, Clinic Comparison, Budget Planner, and Break-Even Analysis modes
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-indigo-200 dark:border-indigo-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center">
                  <Building2 className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="font-semibold text-foreground">Clinic Type Comparison</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Compare costs across nonprofit, mobile, private practice, and specialty clinics
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-foreground">Regional Pricing</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Accurate cost adjustments for 11 states and urban/suburban/rural areas
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-pink-200 dark:border-pink-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 bg-pink-100 dark:bg-pink-900/50 rounded-lg flex items-center justify-center">
                  <Stethoscope className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                </div>
                <h3 className="font-semibold text-foreground">Procedure Comparison</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Traditional vs laparoscopic spay analysis (65% less pain, 3-5 day recovery)
              </p>
            </div>
          </div>

          <p className="text-base text-foreground leading-relaxed">
            Get <strong>personalized recommendations</strong> based on your pet&apos;s age, size, breed, and location.
            Our calculator includes special conditions (pregnancy, cryptorchidism, brachycephalic breeds, obesity),
            additional services (bloodwork, pain medication, e-collar, microchip), insurance reimbursements, and
            multi-pet discounts. Make informed decisions about your pet&apos;s surgical care with detailed breakdowns,
            <strong>money-saving tips</strong>, and <strong>evidence-based recommendations</strong> from veterinary professionals.
          </p>

          <div className="flex flex-wrap gap-2 mt-6">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
              <CheckCircle className="h-3 w-3" />
              15+ Cost Factors
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
              <CheckCircle className="h-3 w-3" />
              Clinic Comparison
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
              <CheckCircle className="h-3 w-3" />
              Insurance Integration
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-300 rounded-full text-xs font-medium">
              <CheckCircle className="h-3 w-3" />
              18 Comprehensive FAQs
            </span>
          </div>
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

      {/* Full Results Section (below calculator) */}
      {result && (
        <div ref={resultsRef} className="bg-background border-2 border-green-500 rounded-xl p-6 shadow-sm">
          <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-500" />
            Your Spay/Neuter Cost Estimate
          </h2>

          {/* Same content as modal */}
          <div className="space-y-6">
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
                <div className="mt-4 text-sm text-muted-foreground">
                  National Average for {getPetTypeLabel(inputs.petType)} {inputs.gender === 'male' ? 'Neuter' : 'Spay'}: ${result.nationalAverageCost.toFixed(2)}
                </div>
              </div>
            </div>

            {/* Cost Breakdown */}
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Detailed Cost Breakdown
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
                  Compare Costs Across Clinic Types
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
                <div className="mt-4 text-sm text-muted-foreground">
                  💡 <strong>Tip:</strong> Low-cost clinics offer the same safety standards as private practices at 50-75% lower cost
                </div>
              </div>
            )}

            {/* Procedure Comparison */}
            {result.procedureComparison && result.procedureComparison.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-lg border border-amber-200 dark:border-amber-800">
                <h4 className="font-semibold text-amber-900 dark:text-amber-100 mb-4 flex items-center gap-2">
                  <Stethoscope className="h-5 w-5" />
                  Traditional vs Laparoscopic Spay Comparison
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
                          <div className="text-xs text-muted-foreground">Recovery Time</div>
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

            {/* Money-Saving Tips */}
            <div className="bg-teal-50 dark:bg-teal-900/20 p-6 rounded-lg border border-teal-200 dark:border-teal-800">
              <h4 className="font-semibold text-teal-900 dark:text-teal-100 mb-4 flex items-center gap-2">
                <TrendingDown className="h-5 w-5" />
                Money-Saving Tips
              </h4>
              <ul className="space-y-2">
                {result.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Percent className="h-4 w-4 text-teal-600 dark:text-teal-400 mt-0.5 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            {result.recommendations.length > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-4 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Personalized Recommendations
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
                  <div className="font-medium text-cyan-900 dark:text-cyan-100 mb-1">Age & Timing Recommendation</div>
                  <div className="text-sm text-cyan-800 dark:text-cyan-200">{result.ageRecommendation}</div>
                </div>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-6 rounded-lg border border-indigo-200 dark:border-indigo-800">
              <h4 className="font-semibold text-indigo-900 dark:text-indigo-100 mb-4">Your Next Steps</h4>
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
      )}

      {/* How to Use Section */}
      <div className="bg-background border rounded-xl p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">How to Use This Free Online Spay/Neuter Cost Calculator</h2>

        {/* Step-by-step guide */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">📋 Step-by-Step Guide</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">1️⃣ Select Your Pet Details</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Choose your <strong>pet type</strong> (dog, cat, or rabbit), <strong>gender</strong> (male/female),
                <strong> weight category</strong> (for dogs), and <strong>age in months</strong>. These basic details
                determine your baseline cost estimate. Larger dogs and older pets typically incur higher costs due to
                increased anesthesia requirements and complexity.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">2️⃣ Enter Location and Clinic Type</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Select your <strong>state</strong> (or National Average) and <strong>area type</strong> (urban/suburban/rural)
                to account for regional pricing variations. Choose your preferred <strong>clinic type</strong>: low-cost nonprofit
                (50-75% savings), low-cost mobile, private veterinary practice, or specialty clinic. Geographic location can
                affect costs by 20-30%, with California and New York being most expensive.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">3️⃣ Indicate Special Conditions (If Applicable)</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Check any special conditions that apply to your pet: <strong>pregnant/in heat</strong> (adds $85),
                <strong> cryptorchid</strong> (undescended testicle, adds $125), <strong>brachycephalic breed</strong>
                (flat-faced like Bulldogs/Pugs, adds $125 for specialized anesthesia), or <strong>obese</strong> (adds $40).
                These conditions increase surgical complexity and require additional precautions.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">4️⃣ Select Additional Services</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Choose from <strong>7 additional services</strong>: pre-op bloodwork ($80, recommended for pets 7+ years),
                IV fluids ($45), pain medication ($15, highly recommended), e-collar ($12, required), microchip ($18),
                antibiotics ($15), and post-op exam ($30). These services enhance safety and recovery but add to the total cost.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">5️⃣ Add Insurance and Multi-Pet Details (Optional)</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                If you have a <strong>pet wellness plan</strong>, enter the reimbursement amount (typically $135-150).
                If spaying/neutering <strong>multiple pets</strong>, enter the number to receive a multi-pet discount
                (5% per additional pet, up to 20% maximum). These options help calculate your final out-of-pocket cost.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">6️⃣ Calculate and Review Results</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Click <strong>"Calculate Cost"</strong> to see your comprehensive cost breakdown including base procedure cost,
                special condition fees, additional services, insurance reimbursement, multi-pet discounts, and final out-of-pocket
                cost. Results include clinic comparisons, personalized recommendations, age-based guidance, money-saving tips,
                and important warnings for your specific situation.
              </p>
            </div>
          </div>
        </div>

        {/* Results Dashboard */}
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4">📊 Your Results Dashboard</h3>
          <p className="text-sm text-green-800 dark:text-green-200 mb-4">After clicking "Calculate Cost," you'll receive:</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">💰</span>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Complete Cost Breakdown</h4>
                <p className="text-xs text-muted-foreground">Itemized costs for base procedure, special conditions, additional services, insurance reimbursement, and multi-pet discounts</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">🏥</span>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Clinic Type Comparison</h4>
                <p className="text-xs text-muted-foreground">Side-by-side cost comparison across 4 clinic types with pros/cons for each option</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">⚕️</span>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Procedure Comparison (Female Dogs)</h4>
                <p className="text-xs text-muted-foreground">Traditional vs laparoscopic spay comparison showing cost difference, pain reduction (65% less), and recovery time (3-5 days vs 10-14 days)</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">💡</span>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Personalized Recommendations & Tips</h4>
                <p className="text-xs text-muted-foreground">Age-based guidance, money-saving strategies, safety warnings, and next steps tailored to your pet's specific situation</p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Use This Calculator */}
        <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold mb-4">🎯 Why Use This Calculator?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">🔬 Most Comprehensive Calculator</h4>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>15+ cost factors vs 5-6 in other tools</li>
                <li>5 calculation modes for different needs</li>
                <li>Regional pricing for 11 states</li>
                <li>Clinic type comparison feature</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">💰 Accurate Cost Estimates</h4>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>Based on national veterinary pricing data</li>
                <li>Accounts for special conditions</li>
                <li>Includes all additional services</li>
                <li>Insurance reimbursement calculator</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">📊 Advanced Features</h4>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>Traditional vs laparoscopic comparison</li>
                <li>Multi-pet discount calculator</li>
                <li>Age-based recommendations</li>
                <li>Recovery time projections</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">🎓 Educational Resource</h4>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>18 comprehensive FAQ items</li>
                <li>Evidence-based recommendations</li>
                <li>Safety warnings for high-risk cases</li>
                <li>Money-saving tips and strategies</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Calculation Modes */}
        <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4">🔧 Advanced Features</h3>
          <div className="space-y-3">
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-2">🏥 Clinic Comparison Mode</h4>
              <p className="text-xs text-muted-foreground">
                Compare costs across low-cost nonprofit ($50-150), mobile clinics ($100-250), private practices ($200-600),
                and specialty clinics ($500-2000+) with detailed pros/cons for each option
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-2">⚕️ Procedure Comparison (Female Dogs)</h4>
              <p className="text-xs text-muted-foreground">
                Compare traditional spay (10-14 day recovery) vs laparoscopic spay (+$225, but 65% less pain and 3-5 day recovery)
                to make an informed decision about your dog's procedure
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-2">🐾 Multi-Pet Discount Calculator</h4>
              <p className="text-xs text-muted-foreground">
                Calculate savings when spaying/neutering multiple pets: 5% discount per additional pet, up to 20% maximum savings
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Understanding Spay/Neuter Costs */}
      <div className="bg-background border rounded-xl p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">Understanding Spay/Neuter Costs</h2>

        <div className="space-y-6">
          {/* Why Spaying Costs More Than Neutering */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">💰 Why Spaying Costs More Than Neutering</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
              Spaying typically costs $10-200 more than neutering because it's a more complex surgical procedure requiring
              internal abdominal surgery, while neutering involves a simpler external procedure.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">•</span>
                <p className="text-sm text-muted-foreground">
                  <strong>Spay Surgery (Ovariohysterectomy):</strong> Requires an abdominal incision to access and remove the ovaries
                  and often the uterus. The surgeon must ligate blood vessels, work inside the abdominal cavity, and close multiple
                  tissue layers. Average time: 30-90 minutes depending on pet size and complexity.
                </p>
              </div>
              <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">•</span>
                <p className="text-sm text-muted-foreground">
                  <strong>Neuter Surgery (Castration):</strong> Involves removing the testicles through a small external incision.
                  It's less invasive, requires less surgical time (15-30 minutes), less anesthesia, and has faster recovery.
                  However, cryptorchid neuters (undescended testicles) require abdominal surgery and cost as much as spays.
                </p>
              </div>
              <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">•</span>
                <p className="text-sm text-muted-foreground">
                  <strong>National Average Costs:</strong> Dog spay: $455 (range $200-600 private practice), Dog neuter: $487
                  (interestingly slightly higher due to weight-based pricing for larger male dogs), Cat spay: $322, Cat neuter: $212.
                  Low-cost clinics offer both procedures at 50-75% savings: dog spay/neuter $50-150, cat spay/neuter $30-100.
                </p>
              </div>
            </div>
          </div>

          {/* Factors That Affect Cost */}
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4">📊 Factors That Affect Spay/Neuter Costs</h3>
            <p className="text-sm text-green-800 dark:text-green-200 mb-4">
              Spay/neuter costs vary widely based on 15+ factors. Understanding these helps you budget accurately and
              identify potential savings opportunities.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-2">🐕 Pet Size & Weight</h4>
                <p className="text-xs text-muted-foreground">
                  Larger dogs require more anesthesia, longer surgical time, and more suture material. Dogs under 10 lbs:
                  -$50 discount. Dogs 25-50 lbs: +$20. Dogs 50-75 lbs: +$30. Dogs 75-100 lbs: +$50. Dogs 100+ lbs: +$75.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-2">📍 Geographic Location</h4>
                <p className="text-xs text-muted-foreground">
                  Regional cost of living affects veterinary prices. California: 1.3x national average (30% higher).
                  New York: 1.25x. Massachusetts: 1.2x. Texas: 0.9x (10% lower). Urban areas: +10% vs suburban. Rural: -15%.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-2">🏥 Clinic Type</h4>
                <p className="text-xs text-muted-foreground">
                  Low-cost nonprofit: 0.25x (75% savings). Mobile clinics: 0.35x (65% savings). Private practice: 1.0x (baseline).
                  Specialty/emergency clinics: 2.0x (double cost but best for high-risk cases).
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-2">⚠️ Special Conditions</h4>
                <p className="text-xs text-muted-foreground">
                  Pregnant/in heat: +$85 (increased bleeding risk). Cryptorchid (undescended testicle): +$125 (abdominal surgery required).
                  Brachycephalic breeds: +$125 (specialized anesthesia). Obesity: +$40 (increased difficulty).
                </p>
              </div>
            </div>
          </div>

          {/* Traditional vs Laparoscopic Spay */}
          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-4">⚕️ Traditional vs Laparoscopic Spay (Female Dogs Only)</h3>
            <p className="text-sm text-orange-800 dark:text-orange-200 mb-4">
              Laparoscopic spay is a minimally invasive alternative to traditional spay that costs $200-250 more but offers
              significant benefits in pain reduction and recovery time.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-2 border-orange-300">
                <div className="text-center mb-3">
                  <div className="text-lg font-bold text-orange-600 dark:text-orange-400">Traditional Spay</div>
                  <div className="text-2xl font-bold text-foreground">$455 avg</div>
                </div>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>3-5 inch incision</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>10-14 day recovery</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Baseline pain level</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Available at all clinics</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>✓</span>
                    <span>Most affordable option</span>
                  </li>
                </ul>
              </div>
              <div className="bg-white dark:bg-gray-800 p-4 rounded-lg border-2 border-green-400">
                <div className="text-center mb-3">
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">Laparoscopic Spay</div>
                  <div className="text-2xl font-bold text-foreground">$680 avg</div>
                  <div className="text-xs text-green-600 dark:text-green-400">+$225 premium</div>
                </div>
                <ul className="space-y-2 text-xs">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span><strong>1-2 small incisions</strong> (keyhole surgery)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span><strong>3-5 day recovery</strong> (66% faster)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span><strong>65% less pain</strong> than traditional</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Magnified view for precision</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">✓</span>
                    <span>Less bleeding and trauma</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
              <h4 className="font-medium text-sm mb-2">💡 Is Laparoscopic Worth It?</h4>
              <p className="text-xs text-muted-foreground">
                Studies show laparoscopic spay results in 65% less post-operative pain, allows pets to return to normal activity
                in 3-5 days instead of 10-14 days, and has lower complication rates. The $225 premium is especially worthwhile
                for larger dogs, active dogs, or owners who want the fastest, most comfortable recovery for their pet. However,
                traditional spay remains safe, effective, and more affordable.
              </p>
            </div>
          </div>

          {/* Age Recommendations */}
          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4">📅 Age Recommendations for Spaying/Neutering</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm text-purple-900 dark:text-purple-100 mb-3">🐱 Cats</h4>
                <div className="space-y-2">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg text-xs">
                    <strong>Ideal Age: 4-5 months</strong>
                    <p className="text-muted-foreground mt-1">
                      Cats should be spayed/neutered before their first heat cycle (typically 5-6 months). Early-age spay/neuter
                      (as young as 8 weeks) is safe and reduces overpopulation. The American Veterinary Medical Association recommends
                      5 months as the optimal age.
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-sm text-purple-900 dark:text-purple-100 mb-3">🐕 Dogs</h4>
                <div className="space-y-2">
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg text-xs">
                    <strong>Small Breeds (&lt;25 lbs): 4-6 months</strong>
                    <p className="text-muted-foreground mt-1">
                      Small and toy breeds mature faster and can be safely spayed/neutered at 4-6 months.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg text-xs">
                    <strong>Medium/Large Breeds (25-75 lbs): 6-9 months</strong>
                    <p className="text-muted-foreground mt-1">
                      Medium to large breeds benefit from waiting until 6-9 months for optimal bone development.
                    </p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 p-3 rounded-lg text-xs">
                    <strong>Giant Breeds (100+ lbs): 12-18 months</strong>
                    <p className="text-muted-foreground mt-1">
                      Giant breeds like Great Danes should wait until 12-18 months for full skeletal maturity. Consult your vet.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Insurance and Financial Assistance */}
          <div className="bg-cyan-50 dark:bg-cyan-900/20 p-6 rounded-lg border border-cyan-200 dark:border-cyan-800">
            <h3 className="text-xl font-semibold text-cyan-900 dark:text-cyan-100 mb-4">💳 Insurance & Financial Assistance Options</h3>
            <p className="text-sm text-cyan-800 dark:text-cyan-200 mb-4">
              Several financial options can help reduce your out-of-pocket costs for spaying/neutering.
            </p>
            <div className="space-y-3">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-2">🛡️ Pet Wellness Plans</h4>
                <p className="text-xs text-muted-foreground">
                  Many pet insurance companies offer optional wellness plans that reimburse $135-150 toward spay/neuter procedures.
                  Companies like Pumpkin, Spot, Lemonade, and Healthy Paws offer these add-on plans for $24-50/month. While wellness
                  plans don't fully cover the procedure, they help offset costs.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-2">🎟️ State/Local Spay/Neuter Voucher Programs</h4>
                <p className="text-xs text-muted-foreground">
                  Most states offer free or low-cost spay/neuter vouchers for low-income residents. These vouchers can cover the full
                  cost or reduce it to $0-50. Check with your state's humane society, ASPCA chapter, or animal control office.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-2">🏦 CareCredit & Payment Plans</h4>
                <p className="text-xs text-muted-foreground">
                  CareCredit is a healthcare credit card that offers 0% APR financing for 6-24 months for veterinary procedures.
                  Many private veterinary practices also offer in-house payment plans allowing you to pay over 3-12 months.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-2">🐾 Multi-Pet Discounts</h4>
                <p className="text-xs text-muted-foreground">
                  If you're spaying/neutering multiple pets, many clinics offer discounts of 5-20%. Our calculator automatically
                  calculates your multi-pet savings: 5% per additional pet up to 20% maximum.
                </p>
              </div>
            </div>
          </div>

          {/* Health Benefits of Spaying/Neutering */}
          <div className="bg-pink-50 dark:bg-pink-900/20 p-6 rounded-lg border border-pink-200 dark:border-pink-800">
            <h3 className="text-xl font-semibold text-pink-900 dark:text-pink-100 mb-4">❤️ Health Benefits of Spaying/Neutering</h3>
            <p className="text-sm text-pink-800 dark:text-pink-200 mb-4">
              Spaying and neutering provide significant health and behavioral benefits that extend your pet's lifespan and
              improve quality of life.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm mb-3">🐕 Spaying Benefits (Females)</h4>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span><strong>90% reduction in mammary cancer</strong> risk when spayed before first heat</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span><strong>Eliminates risk of pyometra</strong> (life-threatening uterine infection affecting 25% of unspayed dogs by age 10)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span><strong>Prevents uterine and ovarian cancers</strong></span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>No heat cycles (no bleeding, no unwanted attention from males)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>Prevents unplanned pregnancies and helps reduce pet overpopulation</span>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-3">🐈 Neutering Benefits (Males)</h4>
                <ul className="space-y-2 text-xs text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span><strong>Eliminates testicular cancer</strong> risk</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span><strong>Reduces prostate problems</strong> by 90% (prostatitis, enlargement)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span><strong>Reduces aggression and fighting</strong> by 60-70%</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span><strong>Decreases roaming behavior</strong> (reduces risk of being hit by cars or getting lost)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span><strong>Reduces marking/spraying</strong> behavior by 50-60% in dogs, 90% in cats</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Reference Table */}
      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-foreground mb-4">Quick Reference: Average Spay/Neuter Costs</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-semibold text-foreground">Pet Type</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Procedure</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">National Average</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Low-Cost Clinic</th>
                <th className="text-left py-3 px-4 font-semibold text-foreground">Private Practice</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Dog</td>
                <td className="py-3 px-4 text-muted-foreground">Spay (Female)</td>
                <td className="py-3 px-4">$455</td>
                <td className="py-3 px-4 text-green-600">$50-150</td>
                <td className="py-3 px-4">$200-600</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Dog</td>
                <td className="py-3 px-4 text-muted-foreground">Neuter (Male)</td>
                <td className="py-3 px-4">$487</td>
                <td className="py-3 px-4 text-green-600">$50-150</td>
                <td className="py-3 px-4">$200-600</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Cat</td>
                <td className="py-3 px-4 text-muted-foreground">Spay (Female)</td>
                <td className="py-3 px-4">$322</td>
                <td className="py-3 px-4 text-green-600">$50-100</td>
                <td className="py-3 px-4">$150-400</td>
              </tr>
              <tr className="border-b hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Cat</td>
                <td className="py-3 px-4 text-muted-foreground">Neuter (Male)</td>
                <td className="py-3 px-4">$212</td>
                <td className="py-3 px-4 text-green-600">$30-80</td>
                <td className="py-3 px-4">$100-300</td>
              </tr>
              <tr className="hover:bg-muted/50">
                <td className="py-3 px-4 font-medium">Rabbit</td>
                <td className="py-3 px-4 text-muted-foreground">Spay/Neuter</td>
                <td className="py-3 px-4">$150-200</td>
                <td className="py-3 px-4 text-green-600">$75-150</td>
                <td className="py-3 px-4">$150-400</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 text-xs text-muted-foreground">
          * Costs vary by location, pet size, age, and clinic type. Additional services (bloodwork, pain medication, e-collar) are extra.
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-background border rounded-xl p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
        <FAQAccordion faqs={faqItems} />
      </div>

      {/* Review Section */}
      <div className="bg-background border rounded-xl p-6">
        <CalculatorReview calculatorName="Spay/Neuter Cost Calculator" />
      </div>
    </div>
  );
};

export default AdvancedSpayNeuterCalculator;

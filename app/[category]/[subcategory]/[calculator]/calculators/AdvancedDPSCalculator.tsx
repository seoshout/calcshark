'use client';

import React, { useState } from 'react';
import { Info, AlertTriangle, X, Check, Zap, Target, TrendingUp, Calculator as CalcIcon, Users, ChevronDown, ChevronUp, RefreshCw, Clock, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import FAQAccordion, { FAQItem } from '@/components/ui/faq-accordion';
import CalculatorReview from '@/components/ui/calculator-review';

type WeaponType = 'automatic' | 'semi-auto' | 'burst' | 'melee';

interface DPSInputs {
  // Basic Damage
  baseDamage: string;
  attackSpeed: string;

  // Weapon Specifics
  weaponType: WeaponType;
  magazineSize: string;
  reloadTime: string;
  burstSize: string;

  // Critical Hits
  critChance: string;
  critMultiplier: string;

  // Modifiers
  damageBonus: string;
  armorPenetration: string;
  targetArmor: string;

  // Advanced Options
  buffDuration: string;
  debuffDuration: string;
}

interface DPSResults {
  // Basic DPS
  burstDPS: number;
  sustainedDPS: number;
  effectiveDPS: number;

  // Detailed Breakdown
  damagePerHit: number;
  critAverageDamage: number;
  hitsPerSecond: number;

  // Sustained Calculations
  shotsBeforeReload: number;
  timeToEmptyMag: number;
  totalCycleTime: number;

  // Advanced Metrics
  damagePerMagazine: number;
  timeToKill: number;
  armorReduction: number;

  // Comparisons
  burstVsSustained: number;
  effectivenessRating: string;
  recommendations: string[];
}

export default function AdvancedDPSCalculator() {
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [inputs, setInputs] = useState<DPSInputs>({
    baseDamage: '',
    attackSpeed: '',
    weaponType: 'automatic',
    magazineSize: '',
    reloadTime: '',
    burstSize: '3',
    critChance: '5',
    critMultiplier: '2',
    damageBonus: '0',
    armorPenetration: '0',
    targetArmor: '0',
    buffDuration: '',
    debuffDuration: ''
  });
  const [results, setResults] = useState<DPSResults | null>(null);

  const calculateDPS = () => {
    const baseDamage = parseFloat(inputs.baseDamage) || 0;
    const attackSpeed = parseFloat(inputs.attackSpeed) || 0;
    const magazineSize = parseInt(inputs.magazineSize) || 30;
    const reloadTime = parseFloat(inputs.reloadTime) || 2;
    const critChance = parseFloat(inputs.critChance) / 100 || 0;
    const critMultiplier = parseFloat(inputs.critMultiplier) || 2;
    const damageBonus = parseFloat(inputs.damageBonus) / 100 || 0;
    const armorPenetration = parseFloat(inputs.armorPenetration) / 100 || 0;
    const targetArmor = parseFloat(inputs.targetArmor) / 100 || 0;
    const weaponType = inputs.weaponType;

    if (!baseDamage || !attackSpeed) {
      alert('Please enter base damage and attack speed');
      return;
    }

    // Calculate damage per hit with bonuses
    const baseDamageWithBonus = baseDamage * (1 + damageBonus);

    // Calculate critical hit average damage
    // Formula: Base × (1 + CritRate × (CritMultiplier - 1))
    const critAverageDamage = baseDamageWithBonus * (1 + (critChance * (critMultiplier - 1)));

    // Calculate armor reduction
    const effectiveArmor = Math.max(0, targetArmor - armorPenetration);
    const armorReduction = effectiveArmor;
    const damageAfterArmor = critAverageDamage * (1 - armorReduction);

    // Calculate hits per second
    const hitsPerSecond = attackSpeed;

    // Burst DPS (no reload consideration)
    const burstDPS = damageAfterArmor * hitsPerSecond;

    // Sustained DPS (with reload)
    const timeToEmptyMag = magazineSize / hitsPerSecond;
    const totalCycleTime = timeToEmptyMag + reloadTime;
    const damagePerMagazine = damageAfterArmor * magazineSize;
    const sustainedDPS = damagePerMagazine / totalCycleTime;

    // Effective DPS (weighted average for typical engagement)
    // Assumes 70% of combat time is sustained, 30% is burst
    const effectiveDPS = (burstDPS * 0.3) + (sustainedDPS * 0.7);

    // Time to kill (assuming 1000 HP target)
    const timeToKill = 1000 / effectiveDPS;

    // Burst vs Sustained difference
    const burstVsSustained = ((burstDPS - sustainedDPS) / sustainedDPS) * 100;

    // Effectiveness rating
    let effectivenessRating = 'Average';
    if (effectiveDPS > 500) effectivenessRating = 'Excellent';
    else if (effectiveDPS > 300) effectivenessRating = 'Good';
    else if (effectiveDPS < 150) effectivenessRating = 'Poor';

    // Generate recommendations
    const recommendations: string[] = [];

    if (critChance < 0.15) {
      recommendations.push('Consider increasing critical hit chance above 15% for optimal DPS');
    }
    if (critChance > 0.5 && critMultiplier < 2.5) {
      recommendations.push('Your high crit chance would benefit from higher crit multiplier');
    }
    if (reloadTime > 3) {
      recommendations.push('Reload time is high - consider reload speed mods or perks');
    }
    if (burstVsSustained > 50) {
      recommendations.push('Large gap between burst and sustained DPS - magazine size or reload speed improvements recommended');
    }
    if (armorReduction > 0.3) {
      recommendations.push('Target has significant armor - prioritize armor penetration');
    }
    if (magazineSize < 20 && weaponType === 'automatic') {
      recommendations.push('Small magazine for automatic weapon - frequent reloads will reduce DPS');
    }

    if (recommendations.length === 0) {
      recommendations.push('Build is well-optimized for consistent damage output');
    }

    const calculatedResults: DPSResults = {
      burstDPS: Math.round(burstDPS),
      sustainedDPS: Math.round(sustainedDPS),
      effectiveDPS: Math.round(effectiveDPS),
      damagePerHit: Math.round(damageAfterArmor * 10) / 10,
      critAverageDamage: Math.round(critAverageDamage * 10) / 10,
      hitsPerSecond: Math.round(hitsPerSecond * 100) / 100,
      shotsBeforeReload: magazineSize,
      timeToEmptyMag: Math.round(timeToEmptyMag * 10) / 10,
      totalCycleTime: Math.round(totalCycleTime * 10) / 10,
      damagePerMagazine: Math.round(damagePerMagazine),
      timeToKill: Math.round(timeToKill * 10) / 10,
      armorReduction: Math.round(armorReduction * 100),
      burstVsSustained: Math.round(burstVsSustained * 10) / 10,
      effectivenessRating,
      recommendations
    };

    setResults(calculatedResults);
    setShowModal(true);
  };

  const resetCalculator = () => {
    setInputs({
      baseDamage: '',
      attackSpeed: '',
      weaponType: 'automatic',
      magazineSize: '',
      reloadTime: '',
      burstSize: '3',
      critChance: '5',
      critMultiplier: '2',
      damageBonus: '0',
      armorPenetration: '0',
      targetArmor: '0',
      buffDuration: '',
      debuffDuration: ''
    });
    setResults(null);
    setShowModal(false);
  };

  const faqs: FAQItem[] = [
    {
      question: "What is DPS and why does it matter in games?",
      answer: "DPS (Damage Per Second) measures how much damage a weapon or character deals over time. It's crucial for comparing weapons, optimizing builds, and understanding combat effectiveness. Higher DPS means faster enemy elimination and better performance in sustained fights.",
      category: "General"
    },
    {
      question: "What's the difference between burst DPS and sustained DPS?",
      answer: "Burst DPS is the maximum damage output while actively firing without reloading. Sustained DPS accounts for reload time and magazine capacity, representing real-world damage over extended combat. Sustained DPS is typically 20-50% lower than burst DPS depending on magazine size and reload speed.",
      category: "General"
    },
    {
      question: "How do critical hits affect DPS calculations?",
      answer: "Critical hits are calculated using the formula: Base Damage × (1 + Crit Rate × (Crit Multiplier - 1)). For example, with 25% crit chance and 2× crit multiplier, you get a 25% overall damage increase. Higher crit chance and multiplier dramatically increase average DPS.",
      category: "Advanced"
    },
    {
      question: "Should I prioritize attack speed or base damage?",
      answer: "It depends on game mechanics. Generally, they have equal impact on DPS (damage × speed = DPS), but attack speed may trigger more on-hit effects while high base damage works better against armored targets. For most games, balanced stats outperform extreme specialization.",
      category: "Advanced"
    },
    {
      question: "How does armor affect my effective DPS?",
      answer: "Armor reduces damage by a percentage. If an enemy has 30% armor and you have 0% armor penetration, your effective DPS is reduced by 30%. Armor penetration directly counters this - 20% armor penetration against 30% armor results in only 10% damage reduction.",
      category: "Advanced"
    },
    {
      question: "Why is reload time important for DPS?",
      answer: "Reload time creates downtime where you deal zero damage. A weapon dealing 500 damage per second with 3 seconds of shooting and 2 seconds reload has actual DPS of 300 (1500 damage ÷ 5 seconds). Faster reloads or larger magazines significantly improve sustained DPS.",
      category: "General"
    },
    {
      question: "What's considered good DPS in most RPG games?",
      answer: "This varies by game, but generally: 100-200 DPS is entry-level, 300-500 DPS is competitive mid-game, and 800+ DPS is high-end endgame performance. Always compare within the same game system, as scaling varies dramatically between titles.",
      category: "General"
    },
    {
      question: "How do damage bonuses stack in DPS calculations?",
      answer: "Most games use additive stacking for similar bonus types (e.g., +10% damage and +15% damage = +25% total) and multiplicative stacking for different types (e.g., base damage × (1 + damage bonus) × (1 + crit damage)). Check your game's mechanics for specific interactions.",
      category: "Advanced"
    },
    {
      question: "What's the optimal crit chance to crit damage ratio?",
      answer: "The theoretical optimal ratio depends on costs, but generally 1:3 to 1:4 works well (e.g., 25% crit chance with 200% crit damage). Diminishing returns occur above 50% crit chance unless crit damage scales proportionally. Balance both stats rather than maximizing one.",
      category: "Advanced"
    },
    {
      question: "Can I use this calculator for any game?",
      answer: "Yes - the core DPS formulas (damage × attack speed, crit calculations, sustained DPS with reload) are universal across RPGs, shooters, and MOBAs. However, game-specific mechanics like combo multipliers, elemental damage, or ability rotations aren't included. Use this for weapon and basic build DPS comparisons.",
      category: "General"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="text-center space-y-4 py-8">
        <div className="flex items-center justify-center gap-3">
          <Zap className="h-10 w-10 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            DPS Calculator
          </h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          Calculate damage per second with precision for any weapon or character build. Includes burst DPS, sustained DPS, critical hit calculations, and armor penetration analysis
        </p>
      </div>

      {/* Calculator Card */}
      <div className="bg-background border rounded-xl p-6 space-y-6">

        {/* Mode Toggle */}
        <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">
              {isAdvancedMode ? 'Advanced Mode' : 'Simple Mode'}
            </h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
              {isAdvancedMode ? 'Comprehensive analysis with critical hits, armor, and sustained DPS calculations' : 'Quick burst DPS calculation with essential inputs only'}
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

        {/* Essential Inputs */}
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Target className="h-5 w-5 mr-2 text-primary" />
            Essential Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Base Damage (per hit)
                <span className="text-destructive ml-1">*</span>
              </label>
              <input
                type="number"
                value={inputs.baseDamage}
                onChange={(e) => setInputs({ ...inputs, baseDamage: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="e.g., 50"
                step="0.1"
              />
              <p className="text-xs text-muted-foreground mt-1">Damage dealt per single hit/attack</p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Attack Speed (attacks per second)
                <span className="text-destructive ml-1">*</span>
              </label>
              <input
                type="number"
                value={inputs.attackSpeed}
                onChange={(e) => setInputs({ ...inputs, attackSpeed: e.target.value })}
                className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="e.g., 2.5"
                step="0.1"
              />
              <p className="text-xs text-muted-foreground mt-1">How many attacks per second</p>
            </div>
          </div>
        </div>

        {/* Advanced Mode Options */}
        {isAdvancedMode && (
          <>
            {/* Weapon Configuration */}
            <div className="border-t pt-6 space-y-4">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-primary" />
                Weapon Configuration
              </h3>

              <div>
                <label className="block text-sm font-medium mb-2">Weapon Type</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {['automatic', 'semi-auto', 'burst', 'melee'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setInputs({ ...inputs, weaponType: type as WeaponType })}
                      className={cn(
                        "p-2 sm:p-3 rounded-lg border-2 transition-all text-center",
                        inputs.weaponType === type
                          ? "border-primary bg-primary/5"
                          : "border-border hover:border-primary/50"
                      )}
                    >
                      <div className="font-medium text-xs sm:text-sm truncate capitalize">{type}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Magazine Size</label>
                  <input
                    type="number"
                    value={inputs.magazineSize}
                    onChange={(e) => setInputs({ ...inputs, magazineSize: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="e.g., 30"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Shots before reload</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Reload Time (seconds)</label>
                  <input
                    type="number"
                    value={inputs.reloadTime}
                    onChange={(e) => setInputs({ ...inputs, reloadTime: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="e.g., 2.0"
                    step="0.1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Time to fully reload</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Damage Bonus (%)</label>
                  <input
                    type="number"
                    value={inputs.damageBonus}
                    onChange={(e) => setInputs({ ...inputs, damageBonus: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="e.g., 15"
                  />
                  <p className="text-xs text-muted-foreground mt-1">From mods/perks</p>
                </div>
              </div>
            </div>

            {/* Critical Hit Configuration */}
            <div className="border-t pt-6 space-y-4">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                Critical Hit Configuration
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Critical Hit Chance (%)</label>
                  <input
                    type="number"
                    value={inputs.critChance}
                    onChange={(e) => setInputs({ ...inputs, critChance: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="e.g., 25"
                    min="0"
                    max="100"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Probability of critical hit (0-100%)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Critical Damage Multiplier</label>
                  <input
                    type="number"
                    value={inputs.critMultiplier}
                    onChange={(e) => setInputs({ ...inputs, critMultiplier: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="e.g., 2.0"
                    step="0.1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Crit damage multiplier (e.g., 2.0 = 200%)</p>
                </div>
              </div>
            </div>

            {/* Armor & Penetration */}
            <div className="border-t pt-6 space-y-4">
              <h3 className="text-xl font-semibold mb-4 flex items-center">
                <Shield className="h-5 w-5 mr-2 text-primary" />
                Armor & Penetration
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Target Armor (%)</label>
                  <input
                    type="number"
                    value={inputs.targetArmor}
                    onChange={(e) => setInputs({ ...inputs, targetArmor: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="e.g., 30"
                    min="0"
                    max="100"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Enemy armor damage reduction</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Armor Penetration (%)</label>
                  <input
                    type="number"
                    value={inputs.armorPenetration}
                    onChange={(e) => setInputs({ ...inputs, armorPenetration: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    placeholder="e.g., 15"
                    min="0"
                    max="100"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Your armor penetration stat</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Calculate Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
          <button
            onClick={calculateDPS}
            className="flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <CalcIcon className="h-4 w-4 mr-2" />
            Calculate DPS
          </button>

          <button
            onClick={resetCalculator}
            className="flex items-center justify-center px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors font-medium"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </button>
        </div>
      </div>

      {/* Results Modal */}
      {showModal && results && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-background border rounded-xl max-w-3xl w-full my-8 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-background border-b p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Zap className="h-6 w-6 text-primary" />
                DPS Analysis Results
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Primary DPS Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Zap className="h-6 w-6 text-green-600 dark:text-green-400" />
                    <h4 className="text-lg font-bold text-green-900 dark:text-green-100">
                      Burst DPS
                    </h4>
                  </div>
                  <p className="text-3xl font-bold text-green-700 dark:text-green-300">
                    {results.burstDPS.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">Maximum damage output</p>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    <h4 className="text-lg font-bold text-blue-900 dark:text-blue-100">
                      Sustained DPS
                    </h4>
                  </div>
                  <p className="text-3xl font-bold text-blue-700 dark:text-blue-300">
                    {results.sustainedDPS.toLocaleString()}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">With reload time</p>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
                  <div className="flex items-center gap-3 mb-2">
                    <Target className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    <h4 className="text-lg font-bold text-purple-900 dark:text-purple-100">
                      Effective DPS
                    </h4>
                  </div>
                  <p className="text-3xl font-bold text-purple-700 dark:text-purple-300">
                    {results.effectiveDPS.toLocaleString()}
                  </p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Real-world average</p>
                </div>
              </div>

              {/* Detailed Breakdown */}
              <div className="bg-muted/30 p-6 rounded-lg">
                <h4 className="font-bold text-lg mb-4">Detailed Breakdown</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">Damage per Hit:</span>
                    <p className="font-semibold">{results.damagePerHit}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">With Crits Avg:</span>
                    <p className="font-semibold">{results.critAverageDamage}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Hits per Second:</span>
                    <p className="font-semibold">{results.hitsPerSecond}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Shots Before Reload:</span>
                    <p className="font-semibold">{results.shotsBeforeReload}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Time to Empty Mag:</span>
                    <p className="font-semibold">{results.timeToEmptyMag}s</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Total Cycle Time:</span>
                    <p className="font-semibold">{results.totalCycleTime}s</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Damage per Magazine:</span>
                    <p className="font-semibold">{results.damagePerMagazine.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Time to Kill (1000 HP):</span>
                    <p className="font-semibold">{results.timeToKill}s</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Armor Reduction:</span>
                    <p className="font-semibold">{results.armorReduction}%</p>
                  </div>
                </div>
              </div>

              {/* Performance Rating */}
              <div className="bg-background border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-bold text-lg">Performance Rating</h4>
                  <span className={cn(
                    "px-4 py-2 rounded-lg font-semibold",
                    results.effectivenessRating === 'Excellent' && "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300",
                    results.effectivenessRating === 'Good' && "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",
                    results.effectivenessRating === 'Average' && "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300",
                    results.effectivenessRating === 'Poor' && "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                  )}>
                    {results.effectivenessRating}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Burst vs Sustained Gap: <span className="font-semibold">{results.burstVsSustained}%</span>
                </p>
              </div>

              {/* Recommendations */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="font-bold text-lg mb-3 text-blue-900 dark:text-blue-100">
                  Optimization Recommendations
                </h4>
                <ul className="space-y-2">
                  {results.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-blue-800 dark:text-blue-200">
                      <Check className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => window.print()}
                  className="flex-1 py-3 bg-secondary text-secondary-foreground rounded-lg font-medium hover:bg-secondary/90 transition-colors"
                >
                  Print Results
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Introduction Section */}
      <div className="bg-background border rounded-xl p-6 sm:p-8 mb-6">
        <p className="text-lg text-muted-foreground leading-relaxed">
          Calculate precise damage per second (DPS) for any weapon or character build in RPGs, shooters, and MOBAs. This calculator computes burst DPS, sustained DPS with reload time, critical hit damage, armor penetration effects, and provides optimization recommendations. Get accurate DPS metrics to compare weapons, optimize builds, and maximize combat effectiveness.
        </p>
      </div>

      {/* How to Use Section */}
      <div className="bg-background border rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">How to Use This Free DPS Calculator</h2>

        {/* Step-by-step guide */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">📋 Step-by-Step Guide</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">1️⃣ Choose Your Mode</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Start with <strong>Simple Mode</strong> for quick burst DPS calculations using just base damage and attack speed.
                Switch to <strong>Advanced Mode</strong> for comprehensive analysis including sustained DPS, critical hits, armor penetration, and optimization recommendations.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">2️⃣ Enter Base Damage and Attack Speed</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Input your weapon's <strong>base damage per hit</strong> (check weapon stats or tooltips) and <strong>attack speed in attacks per second</strong>.
                For example: 50 damage per hit at 2.5 attacks/second. Some games show attack speed as a time value - convert it (1.0 second = 1 attack/second, 0.5 seconds = 2 attacks/second).
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">3️⃣ Configure Weapon Settings (Advanced Mode)</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Select <strong>weapon type</strong>, enter <strong>magazine size</strong> (shots before reload), and <strong>reload time in seconds</strong>.
                Add any <strong>damage bonus percentage</strong> from mods, perks, or buffs. These settings calculate sustained DPS by accounting for reload downtime.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">4️⃣ Set Critical Hit Parameters (Advanced Mode)</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Enter <strong>critical hit chance</strong> (0-100%) and <strong>critical damage multiplier</strong> (e.g., 2.0 for 200% crit damage).
                The calculator uses the formula: Base × (1 + Crit Rate × (Crit Multiplier - 1)) to compute average damage including crits.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">5️⃣ Add Armor Calculations (Advanced Mode)</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Input <strong>target armor percentage</strong> (enemy damage reduction) and your <strong>armor penetration</strong>.
                Effective armor is calculated as: Target Armor - Your Penetration. This shows real damage against armored enemies and helps optimize penetration stats.
              </p>
            </div>
          </div>
        </div>

        {/* Results Dashboard */}
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4">📊 Your Results Dashboard</h3>
          <p className="text-sm text-green-800 dark:text-green-200 mb-4">After clicking "Calculate DPS," you'll receive:</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="h-3 w-3 text-white dark:text-gray-900" />
              </div>
              <div>
                <p className="font-medium text-green-900 dark:text-green-100">Three DPS Metrics</p>
                <p className="text-xs text-green-700 dark:text-green-300">Burst DPS (max output), Sustained DPS (with reloads), and Effective DPS (real-world average)</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="h-3 w-3 text-white dark:text-gray-900" />
              </div>
              <div>
                <p className="font-medium text-green-900 dark:text-green-100">Detailed Breakdown</p>
                <p className="text-xs text-green-700 dark:text-green-300">Damage per hit, crit-adjusted average, hits/second, magazine metrics, and time-to-kill analysis</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="h-3 w-3 text-white dark:text-gray-900" />
              </div>
              <div>
                <p className="font-medium text-green-900 dark:text-green-100">Performance Rating</p>
                <p className="text-xs text-green-700 dark:text-green-300">Overall effectiveness rating (Excellent/Good/Average/Poor) and burst vs sustained comparison</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="h-3 w-3 text-white dark:text-gray-900" />
              </div>
              <div>
                <p className="font-medium text-green-900 dark:text-green-100">Optimization Recommendations</p>
                <p className="text-xs text-green-700 dark:text-green-300">Specific suggestions to improve DPS: crit optimization, reload improvements, armor penetration priorities</p>
              </div>
            </div>
          </div>
        </div>

        {/* Why Use This Calculator */}
        <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800 mb-6">
          <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4">🎯 Why Use This Calculator?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="font-semibold text-purple-900 dark:text-purple-100 mb-2">💰 Optimize Your Build</p>
              <p className="text-sm text-purple-800 dark:text-purple-200">
                Compare weapons and equipment objectively. Understand which stats provide the best DPS increases for your playstyle and game.
              </p>
            </div>
            <div>
              <p className="font-semibold text-purple-900 dark:text-purple-100 mb-2">🎯 Make Informed Decisions</p>
              <p className="text-sm text-purple-800 dark:text-purple-200">
                See the real impact of critical hits, attack speed, and armor penetration. Stop guessing which upgrade is better.
              </p>
            </div>
            <div>
              <p className="font-semibold text-purple-900 dark:text-purple-100 mb-2">⚡ Understand Sustained vs Burst</p>
              <p className="text-sm text-purple-800 dark:text-purple-200">
                Learn why reload time matters. Discover how magazine size affects real combat performance, not just theoretical DPS.
              </p>
            </div>
            <div>
              <p className="font-semibold text-purple-900 dark:text-purple-100 mb-2">🆓 Completely Free</p>
              <p className="text-sm text-purple-800 dark:text-purple-200">
                No registration, no subscriptions, no hidden features. Full advanced calculations available to everyone.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 mb-2">
              <Check className="h-5 w-5 text-green-600 dark:text-green-400" />
              <h3 className="font-semibold text-green-900 dark:text-green-100">100% Free</h3>
            </div>
            <p className="text-sm text-green-800 dark:text-green-200">No hidden costs or premium features</p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center gap-2 mb-2">
              <CalcIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">Universal Game Support</h3>
            </div>
            <p className="text-sm text-blue-800 dark:text-blue-200">Works for RPGs, shooters, MOBAs, and more</p>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold text-purple-900 dark:text-purple-100">No Registration</h3>
            </div>
            <p className="text-sm text-purple-800 dark:text-purple-200">Calculate anonymously, no account needed</p>
          </div>

          <div className="bg-orange-50 dark:bg-orange-900/20 p-4 rounded-lg border border-orange-200 dark:border-orange-800">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              <h3 className="font-semibold text-orange-900 dark:text-orange-100">Advanced Metrics</h3>
            </div>
            <p className="text-sm text-orange-800 dark:text-orange-200">Burst, sustained, and effective DPS calculations</p>
          </div>
        </div>

        {/* Scientific References */}
        <div className="bg-gray-50 dark:bg-gray-900/20 p-6 rounded-lg border border-gray-200 dark:border-gray-800">
          <h3 className="font-semibold text-lg mb-4">Scientific References & Methodology</h3>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-semibold mb-2">DPS Calculation Formula</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Basic Formula: Damage per Hit × Hits per Second = DPS</li>
                <li>• Critical Hit Formula: Base × (1 + Crit Rate × (Crit Multiplier - 1))</li>
                <li>• Sustained DPS: Damage per Magazine / (Time to Empty + Reload Time)</li>
                <li>• Sources: <a href="https://www.gigacalculator.com/calculators/weapon-dps-calculator.php" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">GigaCalculator DPS Methods</a>, <a href="https://calculator.academy/damage-per-second-calculator/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Calculator Academy DPS Guide</a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-background border rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
        <FAQAccordion faqs={faqs} />
      </div>

      {/* Review Section */}
      <div id="calculator-review-section">
        <CalculatorReview calculatorId="dps-calculator" calculatorName="DPS Calculator" />
      </div>
    </div>
  );
}

'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import {
  Timer,
  Gamepad2,
  Calculator,
  Zap,
  Target,
  TrendingUp,
  BarChart3,
  Flame,
  Shield,
  Star,
  Clock,
  Gauge,
  Settings,
  Download,
  Share,
  Info,
  Play,
  Pause,
  RotateCcw
} from 'lucide-react';

// Game systems and their CDR mechanics
const GAME_SYSTEMS = {
  'league-of-legends': {
    name: 'League of Legends',
    type: 'ability-haste',
    formula: 'CDR% = AH ÷ (AH + 100) × 100',
    description: 'Uses Ability Haste system with diminishing returns',
    maxReduction: 83.3,
    softCap: 500,
    color: 'from-blue-500 to-purple-600',
    icon: '🎮'
  },
  'dota-2': {
    name: 'Dota 2',
    type: 'multiplicative',
    formula: 'Final CD = Base × ∏(1 - reduction%)',
    description: 'Multiplicative stacking with no hard caps',
    maxReduction: 95,
    softCap: null,
    color: 'from-red-500 to-orange-600',
    icon: '⚔️'
  },
  'world-of-warcraft': {
    name: 'World of Warcraft',
    type: 'haste',
    formula: 'New CD = Base ÷ (1 + Haste%/100)',
    description: 'Haste reduces GCD and specific abilities',
    maxReduction: 50,
    softCap: 100,
    color: 'from-yellow-500 to-orange-500',
    icon: '🛡️'
  },
  'diablo-4': {
    name: 'Diablo 4',
    type: 'multiplicative-capped',
    formula: 'Final CD = Base × ∏(1 - CDR%) (Max 75%)',
    description: 'Multiplicative stacking with 75% hard cap',
    maxReduction: 75,
    softCap: 75,
    color: 'from-purple-600 to-red-600',
    icon: '⚡'
  },
  'path-of-exile': {
    name: 'Path of Exile',
    type: 'recovery-rate',
    formula: 'Final CD = Base ÷ (1 + Recovery%/100)',
    description: 'Uses Cooldown Recovery Rate mechanics',
    maxReduction: 90,
    softCap: null,
    color: 'from-green-500 to-blue-500',
    icon: '💎'
  },
  'final-fantasy-xiv': {
    name: 'Final Fantasy XIV',
    type: 'skill-speed',
    formula: 'Complex tier-based GCD reduction',
    description: 'Skill/Spell Speed affects GCD in tiers',
    maxReduction: 20,
    softCap: 3000,
    color: 'from-cyan-500 to-blue-600',
    icon: '🗡️'
  },
  'lost-ark': {
    name: 'Lost Ark',
    type: 'gem-based',
    formula: 'Direct percentage reduction per gem',
    description: 'Gem-based CDR with level scaling',
    maxReduction: 20,
    softCap: 20,
    color: 'from-amber-500 to-yellow-600',
    icon: '💠'
  },
  'generic': {
    name: 'Generic/Custom',
    type: 'configurable',
    formula: 'Configurable calculation method',
    description: 'Customize for any game system',
    maxReduction: 99,
    softCap: null,
    color: 'from-gray-500 to-slate-600',
    icon: '⚙️'
  }
};

// Skill types for different scenarios
const SKILL_TYPES = {
  ultimate: { name: 'Ultimate/Elite Skill', color: 'text-red-600', baseCooldown: 100 },
  major: { name: 'Major Ability', color: 'text-orange-600', baseCooldown: 20 },
  basic: { name: 'Basic Ability', color: 'text-blue-600', baseCooldown: 8 },
  defensive: { name: 'Defensive Skill', color: 'text-green-600', baseCooldown: 15 },
  utility: { name: 'Utility/Movement', color: 'text-purple-600', baseCooldown: 12 },
  custom: { name: 'Custom', color: 'text-gray-600', baseCooldown: 10 }
};

interface CDRSource {
  id: string;
  name: string;
  value: number;
  type: 'percentage' | 'flat' | 'haste' | 'ability-haste';
  enabled: boolean;
}

interface CalculationResult {
  finalCooldown: number;
  totalReduction: number;
  castsPerMinute: number;
  dpsIncrease: number;
  efficiency: number;
  warnings: string[];
}

interface Build {
  id: string;
  name: string;
  game: string;
  sources: CDRSource[];
  timestamp: number;
}

const AdvancedCooldownCalculator: React.FC = () => {
  // Core calculation state
  const [selectedGame, setSelectedGame] = useState<string>('league-of-legends');
  const [baseCooldown, setBaseCooldown] = useState<number>(10);
  const [skillType, setSkillType] = useState<string>('basic');
  const [cdrSources, setCdrSources] = useState<CDRSource[]>([
    { id: '1', name: 'Item 1', value: 0, type: 'percentage', enabled: true }
  ]);

  // Advanced features state
  const [builds, setBuilds] = useState<Build[]>([]);
  const [currentBuildName, setCurrentBuildName] = useState<string>('');

  // UI state
  const [activeTab, setActiveTab] = useState<string>('calculator');
  const [timerRunning, setTimerRunning] = useState<boolean>(false);
  const [timerTime, setTimerTime] = useState<number>(0);

  // Timer effect for real-time demonstration
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerTime(prev => prev + 0.1);
      }, 100);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  // Calculate CDR based on selected game system
  const calculateCDR = useCallback((sources: CDRSource[], gameSystem: string, baseCD: number): CalculationResult => {
    const enabledSources = sources.filter(s => s.enabled && s.value > 0);
    const system = GAME_SYSTEMS[gameSystem as keyof typeof GAME_SYSTEMS];
    let finalCooldown = baseCD;
    let totalReduction = 0;
    const warnings: string[] = [];

    switch (system.type) {
      case 'ability-haste': {
        // League of Legends Ability Haste system
        const totalAH = enabledSources
          .filter(s => s.type === 'ability-haste')
          .reduce((sum, s) => sum + s.value, 0);

        totalReduction = (totalAH / (totalAH + 100)) * 100;
        finalCooldown = baseCD * (1 - totalReduction / 100);

        if (totalAH > system.softCap!) {
          warnings.push(`Ability Haste above ${system.softCap} has severe diminishing returns`);
        }
        break;
      }

      case 'multiplicative':
      case 'multiplicative-capped': {
        // Dota 2 / Diablo 4 multiplicative stacking
        let multiplier = 1;
        enabledSources.forEach(source => {
          if (source.type === 'percentage') {
            multiplier *= (1 - source.value / 100);
          }
        });

        totalReduction = (1 - multiplier) * 100;
        if (system.type === 'multiplicative-capped' && totalReduction > system.maxReduction) {
          totalReduction = system.maxReduction;
          warnings.push(`CDR capped at ${system.maxReduction}%`);
        }

        finalCooldown = baseCD * (1 - totalReduction / 100);
        break;
      }

      case 'haste':
      case 'recovery-rate': {
        // WoW Haste / PoE Recovery Rate
        const totalHaste = enabledSources
          .filter(s => s.type === 'haste')
          .reduce((sum, s) => sum + s.value, 0);

        finalCooldown = baseCD / (1 + totalHaste / 100);
        totalReduction = (1 - finalCooldown / baseCD) * 100;
        break;
      }

      case 'skill-speed': {
        // FFXIV tier-based system (simplified)
        const totalSpeed = enabledSources
          .filter(s => s.type === 'haste')
          .reduce((sum, s) => sum + s.value, 0);

        const speedTiers = Math.floor(totalSpeed / 4);
        const gcdReduction = speedTiers * 0.01;
        finalCooldown = Math.max(baseCD - gcdReduction, baseCD * 0.8);
        totalReduction = (1 - finalCooldown / baseCD) * 100;
        break;
      }

      case 'gem-based': {
        // Lost Ark gem system
        const gemReduction = enabledSources
          .filter(s => s.type === 'percentage')
          .reduce((sum, s) => Math.min(s.value, 20), 0);

        totalReduction = Math.min(gemReduction, system.maxReduction);
        finalCooldown = baseCD * (1 - totalReduction / 100);
        break;
      }

      default: {
        // Generic/configurable system
        const percentageReduction = enabledSources
          .filter(s => s.type === 'percentage')
          .reduce((sum, s) => sum + s.value, 0);

        totalReduction = Math.min(percentageReduction, 99);
        finalCooldown = baseCD * (1 - totalReduction / 100);
        break;
      }
    }

    // Calculate derived metrics
    const castsPerMinute = finalCooldown > 0 ? 60 / finalCooldown : 0;
    const baseCastsPerMinute = 60 / baseCD;
    const dpsIncrease = ((castsPerMinute - baseCastsPerMinute) / baseCastsPerMinute) * 100;
    const efficiency = totalReduction > 0 ? (dpsIncrease / totalReduction) * 100 : 0;

    return {
      finalCooldown: Math.max(finalCooldown, 0.1),
      totalReduction,
      castsPerMinute,
      dpsIncrease,
      efficiency,
      warnings
    };
  }, []);

  // Memoized calculation results
  const results = useMemo(() => {
    return calculateCDR(cdrSources, selectedGame, baseCooldown);
  }, [calculateCDR, cdrSources, selectedGame, baseCooldown]);

  // Add new CDR source
  const addCDRSource = useCallback(() => {
    const newSource: CDRSource = {
      id: Date.now().toString(),
      name: `Source ${cdrSources.length + 1}`,
      value: 0,
      type: 'percentage',
      enabled: true
    };
    setCdrSources(prev => [...prev, newSource]);
  }, [cdrSources.length]);

  // Update CDR source
  const updateCDRSource = useCallback((id: string, field: keyof CDRSource, value: any) => {
    setCdrSources(prev => prev.map(source =>
      source.id === id ? { ...source, [field]: value } : source
    ));
  }, []);

  // Remove CDR source
  const removeCDRSource = useCallback((id: string) => {
    setCdrSources(prev => prev.filter(source => source.id !== id));
  }, []);

  // Save current build
  const saveBuild = useCallback(() => {
    if (!currentBuildName.trim()) return;

    const newBuild: Build = {
      id: Date.now().toString(),
      name: currentBuildName,
      game: selectedGame,
      sources: [...cdrSources],
      timestamp: Date.now()
    };

    setBuilds(prev => [...prev, newBuild]);
    setCurrentBuildName('');
  }, [currentBuildName, selectedGame, cdrSources]);

  // Load build
  const loadBuild = useCallback((build: Build) => {
    setSelectedGame(build.game);
    setCdrSources(build.sources);
  }, []);

  // Quick preset for skill types
  const applySkillPreset = useCallback((type: string) => {
    setSkillType(type);
    if (type !== 'custom') {
      setBaseCooldown(SKILL_TYPES[type as keyof typeof SKILL_TYPES].baseCooldown);
    }
  }, []);

  // Reset calculator
  const resetCalculator = useCallback(() => {
    setBaseCooldown(10);
    setSkillType('basic');
    setCdrSources([{ id: '1', name: 'Item 1', value: 0, type: 'percentage', enabled: true }]);
    setTimerTime(0);
    setTimerRunning(false);
  }, []);

  const gameSystem = GAME_SYSTEMS[selectedGame as keyof typeof GAME_SYSTEMS];

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <Timer className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground">
            Cooldown Reduction Calculator
          </h1>
        </div>
        <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
          The most comprehensive cooldown reduction calculator for all major games. Calculate CDR, optimize builds, and master your skill rotations.
        </p>
      </div>

      {/* Main Calculator Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          {[
            { id: 'calculator', label: 'Calculator', icon: Calculator },
            { id: 'optimizer', label: 'Optimizer', icon: TrendingUp },
            { id: 'builds', label: 'Builds', icon: Star },
            { id: 'simulator', label: 'Simulator', icon: BarChart3 }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground'
                }`}
              >
                <Icon className="h-4 w-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Input Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Game Selection */}
            <div className="bg-background border rounded-xl p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <Gamepad2 className="h-5 w-5 mr-2 text-primary" />
                Game System
              </h3>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select Game</label>
                  <select
                    value={selectedGame}
                    onChange={(e) => setSelectedGame(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {Object.entries(GAME_SYSTEMS).map(([key, game]) => (
                      <option key={key} value={key}>
                        {game.icon} {game.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className={`p-4 rounded-lg bg-gradient-to-r ${gameSystem.color} text-white`}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold">{gameSystem.name}</h3>
                    <span className="px-2 py-1 bg-white/20 rounded text-xs">{gameSystem.type}</span>
                  </div>
                  <p className="text-sm opacity-90 mb-2">{gameSystem.description}</p>
                  <p className="text-xs font-mono opacity-80">{gameSystem.formula}</p>
                </div>
              </div>
            </div>

            {/* Skill Configuration */}
            <div className="bg-background border rounded-xl p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <Target className="h-5 w-5 mr-2 text-primary" />
                Skill Configuration
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Skill Type</label>
                  <select
                    value={skillType}
                    onChange={(e) => applySkillPreset(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    {Object.entries(SKILL_TYPES).map(([key, skill]) => (
                      <option key={key} value={key}>
                        {skill.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Base Cooldown (seconds)</label>
                  <input
                    type="number"
                    value={baseCooldown}
                    onChange={(e) => setBaseCooldown(Number(e.target.value))}
                    min="0.1"
                    step="0.1"
                    className="w-full px-3 py-2 border rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* CDR Sources */}
            <div className="bg-background border rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center">
                  <Zap className="h-5 w-5 mr-2 text-primary" />
                  CDR Sources
                </h3>
                <button
                  onClick={addCDRSource}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Add Source
                </button>
              </div>

              <div className="space-y-4">
                {cdrSources.map((source) => (
                  <div key={source.id} className="flex items-center space-x-2 p-3 border rounded-lg">
                    <input
                      placeholder="Source name"
                      value={source.name}
                      onChange={(e) => updateCDRSource(source.id, 'name', e.target.value)}
                      className="flex-1 px-3 py-2 border rounded bg-background"
                    />

                    <select
                      value={source.type}
                      onChange={(e) => updateCDRSource(source.id, 'type', e.target.value as CDRSource['type'])}
                      className="w-32 px-3 py-2 border rounded bg-background"
                    >
                      <option value="percentage">% CDR</option>
                      <option value="ability-haste">AH</option>
                      <option value="haste">Haste</option>
                      <option value="flat">Flat (sec)</option>
                    </select>

                    <input
                      type="number"
                      value={source.value}
                      onChange={(e) => updateCDRSource(source.id, 'value', Number(e.target.value))}
                      className="w-20 px-3 py-2 border rounded bg-background"
                      min="0"
                      step="0.1"
                    />

                    <button
                      onClick={() => updateCDRSource(source.id, 'enabled', !source.enabled)}
                      className={`p-2 rounded ${
                        source.enabled
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {source.enabled ? <Zap className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
                    </button>

                    {cdrSources.length > 1 && (
                      <button
                        onClick={() => removeCDRSource(source.id)}
                        className="p-2 bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
                      >
                        ×
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Main Results */}
            <div className="bg-background border rounded-xl p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-primary" />
                Results
              </h3>

              <div className="space-y-4">
                <div className="text-center p-4 bg-primary/5 rounded-lg">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {results.finalCooldown.toFixed(2)}s
                  </div>
                  <div className="text-sm text-muted-foreground">Final Cooldown</div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">CDR Reduction:</span>
                    <span className="font-semibold">{results.totalReduction.toFixed(1)}%</span>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{results.totalReduction.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min((results.totalReduction / gameSystem.maxReduction) * 100, 100)}%`
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">Casts/Minute:</span>
                    <span className="font-semibold">{results.castsPerMinute.toFixed(1)}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm">DPS Increase:</span>
                    <span className={`font-semibold ${results.dpsIncrease > 0 ? 'text-green-600' : 'text-muted-foreground'}`}>
                      +{results.dpsIncrease.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {results.warnings.length > 0 && (
                  <div className="space-y-2">
                    {results.warnings.map((warning, index) => (
                      <div key={index} className="flex items-center text-sm text-orange-600 bg-orange-50 p-2 rounded">
                        <Info className="h-4 w-4 mr-2" />
                        {warning}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Visual Timer */}
            <div className="bg-background border rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  Visual Timer
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setTimerRunning(!timerRunning)}
                    className={`p-2 rounded ${
                      timerRunning
                        ? 'bg-destructive text-destructive-foreground'
                        : 'bg-primary text-primary-foreground'
                    }`}
                  >
                    {timerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => {
                      setTimerTime(0);
                      setTimerRunning(false);
                    }}
                    className="p-2 bg-muted text-muted-foreground rounded hover:bg-muted/80"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-mono">
                    {timerTime.toFixed(1)}s
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Current Time
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Base Cooldown</span>
                    <span>{baseCooldown.toFixed(1)}s</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="bg-gray-500 h-3 rounded-full transition-all duration-100"
                      style={{
                        width: `${((timerTime % baseCooldown) / baseCooldown) * 100}%`
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Reduced Cooldown</span>
                    <span>{results.finalCooldown.toFixed(1)}s</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3">
                    <div
                      className="bg-primary h-3 rounded-full transition-all duration-100"
                      style={{
                        width: `${((timerTime % results.finalCooldown) / results.finalCooldown) * 100}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-background border rounded-xl p-6">
              <h3 className="text-xl font-bold mb-6 flex items-center">
                <Settings className="h-5 w-5 mr-2 text-primary" />
                Quick Actions
              </h3>

              <div className="space-y-2">
                <button
                  onClick={resetCalculator}
                  className="w-full flex items-center justify-center px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Calculator
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
                  <Download className="h-4 w-4 mr-2" />
                  Export Results
                </button>
                <button className="w-full flex items-center justify-center px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors">
                  <Share className="h-4 w-4 mr-2" />
                  Share Build
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'optimizer' && (
        <div className="bg-background border rounded-xl p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-primary" />
            CDR Optimizer
          </h3>
          <div className="text-center py-8 text-muted-foreground">
            <Gauge className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Build Optimizer</h3>
            <p>Compare different CDR configurations and find the optimal setup for your playstyle.</p>
            <p className="text-sm mt-2 opacity-75">Feature coming soon - analyze efficiency curves and breakpoints.</p>
          </div>
        </div>
      )}

      {activeTab === 'builds' && (
        <div className="bg-background border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center">
              <Star className="h-5 w-5 mr-2 text-primary" />
              Saved Builds
            </h3>
            <div className="flex space-x-2">
              <input
                placeholder="Build name"
                value={currentBuildName}
                onChange={(e) => setCurrentBuildName(e.target.value)}
                className="px-3 py-2 border rounded-lg bg-background w-40"
              />
              <button
                onClick={saveBuild}
                disabled={!currentBuildName.trim()}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Current
              </button>
            </div>
          </div>

          {builds.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Star className="h-12 w-12 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Saved Builds</h3>
              <p>Save your current CDR configuration to quickly switch between different setups.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {builds.map((build) => (
                <div key={build.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{build.name}</h4>
                    <span className="px-2 py-1 bg-muted rounded text-xs">
                      {GAME_SYSTEMS[build.game as keyof typeof GAME_SYSTEMS]?.name}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {build.sources.filter(s => s.enabled).length} active sources
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Saved {new Date(build.timestamp).toLocaleDateString()}
                  </div>
                  <button
                    onClick={() => loadBuild(build)}
                    className="w-full px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
                  >
                    Load Build
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'simulator' && (
        <div className="bg-background border rounded-xl p-6">
          <h3 className="text-xl font-bold mb-6 flex items-center">
            <BarChart3 className="h-5 w-5 mr-2 text-primary" />
            Rotation Simulator
          </h3>
          <div className="text-center py-8 text-muted-foreground">
            <Flame className="h-12 w-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Skill Rotation Simulator</h3>
            <p>Simulate complex skill rotations and see how CDR affects your DPS over time.</p>
            <p className="text-sm mt-2 opacity-75">Feature coming soon - visual timeline and optimization suggestions.</p>
          </div>
        </div>
      )}

      {/* Game-Specific Information */}
      <div className="bg-background border rounded-xl p-6 mt-8">
        <h3 className="text-xl font-bold mb-6 flex items-center">
          <Info className="h-5 w-5 mr-2 text-primary" />
          Understanding Cooldown Reduction
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Calculation Methods</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Additive:</strong> Simple percentage addition (10% + 20% = 30%)
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Multiplicative:</strong> Stacking reductions (10% + 20% = 28%)
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Haste-based:</strong> Increases action speed instead of reducing cooldowns
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Optimization Tips</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Diminishing Returns:</strong> More CDR = less efficiency per point
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Breakpoints:</strong> Some systems have optimal CDR thresholds
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Balance:</strong> Consider CDR vs damage stats for maximum DPS
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-lg">Game-Specific Notes</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>League of Legends:</strong> Ability Haste provides linear cast frequency
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Dota 2:</strong> No hard caps, multiplicative stacking
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-pink-500 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <strong>Diablo 4:</strong> 75% hard cap, multiplicative until cap
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedCooldownCalculator;
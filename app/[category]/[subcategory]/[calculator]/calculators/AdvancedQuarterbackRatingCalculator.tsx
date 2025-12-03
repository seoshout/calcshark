'use client';

import React, { useState, useRef } from 'react';
import {
  Calculator, Activity, TrendingUp, Users, Award, Target, BarChart3, CheckCircle,
  X, ChevronDown, ChevronUp, Info, Lightbulb, Shield, Star, RefreshCw, Zap, Trophy
} from 'lucide-react';
import { cn } from '@/lib/utils';
import CalculatorReview from '@/components/ui/calculator-review';
import FAQAccordion, { FAQItem } from '@/components/ui/faq-accordion';

// Alias Activity as Football for semantic clarity
const Football = Activity;

// Type Definitions
type CalculationMode = 'basic' | 'comparison' | 'season' | 'perfect' | 'ncaa';
type RatingSystem = 'nfl' | 'ncaa';

interface PassingStats {
  attempts: string;
  completions: string;
  yards: string;
  touchdowns: string;
  interceptions: string;
}

interface NFLRatingResult {
  rating: number;
  componentA: number;
  componentB: number;
  componentC: number;
  componentD: number;
  completionPct: number;
  yardsPerAttempt: number;
  tdPct: number;
  intPct: number;
  grade: string;
  gradeColor: string;
}

interface NCAAResult {
  rating: number;
  grade: string;
  gradeColor: string;
}

interface PerfectRatingNeeds {
  minCompletions: number;
  minYards: number;
  minTouchdowns: number;
  maxInterceptions: number;
  currentRating: number;
  isAlreadyPerfect: boolean;
}

export default function AdvancedQuarterbackRatingCalculator() {
  // State Management
  const [isAdvancedMode, setIsAdvancedMode] = useState<boolean>(true);
  const [calculationMode, setCalculationMode] = useState<CalculationMode>('basic');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showModeDropdown, setShowModeDropdown] = useState<boolean>(false);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Basic Stats
  const [stats, setStats] = useState<PassingStats>({
    attempts: '30',
    completions: '20',
    yards: '250',
    touchdowns: '2',
    interceptions: '1'
  });

  // Comparison Mode - QB2
  const [stats2, setStats2] = useState<PassingStats>({
    attempts: '35',
    completions: '22',
    yards: '275',
    touchdowns: '3',
    interceptions: '0'
  });

  // Season Mode
  const [seasonGames, setSeasonGames] = useState<string>('10');
  const [totalAttempts, setTotalAttempts] = useState<string>('300');
  const [totalCompletions, setTotalCompletions] = useState<string>('200');
  const [totalYards, setTotalYards] = useState<string>('2500');
  const [totalTouchdowns, setTotalTouchdowns] = useState<string>('20');
  const [totalInterceptions, setTotalInterceptions] = useState<string>('8');

  // Results
  const [result, setResult] = useState<any>(null);

  // Helper: Calculate NFL Passer Rating
  const calculateNFLRating = (att: number, cmp: number, yds: number, td: number, int: number): NFLRatingResult => {
    // Component A: Completion Percentage
    let a = ((cmp / att) - 0.3) * 5;
    if (a < 0) a = 0;
    if (a > 2.375) a = 2.375;

    // Component B: Yards per Attempt
    let b = ((yds / att) - 3) * 0.25;
    if (b < 0) b = 0;
    if (b > 2.375) b = 2.375;

    // Component C: Touchdowns per Attempt
    let c = (td / att) * 20;
    if (c < 0) c = 0;
    if (c > 2.375) c = 2.375;

    // Component D: Interceptions per Attempt
    let d = 2.375 - ((int / att) * 25);
    if (d < 0) d = 0;
    if (d > 2.375) d = 2.375;

    // Final Rating
    const rating = ((a + b + c + d) / 6) * 100;

    // Calculate percentages
    const completionPct = (cmp / att) * 100;
    const yardsPerAttempt = yds / att;
    const tdPct = (td / att) * 100;
    const intPct = (int / att) * 100;

    // Grade
    let grade = '';
    let gradeColor = '';
    if (rating >= 158.3) {
      grade = 'Perfect';
      gradeColor = 'purple';
    } else if (rating >= 120) {
      grade = 'Elite';
      gradeColor = 'green';
    } else if (rating >= 110) {
      grade = 'Excellent';
      gradeColor = 'blue';
    } else if (rating >= 100) {
      grade = 'Very Good';
      gradeColor = 'cyan';
    } else if (rating >= 90) {
      grade = 'Above Average';
      gradeColor = 'teal';
    } else if (rating >= 80) {
      grade = 'Average';
      gradeColor = 'yellow';
    } else if (rating >= 70) {
      grade = 'Below Average';
      gradeColor = 'orange';
    } else {
      grade = 'Poor';
      gradeColor = 'red';
    }

    return {
      rating,
      componentA: a,
      componentB: b,
      componentC: c,
      componentD: d,
      completionPct,
      yardsPerAttempt,
      tdPct,
      intPct,
      grade,
      gradeColor
    };
  };

  // Helper: Calculate NCAA Rating
  const calculateNCAArating = (att: number, cmp: number, yds: number, td: number, int: number): NCAAResult => {
    const rating = ((8.4 * yds) + (330 * td) + (100 * cmp) - (200 * int)) / att;

    let grade = '';
    let gradeColor = '';
    if (rating >= 200) {
      grade = 'Elite';
      gradeColor = 'purple';
    } else if (rating >= 150) {
      grade = 'Excellent';
      gradeColor = 'green';
    } else if (rating >= 120) {
      grade = 'Very Good';
      gradeColor = 'blue';
    } else if (rating >= 100) {
      grade = 'Good';
      gradeColor = 'cyan';
    } else if (rating >= 80) {
      grade = 'Average';
      gradeColor = 'yellow';
    } else {
      grade = 'Below Average';
      gradeColor = 'orange';
    }

    return { rating, grade, gradeColor };
  };

  // Handle Calculate
  const handleCalculate = () => {
    const att = parseInt(stats.attempts);
    const cmp = parseInt(stats.completions);
    const yds = parseInt(stats.yards);
    const td = parseInt(stats.touchdowns);
    const int = parseInt(stats.interceptions);

    if (att <= 0 || cmp > att) {
      alert('Invalid input: Completions cannot exceed attempts, and attempts must be positive.');
      return;
    }

    let calculatedResult: any = {};

    switch (calculationMode) {
      case 'basic':
        calculatedResult = {
          mode: 'basic',
          nflRating: calculateNFLRating(att, cmp, yds, td, int),
          stats: { attempts: att, completions: cmp, yards: yds, touchdowns: td, interceptions: int }
        };
        break;

      case 'comparison':
        const att2 = parseInt(stats2.attempts);
        const cmp2 = parseInt(stats2.completions);
        const yds2 = parseInt(stats2.yards);
        const td2 = parseInt(stats2.touchdowns);
        const int2 = parseInt(stats2.interceptions);

        if (att2 <= 0 || cmp2 > att2) {
          alert('Invalid QB2 input: Completions cannot exceed attempts, and attempts must be positive.');
          return;
        }

        calculatedResult = {
          mode: 'comparison',
          qb1: {
            nflRating: calculateNFLRating(att, cmp, yds, td, int),
            stats: { attempts: att, completions: cmp, yards: yds, touchdowns: td, interceptions: int }
          },
          qb2: {
            nflRating: calculateNFLRating(att2, cmp2, yds2, td2, int2),
            stats: { attempts: att2, completions: cmp2, yards: yds2, touchdowns: td2, interceptions: int2 }
          }
        };
        break;

      case 'season':
        const tAtt = parseInt(totalAttempts);
        const tCmp = parseInt(totalCompletions);
        const tYds = parseInt(totalYards);
        const tTd = parseInt(totalTouchdowns);
        const tInt = parseInt(totalInterceptions);
        const games = parseInt(seasonGames);

        if (tAtt <= 0 || tCmp > tAtt) {
          alert('Invalid season input');
          return;
        }

        calculatedResult = {
          mode: 'season',
          seasonRating: calculateNFLRating(tAtt, tCmp, tYds, tTd, tInt),
          perGameStats: {
            attempts: (tAtt / games).toFixed(1),
            completions: (tCmp / games).toFixed(1),
            yards: (tYds / games).toFixed(1),
            touchdowns: (tTd / games).toFixed(1),
            interceptions: (tInt / games).toFixed(1)
          },
          totalStats: { attempts: tAtt, completions: tCmp, yards: tYds, touchdowns: tTd, interceptions: tInt },
          games
        };
        break;

      case 'perfect':
        const currentRating = calculateNFLRating(att, cmp, yds, td, int);
        const minCmp = Math.ceil(att * 0.775);
        const minYds = Math.ceil(att * 12.5);
        const minTd = Math.ceil(att * 0.11875);
        const maxInt = 0;

        calculatedResult = {
          mode: 'perfect',
          currentRating,
          perfectNeeds: {
            minCompletions: minCmp,
            minYards: minYds,
            minTouchdowns: minTd,
            maxInterceptions: maxInt,
            currentRating: currentRating.rating,
            isAlreadyPerfect: currentRating.rating >= 158.3
          },
          stats: { attempts: att, completions: cmp, yards: yds, touchdowns: td, interceptions: int }
        };
        break;

      case 'ncaa':
        const ncaaResult = calculateNCAArating(att, cmp, yds, td, int);
        calculatedResult = {
          mode: 'ncaa',
          ncaaRating: ncaaResult,
          nflRating: calculateNFLRating(att, cmp, yds, td, int),
          stats: { attempts: att, completions: cmp, yards: yds, touchdowns: td, interceptions: int }
        };
        break;
    }

    setResult(calculatedResult);
    setShowModal(true);
  };

  const handleReset = () => {
    setStats({
      attempts: '30',
      completions: '20',
      yards: '250',
      touchdowns: '2',
      interceptions: '1'
    });
    setStats2({
      attempts: '35',
      completions: '22',
      yards: '275',
      touchdowns: '3',
      interceptions: '0'
    });
    setSeasonGames('10');
    setTotalAttempts('300');
    setTotalCompletions('200');
    setTotalYards('2500');
    setTotalTouchdowns('20');
    setTotalInterceptions('8');
    setResult(null);
    setShowModal(false);
  };

  const faqItems: FAQItem[] = [
    {
      question: "How is NFL passer rating calculated?",
      answer: "NFL passer rating uses a formula with four components, each capped at 0 minimum and 2.375 maximum: A (Completion %) = ((CMP/ATT) - 0.3) × 5; B (Yards/Attempt) = ((YDS/ATT) - 3) × 0.25; C (TD %) = (TD/ATT) × 20; D (INT %) = 2.375 - ((INT/ATT) × 25). The final rating is ((A + B + C + D) / 6) × 100, creating a scale from 0 to 158.3. Each component is standardized so that 1.0 represents average performance based on league data from 1960-1970."
    },
    {
      question: "What is a perfect passer rating of 158.3?",
      answer: "A perfect passer rating of 158.3 is the highest possible rating in the NFL system. To achieve it in a single game, a quarterback must attempt at least 10 passes, complete at least 77.5% of passes, average at least 12.5 yards per attempt, have at least 11.875% of passes result in touchdowns, and throw zero interceptions. As of 2025, there have been 82 instances of perfect ratings in regular season history among 67 players. Lamar Jackson leads with four perfect games, while Ben Roethlisberger also has four. Only Nick Foles achieved a perfect rating with seven touchdown passes."
    },
    {
      question: "What's the difference between passer rating and QBR?",
      answer: "Passer rating (0-158.3 scale) only considers passing statistics: completion percentage, yards per attempt, touchdowns per attempt, and interceptions per attempt. ESPN's Total QBR (0-100 scale) accounts for all quarterback contributions including passing, rushing, sacks, fumbles, penalties, and scrambles. QBR also weighs plays by game context (score, time, field position) and difficulty, discounting garbage time and giving less credit for screen passes where receivers do the work. QBR's formula is proprietary and not publicly available, while passer rating's formula is transparent and has been used since 1973."
    },
    {
      question: "What is a good passer rating in the NFL?",
      answer: "Modern NFL passer rating benchmarks: 120+ = Elite (top QBs), 110-119 = Excellent (Pro Bowl level), 100-109 = Very Good (quality starter), 90-99 = Above Average (solid starter), 80-89 = Average (league average is now 90-95), 70-79 = Below Average (backup level), Under 70 = Poor (unacceptable). When the formula was created, 66.7 was average and 100+ was excellent, but passing has improved dramatically. In 2017 the league average was 88.6, and by 2020 it reached 93.6. Today, a rating around 95 is considered average, while 110+ represents elite quarterback play."
    },
    {
      question: "How is NCAA passer rating different from NFL?",
      answer: "NCAA uses a completely different formula called Passing Efficiency: ((8.4 × YDS) + (330 × TD) + (100 × CMP) - (200 × INT)) / ATT. The scale ranges from -731.6 to 1261.6, with 100 originally indicating average performance. NCAA rating weights touchdowns and interceptions much more heavily than the NFL formula. A 150+ NCAA rating is excellent, 120-150 is very good, 100-120 is good, and 80-100 is average. The NCAA formula is simpler and doesn't cap individual components like the NFL formula does, allowing for much higher ratings with exceptional performances."
    },
    {
      question: "Why is passer rating capped at 158.3?",
      answer: "The 158.3 maximum results from the formula's design with each of four components capped at 2.375. When you max out all four components (2.375 + 2.375 + 2.375 + 2.375 = 9.5), divide by 6 (9.5 / 6 = 1.583333), and multiply by 100, you get 158.3. The formula was designed in 1971 to make 1.0 in each component represent average performance from 1960-1970 data. The capping prevents extreme outliers: completion % caps at 77.5%, yards per attempt at 12.5, touchdown % at 11.875%, and interception % at 0%. This design creates a standardized scale for comparing quarterbacks across eras."
    },
    {
      question: "Who has the highest career passer rating in NFL history?",
      answer: "As of 2025, the career passer rating leaders (minimum 1,500 attempts) include several modern quarterbacks. Patrick Mahomes, Aaron Rodgers, and Deshaun Watson are among the top career leaders. Tom Brady, Drew Brees, and Peyton Manning are also in the top 10. Career ratings above 100 are considered elite, and only a select group of quarterbacks maintain such high ratings over their entire careers. The increasing league average means more quarterbacks achieve high career ratings today than in previous eras."
    },
    {
      question: "How many perfect passer ratings have there been in NFL history?",
      answer: "As of 2025, there have been 82 instances of perfect passer ratings (158.3) in the regular season among 67 different players. Eight players achieved the feat multiple times: Lamar Jackson (4), Ben Roethlisberger (4), Tom Brady (3), Peyton Manning (3), Kurt Warner (3), Craig Morton (2), Ken O'Brien (2), and Jared Goff (2). Only four players posted perfect ratings in the postseason: Terry Bradshaw, Dave Krieg, Peyton Manning, and Don Meredith. Tom Brady is the oldest QB to achieve a perfect rating at 43 years, 4 months old. Drew Bledsoe, Robert Griffin III, and Marcus Mariota achieved perfect ratings in their rookie seasons."
    },
    {
      question: "What stats are needed for a perfect passer rating?",
      answer: "To achieve a perfect 158.3 rating with a given number of attempts: Complete at least 77.5% of passes (e.g., 31 of 40 attempts), average at least 12.5 yards per attempt (e.g., 500 yards on 40 attempts), have at least 11.875% touchdown percentage (e.g., 5 TDs on 40 attempts), and throw zero interceptions. Minimum 10 attempts required. The requirements scale with attempts: 20 attempts needs 16 completions, 250 yards, 3 TDs, 0 INT; 30 attempts needs 24 completions, 375 yards, 4 TDs, 0 INT; 40 attempts needs 31 completions, 500 yards, 5 TDs, 0 INT."
    },
    {
      question: "Does NFL passer rating account for rushing yards?",
      answer: "No, NFL passer rating only includes passing statistics: attempts, completions, yards, touchdowns, and interceptions. Rushing yards, rushing touchdowns, scrambles, and QB runs are not included in the formula. This is a major criticism of passer rating, especially in the modern era with mobile quarterbacks like Lamar Jackson, Josh Allen, and Jalen Hurts who add significant value through rushing. ESPN's Total QBR addresses this limitation by including all rushing contributions, sacks taken, and fumbles. For a complete picture of QB performance, passer rating should be supplemented with rushing statistics."
    },
    {
      question: "Why doesn't passer rating include sacks?",
      answer: "Passer rating was created in 1971 when sacks became an official statistic (1969). The formula designers chose not to include sacks, considering them more reflective of offensive line performance than quarterback play, though this is debatable. Modern analysis shows sacks are often the QB's fault: holding the ball too long, missing open receivers, or failing to adjust protections. The exclusion of sacks is a significant flaw in passer rating. ESPN's Total QBR includes sacks, as they represent negative plays that should count against the quarterback. A QB with a high passer rating but many sacks taken may not be as effective as the rating suggests."
    },
    {
      question: "What is the lowest possible passer rating?",
      answer: "The lowest possible passer rating is 0.0, achieved when a quarterback throws all passes incomplete and has multiple interceptions. To get exactly 0.0, each component must equal zero: Component A (completion %) = 0 requires less than 30% completions; Component B (yards/attempt) = 0 requires less than 3 yards per attempt; Component C (TD %) = 0 requires zero touchdowns; Component D (INT %) = 0 requires 9.5% or more interceptions (e.g., 2+ INTs on 20 attempts). In practice, ratings below 40 are extremely rare and indicate a disastrous performance. Historical examples of ratings near zero include games with multiple interceptions, no touchdowns, and very low completion percentages."
    },
    {
      question: "How has the average NFL passer rating changed over time?",
      answer: "The average NFL passer rating has increased significantly since 1973: 1973 (formula introduced): 61.7, 1980s: mid-70s, 1990s: low 80s, 2000s: mid-80s, 2010: 85.0, 2017: 88.6, 2020: 93.6, 2023-2025: 90-95 range. The increase reflects rule changes favoring passing (illegal contact, defensive holding, roughing the passer), better QB development, improved passing schemes, more passing-friendly offenses, and better protection rules for quarterbacks. What was considered 'excellent' (100+) in 1973 is now merely 'above average.' This grade inflation means modern QBs need ratings of 110+ to be considered elite, whereas 90+ was elite in the 1970s-1980s."
    },
    {
      question: "Is passer rating a good measure of quarterback performance?",
      answer: "Passer rating has significant strengths and weaknesses. Strengths: Simple formula that's easy to calculate and understand, has been used consistently since 1973 allowing historical comparisons, correlates well with team success and winning percentage, and accounts for efficiency in passing. Weaknesses: Doesn't include rushing yards (critical for mobile QBs), ignores sacks taken, doesn't account for dropped passes or receiver performance, doesn't consider game situation or context, treats all interceptions equally regardless of depth or situation, and doesn't account for strength of schedule. It's best used alongside other metrics like completion percentage, yards per attempt, TD:INT ratio, QBR, and EPA (Expected Points Added) for a complete evaluation."
    },
    {
      question: "What is Total QBR and how is it calculated?",
      answer: "Total Quarterback Rating (QBR) is ESPN's proprietary metric on a 0-100 scale (50 = average). Unlike passer rating, QBR includes: all plays (passing, rushing, sacks, scrambles), play-by-play analysis of every game action, context weighting (score, time, field position, down & distance), difficulty adjustments, credit allocation (less credit for screen passes, more for pressured throws), fumbles and penalties, and clutch performance bonuses. The exact formula is not publicly available, making it less transparent than passer rating. QBR aims to measure total QB contribution to winning, not just passing efficiency. It typically aligns better with the 'eye test' than passer rating, but the proprietary nature and complexity make it controversial among analysts."
    },
    {
      question: "Can non-quarterbacks have passer ratings?",
      answer: "Yes, any player who attempts a forward pass receives a passer rating for those attempts. Wide receivers, running backs, and even offensive linemen who throw trick play passes get passer ratings. Notable examples include: Wide receivers on WR passes (end-arounds with throws), running backs on halfback option passes, punters and kickers on fake punts/field goals with passes, and Antwaan Randle El (former WR) has a perfect 158.3 career rating on 7 attempts with 1 TD and 0 INTs. These players often have very high ratings because they attempt passes rarely and only in favorable situations, usually wide-open receivers on trick plays. Minimum 10 attempts are needed for season/career qualification in official statistics."
    },
    {
      question: "How does completion percentage affect passer rating?",
      answer: "Completion percentage is Component A of passer rating: ((CMP/ATT) - 0.3) × 5, capped at 0-2.375. The formula makes 30% completions = 0.0 and 77.5% completions = 2.375 (maximum). Each 9.5% increase in completion rate adds 0.475 to the component. Examples: 30% = 0.0, 50% = 1.0, 60% = 1.5, 70% = 2.0, 77.5%+ = 2.375. In modern NFL, completion percentage typically ranges from 55% (poor) to 70% (excellent). A quarterback completing 65% of passes gets 1.75 in Component A, contributing 29.2 points to the final rating. High completion percentage alone cannot create a perfect rating; you need excellence in all four components simultaneously."
    },
    {
      question: "Why do interceptions hurt passer rating more than touchdowns help?",
      answer: "In the passer rating formula, interceptions and touchdowns are NOT equally weighted. Interceptions: Component D = 2.375 - ((INT/ATT) × 25). One interception per 100 attempts reduces rating by 4.17 points. Touchdowns: Component C = (TD/ATT) × 20. One touchdown per 100 attempts increases rating by 3.33 points. Therefore, interceptions hurt about 25% MORE than touchdowns help (4.17 vs 3.33 points per 100 attempts). This reflects the historical context: when the formula was created in 1971, interceptions were considered especially damaging to winning, more so than touchdowns were beneficial. Modern analysts debate whether this weighting remains appropriate given today's pass-heavy, high-scoring NFL."
    },
    {
      question: "What is the minimum number of attempts for an official passer rating?",
      answer: "For a single-game perfect rating, the minimum is 10 attempts. For season and career statistics, the minimums are: Season leaders: Must average 1 attempt per team game (17 attempts for 17-game season). Career leaders: 1,500 career attempts minimum for official recognition on NFL.com and Pro-Football-Reference.com. Rookie of the Year consideration: Typically 200-300 attempts minimum. These minimums prevent statistical flukes where a player completes 2 of 2 passes for 50 yards and a TD (perfect 158.3 rating) from being considered official. Most starting quarterbacks attempt 450-600 passes per season, far exceeding these minimums."
    }
  ];

  return (
    <div className="w-full space-y-8">
      {/* Calculator Card */}
      <div className="bg-background border rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <Football className="h-8 w-8 text-green-600 dark:text-green-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Quarterback Passer Rating Calculator</h2>
            <p className="text-muted-foreground">Calculate NFL and NCAA passer ratings with comprehensive analysis</p>
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
                ? 'Access all calculation modes, comparisons, and season analysis'
                : 'Quick passer rating calculation with basic options'}
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

        {/* Calculation Mode Selector */}
        {isAdvancedMode && (
          <div className="mb-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
            <label className="block text-sm font-medium text-purple-900 dark:text-purple-100 mb-2">
              Calculation Mode
            </label>
            <div className="relative">
              <button
                onClick={() => setShowModeDropdown(!showModeDropdown)}
                className="w-full px-4 py-3 border border-purple-300 dark:border-purple-700 rounded-lg bg-background text-foreground hover:bg-purple-100 dark:hover:bg-purple-900/30 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-colors flex items-center justify-between"
              >
                <span className="font-medium">
                  {calculationMode === 'basic' && 'Basic Calculator - Single game NFL passer rating'}
                  {calculationMode === 'comparison' && 'QB Comparison - Compare two quarterbacks side-by-side'}
                  {calculationMode === 'season' && 'Season Analyzer - Calculate season-long averages'}
                  {calculationMode === 'perfect' && 'Perfect Rating - See what\'s needed for 158.3'}
                  {calculationMode === 'ncaa' && 'NCAA Calculator - College passer efficiency rating'}
                </span>
                <ChevronDown className={cn(
                  "h-5 w-5 text-purple-600 dark:text-purple-400 transition-transform",
                  showModeDropdown && "rotate-180"
                )} />
              </button>

              {showModeDropdown && (
                <>
                  {/* Backdrop to close dropdown */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowModeDropdown(false)}
                  />

                  {/* Dropdown Menu */}
                  <div className="absolute z-20 w-full mt-2 bg-background border border-purple-300 dark:border-purple-700 rounded-lg shadow-xl overflow-hidden">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          setCalculationMode('basic');
                          setShowModeDropdown(false);
                        }}
                        className={cn(
                          "w-full px-4 py-3 text-left hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors",
                          calculationMode === 'basic' && "bg-purple-100 dark:bg-purple-900/40 font-semibold"
                        )}
                      >
                        <div className="font-medium">Basic Calculator</div>
                        <div className="text-sm text-muted-foreground">Single game NFL passer rating</div>
                      </button>

                      <button
                        onClick={() => {
                          setCalculationMode('comparison');
                          setShowModeDropdown(false);
                        }}
                        className={cn(
                          "w-full px-4 py-3 text-left hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors border-t border-purple-200 dark:border-purple-800",
                          calculationMode === 'comparison' && "bg-purple-100 dark:bg-purple-900/40 font-semibold"
                        )}
                      >
                        <div className="font-medium">QB Comparison</div>
                        <div className="text-sm text-muted-foreground">Compare two quarterbacks side-by-side</div>
                      </button>

                      <button
                        onClick={() => {
                          setCalculationMode('season');
                          setShowModeDropdown(false);
                        }}
                        className={cn(
                          "w-full px-4 py-3 text-left hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors border-t border-purple-200 dark:border-purple-800",
                          calculationMode === 'season' && "bg-purple-100 dark:bg-purple-900/40 font-semibold"
                        )}
                      >
                        <div className="font-medium">Season Analyzer</div>
                        <div className="text-sm text-muted-foreground">Calculate season-long averages</div>
                      </button>

                      <button
                        onClick={() => {
                          setCalculationMode('perfect');
                          setShowModeDropdown(false);
                        }}
                        className={cn(
                          "w-full px-4 py-3 text-left hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors border-t border-purple-200 dark:border-purple-800",
                          calculationMode === 'perfect' && "bg-purple-100 dark:bg-purple-900/40 font-semibold"
                        )}
                      >
                        <div className="font-medium">Perfect Rating</div>
                        <div className="text-sm text-muted-foreground">See what's needed for 158.3</div>
                      </button>

                      <button
                        onClick={() => {
                          setCalculationMode('ncaa');
                          setShowModeDropdown(false);
                        }}
                        className={cn(
                          "w-full px-4 py-3 text-left hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors border-t border-purple-200 dark:border-purple-800",
                          calculationMode === 'ncaa' && "bg-purple-100 dark:bg-purple-900/40 font-semibold"
                        )}
                      >
                        <div className="font-medium">NCAA Calculator</div>
                        <div className="text-sm text-muted-foreground">College passer efficiency rating</div>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Input Forms by Mode */}
        {(calculationMode === 'basic' || calculationMode === 'perfect' || calculationMode === 'ncaa') && (
          <div className="space-y-4 mb-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600 dark:text-green-400" />
              Passing Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Pass Attempts
                </label>
                <input
                  type="number"
                  value={stats.attempts}
                  onChange={(e) => setStats({ ...stats, attempts: e.target.value })}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Completions
                </label>
                <input
                  type="number"
                  value={stats.completions}
                  onChange={(e) => setStats({ ...stats, completions: e.target.value })}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Passing Yards
                </label>
                <input
                  type="number"
                  value={stats.yards}
                  onChange={(e) => setStats({ ...stats, yards: e.target.value })}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Touchdown Passes
                </label>
                <input
                  type="number"
                  value={stats.touchdowns}
                  onChange={(e) => setStats({ ...stats, touchdowns: e.target.value })}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Interceptions
                </label>
                <input
                  type="number"
                  value={stats.interceptions}
                  onChange={(e) => setStats({ ...stats, interceptions: e.target.value })}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  min="0"
                />
              </div>
            </div>
          </div>
        )}

        {calculationMode === 'comparison' && (
          <div className="space-y-6 mb-6">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                Quarterback 1
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Attempts</label>
                  <input
                    type="number"
                    value={stats.attempts}
                    onChange={(e) => setStats({ ...stats, attempts: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Completions</label>
                  <input
                    type="number"
                    value={stats.completions}
                    onChange={(e) => setStats({ ...stats, completions: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Yards</label>
                  <input
                    type="number"
                    value={stats.yards}
                    onChange={(e) => setStats({ ...stats, yards: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Touchdowns</label>
                  <input
                    type="number"
                    value={stats.touchdowns}
                    onChange={(e) => setStats({ ...stats, touchdowns: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Interceptions</label>
                  <input
                    type="number"
                    value={stats.interceptions}
                    onChange={(e) => setStats({ ...stats, interceptions: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Quarterback 2
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Attempts</label>
                  <input
                    type="number"
                    value={stats2.attempts}
                    onChange={(e) => setStats2({ ...stats2, attempts: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    min="1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Completions</label>
                  <input
                    type="number"
                    value={stats2.completions}
                    onChange={(e) => setStats2({ ...stats2, completions: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Yards</label>
                  <input
                    type="number"
                    value={stats2.yards}
                    onChange={(e) => setStats2({ ...stats2, yards: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Touchdowns</label>
                  <input
                    type="number"
                    value={stats2.touchdowns}
                    onChange={(e) => setStats2({ ...stats2, touchdowns: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    min="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Interceptions</label>
                  <input
                    type="number"
                    value={stats2.interceptions}
                    onChange={(e) => setStats2({ ...stats2, interceptions: e.target.value })}
                    className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {calculationMode === 'season' && (
          <div className="space-y-4 mb-6 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              Season Statistics
            </h3>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Number of Games Played
              </label>
              <input
                type="number"
                value={seasonGames}
                onChange={(e) => setSeasonGames(e.target.value)}
                className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                min="1"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Total Attempts</label>
                <input
                  type="number"
                  value={totalAttempts}
                  onChange={(e) => setTotalAttempts(e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Total Completions</label>
                <input
                  type="number"
                  value={totalCompletions}
                  onChange={(e) => setTotalCompletions(e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Total Yards</label>
                <input
                  type="number"
                  value={totalYards}
                  onChange={(e) => setTotalYards(e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Total Touchdowns</label>
                <input
                  type="number"
                  value={totalTouchdowns}
                  onChange={(e) => setTotalTouchdowns(e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  min="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Total Interceptions</label>
                <input
                  type="number"
                  value={totalInterceptions}
                  onChange={(e) => setTotalInterceptions(e.target.value)}
                  className="w-full px-4 py-2 border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  min="0"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleCalculate}
            className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium gap-2"
          >
            <Calculator className="h-5 w-5" />
            Calculate Rating
          </button>
          <button
            onClick={handleReset}
            className="inline-flex items-center justify-center px-6 py-3 border border-border rounded-lg hover:bg-accent transition-colors font-medium gap-2"
          >
            <RefreshCw className="h-5 w-5" />
            Reset
          </button>
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
                Passer Rating Results
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
              {result.mode === 'basic' && (
                <>
                  <div className={`bg-gradient-to-r from-${result.nflRating.gradeColor}-50 to-${result.nflRating.gradeColor}-100 dark:from-${result.nflRating.gradeColor}-900/20 dark:to-${result.nflRating.gradeColor}-800/20 p-6 rounded-lg border-2 border-${result.nflRating.gradeColor}-300 dark:border-${result.nflRating.gradeColor}-700`}>
                    <div className="text-center">
                      <div className="text-sm font-medium text-muted-foreground mb-2">NFL Passer Rating</div>
                      <div className="text-5xl font-bold text-foreground mb-2">
                        {result.nflRating.rating.toFixed(1)}
                      </div>
                      <div className={`text-lg font-semibold text-${result.nflRating.gradeColor}-600 dark:text-${result.nflRating.gradeColor}-400`}>
                        {result.nflRating.grade}
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-4">Rating Components</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Completion %</p>
                        <p className="text-lg font-bold">{result.nflRating.componentA.toFixed(3)}</p>
                        <p className="text-xs text-muted-foreground">{result.nflRating.completionPct.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Yards/Attempt</p>
                        <p className="text-lg font-bold">{result.nflRating.componentB.toFixed(3)}</p>
                        <p className="text-xs text-muted-foreground">{result.nflRating.yardsPerAttempt.toFixed(1)} Y/A</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">TD %</p>
                        <p className="text-lg font-bold">{result.nflRating.componentC.toFixed(3)}</p>
                        <p className="text-xs text-muted-foreground">{result.nflRating.tdPct.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">INT %</p>
                        <p className="text-lg font-bold">{result.nflRating.componentD.toFixed(3)}</p>
                        <p className="text-xs text-muted-foreground">{result.nflRating.intPct.toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Game Statistics</h4>
                    <p className="text-sm">
                      {result.stats.completions}/{result.stats.attempts} ({result.nflRating.completionPct.toFixed(1)}%), {result.stats.yards} yards, {result.stats.touchdowns} TD, {result.stats.interceptions} INT
                    </p>
                  </div>
                </>
              )}

              {result.mode === 'comparison' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border-2 border-blue-300 dark:border-blue-700`}>
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-4">Quarterback 1</h4>
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold text-foreground">{result.qb1.nflRating.rating.toFixed(1)}</div>
                      <div className={`text-sm font-semibold text-${result.qb1.nflRating.gradeColor}-600`}>{result.qb1.nflRating.grade}</div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p>CMP/ATT: {result.qb1.stats.completions}/{result.qb1.stats.attempts} ({result.qb1.nflRating.completionPct.toFixed(1)}%)</p>
                      <p>Yards: {result.qb1.stats.yards} ({result.qb1.nflRating.yardsPerAttempt.toFixed(1)} Y/A)</p>
                      <p>TD: {result.qb1.stats.touchdowns} ({result.qb1.nflRating.tdPct.toFixed(1)}%)</p>
                      <p>INT: {result.qb1.stats.interceptions} ({result.qb1.nflRating.intPct.toFixed(1)}%)</p>
                    </div>
                  </div>

                  <div className={`bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border-2 border-purple-300 dark:border-purple-700`}>
                    <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-4">Quarterback 2</h4>
                    <div className="text-center mb-4">
                      <div className="text-4xl font-bold text-foreground">{result.qb2.nflRating.rating.toFixed(1)}</div>
                      <div className={`text-sm font-semibold text-${result.qb2.nflRating.gradeColor}-600`}>{result.qb2.nflRating.grade}</div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p>CMP/ATT: {result.qb2.stats.completions}/{result.qb2.stats.attempts} ({result.qb2.nflRating.completionPct.toFixed(1)}%)</p>
                      <p>Yards: {result.qb2.stats.yards} ({result.qb2.nflRating.yardsPerAttempt.toFixed(1)} Y/A)</p>
                      <p>TD: {result.qb2.stats.touchdowns} ({result.qb2.nflRating.tdPct.toFixed(1)}%)</p>
                      <p>INT: {result.qb2.stats.interceptions} ({result.qb2.nflRating.intPct.toFixed(1)}%)</p>
                    </div>
                  </div>

                  <div className="md:col-span-2 bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">Winner</h4>
                    <p className="text-lg">
                      {result.qb1.nflRating.rating > result.qb2.nflRating.rating
                        ? `QB1 has a higher rating by ${(result.qb1.nflRating.rating - result.qb2.nflRating.rating).toFixed(1)} points`
                        : result.qb2.nflRating.rating > result.qb1.nflRating.rating
                        ? `QB2 has a higher rating by ${(result.qb2.nflRating.rating - result.qb1.nflRating.rating).toFixed(1)} points`
                        : 'Both quarterbacks have identical ratings'}
                    </p>
                  </div>
                </div>
              )}

              {result.mode === 'season' && (
                <>
                  <div className={`bg-gradient-to-r from-${result.seasonRating.gradeColor}-50 to-${result.seasonRating.gradeColor}-100 dark:from-${result.seasonRating.gradeColor}-900/20 dark:to-${result.seasonRating.gradeColor}-800/20 p-6 rounded-lg border-2 border-${result.seasonRating.gradeColor}-300 dark:border-${result.seasonRating.gradeColor}-700`}>
                    <div className="text-center">
                      <div className="text-sm font-medium text-muted-foreground mb-2">Season Passer Rating</div>
                      <div className="text-5xl font-bold text-foreground mb-2">
                        {result.seasonRating.rating.toFixed(1)}
                      </div>
                      <div className={`text-lg font-semibold text-${result.seasonRating.gradeColor}-600 dark:text-${result.seasonRating.gradeColor}-400`}>
                        {result.seasonRating.grade}
                      </div>
                      <div className="text-sm text-muted-foreground mt-2">{result.games} Games Played</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-3">Season Totals</h4>
                      <div className="space-y-2 text-sm">
                        <p>Attempts: {result.totalStats.attempts}</p>
                        <p>Completions: {result.totalStats.completions} ({result.seasonRating.completionPct.toFixed(1)}%)</p>
                        <p>Yards: {result.totalStats.yards}</p>
                        <p>Touchdowns: {result.totalStats.touchdowns}</p>
                        <p>Interceptions: {result.totalStats.interceptions}</p>
                      </div>
                    </div>

                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 dark:text-green-100 mb-3">Per Game Averages</h4>
                      <div className="space-y-2 text-sm">
                        <p>Attempts: {result.perGameStats.attempts}</p>
                        <p>Completions: {result.perGameStats.completions}</p>
                        <p>Yards: {result.perGameStats.yards}</p>
                        <p>Touchdowns: {result.perGameStats.touchdowns}</p>
                        <p>Interceptions: {result.perGameStats.interceptions}</p>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {result.mode === 'perfect' && (
                <>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-lg border-2 border-purple-300 dark:border-purple-700">
                    <div className="text-center">
                      <div className="text-sm font-medium text-muted-foreground mb-2">Perfect Rating Requirements</div>
                      <div className="text-5xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                        158.3
                      </div>
                      <div className="text-lg font-semibold text-purple-700 dark:text-purple-300">
                        {result.perfectNeeds.isAlreadyPerfect ? '🎉 Already Perfect!' : 'Target Rating'}
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-4">Current Performance</h4>
                    <div className="space-y-2">
                      <p className="text-sm">Current Rating: <span className="font-bold">{result.perfectNeeds.currentRating.toFixed(1)}</span> ({result.currentRating.grade})</p>
                      <p className="text-sm">Attempts: {result.stats.attempts} | Completions: {result.stats.completions} | Yards: {result.stats.yards}</p>
                      <p className="text-sm">Touchdowns: {result.stats.touchdowns} | Interceptions: {result.stats.interceptions}</p>
                    </div>
                  </div>

                  <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                    <h4 className="font-semibold text-green-900 dark:text-green-100 mb-4">
                      What's Needed for 158.3 with {result.stats.attempts} Attempts
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Minimum {result.perfectNeeds.minCompletions} completions (77.5%)</p>
                          <p className="text-sm text-muted-foreground">Current: {result.stats.completions} ({result.currentRating.completionPct.toFixed(1)}%)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Minimum {result.perfectNeeds.minYards} yards (12.5 Y/A)</p>
                          <p className="text-sm text-muted-foreground">Current: {result.stats.yards} yards ({result.currentRating.yardsPerAttempt.toFixed(1)} Y/A)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Minimum {result.perfectNeeds.minTouchdowns} touchdowns (11.875%)</p>
                          <p className="text-sm text-muted-foreground">Current: {result.stats.touchdowns} TDs ({result.currentRating.tdPct.toFixed(1)}%)</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Maximum 0 interceptions</p>
                          <p className="text-sm text-muted-foreground">Current: {result.stats.interceptions} INTs</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {result.mode === 'ncaa' && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={`bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-lg border-2 border-orange-300 dark:border-orange-700`}>
                      <div className="text-center">
                        <div className="text-sm font-medium text-muted-foreground mb-2">NCAA Passer Rating</div>
                        <div className="text-5xl font-bold text-foreground mb-2">
                          {result.ncaaRating.rating.toFixed(1)}
                        </div>
                        <div className={`text-lg font-semibold text-${result.ncaaRating.gradeColor}-600 dark:text-${result.ncaaRating.gradeColor}-400`}>
                          {result.ncaaRating.grade}
                        </div>
                      </div>
                    </div>

                    <div className={`bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 p-6 rounded-lg border-2 border-blue-300 dark:border-blue-700`}>
                      <div className="text-center">
                        <div className="text-sm font-medium text-muted-foreground mb-2">NFL Passer Rating</div>
                        <div className="text-5xl font-bold text-foreground mb-2">
                          {result.nflRating.rating.toFixed(1)}
                        </div>
                        <div className={`text-lg font-semibold text-${result.nflRating.gradeColor}-600 dark:text-${result.nflRating.gradeColor}-400`}>
                          {result.nflRating.grade}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold mb-2">Game Statistics</h4>
                    <p className="text-sm">
                      {result.stats.completions}/{result.stats.attempts} ({result.nflRating.completionPct.toFixed(1)}%), {result.stats.yards} yards, {result.stats.touchdowns} TD, {result.stats.interceptions} INT
                    </p>
                  </div>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-2">Formula Difference</h4>
                    <p className="text-sm text-muted-foreground">
                      NCAA uses a different formula that weights touchdowns and interceptions more heavily: ((8.4 × YDS) + (330 × TD) + (100 × CMP) - (200 × INT)) / ATT. This typically produces higher ratings than NFL formula.
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* How to Use Section */}
      <div className="bg-background border rounded-xl p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">How to Use This Free Quarterback Passer Rating Calculator</h2>

        {/* Step-by-step guide */}
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800 mb-6">
          <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">📋 Step-by-Step Guide</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">1️⃣ Select Calculation Mode</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Choose from <strong>5 calculation modes</strong>: Basic Calculator for single game ratings, QB Comparison to compare two quarterbacks, Season Analyzer for full season statistics, Perfect Rating to see what's needed for 158.3, or NCAA Calculator for college passer efficiency. Each mode is optimized for different analysis needs.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">2️⃣ Enter Passing Statistics</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Input the quarterback's <strong>pass attempts</strong>, <strong>completions</strong>, <strong>passing yards</strong>, <strong>touchdown passes</strong>, and <strong>interceptions</strong>. For season mode, enter total season statistics and number of games played. The calculator validates that completions don't exceed attempts and all values are positive.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">3️⃣ Review Rating Formula</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                The calculator uses the official <strong>NFL passer rating formula</strong> with four components: Completion % ((CMP/ATT - 0.3) × 5), Yards/Attempt ((YDS/ATT - 3) × 0.25), TD % (TD/ATT × 20), and INT % (2.375 - (INT/ATT × 25)). Each component is capped at 0-2.375, then summed, divided by 6, and multiplied by 100 for the final rating (0-158.3 scale).
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">4️⃣ Calculate and View Results</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Click <strong>"Calculate Rating"</strong> to see comprehensive results including the passer rating (0-158.3), performance grade (Perfect/Elite/Excellent/Very Good/Above Average/Average/Below Average/Poor), detailed component breakdown showing how each statistic contributed to the rating, completion percentage, yards per attempt, touchdown percentage, and interception percentage.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">5️⃣ Compare and Analyze</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Use <strong>Comparison Mode</strong> to evaluate two QBs side-by-side, <strong>Season Analyzer</strong> for per-game averages and season totals, or <strong>Perfect Rating</strong> mode to see exactly what statistics are needed to achieve the elusive 158.3 perfect rating. Each mode provides tailored insights for your analysis needs.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">6️⃣ Understand Rating Benchmarks</h4>
              <p className="text-sm text-blue-800 dark:text-blue-200">
                Interpret the results using modern NFL benchmarks: <strong>158.3 = Perfect</strong> (only achieved 82 times in history), <strong>120+ = Elite</strong> (top tier QBs), <strong>110-119 = Excellent</strong> (Pro Bowl), <strong>100-109 = Very Good</strong>, <strong>90-99 = Above Average</strong>, <strong>80-89 = Average</strong> (league average now 90-95), <strong>70-79 = Below Average</strong>, <strong>Under 70 = Poor</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Results Dashboard */}
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg mb-6">
          <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4">📊 Your Results Dashboard</h3>
          <p className="text-sm text-green-800 dark:text-green-200 mb-4">After clicking "Calculate Rating," you'll receive:</p>
          <div className="space-y-3">
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">1</span>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">NFL Passer Rating (0-158.3)</h4>
                <p className="text-xs text-muted-foreground">Official rating with performance grade, component breakdown (A, B, C, D values), and detailed efficiency metrics</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">2</span>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Performance Analysis</h4>
                <p className="text-xs text-muted-foreground">Completion percentage, yards per attempt, TD rate, interception rate, and how each metric contributed to the final rating</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">3</span>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Grade Classification</h4>
                <p className="text-xs text-muted-foreground">Performance tier from Perfect (158.3) to Poor (&lt;70) based on modern NFL benchmarks with color-coded visualization</p>
              </div>
            </div>
            <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
              <div className="h-5 w-5 bg-green-600 dark:bg-green-400 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-xs font-bold">4</span>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Mode-Specific Insights</h4>
                <p className="text-xs text-muted-foreground">QB comparisons, season averages, perfect rating requirements, or NCAA vs NFL rating differences tailored to your selected mode</p>
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
                <li>5 calculation modes vs 1-2 in other tools</li>
                <li>Both NFL and NCAA formulas</li>
                <li>QB comparison feature</li>
                <li>Perfect rating analyzer</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">💯 Accurate Calculations</h4>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>Official NFL formula since 1973</li>
                <li>Proper component capping (0-2.375)</li>
                <li>NCAA passer efficiency</li>
                <li>Validated against NFL.com</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">📊 Advanced Features</h4>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>Season analyzer with per-game stats</li>
                <li>Side-by-side QB comparisons</li>
                <li>Perfect rating requirements</li>
                <li>Modern performance benchmarks</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">🎓 Educational Resource</h4>
              <ul className="text-sm space-y-1 list-disc list-inside text-muted-foreground">
                <li>19 comprehensive FAQ items</li>
                <li>Formula explanations</li>
                <li>Historical context</li>
                <li>Rating interpretation guide</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Understanding Passer Rating */}
      <div className="bg-background border rounded-xl p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">Understanding Passer Rating</h2>

        <div className="space-y-6">
          {/* The Science Behind Passer Rating */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-xl font-semibold text-blue-900 dark:text-blue-100 mb-4">🔬 The Science Behind Passer Rating</h3>
            <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
              NFL passer rating was created in 1971 by Don Smith and is the most standardized metric for evaluating quarterback passing efficiency. The formula uses four statistical components, each capped at 0-2.375, which are summed, divided by 6, and multiplied by 100 to create a 0-158.3 scale.
            </p>
            <div className="space-y-3">
              <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">•</span>
                <p className="text-sm text-muted-foreground">
                  <strong>Historical Baseline (1960-1970):</strong> The 1.0 standard was set using NFL data from 1960-1970, when the average quarterback had a rating around 67. This means 100+ was excellent in 1973, but today's average is 90-95, so the benchmarks have shifted dramatically over 50+ years.
                </p>
              </div>
              <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">•</span>
                <p className="text-sm text-muted-foreground">
                  <strong>Component Weighting:</strong> Each component has equal weight (1/4 of the total), but they measure different aspects: efficiency (completion %), production (yards and TDs), and avoiding mistakes (interceptions). Interceptions hurt slightly more than TDs help due to historical emphasis on ball security.
                </p>
              </div>
              <div className="flex items-start gap-3 bg-white dark:bg-gray-800 p-3 rounded-lg">
                <span className="text-blue-600 dark:text-blue-400 font-bold text-lg">•</span>
                <p className="text-sm text-muted-foreground">
                  <strong>Why Four Components:</strong> These represent the four key aspects of passing: completing passes (CMP%), gaining yards (YDS/ATT), scoring touchdowns (TD%), and avoiding interceptions (INT%). All four must be strong for an elite rating; weaknesses in any area cap your rating even if other areas excel.
                </p>
              </div>
            </div>
          </div>

          {/* Why the Formula Uses Four Components */}
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h3 className="text-xl font-semibold text-green-900 dark:text-green-100 mb-4">📊 Why the Formula Uses Four Components</h3>
            <p className="text-sm text-green-800 dark:text-green-200 mb-4">
              Each component represents a different dimension of QB performance that contributes to team success:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Component A: Completion %</h4>
                <p className="text-xs text-muted-foreground">
                  Formula: ((CMP/ATT - 0.3) × 5), capped 0-2.375. Measures ability to place accurate throws where receivers can catch them. 30% = 0, 77.5%+ = max. Modern QBs average 62-65%.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Component B: Yards per Attempt</h4>
                <p className="text-xs text-muted-foreground">
                  Formula: ((YDS/ATT - 3) × 0.25), capped 0-2.375. Measures depth of throws and offensive play calling. 3 Y/A = 0, 12.5 Y/A = max. Excellent QBs average 7-8 Y/A.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Component C: Touchdown %</h4>
                <p className="text-xs text-muted-foreground">
                  Formula: (TD/ATT × 20), capped 0-2.375. Measures ability to throw scoring passes. 0% = 0, 11.875%+ = max. Separates elite from average QBs significantly.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Component D: Interception %</h4>
                <p className="text-xs text-muted-foreground">
                  Formula: (2.375 - (INT/ATT × 25)), capped 0-2.375. Penalizes turnovers; one INT per 100 attempts costs 4.17 rating points. One TD per 100 attempts adds 3.33, so INTs hurt more.
                </p>
              </div>
            </div>
          </div>

          {/* Understanding Component Capping */}
          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
            <h3 className="text-xl font-semibold text-orange-900 dark:text-orange-100 mb-4">⚠️ Understanding Component Capping</h3>
            <p className="text-sm text-orange-800 dark:text-orange-200 mb-4">
              Each component is capped at 0 minimum and 2.375 maximum. This prevents extreme outliers from skewing the rating and creates a standardized scale.
            </p>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-medium text-sm mb-3">How Capping Works:</h4>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-2 font-semibold">Component</th>
                    <th className="text-left py-2 px-2 font-semibold">Minimum Cap</th>
                    <th className="text-left py-2 px-2 font-semibold">Maximum Cap</th>
                    <th className="text-left py-2 px-2 font-semibold">Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-2">Completion %</td>
                    <td className="py-2 px-2">0 (≤30%)</td>
                    <td className="py-2 px-2">2.375 (≥77.5%)</td>
                    <td className="py-2 px-2">85% = 2.375 (capped)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-2">Yards/Attempt</td>
                    <td className="py-2 px-2">0 (≤3)</td>
                    <td className="py-2 px-2">2.375 (≥12.5)</td>
                    <td className="py-2 px-2">15 Y/A = 2.375 (capped)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-2">Touchdown %</td>
                    <td className="py-2 px-2">0 (0%)</td>
                    <td className="py-2 px-2">2.375 (≥11.875%)</td>
                    <td className="py-2 px-2">15% TD = 2.375 (capped)</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-2">Interception %</td>
                    <td className="py-2 px-2">0 (≥9.5%)</td>
                    <td className="py-2 px-2">2.375 (0%)</td>
                    <td className="py-2 px-2">2% INT = 1.875</td>
                  </tr>
                </tbody>
              </table>
              <p className="text-xs text-muted-foreground mt-3">
                Capping prevents outliers from creating unrealistic ratings and ensures all QBs are evaluated on the same standardized scale. Without capping, a single exceptional performance could create an artificially inflated rating.
              </p>
            </div>
          </div>

          {/* Perfect Rating Breakdown */}
          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <h3 className="text-xl font-semibold text-purple-900 dark:text-purple-100 mb-4">🎯 Perfect Rating Breakdown</h3>
            <p className="text-sm text-purple-800 dark:text-purple-200 mb-4">
              A perfect rating of 158.3 occurs when all four components are maxed at 2.375: (2.375 + 2.375 + 2.375 + 2.375) / 6 × 100 = 158.3
            </p>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg mb-3">
              <h4 className="font-medium text-sm mb-3">Perfect Rating Requirements (scales with attempts):</h4>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span><strong>Minimum 10 attempts:</strong></span>
                  <span>8 CMP, 125 yards, 2 TDs, 0 INT</span>
                </div>
                <div className="flex justify-between">
                  <span><strong>20 attempts:</strong></span>
                  <span>16 CMP, 250 yards, 3 TDs, 0 INT</span>
                </div>
                <div className="flex justify-between">
                  <span><strong>30 attempts:</strong></span>
                  <span>24 CMP, 375 yards, 4 TDs, 0 INT</span>
                </div>
                <div className="flex justify-between">
                  <span><strong>40 attempts:</strong></span>
                  <span>31 CMP, 500 yards, 5 TDs, 0 INT</span>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 p-3 rounded-lg">
              <p className="text-xs font-medium">
                Perfect ratings are exceptionally rare: only 82 achieved in regular season history among 67 different QBs through 2025. The zero interceptions requirement is the biggest barrier. Tom Brady (3), Peyton Manning (3), and Lamar Jackson (4) hold the records.
              </p>
            </div>
          </div>

          {/* Common Misconceptions */}
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
            <h3 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-4">🚫 Common Misconceptions</h3>
            <div className="space-y-3">
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-1">❌ Myth: Higher completion % = higher rating</h4>
                <p className="text-xs text-muted-foreground">
                  False. A QB with 70% completions, 4.0 Y/A, 3% TD, 2% INT rates 104. One with 65% completions, 8.0 Y/A, 8% TD, 1% INT rates 120. Yards and TDs matter more.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-1">❌ Myth: Passer rating equals QB quality</h4>
                <p className="text-xs text-muted-foreground">
                  False. Rating measures passing efficiency only. It excludes rushing yards, sacks taken, scrambles, game context, receiver quality, and offensive line protection. Total QBR, EPA, or CPOE provide complementary metrics.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-1">❌ Myth: 100+ always means good QB</h4>
                <p className="text-xs text-muted-foreground">
                  Depends on era. In 1973, 100+ was elite. By 2020s, league average is 90-95, so 100+ is good but not elite. Modern elite requires 110+. Context is critical for historical comparisons.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-1">❌ Myth: One perfect game makes a great QB</h4>
                <p className="text-xs text-muted-foreground">
                  False. 82 perfect games achieved by 67 QBs includes backups, rookies, and journeymen with just one perfect game. Consistency matters more. Career rating is most meaningful; 100+ career is elite.
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 p-3 rounded-lg">
                <h4 className="font-medium text-sm mb-1">❌ Myth: The formula is simple to maximize</h4>
                <p className="text-xs text-muted-foreground">
                  False. The interdependent components make tradeoffs inevitable. You can't just focus on one area. Screen passes inflate completion %, run plays reduce all passing stats, and aggressive throws increase both TDs and INTs.
                </p>
              </div>
            </div>
          </div>
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
            <p className="text-muted-foreground mt-1">Comprehensive NFL and NCAA passer rating calculator with advanced analysis</p>
          </div>
        </div>

        <div className="prose prose-sm max-w-none">
          <p className="text-base text-foreground leading-relaxed mb-4">
            Calculate passer ratings for <strong>NFL and NCAA quarterbacks</strong> with the most comprehensive
            rating calculator available. Our advanced calculator includes <strong>5 calculation modes</strong> to analyze quarterback
            performance from multiple angles with detailed component breakdowns and performance grading.
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
                Basic, QB Comparison, Season Analyzer, Perfect Rating, and NCAA Calculator modes
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                  <Trophy className="h-4 w-4 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="font-semibold text-foreground">NFL & NCAA Formulas</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Official NFL passer rating (0-158.3) and NCAA Passing Efficiency (-731.6 to 1261.6)
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                  <BarChart3 className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="font-semibold text-foreground">Component Breakdown</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Detailed analysis of all four components (A, B, C, D) with individual contribution scores
              </p>
            </div>

            <div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-orange-200 dark:border-orange-800">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-8 w-8 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center">
                  <Award className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="font-semibold text-foreground">Performance Grading</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                8-tier grading system from Perfect (158.3) to Poor with color-coded visualization
              </p>
            </div>
          </div>

          <p className="text-base text-foreground leading-relaxed">
            Get <strong>instant analysis</strong> of quarterback performance. Our calculator includes side-by-side QB comparisons, season-long averaging, perfect rating requirements, NCAA vs NFL comparisons,
            and <strong>19 comprehensive FAQ items</strong> covering everything from formula mechanics to historical context.
          </p>

          <div className="flex flex-wrap gap-2 mt-6">
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-xs font-medium">
              <CheckCircle className="h-3 w-3" />
              5 Calculation Modes
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-xs font-medium">
              <CheckCircle className="h-3 w-3" />
              NFL & NCAA Formulas
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full text-xs font-medium">
              <CheckCircle className="h-3 w-3" />
              QB Comparison
            </span>
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full text-xs font-medium">
              <CheckCircle className="h-3 w-3" />
              19 Comprehensive FAQs
            </span>
          </div>
        </div>
      </div>

      {/* Scientific References & Resources */}
      <div className="bg-background border rounded-xl p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">Scientific References & Resources</h2>

        <div className="space-y-3 text-sm">
          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Passer Rating Formula Sources</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• <a href="https://www.nfl.com/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">NFL Official Website</a> - Official passer rating formula and historical records since 1973</li>
              <li>• Don Smith (1971) - Original formula designer who created the modern NFL passer rating system</li>
              <li>• <a href="https://pro-football-reference.com/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Pro Football Reference</a> - Historical passer rating data and career statistics</li>
              <li>• "The Analytical Football" by Brian Burke - Advanced quarterback evaluation methods</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Historical Data and Analysis</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• <a href="https://www.pro-football-reference.com/play-index/psl_finder.cgi" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Historical Passer Rating Trends</a> - Tracking league average rating evolution from 1973-2025</li>
              <li>• "The Evolution of Passing in the NFL" - Analysis of how rule changes and strategy have affected ratings</li>
              <li>• <a href="https://nextgen.stats.nfl.com/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">NFL Next Gen Stats</a> - Modern quarterback analytics and performance metrics</li>
              <li>• Historical records show average rating increased from 61.7 (1973) to 90-95 (2020s)</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">NFL Statistics and Records</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• <a href="https://www.pro-football-reference.com/leaders/pass_rating_single_season.htm" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Single Season Passer Rating Records</a> - Career high ratings by season leaders</li>
              <li>• <a href="https://www.pro-football-reference.com/leaders/pass_rating_career.htm" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Career Passer Rating Records</a> - All-time leaders (minimum 1,500 attempts)</li>
              <li>• Perfect Game Database - 82 instances of 158.3 ratings among 67 QBs (through 2025)</li>
              <li>• <a href="https://www.nfl.com/stats/player-stats/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">NFL Official Statistics</a> - Real-time passer rating data for all active players</li>
            </ul>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <h3 className="font-semibold mb-2">Rating Comparison Studies</h3>
            <ul className="space-y-1 text-muted-foreground">
              <li>• <a href="https://www.espn.com/nfl/stats/qbr/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">ESPN Total QBR</a> - Proprietary metric (0-100 scale) accounting for context and all contributions</li>
              <li>• <a href="https://www.footballoutsiders.com/" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">Football Outsiders</a> - EPA (Expected Points Added) and advanced QB analytics</li>
              <li>• Passer Rating vs QBR correlation studies show ratings account for ~70% of winning variance</li>
              <li>• NCAA Passer Efficiency comparative analysis - Different formula emphasis on TDs and INTs</li>
            </ul>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-4 italic">
          This calculator uses the official NFL passer rating formula as defined in NFL Game Operations Manual and enforced since 1973.
          Calculations are validated against NFL.com, Pro-Football-Reference.com, and ESPN statistics. While we strive for accuracy,
          always consult official NFL sources for record-setting claims or historical records verification.
        </p>
      </div>

      {/* FAQ Section */}
      <div className="bg-background border rounded-xl p-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">Frequently Asked Questions</h2>
        <FAQAccordion faqs={faqItems} />
      </div>

      {/* Calculator Review Section */}
      <div className="bg-background border rounded-xl p-6">
        <CalculatorReview calculatorName="Quarterback Passer Rating Calculator" />
      </div>
    </div>
  );
}

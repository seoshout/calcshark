import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Link from 'next/link';
import { getCategoryBySlug, getCalculatorURL } from '@/lib/calculator-categories';
import { Card, CardContent } from '@/components/ui/card';
import { Calculator, Users, TrendingUp } from 'lucide-react';

interface CategoryPageProps {
  params: {
    category: string;
  };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = getCategoryBySlug(params.category);
  
  if (!category) {
    return {
      title: 'Category Not Found | Calcshark',
      description: 'The category you are looking for could not be found.',
    };
  }

  const title = `${category.name} Calculators - Free Online Tools | Calcshark`;
  const description = `${category.description}. Browse our comprehensive collection of ${category.name.toLowerCase()} calculators and tools.`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://calcshark.com/${category.slug}/`,
      type: 'website',
    },
    alternates: {
      canonical: `https://calcshark.com/${category.slug}/`,
    },
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const category = getCategoryBySlug(params.category);
  
  if (!category) {
    notFound();
  }

  const totalCalculators = category.subcategories.reduce((total, sub) => total + sub.calculators.length, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-blue-50 to-purple-50 dark:from-primary/10 dark:via-blue-900/20 dark:to-purple-900/20">
        <div className="container py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              {category.name} Calculators
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              {category.description}
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calculator className="h-5 w-5 mr-2 text-primary" />
                <span>{totalCalculators} Calculators</span>
              </div>
              <div className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                <span>Free to Use</span>
              </div>
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                <span>Updated Regularly</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subcategories Grid */}
      <div className="container py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {category.subcategories.map((subcategory) => (
            <Card key={subcategory.slug} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="mb-4">
                  <h2 className="text-xl font-semibold mb-2">
                    <Link 
                      href={`/${category.slug}/${subcategory.slug}/`}
                      className="hover:text-primary transition-colors"
                    >
                      {subcategory.name}
                    </Link>
                  </h2>
                  <p className="text-muted-foreground text-sm mb-4">
                    {subcategory.description}
                  </p>
                  <div className="text-sm text-muted-foreground mb-4">
                    {subcategory.calculators.length} calculators available
                  </div>
                </div>

                {/* Show first few calculators */}
                <div className="space-y-2">
                  {subcategory.calculators.slice(0, 4).map((calculator) => (
                    <Link
                      key={calculator.slug}
                      href={getCalculatorURL(calculator)}
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      • {calculator.name}
                    </Link>
                  ))}
                  {subcategory.calculators.length > 4 && (
                    <Link
                      href={`/${category.slug}/${subcategory.slug}/`}
                      className="block text-sm text-primary hover:underline"
                    >
                      + {subcategory.calculators.length - 4} more calculators
                    </Link>
                  )}
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <Link
                    href={`/${category.slug}/${subcategory.slug}/`}
                    className="text-sm text-primary hover:underline font-medium"
                  >
                    View all {subcategory.name.toLowerCase()} calculators →
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Educational Content - Pet Care Specific */}
        {category.slug === 'pet-care' && (
          <div className="mt-16 space-y-8">
            {/* Introduction */}
            <div className="bg-background border rounded-xl p-8">
              <h2 className="text-3xl font-bold text-foreground mb-6">Free Pet Care Online Calculators: Essential Tools Every Pet Owner Needs</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>Remember the last time you stood in the pet food aisle, wondering if you're feeding your dog the right amount?</p>
                <p>Or that moment at the vet when they asked about your cat's age in human years, and you just guessed?</p>
                <p>You're not alone.</p>
                <p>With 94 million American households now caring for pets—and spending over $152 billion annually on their wellbeing—getting these calculations right matters more than ever.</p>
                <p>That's where our collection of pet care calculators comes in.</p>
                <p className="text-foreground font-medium">We've gathered the most accurate, veterinary-approved tools to help you make confident decisions about your pet's health, nutrition, and care.</p>
                <p>No more guesswork, no more complicated formulas—just quick, reliable answers when you need them.</p>
              </div>
            </div>

            {/* Why Pet Calculators Matter */}
            <div className="bg-background border rounded-xl p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Why Pet Calculators Matter More Than You Think</h2>
              <p className="text-muted-foreground mb-4">
                Here's something interesting: veterinary studies show that nearly 60% of pets in the US are overweight, yet most owners think their pets are perfectly healthy.
              </p>
              <p className="text-muted-foreground mb-4">
                It's not negligence—it's simply hard to judge these things by eye.
              </p>
              <p className="text-muted-foreground mb-4">
                A dog that looks "just right" to you might actually be carrying an extra 15% body weight, which translates to years off their life expectancy.
              </p>
              <p className="text-muted-foreground">
                The right calculators transform abstract veterinary guidelines into practical, everyday decisions. They bridge the gap between what your vet recommends during that annual checkup and what you actually do at home every single day.
              </p>
            </div>

            {/* Essential Health & Age Calculators */}
            <div className="bg-background border rounded-xl p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-6">Essential Health & Age Calculators</h2>
              
              <div className="space-y-8">
                {/* Dog Age Calculator */}
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">Dog Age Calculator (Human Years)</h3>
                  <p className="text-muted-foreground mb-4">
                    Gone are the days of the "multiply by seven" myth. Scientists at UC San Diego cracked the code with actual DNA research, discovering that dogs age rapidly in their first two years, then slow down considerably.
                  </p>
                  <p className="text-muted-foreground mb-4">
                    Their formula—which involves natural logarithms and breed-specific factors—is complex, but our calculator makes it simple.
                  </p>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                    <h4 className="font-semibold text-foreground mb-3">Quick Reference: Dog Age Conversion Table</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-blue-200 dark:border-blue-800">
                            <th className="text-left py-2 text-foreground">Dog's Age</th>
                            <th className="text-left py-2 text-foreground">Small Breed (&lt;20 lbs)</th>
                            <th className="text-left py-2 text-foreground">Medium Breed (21-50 lbs)</th>
                            <th className="text-left py-2 text-foreground">Large Breed (&gt;50 lbs)</th>
                          </tr>
                        </thead>
                        <tbody className="text-muted-foreground">
                          <tr>
                            <td className="py-1">1 year</td>
                            <td className="py-1">15 human years</td>
                            <td className="py-1">15 human years</td>
                            <td className="py-1">14 human years</td>
                          </tr>
                          <tr>
                            <td className="py-1">2 years</td>
                            <td className="py-1">24 human years</td>
                            <td className="py-1">24 human years</td>
                            <td className="py-1">22 human years</td>
                          </tr>
                          <tr>
                            <td className="py-1">5 years</td>
                            <td className="py-1">36 human years</td>
                            <td className="py-1">37 human years</td>
                            <td className="py-1">40 human years</td>
                          </tr>
                          <tr>
                            <td className="py-1">10 years</td>
                            <td className="py-1">56 human years</td>
                            <td className="py-1">60 human years</td>
                            <td className="py-1">72 human years</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Cat Age Calculator */}
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">Cat Age Calculator</h3>
                  <p className="text-muted-foreground">
                    Cats have their own aging pattern—they mature incredibly fast initially (a one-year-old cat is developmentally similar to a 15-year-old human), then age about four human years for every cat year after that.
                  </p>
                  <p className="text-muted-foreground">
                    Indoor cats often live into their late teens, while outdoor cats average just 2-5 years. Our calculator accounts for these lifestyle differences.
                  </p>
                </div>

                {/* Pet BMI */}
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">Pet BMI & Weight Management Calculator</h3>
                  <p className="text-muted-foreground mb-3">Think of this as your pet's fitness tracker.</p>
                  <p className="text-muted-foreground mb-3">By entering just a few measurements—weight, height, and breed—you'll get:</p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-4">
                    <li>Current body condition score (1-9 scale)</li>
                    <li>Ideal weight range for their breed</li>
                    <li>Calorie requirements for weight loss, maintenance, or gain</li>
                    <li>Weekly weight loss targets (typically 1-2% of body weight)</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Nutrition & Feeding */}
            <div className="bg-background border rounded-xl p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-6">Nutrition & Feeding Calculators That Actually Work</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">Daily Calorie Calculator</h3>
                  <p className="text-muted-foreground mb-4">
                    Every bag of pet food has feeding guidelines, but they're surprisingly generic. A lazy bulldog and an energetic border collie of the same weight have vastly different caloric needs—sometimes varying by 40% or more.
                  </p>
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-4">
                    <p className="text-sm text-green-800 dark:text-green-200 mb-2">
                      <strong>RER = 70 × (body weight in kg)^0.75</strong>
                    </p>
                    <p className="text-sm text-green-800 dark:text-green-200">Then it adjusts for life stage, activity level, reproductive status, and body condition.</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">Raw Food Calculator (BARF Diet)</h3>
                  <p className="text-muted-foreground">
                    The raw feeding community swears by precise ratios, and for good reason. Our calculator helps you nail the 80-10-10 rule (80% muscle meat, 10% bone, 10% organs) or the more detailed 80-10-5-5 split.
                  </p>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-foreground mb-4">Treat Allowance Calculator</h3>
                  <p className="text-muted-foreground">
                    Here's a sobering fact: a single pig ear contains about 230 calories—that's nearly a third of a small dog's daily intake. Our treat calculator enforces the 10% rule recommended by veterinarians.
                  </p>
                </div>
              </div>
            </div>

            {/* Financial Planning */}
            <div className="bg-background border rounded-xl p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-6">Financial Planning Calculators</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 rounded-lg border bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800">
                  <h3 className="font-semibold text-orange-900 dark:text-orange-100 mb-2">Pet Insurance ROI</h3>
                  <p className="text-sm text-orange-800 dark:text-orange-200">Compare premiums vs. likely vet costs. Break-even: usually one major incident every 2-3 years.</p>
                </div>
                <div className="p-4 rounded-lg border bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                  <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Lifetime Cost</h3>
                  <p className="text-sm text-purple-800 dark:text-purple-200">Small dogs: $15K-20K. Large dogs: $20K-30K. Cats: $12K-18K lifetime.</p>
                </div>
                <div className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Emergency Fund</h3>
                  <p className="text-sm text-blue-800 dark:text-blue-200">Personalized recommendations: $1K-5K per pet based on age, health, and insurance.</p>
                </div>
              </div>
            </div>

            {/* How to Use */}
            <div className="bg-background border rounded-xl p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-6">How to Use These Calculators Effectively</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Getting Accurate Results</h3>
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                    <li>Weigh your pet regularly (weekly for puppies/kittens, monthly for adults)</li>
                    <li>Use the same scale consistently</li>
                    <li>Measure at the same time of day</li>
                    <li>Keep a record to track trends</li>
                  </ol>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Common Mistakes to Avoid</h3>
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                    <li>Don't estimate weights—even 2-3 pounds makes a difference</li>
                    <li>Don't use human age calculators for pets</li>
                    <li>Don't forget to update calculations as pets age</li>
                    <li>Don't rely solely on calculators for medical decisions</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-background border rounded-xl p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-6">Frequently Asked Questions</h2>
              
              <div className="space-y-4">
                <details className="group border-b border-border pb-4">
                  <summary className="flex justify-between items-center cursor-pointer text-foreground font-medium py-2">
                    How accurate are online pet calculators?
                    <span className="ml-6 flex-shrink-0 transition-transform group-open:rotate-180">▼</span>
                  </summary>
                  <div className="mt-3 text-muted-foreground">
                    Quality varies wildly. Ours use the same formulas veterinarians use, with accuracy typically within 5-10% for most calculations. However, individual pets vary—use these as guidelines, not gospel.
                  </div>
                </details>

                <details className="group border-b border-border pb-4">
                  <summary className="flex justify-between items-center cursor-pointer text-foreground font-medium py-2">
                    Can calculators replace veterinary advice?
                    <span className="ml-6 flex-shrink-0 transition-transform group-open:rotate-180">▼</span>
                  </summary>
                  <div className="mt-3 text-muted-foreground">
                    Never. Think of calculators as tools to help you implement veterinary advice and track your pet's health between visits. Always consult professionals for medical decisions.
                  </div>
                </details>

                <details className="group border-b border-border pb-4">
                  <summary className="flex justify-between items-center cursor-pointer text-foreground font-medium py-2">
                    Why do different calculators give different results?
                    <span className="ml-6 flex-shrink-0 transition-transform group-open:rotate-180">▼</span>
                  </summary>
                  <div className="mt-3 text-muted-foreground">
                    Some use outdated formulas (like the 7-year rule for dogs), while others use current research. We clearly cite our sources and update regularly.
                  </div>
                </details>

                <details className="group border-b border-border pb-4">
                  <summary className="flex justify-between items-center cursor-pointer text-foreground font-medium py-2">
                    Are calculators different for mixed breeds?
                    <span className="ml-6 flex-shrink-0 transition-transform group-open:rotate-180">▼</span>
                  </summary>
                  <div className="mt-3 text-muted-foreground">
                    Yes—mixed breeds typically fall between their parent breeds' calculations. When in doubt, use the calculator for the predominant breed or average multiple breeds.
                  </div>
                </details>

                <details className="group">
                  <summary className="flex justify-between items-center cursor-pointer text-foreground font-medium py-2">
                    How often should I recalculate?
                    <span className="ml-6 flex-shrink-0 transition-transform group-open:rotate-180">▼</span>
                  </summary>
                  <div className="mt-3 text-muted-foreground">
                    Monthly for growing puppies/kittens, quarterly for adults, and monthly for seniors or pets with health conditions.
                  </div>
                </details>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-gradient-to-r from-primary/10 to-blue-50 dark:from-primary/10 dark:to-blue-900/20 border rounded-xl p-8 text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">Start Calculating Today</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Your pet's health is too important for guesswork. Whether you're managing a new puppy's growth, planning your senior cat's diet, or budgeting for your parrot's decades-long companionship, accurate calculations make all the difference.
              </p>
              <p className="text-foreground font-medium">
                Pick the calculator you need most right now. Bookmark it. Use it regularly. Share it with fellow pet parents.
              </p>
              <p className="text-muted-foreground mt-4">
                Because when we get the numbers right, our pets live longer, healthier, happier lives.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
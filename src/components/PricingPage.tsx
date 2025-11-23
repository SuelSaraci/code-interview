import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Check, Sparkles, Lock } from 'lucide-react';

interface PricingPageProps {
  hasUnlocked: boolean;
  onUnlock: () => void;
}

export function PricingPage({ hasUnlocked, onUnlock }: PricingPageProps) {
  const freeFeatures = [
    '3 curated interview questions',
    'All experience levels available',
    'Sample answers & explanations',
    'Common mistakes breakdown',
    'Unlimited access to free hints',
    'Progress tracking',
  ];

  const premiumFeatures = [
    'Everything in Free, plus:',
    '200+ expert-crafted questions',
    'All experience levels (Junior, Mid, Senior)',
    'All programming languages',
    'Advanced tech hints for every question',
    'Questions asked at top companies',
    'Filter by difficulty, topic & company',
    'Practice mode with timer',
    'Detailed analytics dashboard',
    'Monthly subscription for just €2/month',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">Simple, Transparent Pricing</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600">
            Start free, upgrade when you're ready
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto mb-12 sm:mb-16">
          {/* Free Tier */}
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-2xl">Free</CardTitle>
                <Badge variant="secondary" className="bg-green-100 text-green-700">
                  Current Plan
                </Badge>
              </div>
              <div className="mb-4">
                <span className="text-3xl sm:text-4xl">€0</span>
              </div>
              <CardDescription>Perfect to get started</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {freeFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant="outline" className="w-full" disabled>
                Current Plan
              </Button>
            </CardContent>
          </Card>

          {/* Premium Tier */}
          <Card className={`border-2 relative ${hasUnlocked ? 'border-green-500' : 'border-blue-500 shadow-xl'}`}>
            {!hasUnlocked && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-blue-600 text-white px-4 py-1">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Most Popular
                </Badge>
              </div>
            )}
            {hasUnlocked && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-green-600 text-white px-4 py-1">
                  <Check className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              </div>
            )}
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-2xl">Premium</CardTitle>
                {hasUnlocked && (
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    Unlocked
                  </Badge>
                )}
              </div>
              <div className="mb-4">
                <span className="text-4xl">€2</span>
                <span className="text-gray-600 ml-2">/month</span>
              </div>
              <CardDescription>Unlock all questions for all levels</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                {premiumFeatures.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <div className={`w-5 h-5 ${idx === 0 ? 'bg-blue-100' : 'bg-blue-100'} rounded-full flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <Check className={`w-3 h-3 ${idx === 0 ? 'text-blue-600' : 'text-blue-600'}`} />
                    </div>
                    <span className={`text-sm ${idx === 0 ? 'font-medium text-gray-900' : 'text-gray-700'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              {hasUnlocked ? (
                <Button className="w-full bg-green-600 hover:bg-green-700" disabled>
                  <Check className="w-4 h-4 mr-2" />
                  Already Unlocked
                </Button>
              ) : (
                <Button className="w-full" onClick={onUnlock}>
                  <Lock className="w-4 h-4 mr-2" />
                  Subscribe for €2/month
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">How does the monthly subscription work?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Pay €2 per month to access all premium content including 200+ questions for all levels (Junior, Mid, Senior) and all programming languages. Cancel anytime, no hidden fees.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  We accept all major credit cards through Stripe. This demo uses a mock payment system for demonstration purposes.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Can I try before I buy?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Absolutely! Start with 3 free questions to experience the quality of our content. Upgrade only when you're ready.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Do you add new questions regularly?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">
                  Yes! We regularly add new questions based on the latest interview trends at top tech companies. All updates are included in your monthly subscription.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom CTA */}
        {!hasUnlocked && (
          <div className="text-center mt-16 py-12 px-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl text-white">
            <h2 className="text-3xl mb-4">Ready to Unlock Your Potential?</h2>
            <p className="text-xl mb-6 text-blue-100">
              Join thousands of developers who aced their interviews
            </p>
            <Button size="lg" variant="secondary" onClick={onUnlock}>
              <Lock className="w-5 h-5 mr-2" />
              Subscribe for €2/month
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

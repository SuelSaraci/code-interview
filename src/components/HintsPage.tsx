import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Button } from './ui/button';
import { Download, CheckCircle } from 'lucide-react';
import { hints } from '../data/hints';
import { Hint } from '../types';

export function HintsPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<Hint['category']>('Behavioral');

  const categories: Hint['category'][] = ['Behavioral', 'Technical Mindset', 'Negotiation', 'Remote Etiquette'];

  const filteredHints = hints.filter(h => h.category === selectedCategory);

  const handleDownloadPDF = () => {
    // Mock PDF download
    alert('PDF download would start here. This is a demo.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-purple-100 text-purple-700 rounded-full mb-3 sm:mb-4 text-xs sm:text-sm">
            <span>100% Free</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl mb-3 sm:mb-4">Interview Hints & Tips</h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-4 sm:mb-6 px-4">
            Expert advice to help you succeed in every interview
          </p>
          <Button onClick={handleDownloadPDF} className="gap-2">
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Download Top 10 Hints PDF</span>
            <span className="sm:hidden">Download PDF</span>
          </Button>
        </div>

        {/* Tabs */}
        <Tabs value={selectedCategory} onValueChange={(v) => setSelectedCategory(v as Hint['category'])}>
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-6 sm:mb-8 h-auto">
            {categories.map(category => (
              <TabsTrigger key={category} value={category} className="text-xs sm:text-sm py-2">
                {category}
              </TabsTrigger>
            ))}
          </TabsList>

          {categories.map(category => (
            <TabsContent key={category} value={category} className="space-y-4 sm:space-y-6">
              {hints.filter(h => h.category === category).map(hint => (
                <Card key={hint.id} className="border-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      {hint.title}
                    </CardTitle>
                    <CardDescription className="text-sm sm:text-base">{hint.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {hint.tips.map((tip, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-5 h-5 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckCircle className="w-3 h-3 text-purple-600" />
                          </div>
                          <span className="text-sm sm:text-base text-gray-700">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          ))}
        </Tabs>

        {/* Bottom CTA */}
        <Card className="mt-8 sm:mt-12 bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
          <CardContent className="text-center py-8 sm:py-10 md:py-12">
            <h2 className="text-2xl sm:text-3xl mb-3 sm:mb-4">Ready to Practice?</h2>
            <p className="text-base sm:text-lg md:text-xl mb-4 sm:mb-6 text-purple-100">
              Apply these tips with our interview questions
            </p>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate("/practices")}
            >
              Browse Practices
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

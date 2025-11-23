import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Checkbox } from './ui/checkbox';
import { Level, Language } from '../types';
import { Code, Rocket } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (levels: Level[], languages: Language[]) => void;
}

export function OnboardingModal({ isOpen, onClose, onComplete }: OnboardingModalProps) {
  const [step, setStep] = useState(1);
  const [selectedLevels, setSelectedLevels] = useState<Level[]>(['junior']);
  const [selectedLanguages, setSelectedLanguages] = useState<Language[]>(['JavaScript']);

  const levels: { value: Level; label: string; description: string; color: string }[] = [
    {
      value: 'junior',
      label: 'Junior',
      description: '0-2 years experience',
      color: 'bg-green-100 text-green-700 border-green-300'
    },
    {
      value: 'mid',
      label: 'Mid-Level',
      description: '2-5 years experience',
      color: 'bg-blue-100 text-blue-700 border-blue-300'
    },
    {
      value: 'senior',
      label: 'Senior',
      description: '5+ years experience',
      color: 'bg-purple-100 text-purple-700 border-purple-300'
    }
  ];

  const languages: Language[] = ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'Python', 'Ruby', 'Java', 'React', 'Node.js', 'SQL'];

  const toggleLevel = (level: Level) => {
    setSelectedLevels(prev => {
      if (prev.includes(level)) {
        // Don't allow deselecting all levels
        if (prev.length === 1) return prev;
        return prev.filter(l => l !== level);
      } else {
        return [...prev, level];
      }
    });
  };

  const toggleLanguage = (language: Language) => {
    setSelectedLanguages(prev => {
      if (prev.includes(language)) {
        // Don't allow deselecting all languages
        if (prev.length === 1) return prev;
        return prev.filter(l => l !== language);
      } else {
        return [...prev, language];
      }
    });
  };

  const handleComplete = () => {
    onComplete(selectedLevels, selectedLanguages);
    onClose();
    setStep(1);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Rocket className="w-6 h-6 text-blue-600" />
            Let's Get You Started
          </DialogTitle>
          <DialogDescription>
            {step === 1 ? 'Choose your experience level (select one or more)' : 'Select languages you want to practice (select one or more)'}
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {step === 1 ? (
            <div className="space-y-4">
              {levels.map((level) => {
                const isSelected = selectedLevels.includes(level.value);
                return (
                  <div
                    key={level.value}
                    onClick={() => toggleLevel(level.value)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleLevel(level.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <Badge className={level.color} variant="outline">
                              {level.label}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">{level.description}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {selectedLevels.length > 0 && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Selected levels:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedLevels.map(level => {
                      const levelData = levels.find(l => l.value === level);
                      return (
                        <Badge key={level} className={levelData?.color} variant="outline">
                          {levelData?.label}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {languages.map((language) => {
                  const isSelected = selectedLanguages.includes(language);
                  return (
                    <Button
                      key={language}
                      variant={isSelected ? 'default' : 'outline'}
                      onClick={() => toggleLanguage(language)}
                      className="h-auto py-4 flex-col gap-2 relative"
                    >
                      {isSelected && (
                        <div className="absolute top-2 right-2">
                          <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                          </div>
                        </div>
                      )}
                      <Code className="w-5 h-5" />
                      {language}
                    </Button>
                  );
                })}
              </div>

              {selectedLanguages.length > 0 && (
                <div className="mt-6 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-2">Selected languages:</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedLanguages.map(language => (
                      <Badge key={language} variant="outline">
                        <Code className="w-3 h-3 mr-1" />
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex gap-2">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`w-2 h-2 rounded-full transition-colors ${
                  s === step ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
          
          <div className="flex gap-2">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
            )}
            {step === 1 ? (
              <Button onClick={() => setStep(2)} disabled={selectedLevels.length === 0}>
                Next
              </Button>
            ) : (
              <Button onClick={handleComplete} disabled={selectedLanguages.length === 0}>
                Start Learning
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

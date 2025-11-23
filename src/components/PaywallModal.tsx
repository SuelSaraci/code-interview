import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Lock, Check, Sparkles, CreditCard, User } from 'lucide-react';
import { useState } from 'react';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUnlock: () => void;
  user: { email: string; name: string } | null;
  onLoginRequired: () => void;
}

export function PaywallModal({ isOpen, onClose, onUnlock, user, onLoginRequired }: PaywallModalProps) {
  const [processing, setProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handlePayment = () => {
    // Check if user is logged in
    if (!user) {
      onClose();
      onLoginRequired();
      return;
    }

    setProcessing(true);
    // Mock payment processing
    setTimeout(() => {
      setProcessing(false);
      setShowSuccess(true);
      
      // Show confetti effect
      setTimeout(() => {
        onUnlock();
        setShowSuccess(false);
        onClose();
      }, 2000);
    }, 1500);
  };

  const features = [
    '200+ expert-crafted questions for all levels',
    'All experience levels (Junior, Mid, Senior)',
    'All languages: HTML, CSS, JS, Python, Java, React, Node.js, SQL, TypeScript, Ruby',
    'Tech hints for every question',
    'Sample answers & explanations',
    'Common mistakes breakdown',
    'Monthly subscription for €2/month',
    'Cancel anytime, no hidden fees'
  ];

  if (showSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md text-center">
          <div className="py-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-3xl mb-2">🎉 Unlocked!</h2>
            <p className="text-gray-600">You now have access to all premium content</p>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Lock className="w-6 h-6 text-blue-600" />
            <DialogTitle className="text-2xl">Unlock All Premium Content</DialogTitle>
          </div>
          <DialogDescription>
            Monthly subscription of €2 to unlock all questions for all levels
          </DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {/* Login Required Notice */}
          {!user && (
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <User className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm text-blue-900 mb-1">Login required to unlock</p>
                  <p className="text-xs text-blue-700">
                    You'll need to sign in or create an account before purchasing premium access.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Pricing Card */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-4xl">€2</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    /month
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">All questions • All levels • Cancel anytime</p>
                {user && (
                  <p className="text-xs text-blue-600 mt-1">Logged in as: {user.email}</p>
                )}
              </div>
              <Sparkles className="w-12 h-12 text-blue-600" />
            </div>
          </div>

          {/* Features */}
          <div className="space-y-3 mb-6">
            {features.map((feature, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Check className="w-3 h-3 text-blue-600" />
                </div>
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>

          {/* Mock Payment Form */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 mb-4 bg-gray-50">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-600">Mock Stripe Payment (Demo Mode)</span>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 block mb-1">Card Number</label>
                <input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  className="w-full px-3 py-2 border rounded-lg text-sm"
                  disabled={processing}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm text-gray-600 block mb-1">Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    disabled={processing}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600 block mb-1">CVC</label>
                  <input
                    type="text"
                    placeholder="123"
                    className="w-full px-3 py-2 border rounded-lg text-sm"
                    disabled={processing}
                  />
                </div>
              </div>
            </div>
          </div>

          <p className="text-xs text-gray-500 text-center mb-4">
            This is a demo payment form. No actual charges will be made.
          </p>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={processing} className="flex-1">
            Maybe Later
          </Button>
          <Button onClick={handlePayment} disabled={processing} className="flex-1 gap-2">
            {processing ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </>
            ) : user ? (
              <>
                <Lock className="w-4 h-4" />
                Subscribe €2/month
              </>
            ) : (
              <>
                <User className="w-4 h-4" />
                Login to Continue
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

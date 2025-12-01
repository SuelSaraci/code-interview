import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Mail, Lock, User, CheckCircle, AlertCircle } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { toast } from "sonner";

// Google icon SVG component
const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: { email: string; name: string }) => void;
  mode?: "login" | "signup";
}

export function AuthModal({
  isOpen,
  onClose,
  onAuthSuccess,
  mode = "login",
}: AuthModalProps) {
  const { login, signup, loginWithGoogle } = useAuth();
  const [activeTab, setActiveTab] = useState(mode);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Signup state
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  // Reset error when modal opens/closes or tab changes
  useEffect(() => {
    setError(null);
  }, [isOpen, activeTab]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await login(loginEmail, loginPassword);

    if (result.success && result.user) {
      onAuthSuccess({
        email: result.user.email || loginEmail,
        name: result.user.displayName || loginEmail.split("@")[0],
      });
      onClose();
      setLoginEmail("");
      setLoginPassword("");
      toast.success("Successfully logged in!");
    } else {
      setError(result.error || "Failed to login. Please try again.");
      toast.error(result.error || "Failed to login");
    }

    setLoading(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signup(signupEmail, signupPassword, signupName);

    if (result.success && result.user) {
      onAuthSuccess({
        email: result.user.email || signupEmail,
        name: signupName,
      });
      onClose();
      setSignupName("");
      setSignupEmail("");
      setSignupPassword("");
      toast.success("Account created successfully!");
    } else {
      setError(result.error || "Failed to create account. Please try again.");
      toast.error(result.error || "Failed to create account");
    }

    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);

    const result = await loginWithGoogle();

    if (result.success && result.user) {
      onAuthSuccess({
        email: result.user.email || "",
        name:
          result.user.displayName || result.user.email?.split("@")[0] || "User",
      });
      onClose();
      toast.success("Successfully signed in with Google!");
    } else {
      setError(
        result.error || "Failed to sign in with Google. Please try again."
      );
      toast.error(result.error || "Failed to sign in with Google");
    }

    setGoogleLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            Welcome to InterviewPrep
          </DialogTitle>
          <DialogDescription>
            Sign in to unlock premium features and track your progress
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "login" | "signup")}
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          {/* Google Sign In Button - shown in both tabs */}
          <div className="mt-4">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={handleGoogleSignIn}
              disabled={loading || googleLoading}
            >
              {googleLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                  Signing in...
                </>
              ) : (
                <>
                  <GoogleIcon />
                  <span className="ml-2">Continue with Google</span>
                </>
              )}
            </Button>
          </div>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">
                Or continue with email
              </span>
            </div>
          </div>

          {/* Login Tab */}
          <TabsContent value="login">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-sm text-red-700">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="login-email">Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="login-password">Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded" />
                  <span className="text-gray-600">Remember me</span>
                </label>
                {/* <a href="#" className="text-blue-600 hover:underline">
                  Forgot password?
                </a> */}
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Logging in...
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </form>
          </TabsContent>

          {/* Signup Tab */}
          <TabsContent value="signup">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-sm text-red-700">
                <AlertCircle className="w-4 h-4" />
                <span>{error}</span>
              </div>
            )}
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <Label htmlFor="signup-name">Full Name</Label>
                <div className="relative mt-1">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="John Doe"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative mt-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative mt-1">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    className="pl-10"
                    required
                    minLength={6}
                  />
                </div>
                <p className="text-xs text-gray-600 mt-1">
                  Must be at least 6 characters
                </p>
              </div>

              <div className="flex items-start gap-2">
                <input type="checkbox" required className="mt-1" />
                <Label className="text-sm text-gray-600">
                  I agree to the Terms of Service and Privacy Policy
                </Label>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Creating account...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Create Account
                  </>
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>

        {/* Benefits */}
        <div className="border-t pt-4 mt-4">
          <p className="text-sm text-gray-600 mb-3">With an account you get:</p>
          <ul className="space-y-2 text-sm text-gray-700">
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Save your progress across devices
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Unlock premium content
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              Track your interview preparation
            </li>
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}

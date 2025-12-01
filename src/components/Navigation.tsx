import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Code2, Home, BookOpen, Lightbulb, CreditCard, User, LogOut, Menu, X, LayoutDashboard, ClipboardList } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';

interface NavigationProps {
  currentPage: string;
  hasUnlocked: boolean;
  user: { email: string; name: string } | null;
  onLogin: () => void;
  onLogout: () => void;
  onProtectedRouteClick?: () => void;
}

export function Navigation({ currentPage, hasUnlocked, user, onLogin, onLogout, onProtectedRouteClick }: NavigationProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Conditionally build nav items based on login status
  const navItems = [
    // Show Dashboard if logged in, Home if not logged in
    user 
      ? { id: 'dashboard', path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard }
      : { id: 'home', path: '/', label: 'Home', icon: Home },
    { id: 'questions', path: '/questions', label: 'Questions', icon: BookOpen },
    { id: 'practices', path: '/practices', label: 'Practices', icon: ClipboardList },
    { id: 'hints', path: '/hints', label: 'Hints', icon: Lightbulb },
    { id: 'pricing', path: '/pricing', label: 'Pricing', icon: CreditCard },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    if (path === '/practices') {
      return location.pathname.startsWith('/practices');
    }
    if (path === '/questions') {
      return location.pathname.startsWith('/questions');
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4 md:gap-8">
            <Link to="/" className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Code2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <span className="text-lg sm:text-xl">codeinterview</span>
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.map(item => {
                const isProtected = !user && (item.path === '/questions' || item.path === '/practices' || item.path === '/hints' || item.path === '/pricing');
                
                if (isProtected) {
                  return (
                    <Button
                      key={item.id}
                      variant={isActive(item.path) ? 'default' : 'ghost'}
                      className="gap-2"
                      onClick={(e) => {
                        e.preventDefault();
                        if (onProtectedRouteClick) {
                          onProtectedRouteClick();
                        }
                      }}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  );
                }
                
                return (
                  <Link key={item.id} to={item.path}>
                    <Button
                      variant={isActive(item.path) ? 'default' : 'ghost'}
                      className="gap-2"
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Button>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {hasUnlocked && (
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Premium
              </div>
            )}
            
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 hidden sm:flex"
                  >
                    <User className="w-4 h-4" />
                    <span className="hidden sm:inline">{user.name}</span>
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onLogout}
                  className="gap-2 hidden sm:flex"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </Button>
              </>
            ) : (
              <Button
                variant="default"
                size="sm"
                onClick={onLogin}
                className="hidden sm:flex"
              >
                Login
              </Button>
            )}

            {/* Mobile Menu Button */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[280px] sm:w-[350px]">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-blue-600" />
                    codeinterview
                  </SheetTitle>
                </SheetHeader>
                
                <div className="mt-6 space-y-4">
                  {/* User Section */}
                  {user ? (
                    <div className="pb-4 border-b">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm">{user.name}</p>
                          <p className="text-xs text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      {hasUnlocked && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-700 rounded-full text-sm w-fit">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          Premium Active
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="pb-4 border-b">
                      <Button
                        variant="default"
                        onClick={() => {
                          onLogin();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full"
                      >
                        Login / Sign Up
                      </Button>
                    </div>
                  )}

                  {/* Navigation Items */}
                  <div className="space-y-2">
                    {navItems.map(item => {
                      const isProtected = !user && (item.path === '/questions' || item.path === '/practices' || item.path === '/hints' || item.path === '/pricing');
                      
                      if (isProtected) {
                        return (
                          <Button
                            key={item.id}
                            variant={isActive(item.path) ? 'default' : 'ghost'}
                            className="w-full justify-start gap-3"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              if (onProtectedRouteClick) {
                                onProtectedRouteClick();
                              }
                            }}
                          >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                          </Button>
                        );
                      }
                      
                      return (
                        <Link
                          key={item.id}
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block"
                        >
                          <Button
                            variant={isActive(item.path) ? 'default' : 'ghost'}
                            className="w-full justify-start gap-3"
                          >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                          </Button>
                        </Link>
                      );
                    })}
                  </div>

                  {/* Logout Button */}
                  {user && (
                    <div className="pt-4 border-t">
                      <Button
                        variant="outline"
                        onClick={() => {
                          onLogout();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <LogOut className="w-5 h-5" />
                        Logout
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}

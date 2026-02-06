import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { useDashboardNavigation } from '../contexts/DashboardNavigationContext';
import { useAccentPreset } from '../hooks/useAccentPreset';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { LogIn, Moon, Sun, User, Settings, ChevronDown, Palette, Check } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

interface HeaderProps {
  onOpenProfile?: () => void;
}

export default function Header({ onOpenProfile }: HeaderProps) {
  const { login, loginStatus, identity } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { setActiveSection } = useDashboardNavigation();
  const { preset, setPreset, presets, availablePresets } = useAccentPreset();
  const [mounted, setMounted] = useState(false);

  const isAuthenticated = !!identity;
  const disabled = loginStatus === 'logging-in';

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  const toggleTheme = () => {
    // Toggle between light and dark explicitly
    const currentTheme = theme === 'system' ? resolvedTheme : theme;
    setTheme(currentTheme === 'dark' ? 'light' : 'dark');
  };

  const handleEditProfile = () => {
    if (onOpenProfile) {
      onOpenProfile();
    }
  };

  const handleNavigateToSettings = () => {
    setActiveSection('settings');
  };

  const handleLogoClick = () => {
    if (isAuthenticated) {
      // Navigate to dashboard home
      setActiveSection('home');
    } else {
      // Already on HomePage, scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Determine display name and avatar for authenticated users
  const displayName = profileLoading ? 'Loading...' : userProfile?.name || 'Account';
  const displayAvatar = userProfile?.avatar || '🎯';

  // Determine which icon to show based on current effective theme
  const effectiveTheme = theme === 'system' ? resolvedTheme : theme;
  const isDark = effectiveTheme === 'dark';

  return (
    <header className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogoClick}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-brand rounded-lg transition-transform hover:scale-105 active:scale-95"
            aria-label="Go to home"
          >
            <img
              src="/assets/logoo-removebg-preview.png"
              alt="LockedIn"
              className="h-14 w-auto"
            />
          </button>
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full hover:bg-accent/50 transition-colors"
                aria-label="Change accent color"
              >
                <Palette className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>Accent Color</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {availablePresets.map((presetKey) => (
                <DropdownMenuItem
                  key={presetKey}
                  onClick={() => setPreset(presetKey)}
                  className="cursor-pointer"
                >
                  <div className="flex items-center gap-2 w-full">
                    <div
                      className="h-4 w-4 rounded-full border border-border"
                      style={{
                        background: `oklch(${presets[presetKey].primary})`,
                      }}
                    />
                    <span className="flex-1">{presets[presetKey].label}</span>
                    {preset === presetKey && (
                      <Check className="h-4 w-4 text-brand" />
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            onClick={toggleTheme}
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-accent/50 transition-colors"
            aria-label="Toggle theme"
          >
            {mounted ? (
              isDark ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )
            ) : (
              <div className="h-5 w-5" />
            )}
          </Button>
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="gap-2 font-medium hover:bg-brand/10 hover:text-brand transition-colors"
                >
                  <span className="text-xl">{displayAvatar}</span>
                  {displayName}
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={handleEditProfile}>
                  <User className="h-4 w-4 mr-2" />
                  Edit Profile
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleNavigateToSettings}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={handleLogin}
              disabled={disabled}
              className="gap-2 bg-brand hover:bg-brand/90 text-brand-foreground font-semibold rounded-full px-6 shadow-md hover:shadow-lg transition-all"
            >
              {disabled ? (
                <>
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" />
                  Login
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

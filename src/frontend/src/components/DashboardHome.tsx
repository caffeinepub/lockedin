import { useRef } from 'react';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Target, Calendar, TrendingUp, CheckSquare, BarChart3, Settings, Sparkles } from 'lucide-react';
import LockedInGoalsSection from './lockedIn/LockedInGoalsSection';

type Section = 'goals' | 'milestones' | 'daily' | 'weekly' | 'analytics' | 'settings' | 'autoPlanner';

interface DashboardHomeProps {
  onNavigate: (section: Section) => void;
  onCheckInGoal: (goalId: bigint) => void;
}

export default function DashboardHome({ onNavigate, onCheckInGoal }: DashboardHomeProps) {
  const navigationRef = useRef<HTMLDivElement>(null);
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();

  const handleScrollToNavigation = () => {
    navigationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const navigationItems = [
    { id: 'autoPlanner' as Section, label: 'Auto Planner', icon: Sparkles, description: 'Generate structured plans automatically' },
    { id: 'goals' as Section, label: 'Goals', icon: Target, description: 'Define and manage your goals' },
    { id: 'milestones' as Section, label: 'Milestones', icon: CheckSquare, description: 'Break down goals into milestones' },
    { id: 'daily' as Section, label: 'Daily Tasks', icon: Calendar, description: 'Track your daily progress' },
    { id: 'weekly' as Section, label: 'Weekly Plan', icon: TrendingUp, description: 'View your weekly plan' },
    { id: 'analytics' as Section, label: 'Analytics', icon: BarChart3, description: 'View progress insights' },
    { id: 'settings' as Section, label: 'Settings', icon: Settings, description: 'Manage preferences' },
  ];

  const displayName = profileLoading ? 'Loading...' : userProfile?.name || 'there';
  const displayAvatar = userProfile?.avatar || '🎯';

  return (
    <div className="space-y-12 lockedin-bg">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <span className="text-4xl">{displayAvatar}</span>
          <h2 className="text-2xl font-semibold">
            Welcome back, {displayName}!
          </h2>
        </div>
        <h1 className="text-6xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-brand via-brand to-link bg-clip-text text-transparent">
          LOCKED-IN
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          Locked-in helps you turn future goals into clear plans and hold you accountable to the daily actions that actually make them happen. No motivation hacks, no endless to-do lists, just focus structure and execution. Stay locked-in!
        </p>

        {/* Proceed Button */}
        <div className="pt-6">
          <Button
            size="lg"
            onClick={handleScrollToNavigation}
            className="bg-brand hover:bg-brand/90 text-brand-foreground font-semibold text-lg px-12 py-6 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            PROCEED
          </Button>
        </div>
      </div>

      {/* Locked-in Goals Section */}
      <LockedInGoalsSection onNavigate={onNavigate} onCheckInGoal={onCheckInGoal} />

      {/* Navigation Section */}
      <div ref={navigationRef} className="space-y-6 scroll-mt-24">
        <h2 className="text-2xl font-semibold text-center mb-8">Navigate to</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className="group p-6 rounded-lg border-2 border-border bg-card hover:border-brand/50 hover:bg-brand/5 transition-all duration-200 text-left"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-brand/10 group-hover:bg-brand/20 transition-colors">
                    <Icon className="h-6 w-6 text-brand" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1 group-hover:text-brand transition-colors">
                      {item.label}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

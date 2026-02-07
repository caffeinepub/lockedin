import { useEffect } from 'react';
import { useGetGoals } from '../hooks/useQueries';
import { useDashboardNavigation } from '../contexts/DashboardNavigationContext';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu, Target, Calendar, TrendingUp, CheckSquare, BarChart3, Settings, Home, Sparkles } from 'lucide-react';
import { useState } from 'react';
import GoalsOverview from '../components/GoalsOverview';
import GoalDetail from '../components/GoalDetail';
import DashboardHome from '../components/DashboardHome';
import SettingsPanel from '../components/SettingsPanel';
import WeeklyPlanDashboard from '../components/WeeklyPlan/WeeklyPlanDashboard';
import AutoPlannerView from '../components/AutoPlanner/AutoPlannerView';
import DailyCheckIn from '../components/DailyCheckIn';

type Section = 'home' | 'goals' | 'milestones' | 'daily' | 'weekly' | 'analytics' | 'settings' | 'autoPlanner';

export default function Dashboard() {
  const { data: goals = [] } = useGetGoals();
  const { activeSection, setActiveSection } = useDashboardNavigation();
  const [selectedGoalId, setSelectedGoalId] = useState<bigint | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { id: 'home' as Section, label: 'Home', icon: Home },
    { id: 'autoPlanner' as Section, label: 'Auto Planner', icon: Sparkles },
    { id: 'goals' as Section, label: 'Goals', icon: Target },
    { id: 'milestones' as Section, label: 'Milestones', icon: CheckSquare },
    { id: 'daily' as Section, label: 'Daily Tasks', icon: Calendar },
    { id: 'weekly' as Section, label: 'Weekly Plan', icon: TrendingUp },
    { id: 'analytics' as Section, label: 'Analytics', icon: BarChart3 },
    { id: 'settings' as Section, label: 'Settings', icon: Settings },
  ];

  const handleMenuItemClick = (section: Section) => {
    setActiveSection(section);
    setIsMenuOpen(false);
  };

  const handleSelectGoal = (goalId: bigint) => {
    setSelectedGoalId(goalId);
    setActiveSection('milestones');
  };

  const handleGoalDeleted = () => {
    setSelectedGoalId(null);
    setActiveSection('goals');
  };

  const handleCheckInGoal = (goalId: bigint) => {
    setSelectedGoalId(goalId);
    setActiveSection('daily');
  };

  const MenuContent = () => (
    <nav className="space-y-2">
      {menuItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => handleMenuItemClick(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeSection === item.id
                ? 'bg-selection/10 text-brand font-medium ring-1 ring-selection/20'
                : 'hover:bg-accent/50 text-foreground'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex gap-6">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 space-y-6">
            <div className="p-4 rounded-lg border border-border bg-card">
              <h2 className="font-semibold mb-4">Navigation</h2>
              <MenuContent />
            </div>
          </div>
        </aside>

        {/* Hamburger Menu - Now visible on all screen sizes */}
        <div className="fixed bottom-6 right-6 z-50">
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button size="lg" className="rounded-full h-14 w-14 shadow-lg bg-brand hover:bg-brand/90 text-brand-foreground">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72">
              <div className="mt-8">
                <h2 className="font-semibold mb-4 px-4">Navigation</h2>
                <MenuContent />
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="space-y-6">
            {activeSection !== 'home' && (
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold">
                    {activeSection === 'autoPlanner' && 'Auto Planner'}
                    {activeSection === 'goals' && 'Your Goals'}
                    {activeSection === 'milestones' && 'Milestones & Planning'}
                    {activeSection === 'daily' && 'Daily Tasks'}
                    {activeSection === 'weekly' && 'Weekly Plan'}
                    {activeSection === 'analytics' && 'Analytics'}
                    {activeSection === 'settings' && 'Settings'}
                  </h1>
                  <p className="text-muted-foreground mt-1">
                    {activeSection === 'autoPlanner' && 'Generate structured plans with tasks and deadlines'}
                    {activeSection === 'goals' && 'Manage and track all your goals'}
                    {activeSection === 'milestones' && 'Break down your goals into actionable steps'}
                    {activeSection === 'daily' && 'Track your daily progress'}
                    {activeSection === 'weekly' && 'View your weekly plan and track progress'}
                    {activeSection === 'analytics' && 'View your progress insights'}
                    {activeSection === 'settings' && 'Manage your account and preferences'}
                  </p>
                </div>
              </div>
            )}

            {activeSection === 'home' && (
              <DashboardHome onNavigate={handleMenuItemClick} onCheckInGoal={handleCheckInGoal} />
            )}

            {activeSection === 'autoPlanner' && (
              <AutoPlannerView />
            )}

            {activeSection === 'goals' && (
              <GoalsOverview onSelectGoal={handleSelectGoal} />
            )}

            {activeSection === 'milestones' && selectedGoalId && (
              <GoalDetail goalId={selectedGoalId} onDeleted={handleGoalDeleted} />
            )}

            {activeSection === 'milestones' && !selectedGoalId && (
              <div className="text-center py-12 text-muted-foreground">
                Select a goal from the Goals section to view its details
              </div>
            )}

            {activeSection === 'daily' && selectedGoalId && (
              <DailyCheckIn goalId={selectedGoalId} />
            )}

            {activeSection === 'daily' && !selectedGoalId && (
              <div className="text-center py-12 text-muted-foreground">
                Select a goal from Home to check in on your daily tasks
              </div>
            )}

            {activeSection === 'weekly' && (
              <WeeklyPlanDashboard onNavigateToAutoPlanner={() => handleMenuItemClick('autoPlanner')} />
            )}

            {activeSection === 'analytics' && (
              <div className="text-center py-12 text-muted-foreground">
                Analytics view - Coming soon
              </div>
            )}

            {activeSection === 'settings' && <SettingsPanel />}
          </div>
        </main>
      </div>
    </div>
  );
}

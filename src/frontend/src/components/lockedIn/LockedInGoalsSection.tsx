import { useGetGoals } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lock, Sparkles } from 'lucide-react';
import CheckInTicker from './CheckInTicker';

interface LockedInGoalsSectionProps {
  onNavigate: (section: 'autoPlanner') => void;
}

export default function LockedInGoalsSection({ onNavigate }: LockedInGoalsSectionProps) {
  const { data: goals = [], isLoading } = useGetGoals();

  const lockedInGoals = goals.filter((goal) => goal.lockedIn);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Lock className="h-6 w-6 text-brand" />
          Locked-in Goals
        </h2>
        <p className="text-muted-foreground">Loading your locked-in goals...</p>
      </div>
    );
  }

  if (lockedInGoals.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Lock className="h-6 w-6 text-brand" />
          Locked-in Goals
        </h2>
        <Card className="border-dashed">
          <CardContent className="pt-6 text-center space-y-4">
            <p className="text-muted-foreground">
              You don't have any locked-in goals yet. Use the Auto Planner to create your first structured goal!
            </p>
            <Button
              onClick={() => onNavigate('autoPlanner')}
              className="bg-brand hover:bg-brand/90 text-brand-foreground"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Create Auto Plan
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold flex items-center gap-2">
        <Lock className="h-6 w-6 text-brand" />
        Locked-in Goals
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lockedInGoals.map((goal) => (
          <Card key={goal.id.toString()} className="hover:border-brand/50 transition-colors">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lock className="h-4 w-4 text-brand" />
                {goal.description}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CheckInTicker goalId={goal.id} />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

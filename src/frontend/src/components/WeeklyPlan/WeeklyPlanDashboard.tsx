import { useGetGoals } from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, Calendar, CheckSquare, Target } from 'lucide-react';
import WeeklyPlanGoalCard from './WeeklyPlanGoalCard';

interface WeeklyPlanDashboardProps {
  onNavigateToAutoPlanner: () => void;
}

export default function WeeklyPlanDashboard({ onNavigateToAutoPlanner }: WeeklyPlanDashboardProps) {
  const { data: goals = [], isLoading } = useGetGoals();

  const lockedInGoals = goals.filter((goal) => goal.lockedIn);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground">Loading your weekly plan...</p>
      </div>
    );
  }

  if (lockedInGoals.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="pt-6 text-center space-y-4">
          <div className="flex justify-center">
            <Calendar className="h-16 w-16 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">No Weekly Plan Yet</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              You don't have any locked-in goals yet. Use the Auto Planner to create your first structured goal with tasks and deadlines!
            </p>
          </div>
          <Button
            onClick={onNavigateToAutoPlanner}
            className="bg-brand hover:bg-brand/90 text-brand-foreground"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Create Auto Plan
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          Your weekly plan for {lockedInGoals.length} locked-in {lockedInGoals.length === 1 ? 'goal' : 'goals'}
        </p>
        <Button
          onClick={onNavigateToAutoPlanner}
          variant="outline"
          className="border-brand text-brand hover:bg-brand/10"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Create New Plan
        </Button>
      </div>

      <div className="space-y-6">
        {lockedInGoals.map((goal) => (
          <WeeklyPlanGoalCard key={goal.id.toString()} goal={goal} />
        ))}
      </div>
    </div>
  );
}

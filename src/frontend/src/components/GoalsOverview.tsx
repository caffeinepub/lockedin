import { useState } from 'react';
import { useGetGoals } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Target, Calendar, Lock, Library } from 'lucide-react';
import GoalDefinitionFlow from './GoalDefinitionFlow';
import GoalLibraryModal from './GoalLibraryModal';
import { Badge } from '@/components/ui/badge';

interface GoalsOverviewProps {
  onSelectGoal: (goalId: bigint) => void;
}

export default function GoalsOverview({ onSelectGoal }: GoalsOverviewProps) {
  const { data: goals = [], isLoading } = useGetGoals();
  const [showCreateGoal, setShowCreateGoal] = useState(false);
  const [showGoalLibrary, setShowGoalLibrary] = useState(false);

  const getTimeFrameLabel = (goal: any) => {
    // If custom duration exists and is non-zero, use it
    if (goal.durationDays && Number(goal.durationDays) > 0) {
      const days = Number(goal.durationDays);
      return `${days} ${days === 1 ? 'Day' : 'Days'}`;
    }

    // Otherwise use the timeFrame enum
    switch (goal.timeFrame) {
      case 'days30':
        return '30 Days';
      case 'days90':
        return '90 Days';
      case 'months6to12':
        return '6-12 Months';
      case 'years1to5':
        return '1-5 Years';
      default:
        return 'Custom';
    }
  };

  if (showCreateGoal) {
    return (
      <div className="space-y-4">
        <Button variant="outline" onClick={() => setShowCreateGoal(false)}>
          ← Back to Goals
        </Button>
        <GoalDefinitionFlow onComplete={() => setShowCreateGoal(false)} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading your goals...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-3">
        <Button
          onClick={() => setShowCreateGoal(true)}
          className="bg-brand hover:bg-brand/90 text-brand-foreground"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Goal
        </Button>
        <Button onClick={() => setShowGoalLibrary(true)} variant="outline">
          <Library className="h-4 w-4 mr-2" />
          Goal Library
        </Button>
      </div>

      {goals.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Target className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No goals yet</h3>
            <p className="text-muted-foreground mb-6">
              Create your first goal to start tracking your progress
            </p>
            <Button
              onClick={() => setShowCreateGoal(true)}
              className="bg-brand hover:bg-brand/90 text-brand-foreground"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Goal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <Card
              key={goal.id.toString()}
              className="cursor-pointer transition-all hover:shadow-md hover:border-brand/40"
              onClick={() => onSelectGoal(goal.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg line-clamp-2">{goal.description}</CardTitle>
                  {goal.lockedIn && (
                    <Lock className="h-5 w-5 text-brand shrink-0 ml-2" />
                  )}
                </div>
                <CardDescription className="line-clamp-2">{goal.motivation}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{getTimeFrameLabel(goal)}</span>
                </div>
                {goal.lockedIn && (
                  <Badge variant="secondary" className="mt-3">
                    Locked In
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showGoalLibrary && (
        <GoalLibraryModal
          onClose={() => setShowGoalLibrary(false)}
          onSkip={() => setShowGoalLibrary(false)}
        />
      )}
    </div>
  );
}

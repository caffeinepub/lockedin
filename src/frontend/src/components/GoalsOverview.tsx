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

  const getTimeFrameLabel = (timeFrame: string) => {
    switch (timeFrame) {
      case 'days30':
        return '30 Days';
      case 'days90':
        return '90 Days';
      case 'months6to12':
        return '6-12 Months';
      case 'years1to5':
        return '1-5 Years';
      default:
        return timeFrame;
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
      <div className="flex justify-between items-center">
        <div>
          <p className="text-muted-foreground">
            {goals.length === 0
              ? 'No goals yet. Create your first goal to get started.'
              : `You have ${goals.length} active ${goals.length === 1 ? 'goal' : 'goals'}`}
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowGoalLibrary(true)} variant="outline" className="gap-2">
            <Library className="h-4 w-4" />
            Goal Library
          </Button>
          <Button onClick={() => setShowCreateGoal(true)} className="gap-2 bg-brand hover:bg-brand/90 text-brand-foreground">
            <Plus className="h-4 w-4" />
            New Goal
          </Button>
        </div>
      </div>

      {goals.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No goals yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Start your journey by creating your first goal. Whether it's launching a product,
              growing your business, or achieving a personal milestone - we'll help you break it
              down and track your progress.
            </p>
            <div className="flex gap-3">
              <Button onClick={() => setShowGoalLibrary(true)} variant="outline" className="gap-2">
                <Library className="h-4 w-4" />
                Browse Goal Library
              </Button>
              <Button onClick={() => setShowCreateGoal(true)} className="gap-2 bg-brand hover:bg-brand/90 text-brand-foreground">
                <Plus className="h-4 w-4" />
                Create Custom Goal
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {goals.map((goal) => (
            <Card
              key={goal.id.toString()}
              className="hover:shadow-lg hover:border-brand/30 transition-all cursor-pointer"
              onClick={() => onSelectGoal(goal.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl mb-2">{goal.description}</CardTitle>
                    <CardDescription className="line-clamp-2">{goal.motivation}</CardDescription>
                  </div>
                  {goal.lockedIn && (
                    <Lock className="h-5 w-5 text-brand shrink-0" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{getTimeFrameLabel(goal.timeFrame)}</span>
                  </div>
                  <Badge variant={goal.lockedIn ? 'default' : 'outline'} className={goal.lockedIn ? 'bg-brand/10 text-brand border-brand/20' : ''}>
                    {goal.lockedIn ? 'Locked In' : 'Planning'}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {showGoalLibrary && (
        <GoalLibraryModal onClose={() => setShowGoalLibrary(false)} />
      )}
    </div>
  );
}

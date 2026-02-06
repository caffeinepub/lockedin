import { useState } from 'react';
import {
  useGetGoal,
  useIsGoalLockedIn,
  useGetMilestones,
  useGetWeeklyTasks,
  useGetDailyTasks,
  useDeleteGoal,
} from '../hooks/useQueries';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckSquare, Calendar, TrendingUp, Lock, Trash2 } from 'lucide-react';
import PlanningPhase from './PlanningPhase';
import DailyCheckIn from './DailyCheckIn';
import WeeklyReview from './WeeklyReview';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

interface GoalDetailProps {
  goalId: bigint;
  onDeleted?: () => void;
}

export default function GoalDetail({ goalId, onDeleted }: GoalDetailProps) {
  const { data: goal } = useGetGoal(goalId);
  const { data: isLocked } = useIsGoalLockedIn(goalId);
  const { data: milestones = [] } = useGetMilestones(goalId);
  const { data: weeklyTasks = [] } = useGetWeeklyTasks(goalId);
  const { data: dailyTasks = [] } = useGetDailyTasks(goalId);
  const [activeTab, setActiveTab] = useState('overview');
  const deleteGoal = useDeleteGoal();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteGoal.mutateAsync(goalId);
      setIsDeleteDialogOpen(false);
      if (onDeleted) {
        onDeleted();
      }
    } catch (error) {
      // Error is already handled by the mutation
    }
  };

  if (!goal) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading goal details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-2xl mb-2">{goal.description}</CardTitle>
              <CardDescription>{goal.motivation}</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              {isLocked && (
                <div className="flex items-center gap-2 text-brand">
                  <Lock className="h-5 w-5" />
                  <span className="text-sm font-medium">Locked In</span>
                </div>
              )}
              <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Goal
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Goal</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this goal? This will permanently remove the
                      goal and all associated data including milestones, tasks, check-ins, and
                      reviews. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={deleteGoal.isPending}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {deleteGoal.isPending ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-grid">
          <TabsTrigger value="overview" className="gap-2">
            <CheckSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="plan" className="gap-2">
            <CheckSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Plan</span>
          </TabsTrigger>
          <TabsTrigger value="daily" className="gap-2" disabled={!isLocked}>
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Daily</span>
          </TabsTrigger>
          <TabsTrigger value="weekly" className="gap-2" disabled={!isLocked}>
            <TrendingUp className="h-4 w-4" />
            <span className="hidden sm:inline">Weekly</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {!isLocked ? (
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Plan</CardTitle>
                <CardDescription>
                  Define your milestones, weekly tasks, and daily actions to lock in your plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PlanningPhase goalId={goalId} />
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-3">
              <Card className="border-brand/20 hover:border-brand/40 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">Milestones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-brand">{milestones.length}</div>
                  <p className="text-sm text-muted-foreground mt-1">Key milestones defined</p>
                </CardContent>
              </Card>
              <Card className="border-link/20 hover:border-link/40 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">Weekly Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-link">{weeklyTasks.length}</div>
                  <p className="text-sm text-muted-foreground mt-1">Tasks per week</p>
                </CardContent>
              </Card>
              <Card className="border-brand/20 hover:border-brand/40 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg">Daily Tasks</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-brand">{dailyTasks.length}</div>
                  <p className="text-sm text-muted-foreground mt-1">Daily actions</p>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="plan">
          <PlanningPhase goalId={goalId} />
        </TabsContent>

        <TabsContent value="daily">
          <DailyCheckIn goalId={goalId} />
        </TabsContent>

        <TabsContent value="weekly">
          <WeeklyReview goalId={goalId} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

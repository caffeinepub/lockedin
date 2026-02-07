import { useState } from 'react';
import {
  useGetGoal,
  useGetMilestones,
  useGetWeeklyTasks,
  useGetDailyTasks,
  useAddMilestones,
  useAddWeeklyTasks,
  useAddDailyTasks,
  useLockInGoal,
  useIsGoalLockedIn,
} from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Lock } from 'lucide-react';
import type { Milestone, Task } from '../backend';

type PlanStep = 'milestones' | 'weekly' | 'daily' | 'review';

interface PlanningPhaseProps {
  goalId: bigint;
}

export default function PlanningPhase({ goalId }: PlanningPhaseProps) {
  const { data: goal } = useGetGoal(goalId);
  const { data: milestones = [] } = useGetMilestones(goalId);
  const { data: weeklyTasks = [] } = useGetWeeklyTasks(goalId);
  const { data: dailyTasks = [] } = useGetDailyTasks(goalId);
  const { data: isLocked } = useIsGoalLockedIn(goalId);

  const addMilestones = useAddMilestones();
  const addWeeklyTasks = useAddWeeklyTasks();
  const addDailyTasks = useAddDailyTasks();
  const lockInGoal = useLockInGoal();

  const [step, setStep] = useState<PlanStep>('milestones');
  const [newMilestones, setNewMilestones] = useState<string[]>(['']);
  const [newWeeklyTasks, setNewWeeklyTasks] = useState<string[]>(['']);
  const [newDailyTasks, setNewDailyTasks] = useState<string[]>(['']);

  const handleAddMilestones = () => {
    const validMilestones = newMilestones.filter((m) => m.trim());
    if (validMilestones.length > 0) {
      const milestonesToAdd: Milestone[] = validMilestones.map((desc) => ({
        desc,
        dueDate: undefined,
      }));
      addMilestones.mutate(
        { goalId, milestones: milestonesToAdd },
        {
          onSuccess: () => {
            setNewMilestones(['']);
            setStep('weekly');
          },
        }
      );
    }
  };

  const handleAddWeeklyTasks = () => {
    const validTasks = newWeeklyTasks.filter((t) => t.trim());
    if (validTasks.length > 0) {
      const tasksToAdd: Task[] = validTasks.map((desc) => ({
        desc,
        isComplete: false,
        category: undefined,
      }));
      addWeeklyTasks.mutate(
        { goalId, tasks: tasksToAdd },
        {
          onSuccess: () => {
            setNewWeeklyTasks(['']);
            setStep('daily');
          },
        }
      );
    }
  };

  const handleAddDailyTasks = () => {
    const validTasks = newDailyTasks.filter((t) => t.trim());
    if (validTasks.length > 0) {
      const tasksToAdd: Task[] = validTasks.map((desc) => ({
        desc,
        isComplete: false,
        category: undefined,
      }));
      addDailyTasks.mutate(
        { goalId, tasks: tasksToAdd },
        {
          onSuccess: () => {
            setNewDailyTasks(['']);
            setStep('review');
          },
        }
      );
    }
  };

  const handleLockIn = () => {
    lockInGoal.mutate(goalId);
  };

  if (isLocked) {
    return (
      <Card className="max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Lock className="h-6 w-6 text-brand" />
            Plan Locked In
          </CardTitle>
          <CardDescription>Your plan is ready. You're LockedIn.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Goal</h3>
              <p className="text-muted-foreground">{goal?.description}</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Milestones ({milestones.length})</h3>
              <ul className="space-y-1">
                {milestones.map((m, i) => (
                  <li key={i} className="text-muted-foreground">
                    • {m.desc}
                  </li>
                ))}
              </ul>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Weekly Tasks ({weeklyTasks.length})</h3>
              <ul className="space-y-1">
                {weeklyTasks.map((t, i) => (
                  <li key={i} className="text-muted-foreground">
                    • {t.desc}
                  </li>
                ))}
              </ul>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-2">Daily Tasks ({dailyTasks.length})</h3>
              <ul className="space-y-1">
                {dailyTasks.map((t, i) => (
                  <li key={i} className="text-muted-foreground">
                    • {t.desc}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">
          {step === 'milestones' && 'Break Down Into Milestones'}
          {step === 'weekly' && 'Define Weekly Tasks'}
          {step === 'daily' && 'Define Daily Tasks'}
          {step === 'review' && 'Review Your Plan'}
        </CardTitle>
        <CardDescription>
          {step === 'milestones' && 'What are the key milestones to reach your goal?'}
          {step === 'weekly' && 'What tasks should you complete each week?'}
          {step === 'daily' && 'What daily actions will move you forward?'}
          {step === 'review' && 'Review and lock in your plan to start tracking'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {step === 'milestones' && (
          <div className="space-y-4">
            {newMilestones.map((milestone, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={milestone}
                  onChange={(e) => {
                    const updated = [...newMilestones];
                    updated[index] = e.target.value;
                    setNewMilestones(updated);
                  }}
                  placeholder={`Milestone ${index + 1}`}
                />
                {newMilestones.length > 1 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setNewMilestones(newMilestones.filter((_, i) => i !== index));
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => setNewMilestones([...newMilestones, ''])}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Milestone
            </Button>
            <Button
              onClick={handleAddMilestones}
              disabled={!newMilestones.some((m) => m.trim()) || addMilestones.isPending}
              className="w-full"
            >
              {addMilestones.isPending ? 'Saving...' : 'Continue'}
            </Button>
          </div>
        )}

        {step === 'weekly' && (
          <div className="space-y-4">
            {newWeeklyTasks.map((task, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={task}
                  onChange={(e) => {
                    const updated = [...newWeeklyTasks];
                    updated[index] = e.target.value;
                    setNewWeeklyTasks(updated);
                  }}
                  placeholder={`Weekly task ${index + 1}`}
                />
                {newWeeklyTasks.length > 1 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setNewWeeklyTasks(newWeeklyTasks.filter((_, i) => i !== index));
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => setNewWeeklyTasks([...newWeeklyTasks, ''])}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
            <div className="flex gap-3">
              <Button onClick={() => setStep('milestones')} variant="outline" className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleAddWeeklyTasks}
                disabled={!newWeeklyTasks.some((t) => t.trim()) || addWeeklyTasks.isPending}
                className="flex-1"
              >
                {addWeeklyTasks.isPending ? 'Saving...' : 'Continue'}
              </Button>
            </div>
          </div>
        )}

        {step === 'daily' && (
          <div className="space-y-4">
            {newDailyTasks.map((task, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={task}
                  onChange={(e) => {
                    const updated = [...newDailyTasks];
                    updated[index] = e.target.value;
                    setNewDailyTasks(updated);
                  }}
                  placeholder={`Daily task ${index + 1}`}
                />
                {newDailyTasks.length > 1 && (
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setNewDailyTasks(newDailyTasks.filter((_, i) => i !== index));
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => setNewDailyTasks([...newDailyTasks, ''])}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
            <div className="flex gap-3">
              <Button onClick={() => setStep('weekly')} variant="outline" className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleAddDailyTasks}
                disabled={!newDailyTasks.some((t) => t.trim()) || addDailyTasks.isPending}
                className="flex-1"
              >
                {addDailyTasks.isPending ? 'Saving...' : 'Continue'}
              </Button>
            </div>
          </div>
        )}

        {step === 'review' && (
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Goal</h3>
                <p className="text-muted-foreground">{goal?.description}</p>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Milestones ({milestones.length})</h3>
                <ul className="space-y-1">
                  {milestones.map((m, i) => (
                    <li key={i} className="text-muted-foreground">
                      • {m.desc}
                    </li>
                  ))}
                </ul>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Weekly Tasks ({weeklyTasks.length})</h3>
                <ul className="space-y-1">
                  {weeklyTasks.map((t, i) => (
                    <li key={i} className="text-muted-foreground">
                      • {t.desc}
                    </li>
                  ))}
                </ul>
              </div>
              <Separator />
              <div>
                <h3 className="font-semibold mb-2">Daily Tasks ({dailyTasks.length})</h3>
                <ul className="space-y-1">
                  {dailyTasks.map((t, i) => (
                    <li key={i} className="text-muted-foreground">
                      • {t.desc}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="flex gap-3">
              <Button onClick={() => setStep('daily')} variant="outline" className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleLockIn}
                disabled={lockInGoal.isPending}
                className="flex-1 bg-brand hover:bg-brand/90 text-white"
              >
                {lockInGoal.isPending ? 'Locking In...' : 'Lock It In'}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

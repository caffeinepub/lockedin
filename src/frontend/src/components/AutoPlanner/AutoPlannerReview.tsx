import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Save, ArrowLeft, Calendar } from 'lucide-react';
import type { GeneratedPlan } from '../../lib/autoPlanner/generatePlan';
import type { Milestone, Task } from '../../backend';
import { useCreateGoal, useAddMilestones, useAddWeeklyTasks, useAddDailyTasks, useLockInGoal } from '../../hooks/useQueries';
import { toast } from 'sonner';

interface AutoPlannerReviewProps {
  plan: GeneratedPlan;
  onBack: () => void;
  onSaveComplete: () => void;
}

export default function AutoPlannerReview({ plan, onBack, onSaveComplete }: AutoPlannerReviewProps) {
  const [editedGoal, setEditedGoal] = useState(plan.goal);
  const [editedMilestones, setEditedMilestones] = useState<Array<{ desc: string; dueDate: string }>>(
    plan.milestones.map((m) => ({
      desc: m.desc,
      dueDate: m.dueDate || '',
    }))
  );
  const [editedWeeklyTasks, setEditedWeeklyTasks] = useState<string[]>(
    plan.weeklyTasks.map((t) => t.desc)
  );
  const [editedDailyTasks, setEditedDailyTasks] = useState<string[]>(
    plan.dailyTasks.map((t) => t.desc)
  );

  const createGoal = useCreateGoal();
  const addMilestones = useAddMilestones();
  const addWeeklyTasks = useAddWeeklyTasks();
  const addDailyTasks = useAddDailyTasks();
  const lockInGoal = useLockInGoal();

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);

    try {
      // Create goal
      const goalId = await createGoal.mutateAsync({
        description: editedGoal,
        timeFrame: plan.timeFrame,
        motivation: plan.motivation,
      });

      // Add milestones with due dates
      const milestonesToAdd: Milestone[] = editedMilestones
        .filter((m) => m.desc.trim())
        .map((m) => ({
          desc: m.desc,
          dueDate: m.dueDate ? BigInt(new Date(m.dueDate).getTime() * 1_000_000) : undefined,
        }));

      if (milestonesToAdd.length > 0) {
        await addMilestones.mutateAsync({ goalId, milestones: milestonesToAdd });
      }

      // Add weekly tasks
      const weeklyTasksToAdd: Task[] = editedWeeklyTasks
        .filter((t) => t.trim())
        .map((desc) => ({
          desc,
          isComplete: false,
          category: undefined,
        }));

      if (weeklyTasksToAdd.length > 0) {
        await addWeeklyTasks.mutateAsync({ goalId, tasks: weeklyTasksToAdd });
      }

      // Add daily tasks
      const dailyTasksToAdd: Task[] = editedDailyTasks
        .filter((t) => t.trim())
        .map((desc) => ({
          desc,
          isComplete: false,
          category: undefined,
        }));

      if (dailyTasksToAdd.length > 0) {
        await addDailyTasks.mutateAsync({ goalId, tasks: dailyTasksToAdd });
      }

      // Lock in the goal
      await lockInGoal.mutateAsync(goalId);

      toast.success("You're LockedIn! Your plan is ready.");
      onSaveComplete();
    } catch (error: any) {
      toast.error(`Failed to save plan: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const previewMetrics = {
    totalMilestones: editedMilestones.filter((m) => m.desc.trim()).length,
    milestonesWithDeadlines: editedMilestones.filter((m) => m.desc.trim() && m.dueDate).length,
    weeklyTaskCount: editedWeeklyTasks.filter((t) => t.trim()).length,
    dailyTaskCount: editedDailyTasks.filter((t) => t.trim()).length,
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Review & Edit Your Plan</CardTitle>
        <CardDescription>
          Customize your plan before saving. All fields are editable.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Goal */}
        <div className="space-y-2">
          <label className="font-semibold">Goal</label>
          <Input
            value={editedGoal}
            onChange={(e) => setEditedGoal(e.target.value)}
            placeholder="Goal description"
          />
        </div>

        <Separator />

        {/* Tracking Metrics Preview */}
        <div className="p-4 rounded-lg bg-brand/5 border border-brand/20">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            📊 Tracking Metrics Preview
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Total Milestones</p>
              <p className="text-lg font-semibold">{previewMetrics.totalMilestones}</p>
            </div>
            <div>
              <p className="text-muted-foreground">With Deadlines</p>
              <p className="text-lg font-semibold">{previewMetrics.milestonesWithDeadlines}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Weekly Tasks</p>
              <p className="text-lg font-semibold">{previewMetrics.weeklyTaskCount}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Daily Tasks</p>
              <p className="text-lg font-semibold">{previewMetrics.dailyTaskCount}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Milestones */}
        <div className="space-y-3">
          <h3 className="font-semibold">Milestones</h3>
          {editedMilestones.map((milestone, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={milestone.desc}
                onChange={(e) => {
                  const updated = [...editedMilestones];
                  updated[index].desc = e.target.value;
                  setEditedMilestones(updated);
                }}
                placeholder={`Milestone ${index + 1}`}
                className="flex-1"
              />
              <Input
                type="date"
                value={milestone.dueDate}
                onChange={(e) => {
                  const updated = [...editedMilestones];
                  updated[index].dueDate = e.target.value;
                  setEditedMilestones(updated);
                }}
                className="w-40"
              />
              {editedMilestones.length > 1 && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setEditedMilestones(editedMilestones.filter((_, i) => i !== index));
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => setEditedMilestones([...editedMilestones, { desc: '', dueDate: '' }])}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Milestone
          </Button>
        </div>

        <Separator />

        {/* Weekly Tasks */}
        <div className="space-y-3">
          <h3 className="font-semibold">Weekly Tasks</h3>
          {editedWeeklyTasks.map((task, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={task}
                onChange={(e) => {
                  const updated = [...editedWeeklyTasks];
                  updated[index] = e.target.value;
                  setEditedWeeklyTasks(updated);
                }}
                placeholder={`Weekly task ${index + 1}`}
              />
              {editedWeeklyTasks.length > 1 && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setEditedWeeklyTasks(editedWeeklyTasks.filter((_, i) => i !== index));
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => setEditedWeeklyTasks([...editedWeeklyTasks, ''])}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Weekly Task
          </Button>
        </div>

        <Separator />

        {/* Daily Tasks */}
        <div className="space-y-3">
          <h3 className="font-semibold">Daily Tasks</h3>
          {editedDailyTasks.map((task, index) => (
            <div key={index} className="flex gap-2">
              <Input
                value={task}
                onChange={(e) => {
                  const updated = [...editedDailyTasks];
                  updated[index] = e.target.value;
                  setEditedDailyTasks(updated);
                }}
                placeholder={`Daily task ${index + 1}`}
              />
              {editedDailyTasks.length > 1 && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    setEditedDailyTasks(editedDailyTasks.filter((_, i) => i !== index));
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
          <Button
            variant="outline"
            onClick={() => setEditedDailyTasks([...editedDailyTasks, ''])}
            className="w-full"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Daily Task
          </Button>
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={onBack} variant="outline" className="flex-1">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || !editedGoal.trim()}
            className="flex-1 bg-brand hover:bg-brand/90 text-brand-foreground"
          >
            {isSaving ? (
              'Saving...'
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save & Lock In
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

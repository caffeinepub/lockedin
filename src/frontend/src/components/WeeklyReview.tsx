import { useState } from 'react';
import {
  useGetWeeklyTasks,
  useSubmitWeeklyReview,
  useGetWeeklyReviewsByGoal,
} from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { TrendingUp, CheckCircle2 } from 'lucide-react';
import type { Task } from '../backend';
import { formatBackendDate } from '../utils/dates';

interface WeeklyReviewProps {
  goalId: bigint;
}

export default function WeeklyReview({ goalId }: WeeklyReviewProps) {
  const { data: weeklyTasks = [] } = useGetWeeklyTasks(goalId);
  const { data: reviews = [] } = useGetWeeklyReviewsByGoal(goalId);
  const submitReview = useSubmitWeeklyReview();

  const [completedTaskIds, setCompletedTaskIds] = useState<Set<number>>(new Set());
  const [progressSummary, setProgressSummary] = useState('');

  const handleToggleTask = (index: number) => {
    const newSet = new Set(completedTaskIds);
    if (newSet.has(index)) {
      newSet.delete(index);
    } else {
      newSet.add(index);
    }
    setCompletedTaskIds(newSet);
  };

  const handleSubmit = () => {
    const completed: Task[] = [];
    const planned: Task[] = [];

    weeklyTasks.forEach((task, index) => {
      if (completedTaskIds.has(index)) {
        completed.push({ ...task, isComplete: true });
      }
      planned.push(task);
    });

    submitReview.mutate(
      {
        goalId,
        plannedTasks: planned,
        completedTasks: completed,
        progressSummary,
      },
      {
        onSuccess: () => {
          setCompletedTaskIds(new Set());
          setProgressSummary('');
        },
      }
    );
  };

  const completionRate =
    weeklyTasks.length > 0 ? Math.round((completedTaskIds.size / weeklyTasks.length) * 100) : 0;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Weekly Review
          </CardTitle>
          <CardDescription>
            Review your weekly progress and reflect on your execution
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {weeklyTasks.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <img 
                src="/assets/generated/illustration-reviews.dim_512x512.png" 
                alt="Weekly review" 
                className="w-32 h-32 mx-auto opacity-50"
              />
              <p className="text-muted-foreground">
                No weekly tasks defined yet. Complete your planning phase first.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg bg-accent/50">
                  <span className="font-medium">Completion Rate</span>
                  <span className="text-2xl font-bold text-accent-gold">{completionRate}%</span>
                </div>

                <div className="space-y-3">
                  <Label className="text-base">Weekly Tasks</Label>
                  {weeklyTasks.map((task, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg border border-border"
                    >
                      <Checkbox
                        id={`weekly-task-${index}`}
                        checked={completedTaskIds.has(index)}
                        onCheckedChange={() => handleToggleTask(index)}
                      />
                      <Label
                        htmlFor={`weekly-task-${index}`}
                        className={`flex-1 cursor-pointer ${
                          completedTaskIds.has(index) ? 'line-through text-muted-foreground' : ''
                        }`}
                      >
                        {task.desc}
                      </Label>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary">Progress Summary</Label>
                  <Textarea
                    id="summary"
                    value={progressSummary}
                    onChange={(e) => setProgressSummary(e.target.value)}
                    placeholder="Reflect on your week... What went well? What challenges did you face? What will you adjust?"
                    rows={5}
                  />
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!progressSummary.trim() || submitReview.isPending}
                className="w-full"
              >
                {submitReview.isPending ? 'Submitting...' : 'Submit Review'}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {reviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Past Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {reviews.slice(0, 3).map((review, index) => (
                <div key={index}>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Week of {formatBackendDate(review.weekStart, { 
                          year: 'numeric', 
                          month: 'short', 
                          day: 'numeric' 
                        })}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {review.completedTasks.length} / {review.plannedTasks.length} completed
                      </span>
                    </div>
                    
                    {review.completedTasks.length > 0 ? (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm font-medium text-accent-gold">
                          <CheckCircle2 className="h-4 w-4" />
                          <span>Accomplished Tasks:</span>
                        </div>
                        <ul className="list-disc list-inside space-y-1 ml-2">
                          {review.completedTasks.map((task, taskIndex) => (
                            <li key={taskIndex} className="text-sm text-muted-foreground">
                              {task.desc}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground italic">
                        No tasks were completed this week.
                      </div>
                    )}
                    
                    <div className="pt-2">
                      <p className="text-sm text-muted-foreground">{review.progressSummary}</p>
                    </div>
                  </div>
                  {index < reviews.length - 1 && <Separator className="mt-6" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

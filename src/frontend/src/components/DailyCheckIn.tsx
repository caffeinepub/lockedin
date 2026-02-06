import { useState } from 'react';
import {
  useGetDailyTasks,
  useSubmitDailyCheckIn,
  useGetDailyCheckInsByGoal,
} from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Calendar } from 'lucide-react';
import type { Task } from '../backend';
import { Type } from '../backend';
import { formatBackendDate } from '../utils/dates';

interface DailyCheckInProps {
  goalId: bigint;
}

export default function DailyCheckIn({ goalId }: DailyCheckInProps) {
  const { data: dailyTasks = [] } = useGetDailyTasks(goalId);
  const { data: checkIns = [] } = useGetDailyCheckInsByGoal(goalId);
  const submitCheckIn = useSubmitDailyCheckIn();

  const [completedTaskIds, setCompletedTaskIds] = useState<Set<number>>(new Set());
  const [missedReasons, setMissedReasons] = useState<Map<number, Type>>(new Map());

  const handleToggleTask = (index: number) => {
    const newSet = new Set(completedTaskIds);
    if (newSet.has(index)) {
      newSet.delete(index);
      const newReasons = new Map(missedReasons);
      newReasons.delete(index);
      setMissedReasons(newReasons);
    } else {
      newSet.add(index);
    }
    setCompletedTaskIds(newSet);
  };

  const handleSetReason = (index: number, reason: Type) => {
    const newReasons = new Map(missedReasons);
    newReasons.set(index, reason);
    setMissedReasons(newReasons);
  };

  const handleSubmit = () => {
    const completed: Task[] = [];
    const missed: Task[] = [];

    dailyTasks.forEach((task, index) => {
      if (completedTaskIds.has(index)) {
        completed.push({ ...task, isComplete: true });
      } else {
        missed.push({
          ...task,
          isComplete: false,
          category: missedReasons.get(index),
        });
      }
    });

    submitCheckIn.mutate(
      { goalId, completedTasks: completed, missedTasks: missed },
      {
        onSuccess: () => {
          setCompletedTaskIds(new Set());
          setMissedReasons(new Map());
        },
      }
    );
  };

  const allTasksReviewed =
    dailyTasks.length > 0 &&
    dailyTasks.every((_, index) => completedTaskIds.has(index) || missedReasons.has(index));

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            Daily Check-In
          </CardTitle>
          <CardDescription>Review your daily tasks and mark what you completed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {dailyTasks.length === 0 ? (
            <div className="text-center py-8 space-y-4">
              <img 
                src="/assets/generated/illustration-reviews.dim_512x512.png" 
                alt="Daily check-in" 
                className="w-32 h-32 mx-auto opacity-50"
              />
              <p className="text-muted-foreground">
                No daily tasks defined yet. Complete your planning phase first.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {dailyTasks.map((task, index) => (
                  <div key={index} className="space-y-3 p-4 rounded-lg border border-border">
                    <div className="flex items-start gap-3">
                      <Checkbox
                        id={`task-${index}`}
                        checked={completedTaskIds.has(index)}
                        onCheckedChange={() => handleToggleTask(index)}
                      />
                      <Label
                        htmlFor={`task-${index}`}
                        className={`flex-1 cursor-pointer ${
                          completedTaskIds.has(index) ? 'line-through text-muted-foreground' : ''
                        }`}
                      >
                        {task.desc}
                      </Label>
                    </div>
                    {!completedTaskIds.has(index) && (
                      <div className="ml-7 space-y-2">
                        <Label className="text-sm text-muted-foreground">
                          Why was this missed?
                        </Label>
                        <Select
                          value={missedReasons.get(index) || ''}
                          onValueChange={(value) => handleSetReason(index, value as Type)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select reason" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={Type.avoidance}>Avoidance</SelectItem>
                            <SelectItem value={Type.distraction}>Distraction</SelectItem>
                            <SelectItem value={Type.overplanning}>Overplanning</SelectItem>
                            <SelectItem value={Type.lowEnergy}>Low Energy</SelectItem>
                            <SelectItem value={Type.other}>Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <Button
                onClick={handleSubmit}
                disabled={!allTasksReviewed || submitCheckIn.isPending}
                className="w-full"
              >
                {submitCheckIn.isPending ? 'Submitting...' : 'Submit Check-In'}
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {checkIns.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Check-Ins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {checkIns.slice(0, 5).map((checkIn, index) => (
                <div key={index}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">
                      {formatBackendDate(checkIn.date, { 
                        weekday: 'short', 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {checkIn.completedTasks.length} completed, {checkIn.missedTasks.length}{' '}
                      missed
                    </span>
                  </div>
                  {index < checkIns.length - 1 && <Separator className="mt-4" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

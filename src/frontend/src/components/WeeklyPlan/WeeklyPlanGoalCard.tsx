import { useState } from 'react';
import type { Goal } from '../../backend';
import {
  useGetMilestones,
  useGetWeeklyTasks,
  useGetDailyTasks,
  useGetDailyCheckInsByGoal,
  useGetWeeklyReviewsByGoal,
} from '../../hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, ChevronUp, Target, Calendar, CheckSquare, TrendingUp } from 'lucide-react';
import { formatBackendDate } from '../../utils/dates';
import { computeGoalMetrics } from '../../utils/trackingMetrics';

interface WeeklyPlanGoalCardProps {
  goal: Goal;
}

export default function WeeklyPlanGoalCard({ goal }: WeeklyPlanGoalCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const { data: milestones = [] } = useGetMilestones(goal.id);
  const { data: weeklyTasks = [] } = useGetWeeklyTasks(goal.id);
  const { data: dailyTasks = [] } = useGetDailyTasks(goal.id);
  const { data: checkIns = [] } = useGetDailyCheckInsByGoal(goal.id);
  const { data: weeklyReviews = [] } = useGetWeeklyReviewsByGoal(goal.id);

  const metrics = computeGoalMetrics(checkIns, weeklyReviews);

  const upcomingMilestones = milestones
    .filter((m) => m.dueDate !== undefined)
    .sort((a, b) => {
      if (!a.dueDate || !b.dueDate) return 0;
      return Number(a.dueDate - b.dueDate);
    })
    .slice(0, 3);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl flex items-center gap-2">
              <Target className="h-5 w-5 text-accent-gold" />
              {goal.description}
            </CardTitle>
            <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
              <span>📊 {metrics.checkInCount} check-ins (last 7 days)</span>
              {metrics.checkInCount > 0 && (
                <span>✅ {Math.round(metrics.completionRate * 100)}% completion</span>
              )}
              <span>📝 {metrics.weeklyReviewCount} reviews</span>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Upcoming Milestones */}
          {upcomingMilestones.length > 0 && (
            <div>
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-accent-gold" />
                Upcoming Milestones
              </h4>
              <div className="space-y-2">
                {upcomingMilestones.map((milestone, index) => (
                  <div
                    key={index}
                    className="flex items-start justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <span className="text-sm">{milestone.desc}</span>
                    {milestone.dueDate && (
                      <span className="text-xs text-muted-foreground whitespace-nowrap ml-2">
                        {formatBackendDate(milestone.dueDate, { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          <Separator />

          {/* Weekly Tasks */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent-gold" />
              Weekly Tasks ({weeklyTasks.length})
            </h4>
            {weeklyTasks.length > 0 ? (
              <ul className="space-y-2">
                {weeklyTasks.map((task, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-accent-gold mt-0.5">•</span>
                    <span>{task.desc}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No weekly tasks defined</p>
            )}
          </div>

          <Separator />

          {/* Daily Tasks */}
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <CheckSquare className="h-4 w-4 text-accent-gold" />
              Daily Tasks ({dailyTasks.length})
            </h4>
            {dailyTasks.length > 0 ? (
              <ul className="space-y-2">
                {dailyTasks.map((task, index) => (
                  <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-accent-gold mt-0.5">•</span>
                    <span>{task.desc}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No daily tasks defined</p>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );
}

import { useGetDailyCheckInsByGoal, useGetGoal } from '../../hooks/useQueries';
import { computeCheckInStats } from '../../utils/trackingMetrics';
import { CheckCircle2, XCircle, Circle } from 'lucide-react';

interface CheckInTickerProps {
  goalId: bigint;
}

export default function CheckInTicker({ goalId }: CheckInTickerProps) {
  const { data: checkIns = [], isLoading: checkInsLoading } = useGetDailyCheckInsByGoal(goalId);
  const { data: goal, isLoading: goalLoading } = useGetGoal(goalId);

  if (checkInsLoading || goalLoading) {
    return (
      <div className="space-y-2">
        <p className="text-sm text-muted-foreground">Loading check-ins...</p>
      </div>
    );
  }

  const stats = computeCheckInStats(checkIns, goal?.createdAt);
  const daysShown = stats.last7Days.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-1">
        {stats.last7Days.map((day, index) => {
          if (day.hasCheckIn) {
            const completionRate = day.completedTasks / (day.completedTasks + day.missedTasks);
            const isGood = completionRate >= 0.7;
            return (
              <div
                key={index}
                className="flex-1 h-8 rounded flex items-center justify-center"
                style={{
                  backgroundColor: isGood ? 'oklch(0.7 0.15 142)' : 'oklch(0.6 0.15 30)',
                }}
                title={`${day.completedTasks} completed, ${day.missedTasks} missed`}
              >
                {isGood ? (
                  <CheckCircle2 className="h-4 w-4 text-white" />
                ) : (
                  <XCircle className="h-4 w-4 text-white" />
                )}
              </div>
            );
          }
          return (
            <div
              key={index}
              className="flex-1 h-8 rounded flex items-center justify-center bg-muted"
              title="No check-in"
            >
              <Circle className="h-4 w-4 text-muted-foreground" />
            </div>
          );
        })}
      </div>
      <div className="text-xs text-muted-foreground space-y-1">
        <p>Last {daysShown} {daysShown === 1 ? 'day' : 'days'} • {stats.checkInCount} check-ins</p>
        {stats.checkInCount > 0 && (
          <p>Completion rate: {Math.round(stats.completionRate * 100)}%</p>
        )}
      </div>
    </div>
  );
}

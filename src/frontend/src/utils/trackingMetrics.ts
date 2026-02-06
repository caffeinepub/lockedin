import type { DailyCheckIn, WeeklyReview } from '../backend';

export interface CheckInStats {
  last7Days: Array<{
    hasCheckIn: boolean;
    completedTasks: number;
    missedTasks: number;
  }>;
  checkInCount: number;
  completionRate: number;
}

export function computeCheckInStats(checkIns: DailyCheckIn[]): CheckInStats {
  const now = Date.now();
  const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

  // Get check-ins from last 7 days
  const recentCheckIns = checkIns.filter((checkIn) => {
    const checkInDate = Number(checkIn.date / 1_000_000n);
    return checkInDate >= sevenDaysAgo;
  });

  // Create array for last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const dayTimestamp = now - i * 24 * 60 * 60 * 1000;
    const dayStart = new Date(dayTimestamp).setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayTimestamp).setHours(23, 59, 59, 999);

    const checkInForDay = recentCheckIns.find((checkIn) => {
      const checkInDate = Number(checkIn.date / 1_000_000n);
      return checkInDate >= dayStart && checkInDate <= dayEnd;
    });

    if (checkInForDay) {
      return {
        hasCheckIn: true,
        completedTasks: checkInForDay.completedTasks.length,
        missedTasks: checkInForDay.missedTasks.length,
      };
    }

    return {
      hasCheckIn: false,
      completedTasks: 0,
      missedTasks: 0,
    };
  }).reverse();

  // Calculate overall stats
  let totalCompleted = 0;
  let totalMissed = 0;
  let checkInCount = 0;

  for (const day of last7Days) {
    if (day.hasCheckIn) {
      checkInCount++;
      totalCompleted += day.completedTasks;
      totalMissed += day.missedTasks;
    }
  }

  const completionRate =
    totalCompleted + totalMissed > 0 ? totalCompleted / (totalCompleted + totalMissed) : 0;

  return {
    last7Days,
    checkInCount,
    completionRate,
  };
}

export interface GoalMetrics {
  checkInCount: number;
  completionRate: number;
  weeklyReviewCount: number;
}

export function computeGoalMetrics(
  checkIns: DailyCheckIn[],
  weeklyReviews: WeeklyReview[]
): GoalMetrics {
  const stats = computeCheckInStats(checkIns);

  return {
    checkInCount: stats.checkInCount,
    completionRate: stats.completionRate,
    weeklyReviewCount: weeklyReviews.length,
  };
}

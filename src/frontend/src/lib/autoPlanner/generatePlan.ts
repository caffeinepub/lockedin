import type { Milestone, Task } from '../../backend';
import { Type__1 } from '../../backend';

export interface GeneratedPlan {
  goal: string;
  timeFrame: Type__1;
  motivation: string;
  milestones: Array<{ desc: string; dueDate?: string }>;
  weeklyTasks: Task[];
  dailyTasks: Task[];
  durationDays?: number;
}

/**
 * Get the default duration in days for a given timeframe
 */
function getDefaultDurationForTimeframe(timeFrame: Type__1): number {
  switch (timeFrame) {
    case Type__1.days30:
      return 30;
    case Type__1.days90:
      return 90;
    case Type__1.months6to12:
      return 270;
    case Type__1.years1to5:
      return 730;
    default:
      return 90;
  }
}

export function generatePlan(
  goalDescription: string,
  timeFrame: Type__1,
  customDurationDays?: number
): GeneratedPlan {
  const now = new Date();
  
  // Calculate effective duration for plan generation
  const defaultDuration = getDefaultDurationForTimeframe(timeFrame);
  const effectiveDuration = customDurationDays || defaultDuration;
  
  // Only set durationDays in the plan if it differs from the timeframe default
  const isCustomDuration = customDurationDays !== undefined && customDurationDays !== defaultDuration;

  // Generate milestones with deadlines
  const milestoneCount = effectiveDuration <= 30 ? 3 : effectiveDuration <= 90 ? 4 : 5;
  const milestones: Array<{ desc: string; dueDate?: string }> = [];
  
  for (let i = 0; i < milestoneCount; i++) {
    const daysOffset = Math.floor((effectiveDuration / milestoneCount) * (i + 1));
    const dueDate = new Date(now.getTime() + daysOffset * 24 * 60 * 60 * 1000);
    
    milestones.push({
      desc: `Milestone ${i + 1}: Progress checkpoint for ${goalDescription}`,
      dueDate: dueDate.toISOString().split('T')[0],
    });
  }

  // Generate weekly tasks
  const weeklyTasks: Task[] = [
    { desc: `Review progress on ${goalDescription}`, isComplete: false, category: undefined },
    { desc: `Complete key activities for ${goalDescription}`, isComplete: false, category: undefined },
    { desc: `Plan next week's actions`, isComplete: false, category: undefined },
  ];

  // Generate daily tasks
  const dailyTasks: Task[] = [
    { desc: `Work on ${goalDescription} for 30 minutes`, isComplete: false, category: undefined },
    { desc: `Track progress and adjust plan`, isComplete: false, category: undefined },
  ];

  return {
    goal: goalDescription,
    timeFrame,
    motivation: `Achieve ${goalDescription} through consistent daily action and structured planning`,
    milestones,
    weeklyTasks,
    dailyTasks,
    durationDays: isCustomDuration ? customDurationDays : undefined,
  };
}

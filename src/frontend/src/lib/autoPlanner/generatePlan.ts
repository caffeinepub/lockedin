import type { Milestone, Task } from '../../backend';
import { Type__1 } from '../../backend';

export interface GeneratedPlan {
  goal: string;
  timeFrame: Type__1;
  motivation: string;
  milestones: Array<{ desc: string; dueDate?: string }>;
  weeklyTasks: Task[];
  dailyTasks: Task[];
}

export function generatePlan(goalDescription: string, timeFrame: Type__1): GeneratedPlan {
  const now = new Date();
  
  // Calculate timeframe duration in days
  let durationDays = 90;
  switch (timeFrame) {
    case Type__1.days30:
      durationDays = 30;
      break;
    case Type__1.days90:
      durationDays = 90;
      break;
    case Type__1.months6to12:
      durationDays = 270;
      break;
    case Type__1.years1to5:
      durationDays = 730;
      break;
  }

  // Generate milestones with deadlines
  const milestoneCount = durationDays <= 30 ? 3 : durationDays <= 90 ? 4 : 5;
  const milestones: Array<{ desc: string; dueDate?: string }> = [];
  
  for (let i = 0; i < milestoneCount; i++) {
    const daysOffset = Math.floor((durationDays / milestoneCount) * (i + 1));
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
  };
}

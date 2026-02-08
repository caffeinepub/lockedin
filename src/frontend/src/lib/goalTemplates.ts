import { Type__1 } from '../backend';
import type { Milestone, Task } from '../backend';

export interface GoalTemplate {
  id: string;
  category: 'study' | 'fitness' | 'productivity' | 'money' | 'mentalHealth';
  title: string;
  description: string;
  motivation: string;
  timeFrame: Type__1;
  timeFrameLabel: string;
  milestones: Milestone[];
  weeklyTasks: Task[];
  dailyTasks: Task[];
}

export const GOAL_TEMPLATES: GoalTemplate[] = [
  // Study Goals
  {
    id: 'learn-programming',
    category: 'study',
    title: 'Learn Programming Fundamentals',
    description: 'Master the basics of programming and build your first projects',
    motivation: 'Gain valuable tech skills to advance my career and open new opportunities',
    timeFrame: Type__1.days90,
    timeFrameLabel: '90 Days',
    milestones: [
      { desc: 'Complete intro to programming course', dueDate: undefined },
      { desc: 'Build 3 small projects', dueDate: undefined },
      { desc: 'Understand data structures and algorithms', dueDate: undefined },
      { desc: 'Create a portfolio website', dueDate: undefined },
    ],
    weeklyTasks: [
      { desc: 'Complete 3 coding tutorials', isComplete: false, category: undefined },
      { desc: 'Practice coding challenges for 5 hours', isComplete: false, category: undefined },
      { desc: 'Work on personal project', isComplete: false, category: undefined },
    ],
    dailyTasks: [
      { desc: 'Code for 1 hour', isComplete: false, category: undefined },
      { desc: 'Review previous lessons', isComplete: false, category: undefined },
    ],
  },
  {
    id: 'master-language',
    category: 'study',
    title: 'Master a New Language',
    description: 'Achieve conversational fluency in a foreign language',
    motivation: 'Expand my cultural horizons and improve career prospects',
    timeFrame: Type__1.months6to12,
    timeFrameLabel: '6-12 Months',
    milestones: [
      { desc: 'Complete beginner course (A1-A2)', dueDate: undefined },
      { desc: 'Reach intermediate level (B1)', dueDate: undefined },
      { desc: 'Have first conversation with native speaker', dueDate: undefined },
      { desc: 'Pass language proficiency test', dueDate: undefined },
    ],
    weeklyTasks: [
      { desc: 'Complete 5 language lessons', isComplete: false, category: undefined },
      { desc: 'Practice speaking for 2 hours', isComplete: false, category: undefined },
      { desc: 'Watch content in target language', isComplete: false, category: undefined },
    ],
    dailyTasks: [
      { desc: 'Study vocabulary for 20 minutes', isComplete: false, category: undefined },
      { desc: 'Practice pronunciation', isComplete: false, category: undefined },
    ],
  },
  {
    id: 'professional-certification',
    category: 'study',
    title: 'Earn Professional Certification',
    description: 'Complete a professional certification to advance your career',
    motivation: 'Validate my expertise and increase my market value',
    timeFrame: Type__1.months6to12,
    timeFrameLabel: '6-12 Months',
    milestones: [
      { desc: 'Research and choose certification', dueDate: undefined },
      { desc: 'Complete 50% of study material', dueDate: undefined },
      { desc: 'Take practice exams', dueDate: undefined },
      { desc: 'Pass certification exam', dueDate: undefined },
    ],
    weeklyTasks: [
      { desc: 'Study for 10 hours', isComplete: false, category: undefined },
      { desc: 'Complete one practice test', isComplete: false, category: undefined },
      { desc: 'Review weak areas', isComplete: false, category: undefined },
    ],
    dailyTasks: [
      { desc: 'Study for 1.5 hours', isComplete: false, category: undefined },
      { desc: 'Review flashcards', isComplete: false, category: undefined },
    ],
  },
  {
    id: 'data-science',
    category: 'study',
    title: 'Learn Data Science',
    description: 'Master data analysis, statistics, and machine learning fundamentals',
    motivation: 'Break into the high-demand field of data science',
    timeFrame: Type__1.months6to12,
    timeFrameLabel: '6-12 Months',
    milestones: [
      { desc: 'Complete Python for data science course', dueDate: undefined },
      { desc: 'Master statistics and probability', dueDate: undefined },
      { desc: 'Build 3 data analysis projects', dueDate: undefined },
      { desc: 'Complete machine learning course', dueDate: undefined },
    ],
    weeklyTasks: [
      { desc: 'Complete 2 course modules', isComplete: false, category: undefined },
      { desc: 'Work on data project', isComplete: false, category: undefined },
      { desc: 'Practice SQL queries', isComplete: false, category: undefined },
    ],
    dailyTasks: [
      { desc: 'Study for 1.5 hours', isComplete: false, category: undefined },
      { desc: 'Practice coding problems', isComplete: false, category: undefined },
    ],
  },
  {
    id: 'public-speaking',
    category: 'study',
    title: 'Master Public Speaking',
    description: 'Overcome fear and become a confident public speaker',
    motivation: 'Advance my career and communicate ideas effectively',
    timeFrame: Type__1.days90,
    timeFrameLabel: '90 Days',
    milestones: [
      { desc: 'Give first 5-minute speech', dueDate: undefined },
      { desc: 'Present to small group (10 people)', dueDate: undefined },
      { desc: 'Deliver 15-minute presentation', dueDate: undefined },
      { desc: 'Speak at public event', dueDate: undefined },
    ],
    weeklyTasks: [
      { desc: 'Practice speech delivery 3 times', isComplete: false, category: undefined },
      { desc: 'Record and review presentation', isComplete: false, category: undefined },
      { desc: 'Attend speaking club meeting', isComplete: false, category: undefined },
    ],
    dailyTasks: [
      { desc: 'Practice vocal exercises (10 min)', isComplete: false, category: undefined },
      { desc: 'Read aloud for clarity', isComplete: false, category: undefined },
    ],
  },

  // Fitness Goals
  {
    id: 'run-5k',
    category: 'fitness',
    title: 'Run Your First 5K',
    description: 'Train to complete a 5K race from scratch',
    motivation: 'Improve my cardiovascular health and build confidence',
    timeFrame: Type__1.days90,
    timeFrameLabel: '90 Days',
    milestones: [
      { desc: 'Run 1 mile without stopping', dueDate: undefined },
      { desc: 'Run 2 miles continuously', dueDate: undefined },
      { desc: 'Complete 3 miles in training', dueDate: undefined },
      { desc: 'Finish official 5K race', dueDate: undefined },
    ],
    weeklyTasks: [
      { desc: 'Complete 3 running sessions', isComplete: false, category: undefined },
      { desc: 'Do strength training twice', isComplete: false, category: undefined },
      { desc: 'Track progress and adjust plan', isComplete: false, category: undefined },
    ],
    dailyTasks: [
      { desc: 'Stretch for 10 minutes', isComplete: false, category: undefined },
      { desc: 'Stay hydrated (8 glasses)', isComplete: false, category: undefined },
    ],
  },
  {
    id: 'build-muscle',
    category: 'fitness',
    title: 'Build Muscle and Strength',
    description: 'Follow a structured program to gain muscle mass and strength',
    motivation: 'Transform my physique and feel more confident',
    timeFrame: Type__1.months6to12,
    timeFrameLabel: '6-12 Months',
    milestones: [
      { desc: 'Establish consistent gym routine', dueDate: undefined },
      { desc: 'Increase lifts by 25%', dueDate: undefined },
      { desc: 'Gain 10 lbs of muscle', dueDate: undefined },
      { desc: 'Achieve target body composition', dueDate: undefined },
    ],
    weeklyTasks: [
      { desc: 'Complete 4 strength training sessions', isComplete: false, category: undefined },
      { desc: 'Hit protein goals daily', isComplete: false, category: undefined },
      { desc: 'Track measurements and progress', isComplete: false, category: undefined },
    ],
    dailyTasks: [
      { desc: 'Eat 5 balanced meals', isComplete: false, category: undefined },
      { desc: 'Get 8 hours of sleep', isComplete: false, category: undefined },
    ],
  },
  {
    id: 'yoga-flexibility',
    category: 'fitness',
    title: 'Master Yoga and Flexibility',
    description: 'Develop a consistent yoga practice and improve flexibility',
    motivation: 'Reduce stress, improve posture, and increase mobility',
    timeFrame: Type__1.days90,
    timeFrameLabel: '90 Days',
    milestones: [
      { desc: 'Complete 30 consecutive days of yoga', dueDate: undefined },
      { desc: 'Master 10 foundational poses', dueDate: undefined },
      { desc: 'Touch toes without bending knees', dueDate: undefined },
      { desc: 'Hold advanced poses for 1 minute', dueDate: undefined },
    ],
    weeklyTasks: [
      { desc: 'Practice yoga 5 times', isComplete: false, category: undefined },
      { desc: 'Attend one live class', isComplete: false, category: undefined },
      { desc: 'Meditate for 20 minutes', isComplete: false, category: undefined },
    ],
    dailyTasks: [
      { desc: 'Morning yoga routine (15 min)', isComplete: false, category: undefined },
      { desc: 'Evening stretching (10 min)', isComplete: false, category: undefined },
    ],
  },
  {
    id: 'lose-weight',
    category: 'fitness',
    title: 'Lose Weight Sustainably',
    description: 'Achieve healthy weight loss through diet and exercise',
    motivation: 'Improve my health, energy, and confidence',
    timeFrame: Type__1.months6to12,
    timeFrameLabel: '6-12 Months',
    milestones: [
      { desc: 'Lose first 5 pounds', dueDate: undefined },
      { desc: 'Reach 10 pounds lost', dueDate: undefined },
      { desc: 'Hit 20 pounds lost', dueDate: undefined },
      { desc: 'Achieve target weight', dueDate: undefined },
    ],
    weeklyTasks: [
      { desc: 'Exercise 4-5 times', isComplete: false, category: undefined },
      { desc: 'Meal prep for the week', isComplete: false, category: undefined },
      { desc: 'Track weight and measurements', isComplete: false, category: undefined },
    ],
    dailyTasks: [
      { desc: 'Stay in calorie deficit', isComplete: false, category: undefined },
      { desc: 'Drink 8 glasses of water', isComplete: false, category: undefined },
    ],
  },
  {
    id: 'marathon-training',
    category: 'fitness',
    title: 'Train for a Marathon',
    description: 'Complete a full marathon (26.2 miles)',
    motivation: 'Achieve a major fitness milestone and prove my dedication',
    timeFrame: Type__1.months6to12,
    timeFrameLabel: '6-12 Months',
    milestones: [
      { desc: 'Run 10 miles continuously', dueDate: undefined },
      { desc: 'Complete half marathon', dueDate: undefined },
      { desc: 'Run 20 miles in training', dueDate: undefined },
      { desc: 'Finish full marathon', dueDate: undefined },
    ],
    weeklyTasks: [
      { desc: 'Complete 4 running sessions', isComplete: false, category: undefined },
      { desc: 'Do cross-training twice', isComplete: false, category: undefined },
      { desc: 'Long run on weekend', isComplete: false, category: undefined },
    ],
    dailyTasks: [
      { desc: 'Stretch and foam roll', isComplete: false, category: undefined },
      { desc: 'Eat balanced meals', isComplete: false, category: undefined },
    ],
  },

  // Productivity Goals
  {
    id: 'morning-routine',
    category: 'productivity',
    title: 'Build a Powerful Morning Routine',
    description: 'Establish a consistent morning routine to start each day strong',
    motivation: 'Increase productivity and set a positive tone for the day',
    timeFrame: Type__1.days30,
    timeFrameLabel: '30 Days',
    milestones: [
      { desc: 'Wake up at same time for 7 days', dueDate: undefined },
      { desc: 'Complete routine 14 days straight', dueDate: undefined },
      { desc: 'Refine and optimize routine', dueDate: undefined },
      { desc: 'Maintain routine for 30 days', dueDate: undefined },
    ],
    weeklyTasks: [
      { desc: 'Track wake-up times', isComplete: false, category: undefined },
      { desc: 'Prepare evening for next morning', isComplete: false, category: undefined },
      { desc: 'Review and adjust routine', isComplete: false, category: undefined },
    ],
    dailyTasks: [
      { desc: 'Wake up at target time', isComplete: false, category: undefined },
      { desc: 'Complete morning routine checklist', isComplete: false, category: undefined },
    ],
  },
  {
    id: 'deep-work',
    category: 'productivity',
    title: 'Master Deep Work',
    description: 'Develop the ability to focus intensely on cognitively demanding tasks',
    motivation: 'Accomplish more meaningful work and advance my career faster',
    timeFrame: Type__1.days90,
    timeFrameLabel: '90 Days',
    milestones: [
      { desc: 'Complete 1 hour of deep work daily', dueDate: undefined },
      { desc: 'Reach 2 hours of deep work daily', dueDate: undefined },
      { desc: 'Achieve 4 hours of deep work daily', dueDate: undefined },
      { desc: 'Complete major project using deep work', dueDate: undefined },
    ],
    weeklyTasks: [
      { desc: 'Schedule deep work blocks', isComplete: false, category: undefined },
      { desc: 'Eliminate 3 distractions', isComplete: false, category: undefined },
      { desc: 'Review productivity metrics', isComplete: false, category: undefined },
    ],
    dailyTasks: [
      { desc: 'Complete deep work session', isComplete: false, category: undefined },
      { desc: 'Track focus time', isComplete: false, category: undefined },
    ],
  },
  {
    id: 'time-management',
    category: 'productivity',
    title: 'Master Time Management',
    description: 'Implement effective systems to manage time and priorities',
    motivation: 'Reduce stress and accomplish more of what matters',
    timeFrame: Type__1.days90,
    timeFrameLabel: '90 Days',
    milestones: [
      { desc: 'Set up task management system', dueDate: undefined },
      { desc: 'Plan weeks in advance consistently', dueDate: undefined },
      { desc: 'Reduce wasted time by 50%', dueDate: undefined },
      { desc: 'Achieve work-life balance', dueDate: undefined },
    ],
    weeklyTasks: [
      { desc: 'Plan next week in detail', isComplete: false, category: undefined },
      { desc: 'Review time logs', isComplete: false, category: undefined },
      { desc: 'Optimize schedule', isComplete: false, category: undefined },
    ],
    dailyTasks: [
      { desc: 'Review daily priorities', isComplete: false, category: undefined },
      { desc: 'Time-block calendar', isComplete: false, category: undefined },
    ],
  },
  {
    id: 'read-books',
    category: 'productivity',
    title: 'Read 52 Books in a Year',
    description: 'Develop a consistent reading habit and read one book per week',
    motivation: 'Expand my knowledge and become a lifelong learner',
    timeFrame: Type__1.years1to5,
    timeFrameLabel: '1 Year',
    milestones: [
      { desc: 'Read 13 books (Quarter 1)', dueDate: undefined },
      { desc: 'Read 26 books (Half year)', dueDate: undefined },
      { desc: 'Read 39 books (Three quarters)', dueDate: undefined },
      { desc: 'Complete 52 books', dueDate: undefined },
    ],
    weeklyTasks: [
      { desc: 'Finish one book', isComplete: false, category: undefined },
      { desc: 'Write book summary/notes', isComplete: false, category: undefined },
      { desc: 'Choose next book', isComplete: false, category: undefined },
    ],
    dailyTasks: [
      { desc: 'Read for 30 minutes', isComplete: false, category: undefined },
      { desc: 'Take notes on key insights', isComplete: false, category: undefined },
    ],
  },
  {
    id: 'digital-detox',
    category: 'productivity',
    title: 'Complete Digital Detox',
    description: 'Reduce screen time and reclaim focus from digital distractions',
    motivation: 'Improve mental clarity and be more present in life',
    timeFrame: Type__1.days30,
    timeFrameLabel: '30 Days',
    milestones: [
      { desc: 'Reduce screen time by 25%', dueDate: undefined },
      { desc: 'Reduce screen time by 50%', dueDate: undefined },
      { desc: 'Establish phone-free zones', dueDate: undefined },
      { desc: 'Maintain healthy digital habits', dueDate: undefined },
    ],
    weeklyTasks: [
      { desc: 'Track daily screen time', isComplete: false, category: undefined },
      { desc: 'Delete 3 time-wasting apps', isComplete: false, category: undefined },
      { desc: 'Plan offline activities', isComplete: false, category: undefined },
    ],
    dailyTasks: [
      { desc: 'No phone first hour after waking', isComplete: false, category: undefined },
      { desc: 'No screens 1 hour before bed', isComplete: false, category: undefined },
    ],
  },

  // Money Goals
  {
    id: 'emergency-fund',
    category: 'money',
    title: 'Build Emergency Fund',
    description: 'Save 3-6 months of expenses for financial security',
    motivation: 'Achieve peace of mind and financial stability',
    timeFrame: Type__1.months6to12,
    timeFrameLabel: '6-12 Months',
    milestones: [
      { desc: 'Save first $1,000', dueDate: undefined },
      { desc: 'Reach 1 month of expenses', dueDate: undefined },
      { desc: 'Save 3 months of expenses', dueDate: undefined },
      { desc: 'Complete 6-month emergency fund', dueDate: undefined },
    ],
    weeklyTasks: [
      { desc: 'Transfer savings automatically', isComplete: false, category: undefined },
      { desc: 'Track all expenses', isComplete: false, category: undefined },
      { desc: 'Find ways to reduce spending', isComplete: false, category: undefined },
    ],
    dailyTasks: [
      { desc: 'Review spending', isComplete: false, category: undefined },
      { desc: 'Avoid impulse purchases', isComplete: false, category: undefined },
    ],
  },
  {
    id: 'side-income',
    category: 'money',
    title: 'Launch Side Income Stream',
    description: 'Create an additional income source outside your main job',
    motivation: 'Increase financial security and work toward financial freedom',
    timeFrame: Type__1.months6to12,
    timeFrameLabel: '6-12 Months',
    milestones: [
      { desc: 'Identify and validate idea', dueDate: undefined },
      { desc: 'Make first dollar', dueDate: undefined },
      { desc: 'Reach $500/month', dueDate: undefined },
      { desc: 'Scale to $1,000+/month', dueDate: undefined },
    ],
    weeklyTasks: [
      { desc: 'Work on side project 10 hours', isComplete: false, category: undefined },
      { desc: 'Market to potential customers', isComplete: false, category: undefined },
      { desc: 'Track revenue and expenses', isComplete: false, category: undefined },
    ],
    dailyTasks: [
      { desc: 'Dedicate 1-2 hours to side project', isComplete: false, category: undefined },
      { desc: 'Engage with target audience', isComplete: false, category: undefined },
    ],
  },
  {
    id: 'invest-consistently',
    category: 'money',
    title: 'Start Investing Consistently',
    description: 'Begin building wealth through regular investments',
    motivation: 'Secure my financial future and build long-term wealth',
    timeFrame: Type__1.months6to12,
    timeFrameLabel: '6-12 Months',
    milestones: [
      { desc: 'Open investment account', dueDate: undefined },
      { desc: 'Make first investment', dueDate: undefined },
      { desc: 'Automate monthly contributions', dueDate: undefined },
      { desc: 'Build diversified portfolio', dueDate: undefined },
    ],
    weeklyTasks: [
      { desc: 'Research investment options', isComplete: false, category: undefined },
      { desc: 'Review portfolio performance', isComplete: false, category: undefined },
      { desc: 'Learn about investing', isComplete: false, category: undefined },
    ],
    dailyTasks: [
      { desc: 'Read financial news (15 min)', isComplete: false, category: undefined },
      { desc: 'Track net worth', isComplete: false, category: undefined },
    ],
  },
  {
    id: 'pay-off-debt',
    category: 'money',
    title: 'Pay Off Debt',
    description: 'Eliminate credit card and consumer debt',
    motivation: 'Achieve financial freedom and reduce stress',
    timeFrame: Type__1.months6to12,
    timeFrameLabel: '6-12 Months',
    milestones: [
      { desc: 'List all debts and create plan', dueDate: undefined },
      { desc: 'Pay off smallest debt', dueDate: undefined },
      { desc: 'Eliminate 50% of total debt', dueDate: undefined },
      { desc: 'Become debt-free', dueDate: undefined },
    ],
    weeklyTasks: [
      { desc: 'Make extra debt payment', isComplete: false, category: undefined },
      { desc: 'Find ways to increase income', isComplete: false, category: undefined },
      { desc: 'Track debt payoff progress', isComplete: false, category: undefined },
    ],
    dailyTasks: [
      { desc: 'Avoid new debt', isComplete: false, category: undefined },
      { desc: 'Pack lunch to save money', isComplete: false, category: undefined },
    ],
  },
  {
    id: 'increase-income',
    category: 'money',
    title: 'Increase Income by 20%',
    description: 'Boost your earning potential through raises, promotions, or new opportunities',
    motivation: 'Improve my financial situation and quality of life',
    timeFrame: Type__1.months6to12,
    timeFrameLabel: '6-12 Months',
    milestones: [
      { desc: 'Identify income growth opportunities', dueDate: undefined },
      { desc: 'Develop new valuable skills', dueDate: undefined },
      { desc: 'Negotiate raise or find better job', dueDate: undefined },
      { desc: 'Achieve 20% income increase', dueDate: undefined },
    ],
    weeklyTasks: [
      { desc: 'Work on skill development', isComplete: false, category: undefined },
      { desc: 'Network with professionals', isComplete: false, category: undefined },
      { desc: 'Apply to higher-paying positions', isComplete: false, category: undefined },
    ],
    dailyTasks: [
      { desc: 'Learn something new for career', isComplete: false, category: undefined },
      { desc: 'Document achievements', isComplete: false, category: undefined },
    ],
  },

  // Mental Health Goals
  {
    id: 'meditation-habit',
    category: 'mentalHealth',
    title: 'Build Daily Meditation Practice',
    description: 'Establish a consistent meditation habit for mental clarity',
    motivation: 'Reduce stress, improve focus, and enhance overall well-being',
    timeFrame: Type__1.days90,
    timeFrameLabel: '90 Days',
    milestones: [
      { desc: 'Meditate 7 days in a row', dueDate: undefined },
      { desc: 'Reach 30-day streak', dueDate: undefined },
      { desc: 'Increase session to 20 minutes', dueDate: undefined },
      { desc: 'Complete 90 consecutive days', dueDate: undefined },
    ],
    weeklyTasks: [
      { desc: 'Meditate daily', isComplete: false, category: undefined },
      { desc: 'Try new meditation technique', isComplete: false, category: undefined },
      { desc: 'Journal about meditation experience', isComplete: false, category: undefined },
    ],
    dailyTasks: [
      { desc: 'Morning meditation (10 min)', isComplete: false, category: undefined },
      { desc: 'Evening reflection (5 min)', isComplete: false, category: undefined },
    ],
  },
  {
    id: 'gratitude-practice',
    category: 'mentalHealth',
    title: 'Cultivate Gratitude Practice',
    description: 'Develop a daily gratitude habit to improve mental health',
    motivation: 'Shift mindset to positivity and appreciate life more',
    timeFrame: Type__1.days90,
    timeFrameLabel: '90 Days',
    milestones: [
      { desc: 'Journal gratitude for 7 days', dueDate: undefined },
      { desc: 'Reach 30-day gratitude streak', dueDate: undefined },
      { desc: 'Share gratitude with others weekly', dueDate: undefined },
      { desc: 'Complete 90-day gratitude challenge', dueDate: undefined },
    ],
    weeklyTasks: [
      { desc: 'Write gratitude journal daily', isComplete: false, category: undefined },
      { desc: 'Express gratitude to someone', isComplete: false, category: undefined },
      { desc: 'Reflect on positive moments', isComplete: false, category: undefined },
    ],
    dailyTasks: [
      { desc: 'List 3 things you\'re grateful for', isComplete: false, category: undefined },
      { desc: 'Appreciate one person', isComplete: false, category: undefined },
    ],
  },
  {
    id: 'stress-management',
    category: 'mentalHealth',
    title: 'Master Stress Management',
    description: 'Learn and implement effective stress reduction techniques',
    motivation: 'Improve mental health and quality of life',
    timeFrame: Type__1.days90,
    timeFrameLabel: '90 Days',
    milestones: [
      { desc: 'Identify main stress triggers', dueDate: undefined },
      { desc: 'Learn 5 stress management techniques', dueDate: undefined },
      { desc: 'Reduce stress levels by 50%', dueDate: undefined },
      { desc: 'Maintain healthy stress levels', dueDate: undefined },
    ],
    weeklyTasks: [
      { desc: 'Practice stress-relief activities', isComplete: false, category: undefined },
      { desc: 'Exercise 3 times', isComplete: false, category: undefined },
      { desc: 'Review stress levels', isComplete: false, category: undefined },
    ],
    dailyTasks: [
      { desc: 'Deep breathing exercises (5 min)', isComplete: false, category: undefined },
      { desc: 'Take breaks throughout day', isComplete: false, category: undefined },
    ],
  },
  {
    id: 'improve-sleep',
    category: 'mentalHealth',
    title: 'Improve Sleep Quality',
    description: 'Establish healthy sleep habits for better rest and recovery',
    motivation: 'Boost energy, mood, and overall health',
    timeFrame: Type__1.days90,
    timeFrameLabel: '90 Days',
    milestones: [
      { desc: 'Establish consistent sleep schedule', dueDate: undefined },
      { desc: 'Sleep 7+ hours for 14 days straight', dueDate: undefined },
      { desc: 'Optimize sleep environment', dueDate: undefined },
      { desc: 'Maintain healthy sleep for 90 days', dueDate: undefined },
    ],
    weeklyTasks: [
      { desc: 'Track sleep quality', isComplete: false, category: undefined },
      { desc: 'Adjust bedtime routine', isComplete: false, category: undefined },
      { desc: 'Limit caffeine after 2pm', isComplete: false, category: undefined },
    ],
    dailyTasks: [
      { desc: 'Go to bed at same time', isComplete: false, category: undefined },
      { desc: 'No screens 1 hour before bed', isComplete: false, category: undefined },
    ],
  },
  {
    id: 'journaling-habit',
    category: 'mentalHealth',
    title: 'Build Daily Journaling Habit',
    description: 'Develop a consistent journaling practice for self-reflection',
    motivation: 'Process emotions, track growth, and gain clarity',
    timeFrame: Type__1.days90,
    timeFrameLabel: '90 Days',
    milestones: [
      { desc: 'Journal for 7 consecutive days', dueDate: undefined },
      { desc: 'Reach 30-day journaling streak', dueDate: undefined },
      { desc: 'Fill first journal notebook', dueDate: undefined },
      { desc: 'Complete 90 days of journaling', dueDate: undefined },
    ],
    weeklyTasks: [
      { desc: 'Journal daily', isComplete: false, category: undefined },
      { desc: 'Review past entries', isComplete: false, category: undefined },
      { desc: 'Try new journaling prompts', isComplete: false, category: undefined },
    ],
    dailyTasks: [
      { desc: 'Morning pages (10 min)', isComplete: false, category: undefined },
      { desc: 'Evening reflection', isComplete: false, category: undefined },
    ],
  },
];

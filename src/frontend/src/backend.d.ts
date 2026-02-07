import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Milestone {
    desc: string;
    dueDate?: bigint;
}
export interface GoalProgress {
    dailyTasks: Array<Task>;
    weeklyTasks: Array<Task>;
    milestones: Array<Milestone>;
}
export interface Goal {
    id: bigint;
    durationDays: bigint;
    createdAt: bigint;
    description: string;
    lockedIn: boolean;
    motivation: string;
    timeFrame: Type__1;
}
export interface DailyCheckIn {
    completedTasks: Array<Task>;
    missedTasks: Array<Task>;
    date: bigint;
    goalId: bigint;
}
export interface WeeklyPlan {
    completedTasks: Array<Task>;
    plannedTasks: Array<Task>;
    progressSummary: string;
}
export interface Task {
    desc: string;
    category?: Type;
    isComplete: boolean;
}
export interface WeeklyReview {
    completedTasks: Array<Task>;
    plannedTasks: Array<Task>;
    goalId: bigint;
    progressSummary: string;
    weekStart: bigint;
}
export interface UserProfile {
    name: string;
    avatar: string;
}
export interface UserDataView {
    weeklyPlans: Array<[bigint, WeeklyPlan]>;
    dailyCheckIns: Array<[bigint, Array<[bigint, DailyCheckIn]>]>;
    weeklyReviews: Array<WeeklyReview>;
    goalProgress: Array<[bigint, GoalProgress]>;
    goals: Array<[bigint, Goal]>;
}
export enum Type {
    avoidance = "avoidance",
    other = "other",
    lowEnergy = "lowEnergy",
    distraction = "distraction",
    overplanning = "overplanning"
}
export enum Type__1 {
    months6to12 = "months6to12",
    days30 = "days30",
    days90 = "days90",
    years1to5 = "years1to5"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addDailyTasks(goalId: bigint, tasks: Array<Task>): Promise<void>;
    addMilestones(goalId: bigint, milestones: Array<Milestone>): Promise<void>;
    addWeeklyTasks(goalId: bigint, tasks: Array<Task>): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createGoal(description: string, timeFrame: Type__1, motivation: string): Promise<bigint>;
    createGoalWithCustomDuration(description: string, timeFrame: Type__1, motivation: string, durationDays: bigint): Promise<bigint>;
    deleteGoal(goalId: bigint): Promise<void>;
    getAllUserData(): Promise<Array<[Principal, UserDataView]>>;
    getAllUserGoals(): Promise<Array<[Principal, Array<Goal>]>>;
    getAllWeeklyPlans(): Promise<Array<[Principal, Array<[bigint, WeeklyPlan]>]>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getDailyCheckIns(): Promise<Array<[bigint, Array<[bigint, DailyCheckIn]>]>>;
    getDailyCheckInsByGoal(goalId: bigint): Promise<Array<[bigint, DailyCheckIn]>>;
    getDailyTasks(goalId: bigint): Promise<Array<Task>>;
    getGoal(goalId: bigint): Promise<Goal | null>;
    getGoalDuration(goalId: bigint): Promise<bigint | null>;
    getGoals(): Promise<Array<Goal>>;
    getMilestones(goalId: bigint): Promise<Array<Milestone>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getWeeklyPlan(goalId: bigint): Promise<WeeklyPlan | null>;
    getWeeklyPlansByGoal(goalId: bigint): Promise<Array<WeeklyPlan>>;
    getWeeklyReviews(): Promise<Array<WeeklyReview>>;
    getWeeklyReviewsByGoal(goalId: bigint): Promise<Array<WeeklyReview>>;
    getWeeklyTasks(goalId: bigint): Promise<Array<Task>>;
    goalExists(goalId: bigint): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    isGoalLockedIn(goalId: bigint): Promise<boolean>;
    lockInGoal(goalId: bigint): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitDailyCheckIn(goalId: bigint, completedTasks: Array<Task>, missedTasks: Array<Task>): Promise<void>;
    submitWeeklyPlan(goalId: bigint, plannedTasks: Array<Task>, progressSummary: string): Promise<void>;
    submitWeeklyReview(goalId: bigint, plannedTasks: Array<Task>, completedTasks: Array<Task>, progressSummary: string): Promise<void>;
    updateWeeklyPlanProgress(goalId: bigint, completedTasks: Array<Task>): Promise<void>;
}

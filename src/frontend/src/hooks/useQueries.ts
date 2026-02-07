import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type {
  UserProfile,
  Goal,
  Milestone,
  Task,
  DailyCheckIn,
  WeeklyReview,
} from '../backend';
import { Type__1 } from '../backend';
import { toast } from 'sonner';
import type { GoalTemplate } from '../lib/goalTemplates';
import { getErrorMessage } from '../utils/errors';

// User Profile
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: (_, profile) => {
      queryClient.setQueryData(['currentUserProfile'], profile);
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile saved successfully');
    },
    onError: (error: unknown) => {
      toast.error(`Failed to save profile: ${getErrorMessage(error)}`);
    },
  });
}

// Goals Management
export function useGetGoals() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Goal[]>({
    queryKey: ['goals'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getGoals();
      } catch (error) {
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useGetGoal(goalId: bigint) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Goal | null>({
    queryKey: ['goal', goalId.toString()],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getGoal(goalId);
      } catch (error) {
        return null;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useCreateGoal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      description,
      timeFrame,
      motivation,
    }: {
      description: string;
      timeFrame: Type__1;
      motivation: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createGoal(description, timeFrame, motivation);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast.success("You're LockedIn.");
    },
    onError: (error: unknown) => {
      toast.error(`Failed to create goal: ${getErrorMessage(error)}`);
    },
  });
}

export function useCreateGoalWithCustomDuration() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      description,
      timeFrame,
      motivation,
      durationDays,
    }: {
      description: string;
      timeFrame: Type__1;
      motivation: string;
      durationDays: number;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createGoalWithCustomDuration(
        description,
        timeFrame,
        motivation,
        BigInt(durationDays)
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      toast.success("You're LockedIn.");
    },
    onError: (error: unknown) => {
      toast.error(`Failed to create goal: ${getErrorMessage(error)}`);
    },
  });
}

export function useCreateGoalFromTemplate() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (template: GoalTemplate) => {
      if (!actor) throw new Error('Actor not available');
      
      // Create the goal
      const goalId = await actor.createGoal(
        template.title,
        template.timeFrame,
        template.motivation
      );

      // Add milestones
      if (template.milestones.length > 0) {
        await actor.addMilestones(goalId, template.milestones);
      }

      // Add weekly tasks
      if (template.weeklyTasks.length > 0) {
        await actor.addWeeklyTasks(goalId, template.weeklyTasks);
      }

      // Add daily tasks
      if (template.dailyTasks.length > 0) {
        await actor.addDailyTasks(goalId, template.dailyTasks);
      }

      return goalId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] });
    },
    onError: (error: unknown) => {
      toast.error(`Failed to create goal: ${getErrorMessage(error)}`);
    },
  });
}

export function useDeleteGoal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (goalId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.deleteGoal(goalId);
    },
    onSuccess: (_, goalId) => {
      // Invalidate all goal-related queries
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      queryClient.invalidateQueries({ queryKey: ['goal', goalId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['milestones', goalId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['weeklyTasks', goalId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['dailyTasks', goalId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['dailyCheckIns', goalId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['weeklyReviews', goalId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['goalLockedIn', goalId.toString()] });
      toast.success('Goal deleted successfully');
    },
    onError: (error: unknown) => {
      toast.error(`Failed to delete goal: ${getErrorMessage(error)}`);
    },
  });
}

// Milestones
export function useGetMilestones(goalId: bigint) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Milestone[]>({
    queryKey: ['milestones', goalId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getMilestones(goalId);
      } catch (error) {
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddMilestones() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ goalId, milestones }: { goalId: bigint; milestones: Milestone[] }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMilestones(goalId, milestones);
    },
    onSuccess: (_, variables) => {
      queryClient.setQueryData(['milestones', variables.goalId.toString()], variables.milestones);
      queryClient.invalidateQueries({ queryKey: ['milestones', variables.goalId.toString()] });
    },
    onError: (error: unknown) => {
      toast.error(`Failed to add milestones: ${getErrorMessage(error)}`);
    },
  });
}

// Weekly Tasks
export function useGetWeeklyTasks(goalId: bigint) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Task[]>({
    queryKey: ['weeklyTasks', goalId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getWeeklyTasks(goalId);
      } catch (error) {
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddWeeklyTasks() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ goalId, tasks }: { goalId: bigint; tasks: Task[] }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addWeeklyTasks(goalId, tasks);
    },
    onSuccess: (_, variables) => {
      queryClient.setQueryData(['weeklyTasks', variables.goalId.toString()], variables.tasks);
      queryClient.invalidateQueries({ queryKey: ['weeklyTasks', variables.goalId.toString()] });
    },
    onError: (error: unknown) => {
      toast.error(`Failed to add weekly tasks: ${getErrorMessage(error)}`);
    },
  });
}

// Daily Tasks
export function useGetDailyTasks(goalId: bigint) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Task[]>({
    queryKey: ['dailyTasks', goalId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getDailyTasks(goalId);
      } catch (error) {
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddDailyTasks() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ goalId, tasks }: { goalId: bigint; tasks: Task[] }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addDailyTasks(goalId, tasks);
    },
    onSuccess: (_, variables) => {
      queryClient.setQueryData(['dailyTasks', variables.goalId.toString()], variables.tasks);
      queryClient.invalidateQueries({ queryKey: ['dailyTasks', variables.goalId.toString()] });
    },
    onError: (error: unknown) => {
      toast.error(`Failed to add daily tasks: ${getErrorMessage(error)}`);
    },
  });
}

// Goal Lock-in
export function useIsGoalLockedIn(goalId: bigint) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['goalLockedIn', goalId.toString()],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isGoalLockedIn(goalId);
      } catch (error) {
        return false;
      }
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useLockInGoal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (goalId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.lockInGoal(goalId);
    },
    onSuccess: (_, goalId) => {
      // Optimistically update the locked-in state
      queryClient.setQueryData(['goalLockedIn', goalId.toString()], true);
      
      // Update the goal in cache to reflect locked state
      const goalKey = ['goal', goalId.toString()];
      const currentGoal = queryClient.getQueryData<Goal | null>(goalKey);
      if (currentGoal) {
        queryClient.setQueryData(goalKey, { ...currentGoal, lockedIn: true });
      }
      
      // Update goals list
      const goalsKey = ['goals'];
      const currentGoals = queryClient.getQueryData<Goal[]>(goalsKey);
      if (currentGoals) {
        queryClient.setQueryData(
          goalsKey,
          currentGoals.map((g) => (g.id === goalId ? { ...g, lockedIn: true } : g))
        );
      }
      
      // Invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['goalLockedIn', goalId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['goal', goalId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['goals'] });
      
      toast.success("You're LockedIn.");
    },
    onError: (error: unknown) => {
      toast.error(`Failed to lock in goal: ${getErrorMessage(error)}`);
    },
  });
}

// Daily Check-ins
export function useGetDailyCheckIns() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DailyCheckIn[]>({
    queryKey: ['dailyCheckIns'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await actor.getDailyCheckIns();
        // Transform from Array<[goalId, Array<[dayKey, DailyCheckIn]>]> to flat DailyCheckIn[]
        return result.flatMap(([_, checkInTuples]) => 
          checkInTuples.map(([__, checkIn]) => checkIn)
        );
      } catch (error) {
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetDailyCheckInsByGoal(goalId: bigint) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<DailyCheckIn[]>({
    queryKey: ['dailyCheckIns', goalId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      try {
        const result = await actor.getDailyCheckInsByGoal(goalId);
        // Transform from Array<[dayKey, DailyCheckIn]> to DailyCheckIn[]
        return result.map(([_, checkIn]) => checkIn);
      } catch (error) {
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSubmitDailyCheckIn() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      goalId,
      completedTasks,
      missedTasks,
    }: {
      goalId: bigint;
      completedTasks: Task[];
      missedTasks: Task[];
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitDailyCheckIn(goalId, completedTasks, missedTasks);
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch check-ins to show the new submission
      queryClient.invalidateQueries({ queryKey: ['dailyCheckIns'] });
      queryClient.invalidateQueries({
        queryKey: ['dailyCheckIns', variables.goalId.toString()],
      });
      toast.success("Check-in submitted! You're LockedIn.");
    },
    onError: (error: unknown) => {
      const errorMessage = getErrorMessage(error);
      // Surface backend duplicate-same-day rejection message directly
      if (errorMessage.includes('already exists for today')) {
        toast.error(errorMessage);
      } else {
        toast.error(`Failed to submit check-in: ${errorMessage}`);
      }
    },
  });
}

// Weekly Reviews
export function useGetWeeklyReviews() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<WeeklyReview[]>({
    queryKey: ['weeklyReviews'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getWeeklyReviews();
      } catch (error) {
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetWeeklyReviewsByGoal(goalId: bigint) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<WeeklyReview[]>({
    queryKey: ['weeklyReviews', goalId.toString()],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getWeeklyReviewsByGoal(goalId);
      } catch (error) {
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSubmitWeeklyReview() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      goalId,
      plannedTasks,
      completedTasks,
      progressSummary,
    }: {
      goalId: bigint;
      plannedTasks: Task[];
      completedTasks: Task[];
      progressSummary: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitWeeklyReview(goalId, plannedTasks, completedTasks, progressSummary);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['weeklyReviews'] });
      queryClient.invalidateQueries({
        queryKey: ['weeklyReviews', variables.goalId.toString()],
      });
      toast.success("You're LockedIn.");
    },
    onError: (error: unknown) => {
      toast.error(`Failed to submit review: ${getErrorMessage(error)}`);
    },
  });
}

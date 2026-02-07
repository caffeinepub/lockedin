import Map "mo:core/Map";
import List "mo:core/List";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import Time "mo:core/Time";
import Iter "mo:core/Iter";


import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";


actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  module TimeFrame {
    public type Type = {
      #days30;
      #days90;
      #months6to12;
      #years1to5;
    };
  };

  module MissedTaskCategory {
    public type Type = {
      #avoidance;
      #distraction;
      #overplanning;
      #lowEnergy;
      #other;
    };
  };

  type Goal = {
    id : Nat;
    description : Text;
    timeFrame : TimeFrame.Type;
    motivation : Text;
    durationDays : Nat;
    lockedIn : Bool;
    createdAt : Int;
  };

  type Milestone = {
    desc : Text;
    dueDate : ?Int;
  };

  type Task = {
    desc : Text;
    isComplete : Bool;
    category : ?MissedTaskCategory.Type;
  };

  type DailyCheckIn = {
    goalId : Nat;
    date : Int;
    completedTasks : [Task];
    missedTasks : [Task];
  };

  type WeeklyReview = {
    goalId : Nat;
    weekStart : Int;
    plannedTasks : [Task];
    completedTasks : [Task];
    progressSummary : Text;
  };

  public type UserProfile = {
    name : Text;
    avatar : Text;
  };

  type GoalProgress = {
    milestones : [Milestone];
    weeklyTasks : [Task];
    dailyTasks : [Task];
  };

  public type WeeklyPlan = {
    plannedTasks : [Task];
    completedTasks : [Task];
    progressSummary : Text;
  };

  public type UserData = {
    goals : Map.Map<Nat, Goal>;
    goalProgress : Map.Map<Nat, GoalProgress>;
    dailyCheckIns : Map.Map<Nat, Map.Map<Int, DailyCheckIn>>;
    weeklyReviews : List.List<WeeklyReview>;
    weeklyPlans : Map.Map<Nat, WeeklyPlan>;
  };

  public type UserDataView = {
    goals : [(Nat, Goal)];
    goalProgress : [(Nat, GoalProgress)];
    dailyCheckIns : [(Nat, [(Int, DailyCheckIn)])];
    weeklyReviews : [WeeklyReview];
    weeklyPlans : [(Nat, WeeklyPlan)];
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let userData = Map.empty<Principal, UserData>();
  var nextGoalId = 1;

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func createGoal(description : Text, timeFrame : TimeFrame.Type, motivation : Text) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create goals");
    };

    let goalId = nextGoalId;
    nextGoalId += 1;

    let newGoal : Goal = {
      id = goalId;
      description;
      timeFrame;
      motivation;
      durationDays = 0;
      lockedIn = false;
      createdAt = getCurrentTimestamp();
    };

    let userGoals = getUserGoals(caller);

    userGoals.goals.add(goalId, newGoal);
    userData.add(caller, userGoals);

    goalId;
  };

  public query ({ caller }) func getGoals() : async [Goal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access goals");
    };
    getUserGoals(caller).goals.values().toArray();
  };

  public query ({ caller }) func getGoal(goalId : Nat) : async ?Goal {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access goals");
    };
    let userGoals = getUserGoals(caller);
    if (not userGoals.goals.containsKey(goalId)) {
      Runtime.trap("Unauthorized: Goal does not belong to caller");
    };
    userGoals.goals.get(goalId);
  };

  public shared ({ caller }) func lockInGoal(goalId : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can lock in goals");
    };

    let userGoals = getUserGoals(caller);
    switch (userGoals.goals.get(goalId)) {
      case (null) { Runtime.trap("Unauthorized: Goal does not belong to caller") };
      case (?goal) {
        let updatedGoal = { goal with lockedIn = true };
        userGoals.goals.add(goalId, updatedGoal);
        userData.add(caller, userGoals);
        true;
      };
    };
  };

  public query ({ caller }) func isGoalLockedIn(goalId : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check goal status");
    };

    let userGoals = getUserGoals(caller);
    switch (userGoals.goals.get(goalId)) {
      case (null) { Runtime.trap("Unauthorized: Goal does not belong to caller") };
      case (?goal) { goal.lockedIn };
    };
  };

  public shared ({ caller }) func addMilestones(goalId : Nat, milestones : [Milestone]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add milestones");
    };

    let userGoals = getUserGoals(caller);
    if (not userGoals.goals.containsKey(goalId)) {
      Runtime.trap("Unauthorized: Goal does not belong to caller");
    };

    switch (userGoals.goalProgress.get(goalId)) {
      case (null) {
        let newProgress : GoalProgress = {
          milestones;
          weeklyTasks = [];
          dailyTasks = [];
        };
        userGoals.goalProgress.add(goalId, newProgress);
      };
      case (?progress) {
        let updatedProgress = {
          progress with
          milestones = milestones;
        };
        userGoals.goalProgress.add(goalId, updatedProgress);
      };
    };
    userData.add(caller, userGoals);
  };

  public query ({ caller }) func getMilestones(goalId : Nat) : async [Milestone] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access milestones");
    };

    let userGoals = getUserGoals(caller);
    if (not userGoals.goals.containsKey(goalId)) {
      Runtime.trap("Unauthorized: Goal does not belong to caller");
    };

    switch (userGoals.goalProgress.get(goalId)) {
      case (null) { [] };
      case (?progress) { progress.milestones };
    };
  };

  public shared ({ caller }) func addWeeklyTasks(goalId : Nat, tasks : [Task]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add weekly tasks");
    };

    let userGoals = getUserGoals(caller);
    if (not userGoals.goals.containsKey(goalId)) {
      Runtime.trap("Unauthorized: Goal does not belong to caller");
    };

    switch (userGoals.goalProgress.get(goalId)) {
      case (null) {
        let newProgress : GoalProgress = {
          milestones = [];
          weeklyTasks = tasks;
          dailyTasks = [];
        };
        userGoals.goalProgress.add(goalId, newProgress);
      };
      case (?progress) {
        let updatedProgress = {
          progress with
          weeklyTasks = tasks;
        };
        userGoals.goalProgress.add(goalId, updatedProgress);
      };
    };
    userData.add(caller, userGoals);
  };

  public query ({ caller }) func getWeeklyTasks(goalId : Nat) : async [Task] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access weekly tasks");
    };

    let userGoals = getUserGoals(caller);
    if (not userGoals.goals.containsKey(goalId)) {
      Runtime.trap("Unauthorized: Goal does not belong to caller");
    };

    switch (userGoals.goalProgress.get(goalId)) {
      case (null) { [] };
      case (?progress) { progress.weeklyTasks };
    };
  };

  public shared ({ caller }) func addDailyTasks(goalId : Nat, tasks : [Task]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add daily tasks");
    };

    let userGoals = getUserGoals(caller);
    if (not userGoals.goals.containsKey(goalId)) {
      Runtime.trap("Unauthorized: Goal does not belong to caller");
    };

    switch (userGoals.goalProgress.get(goalId)) {
      case (null) {
        let newProgress : GoalProgress = {
          milestones = [];
          weeklyTasks = [];
          dailyTasks = tasks;
        };
        userGoals.goalProgress.add(goalId, newProgress);
      };
      case (?progress) {
        let updatedProgress = {
          progress with
          dailyTasks = tasks;
        };
        userGoals.goalProgress.add(goalId, updatedProgress);
      };
    };
    userData.add(caller, userGoals);
  };

  public query ({ caller }) func getDailyTasks(goalId : Nat) : async [Task] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access daily tasks");
    };

    let userGoals = getUserGoals(caller);
    if (not userGoals.goals.containsKey(goalId)) {
      Runtime.trap("Unauthorized: Goal does not belong to caller");
    };

    switch (userGoals.goalProgress.get(goalId)) {
      case (null) { [] };
      case (?progress) { progress.dailyTasks };
    };
  };

  public shared ({ caller }) func submitDailyCheckIn(goalId : Nat, completedTasks : [Task], missedTasks : [Task]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit daily check-ins");
    };

    let userGoals = getUserGoals(caller);
    if (not userGoals.goals.containsKey(goalId)) {
      Runtime.trap("Unauthorized: Goal does not belong to caller");
    };

    let today = getCurrentDay();
    let goalCheckIns = userGoals.dailyCheckIns.get(goalId);

    switch (goalCheckIns) {
      case (null) {
        let dailyCheckIn = {
          goalId;
          date = getCurrentTimestamp();
          completedTasks;
          missedTasks;
        };
        let newGoalCheckIns = Map.empty<Int, DailyCheckIn>();
        newGoalCheckIns.add(today, dailyCheckIn);
        userGoals.dailyCheckIns.add(goalId, newGoalCheckIns);
      };
      case (?checkIns) {
        let existingCheckIn = checkIns.get(today);

        switch (existingCheckIn) {
          case (?_) {
            Runtime.trap("Check-in already exists for today");
          };
          case (null) {
            let dailyCheckIn = {
              goalId;
              date = getCurrentTimestamp();
              completedTasks;
              missedTasks;
            };
            checkIns.add(today, dailyCheckIn);
          };
        };
      };
    };

    userData.add(caller, userGoals);
  };

  public query ({ caller }) func getDailyCheckIns() : async [(Nat, [(Int, DailyCheckIn)])] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access daily check-ins");
    };

    let userGoals = getUserGoals(caller);
    let result = userGoals.dailyCheckIns.toArray();
    result.map<(Nat, Map.Map<Int, DailyCheckIn>), (Nat, [(Int, DailyCheckIn)])>(
      func((goalId, checkInMap)) {
        let checkIns = checkInMap.toArray();
        (goalId, checkIns);
      }
    );
  };

  public query ({ caller }) func getDailyCheckInsByGoal(goalId : Nat) : async [(Int, DailyCheckIn)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access daily check-ins");
    };

    let userGoals = getUserGoals(caller);
    if (not userGoals.goals.containsKey(goalId)) {
      Runtime.trap("Unauthorized: Goal does not belong to caller");
    };

    switch (userGoals.dailyCheckIns.get(goalId)) {
      case (null) { [] };
      case (?checkIns) { checkIns.toArray() };
    };
  };

  public shared ({ caller }) func submitWeeklyReview(goalId : Nat, plannedTasks : [Task], completedTasks : [Task], progressSummary : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit weekly reviews");
    };

    let userGoals = getUserGoals(caller);
    if (not userGoals.goals.containsKey(goalId)) {
      Runtime.trap("Unauthorized: Goal does not belong to caller");
    };

    let review : WeeklyReview = {
      goalId;
      weekStart = getCurrentTimestamp();
      plannedTasks;
      completedTasks;
      progressSummary;
    };

    userGoals.weeklyReviews.add(review);
    userData.add(caller, userGoals);
  };

  public query ({ caller }) func getWeeklyReviews() : async [WeeklyReview] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access weekly reviews");
    };
    getUserGoals(caller).weeklyReviews.toArray();
  };

  public query ({ caller }) func getWeeklyReviewsByGoal(goalId : Nat) : async [WeeklyReview] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access weekly reviews");
    };

    let userGoals = getUserGoals(caller);
    if (not userGoals.goals.containsKey(goalId)) {
      Runtime.trap("Unauthorized: Goal does not belong to caller");
    };

    let reviews = userGoals.weeklyReviews.toArray();
    reviews.filter(func(review) { review.goalId == goalId });
  };

  public query ({ caller }) func getAllUserGoals() : async [(Principal, [Goal])] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all user goals");
    };

    let usersArray = userData.toArray();
    usersArray.map<(Principal, UserData), (Principal, [Goal])>(
      func((principal, data)) {
        let goalsArray = data.goals.values().toArray();
        (principal, goalsArray);
      }
    );
  };

  public shared ({ caller }) func getAllUserData() : async [(Principal, UserDataView)] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all user data");
    };

    let usersArray = userData.toArray();
    usersArray.map<(Principal, UserData), (Principal, UserDataView)>(
      func((principal, data)) {
        let goalsArray = data.goals.toArray();
        let goalProgressArray = data.goalProgress.toArray();
        let dailyCheckInsArray = data.dailyCheckIns.toArray();
        let weeklyReviewsArray = data.weeklyReviews.toArray();
        let weeklyPlansArray = data.weeklyPlans.toArray();

        (principal, {
          goals = goalsArray;
          goalProgress = goalProgressArray;
          dailyCheckIns = dailyCheckInsArray.map<(Nat, Map.Map<Int, DailyCheckIn>), (Nat, [(Int, DailyCheckIn)])>(
            func((goalId, checkInMap)) {
              let checkIns = checkInMap.toArray();
              (goalId, checkIns);
            }
          );
          weeklyReviews = weeklyReviewsArray;
          weeklyPlans = weeklyPlansArray;
        });
      }
    );
  };

  public shared ({ caller }) func submitWeeklyPlan(goalId : Nat, plannedTasks : [Task], progressSummary : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit weekly plans");
    };

    let userGoals = getUserGoals(caller);
    if (not userGoals.goals.containsKey(goalId)) {
      Runtime.trap("Unauthorized: Goal does not belong to caller");
    };

    let weeklyPlan : WeeklyPlan = {
      plannedTasks;
      completedTasks = [];
      progressSummary;
    };

    userGoals.weeklyPlans.add(goalId, weeklyPlan);
    userData.add(caller, userGoals);
  };

  public shared ({ caller }) func updateWeeklyPlanProgress(goalId : Nat, completedTasks : [Task]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update weekly plans");
    };

    let userGoals = getUserGoals(caller);
    if (not userGoals.goals.containsKey(goalId)) {
      Runtime.trap("Unauthorized: Goal does not belong to caller");
    };

    switch (userGoals.weeklyPlans.get(goalId)) {
      case (null) { Runtime.trap("Weekly plan not found") };
      case (?plan) {
        let updatedPlan = {
          plan with
          completedTasks = completedTasks;
        };
        userGoals.weeklyPlans.add(goalId, updatedPlan);
        userData.add(caller, userGoals);
      };
    };
  };

  public query ({ caller }) func getWeeklyPlan(goalId : Nat) : async ?WeeklyPlan {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access weekly plans");
    };

    let userGoals = getUserGoals(caller);
    if (not userGoals.goals.containsKey(goalId)) {
      Runtime.trap("Unauthorized: Goal does not belong to caller");
    };

    userGoals.weeklyPlans.get(goalId);
  };

  public query ({ caller }) func getWeeklyPlansByGoal(goalId : Nat) : async [WeeklyPlan] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access weekly plans");
    };

    let userGoals = getUserGoals(caller);
    if (not userGoals.goals.containsKey(goalId)) {
      Runtime.trap("Unauthorized: Goal does not belong to caller");
    };

    switch (userGoals.weeklyPlans.get(goalId)) {
      case (null) { [] };
      case (?plan) { [plan] };
    };
  };

  public query ({ caller }) func getAllWeeklyPlans() : async [(Principal, [(Nat, WeeklyPlan)])] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all weekly plans");
    };

    let usersArray = userData.toArray();
    usersArray.map<(Principal, UserData), (Principal, [(Nat, WeeklyPlan)])>(
      func((principal, data)) {
        (principal, data.weeklyPlans.toArray());
      }
    );
  };

  func getCurrentTimestamp() : Int {
    Time.now();
  };

  func getCurrentDay() : Int {
    let millisSinceEpoch = (Time.now() / 1_000_000);
    let daysSinceEpoch = millisSinceEpoch / 86_400_000;
    daysSinceEpoch;
  };

  func getUserGoals(caller : Principal) : UserData {
    switch (userData.get(caller)) {
      case (null) {
        let newUserData : UserData = {
          goals = Map.empty<Nat, Goal>();
          goalProgress = Map.empty<Nat, GoalProgress>();
          dailyCheckIns = Map.empty<Nat, Map.Map<Int, DailyCheckIn>>();
          weeklyReviews = List.empty<WeeklyReview>();
          weeklyPlans = Map.empty<Nat, WeeklyPlan>();
        };
        userData.add(caller, newUserData);
        newUserData;
      };
      case (?data) { data };
    };
  };

  public shared ({ caller }) func createGoalWithCustomDuration(description : Text, timeFrame : TimeFrame.Type, motivation : Text, durationDays : Nat) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create goals");
    };

    let goalId = nextGoalId;
    nextGoalId += 1;

    let newGoal : Goal = {
      id = goalId;
      description;
      timeFrame;
      motivation;
      durationDays;
      lockedIn = false;
      createdAt = getCurrentTimestamp();
    };

    let userGoals = getUserGoals(caller);

    userGoals.goals.add(goalId, newGoal);
    userData.add(caller, userGoals);

    goalId;
  };

  public shared ({ caller }) func deleteGoal(goalId : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete goals");
    };

    let userGoals = getUserGoals(caller);

    if (not userGoals.goals.containsKey(goalId)) {
      Runtime.trap("Unauthorized: Goal does not belong to caller");
    };

    userGoals.goals.remove(goalId);
    userGoals.goalProgress.remove(goalId);
    userGoals.weeklyPlans.remove(goalId);

    userGoals.dailyCheckIns.remove(goalId);

    let weeklyReviewsIter = userGoals.weeklyReviews.values();
    let filteredWeeklyReviewsIter = weeklyReviewsIter.filter(func(review) { review.goalId != goalId });
    userGoals.weeklyReviews.clear();
    for (review in filteredWeeklyReviewsIter) {
      userGoals.weeklyReviews.add(review);
    };

    userData.add(caller, userGoals);
  };

  public query ({ caller }) func goalExists(goalId : Nat) : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can check goal existence");
    };
    let userGoals = getUserGoals(caller);
    userGoals.goals.containsKey(goalId);
  };

  public query ({ caller }) func getGoalDuration(goalId : Nat) : async ?Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access goal duration");
    };
    let userGoals = getUserGoals(caller);
    if (not userGoals.goals.containsKey(goalId)) {
      Runtime.trap("Unauthorized: Goal does not belong to caller");
    };
    switch (userGoals.goals.get(goalId)) {
      case (null) { null };
      case (?goal) { ?goal.durationDays };
    };
  };
};

import { useState, useEffect } from 'react';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile, useGetGoals } from './hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { DashboardNavigationProvider } from './contexts/DashboardNavigationContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import Dashboard from './pages/Dashboard';
import ProfileSetupModal from './components/ProfileSetupModal';
import GoalLibraryModal from './components/GoalLibraryModal';

const GOAL_LIBRARY_SKIP_KEY = 'lockedin-goal-library-skipped';

export default function App() {
  const { identity, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const isAuthenticated = !!identity;
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showGoalLibrary, setShowGoalLibrary] = useState(false);

  const {
    data: userProfile,
    isLoading: profileLoading,
    isFetched,
  } = useGetCallerUserProfile();

  const { data: goals = [], isLoading: goalsLoading } = useGetGoals();

  // Clear all queries on logout
  useEffect(() => {
    if (!isAuthenticated && loginStatus === 'idle') {
      queryClient.clear();
      // Clear skip flag on logout
      sessionStorage.removeItem(GOAL_LIBRARY_SKIP_KEY);
    }
  }, [isAuthenticated, loginStatus, queryClient]);

  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && userProfile === null;

  // Show goal library after profile setup if user has no goals and hasn't skipped
  useEffect(() => {
    const hasSkipped = sessionStorage.getItem(GOAL_LIBRARY_SKIP_KEY) === 'true';
    
    if (
      isAuthenticated &&
      userProfile !== null &&
      !goalsLoading &&
      goals.length === 0 &&
      !showGoalLibrary &&
      !hasSkipped
    ) {
      setShowGoalLibrary(true);
    }
  }, [isAuthenticated, userProfile, goalsLoading, goals.length, showGoalLibrary]);

  const handleOpenProfile = () => {
    setShowProfileModal(true);
  };

  const handleCloseProfile = () => {
    setShowProfileModal(false);
  };

  const handleCloseGoalLibrary = () => {
    setShowGoalLibrary(false);
  };

  const handleSkipGoalLibrary = () => {
    sessionStorage.setItem(GOAL_LIBRARY_SKIP_KEY, 'true');
    setShowGoalLibrary(false);
  };

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem storageKey="lockedin-theme">
      <DashboardNavigationProvider>
        <div className="min-h-screen flex flex-col bg-background text-foreground">
          <Header onOpenProfile={handleOpenProfile} />
          <main className="flex-1">
            {!isAuthenticated ? (
              <HomePage />
            ) : showProfileSetup ? (
              <ProfileSetupModal isSetup={true} onClose={() => {}} />
            ) : (
              <Dashboard />
            )}
          </main>
          <Footer />
          <Toaster />
          {showProfileModal && userProfile && (
            <ProfileSetupModal
              isSetup={false}
              onClose={handleCloseProfile}
              existingProfile={userProfile}
            />
          )}
          {showGoalLibrary && !showProfileSetup && (
            <GoalLibraryModal onClose={handleCloseGoalLibrary} onSkip={handleSkipGoalLibrary} />
          )}
        </div>
      </DashboardNavigationProvider>
    </ThemeProvider>
  );
}

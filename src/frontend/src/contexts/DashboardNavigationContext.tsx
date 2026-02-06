import { createContext, useContext, useState, ReactNode } from 'react';

type Section = 'home' | 'goals' | 'milestones' | 'daily' | 'weekly' | 'analytics' | 'settings' | 'autoPlanner';

interface DashboardNavigationContextType {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
}

const DashboardNavigationContext = createContext<DashboardNavigationContextType | undefined>(undefined);

export function DashboardNavigationProvider({ children }: { children: ReactNode }) {
  const [activeSection, setActiveSection] = useState<Section>('home');

  return (
    <DashboardNavigationContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </DashboardNavigationContext.Provider>
  );
}

export function useDashboardNavigation() {
  const context = useContext(DashboardNavigationContext);
  if (context === undefined) {
    throw new Error('useDashboardNavigation must be used within a DashboardNavigationProvider');
  }
  return context;
}

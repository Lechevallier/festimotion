import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  view: 'explore' | 'favorites';
  onViewChange: (view: 'explore' | 'favorites') => void;
  isAuthenticated: boolean;
  onLogin: () => void;
  onLogout: () => void;
  onAddEvent: () => void;
}

export default function Layout({
  children,
  view,
  onViewChange,
  isAuthenticated,
  onLogin,
  onLogout,
  onAddEvent
}: LayoutProps) {
  return (
    <div className="h-screen flex flex-col">
      <Header
        isAuthenticated={isAuthenticated}
        onLogin={onLogin}
        onLogout={onLogout}
        onAddEvent={onAddEvent}
      />
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {children}
      </main>
      <Footer
        currentView={view}
        onViewChange={onViewChange}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
}
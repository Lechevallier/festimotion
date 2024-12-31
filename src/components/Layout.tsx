import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useNavigate } from 'react-router-dom';

interface LayoutProps {
  children: ReactNode;
  isAuthenticated: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export default function Layout({
  children,
  isAuthenticated,
  onLogin,
  onLogout
}: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const getCurrentView = () => {
    switch (location.pathname) {
      case '/':
        return 'explore';
      case '/create':
        return 'create';
      case '/profile':
      case '/favorites':
      case '/my-events':
        return 'profile';
      default:
        return 'explore';
    }
  };

  return (
    <div className="h-screen flex flex-col">
      <Header
        isAuthenticated={isAuthenticated}
        onLogin={onLogin}
        onSearch={() => navigate('/search')}
      />
      <main className="flex-1 relative overflow-hidden flex flex-col">
        {children}
      </main>
      {isAuthenticated && (
        <Footer
          onCreateEvent={() => navigate('/create')}
          onProfile={() => navigate('/profile')}
          onExplore={() => navigate('/')}
          currentView={getCurrentView() as 'explore' | 'create' | 'profile'}
        />
      )}
    </div>
  );
}
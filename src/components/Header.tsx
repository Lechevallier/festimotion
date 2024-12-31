import { Search, CircleUserRound } from 'lucide-react';

interface HeaderProps {
  isAuthenticated: boolean;
  onLogin: () => void;
  onSearch: () => void;
}

export default function Header({
  isAuthenticated,
  onLogin,
  onSearch
}: HeaderProps) {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-14">
          <h1 className="text-xl font-bold text-blue-600">Festimotion</h1>
          {isAuthenticated ? (
            <button
              onClick={onSearch}
              className="p-2 text-gray-600 hover:text-gray-900"
            >
              <Search className="w-6 h-6" />
            </button>
          ) : (
            <button
              onClick={onLogin}
              className="flex items-center space-x-2 px-4 py-2 text-blue-600 font-medium"
            >
              <CircleUserRound className="w-5 h-5" />
              <span>Sign in</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
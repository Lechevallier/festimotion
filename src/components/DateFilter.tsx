import { useState, useRef, useEffect } from 'react';
import { Filter, ChevronDown } from 'lucide-react';

type FilterOption = 'all' | 'today' | 'week' | 'month' | 'custom';

interface DateFilterProps {
  onFilterChange: (dates: { start: Date | null; end: Date | null }) => void;
}

export default function DateFilter({ onFilterChange }: DateFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<FilterOption>('all');
  const [customDates, setCustomDates] = useState({ start: '', end: '' });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionChange = (option: FilterOption) => {
    setSelectedOption(option);
    
    const now = new Date();
    let start: Date | null = null;
    let end: Date | null = null;

    switch (option) {
      case 'today':
        start = now;
        end = now;
        break;
      case 'week':
        start = now;
        end = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        break;
      case 'month':
        start = now;
        end = new Date(now.getFullYear(), now.getMonth() + 1, now.getDate());
        break;
      case 'custom':
        if (customDates.start && customDates.end) {
          start = new Date(customDates.start);
          end = new Date(customDates.end);
        }
        break;
      case 'all':
      default:
        break;
    }

    onFilterChange({ start, end });
    if (option !== 'custom') setIsOpen(false);
  };

  const handleCustomDateChange = (field: 'start' | 'end', value: string) => {
    setCustomDates(prev => ({ ...prev, [field]: value }));
    if (customDates.start && customDates.end) {
      onFilterChange({
        start: new Date(customDates.start),
        end: new Date(customDates.end)
      });
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white px-4 py-2 rounded-lg shadow-md flex items-center space-x-2 hover:bg-gray-50"
      >
        <Filter className="w-5 h-5 text-gray-600" />
        <span className="text-sm font-medium text-gray-700">
          {selectedOption === 'all' ? '' : 
           selectedOption === 'today' ? 'Today' :
           selectedOption === 'week' ? 'Next 7 days' :
           selectedOption === 'month' ? 'This month' : 'Custom dates'}
        </span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-lg shadow-lg p-4 z-50">
          <div className="space-y-2">
            {[
              { id: 'all', label: 'All events' },
              { id: 'today', label: 'Today' },
              { id: 'week', label: 'Next 7 days' },
              { id: 'month', label: 'This month' },
              { id: 'custom', label: 'Custom' }
            ].map(option => (
              <button
                key={option.id}
                onClick={() => handleOptionChange(option.id as FilterOption)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors
                  ${selectedOption === option.id
                    ? 'bg-blue-100 text-blue-800'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                {option.label}
              </button>
            ))}
          </div>

          {selectedOption === 'custom' && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Start date
                </label>
                <input
                  type="date"
                  value={customDates.start}
                  onChange={(e) => handleCustomDateChange('start', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  End date
                </label>
                <input
                  type="date"
                  value={customDates.end}
                  onChange={(e) => handleCustomDateChange('end', e.target.value)}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
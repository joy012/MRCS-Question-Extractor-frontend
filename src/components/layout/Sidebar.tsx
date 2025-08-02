import {
  Activity,
  BookOpen,
  Home,
  Settings,
  Zap,
  Tag,
  Calendar
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface NavItem {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
}

const navItems: NavItem[] = [
  {
    to: '/',
    icon: Home,
    label: 'Dashboard',
    description: 'Overview and quick actions'
  },
  {
    to: '/extraction',
    icon: Zap,
    label: 'Extract Questions',
    description: 'Monitor extraction progress'
  },
  {
    to: '/questions',
    icon: BookOpen,
    label: 'Questions',
    description: 'Manage question bank'
  },
  {
    to: '/categories',
    icon: Tag,
    label: 'Categories',
    description: 'Manage question categories'
  },
  {
    to: '/intakes',
    icon: Calendar,
    label: 'Intakes',
    description: 'Manage examination intakes'
  },
  {
    to: '/settings',
    icon: Settings,
    label: 'Settings',
    description: 'App configuration'
  },
];

export const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Logo/Brand */}
      <div className="p-5 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <Activity className="h-8 w-8 text-blue-600" />
          <div>
            <h1 className="font-bold text-lg text-gray-900">MRCS</h1>
            <p className="text-xs text-gray-500">Question Extractor</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;

            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    'flex items-center gap-3 px-3 py-3 rounded-lg transition-colors group',
                    isActive
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <Icon
                    className={cn(
                      'h-5 w-5 flex-shrink-0',
                      isActive ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-600'
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <p className={cn(
                      'font-medium text-sm',
                      isActive ? 'text-blue-700' : 'text-gray-900'
                    )}>
                      {item.label}
                    </p>
                    <p className={cn(
                      'text-xs truncate',
                      isActive ? 'text-blue-600' : 'text-gray-500'
                    )}>
                      {item.description}
                    </p>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Activity className="h-4 w-4" />
          <span>v1.0.0</span>
        </div>
      </div>
    </div>
  );
}; 
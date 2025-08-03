import {
  Activity,
  BarChart3,
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Home,
  Settings,
  Shield,
  Tag,
  XCircle,
  Zap
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useGetExtractionStatusQuery } from '../../services/queries/useExtraction';
import { useGetQuestionStatisticsQuery } from '../../services/queries/useQuestions';
import { Badge } from '../ui/badge';

interface NavItem {
  to: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  badge?: string;
  badgeColor?: string;
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
  const { data: questionStats } = useGetQuestionStatisticsQuery();
  const { data: extractionStatus } = useGetExtractionStatusQuery();

  // Calculate derived data
  const totalQuestions = questionStats?.total || 0;
  const approvedQuestions = questionStats?.byStatus?.APPROVED || 0;
  const pendingQuestions = questionStats?.byStatus?.PENDING || 0;
  const rejectedQuestions = questionStats?.byStatus?.REJECTED || 0;

  // Get extraction status for badge
  const getExtractionBadge = () => {
    if (!extractionStatus) return null;

    switch (extractionStatus.status) {
      case 'processing':
        return { text: 'Live', color: 'bg-green-100 text-green-800' };
      case 'completed':
        return { text: 'Done', color: 'bg-blue-100 text-blue-800' };
      case 'failed':
        return { text: 'Failed', color: 'bg-red-100 text-red-800' };
      default:
        return null;
    }
  };

  const extractionBadge = getExtractionBadge();

  return (
    <div className="w-68 bg-gradient-to-b from-white to-gray-50/50 border-r border-gray-200/50 flex flex-col h-full shadow-lg">
      {/* Logo/Brand */}
      <div className="px-6 py-5.5 border-b border-gray-200/50 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg">
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-lg bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              MRCS
            </h1>
            <p className="text-xs text-gray-500">Question Extractor</p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="p-4 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/50 to-indigo-50/50">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <BarChart3 className="h-3 w-3 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-gray-600">Total Questions</span>
            </div>
            <span className="text-sm font-bold text-gray-900">{totalQuestions.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-green-500/10 flex items-center justify-center">
                <CheckCircle className="h-3 w-3 text-green-600" />
              </div>
              <span className="text-xs font-medium text-gray-600">Approved</span>
            </div>
            <span className="text-sm font-bold text-green-600">{approvedQuestions.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <Clock className="h-3 w-3 text-yellow-600" />
              </div>
              <span className="text-xs font-medium text-gray-600">Pending</span>
            </div>
            <span className="text-sm font-bold text-yellow-600">{pendingQuestions.toLocaleString()}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-red-500/10 flex items-center justify-center">
                <XCircle className="h-3 w-3 text-red-600" />
              </div>
              <span className="text-xs font-medium text-gray-600">Rejected</span>
            </div>
            <span className="text-sm font-bold text-red-600">{rejectedQuestions.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="mb-4">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            Navigation
          </h3>
        </div>
        <ul className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.to;
            const showBadge = item.to === '/extraction' && extractionBadge;

            return (
              <li key={item.to}>
                <Link
                  to={item.to}
                  className={cn(
                    'flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group relative',
                    isActive
                      ? 'bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border border-indigo-200/50 shadow-sm'
                      : 'text-gray-700 hover:bg-white/80 hover:text-gray-900 hover:shadow-sm'
                  )}
                >
                  <div className={cn(
                    'w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200',
                    isActive
                      ? 'bg-indigo-500/10'
                      : 'bg-gray-100/50 group-hover:bg-indigo-500/10'
                  )}>
                    <Icon
                      className={cn(
                        'h-4 w-4 flex-shrink-0',
                        isActive ? 'text-indigo-600' : 'text-gray-500 group-hover:text-indigo-600'
                      )}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={cn(
                        'font-medium text-sm',
                        isActive ? 'text-indigo-700' : 'text-gray-900'
                      )}>
                        {item.label}
                      </p>
                      {showBadge && (
                        <Badge
                          variant="secondary"
                          className={cn('text-xs px-1.5 py-0.5', extractionBadge.color)}
                        >
                          {extractionBadge.text}
                        </Badge>
                      )}
                    </div>
                    <p className={cn(
                      'text-xs truncate mt-0.5',
                      isActive ? 'text-indigo-600' : 'text-gray-500'
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
      <div className="p-4 border-t border-gray-200/50 bg-white/80 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <div className="w-6 h-6 rounded-lg bg-gray-100 flex items-center justify-center">
              <Shield className="h-3 w-3 text-gray-400" />
            </div>
            <span>v1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}; 
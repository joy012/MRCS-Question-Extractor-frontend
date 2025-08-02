import {
  Zap
} from 'lucide-react';
import {
  useLocation
} from 'react-router-dom';
import { cn } from '../../lib/utils';
import { useGetExtractionStatusQuery } from '../../services/queries/useExtraction';
import { Badge } from '../ui/badge';

const getPageTitle = (pathname: string): string => {
  switch (pathname) {
    case '/':
      return 'Dashboard';
    case '/extraction':
      return 'Extract Questions';
    case '/questions':
      return 'Questions Management';
    case '/categories':
      return 'Categories Management';
    case '/intakes':
      return 'Intakes Management';
    case '/settings':
      return 'Settings';
    default:
      if (pathname.startsWith('/questions/')) {
        return 'Question Details';
      }
      return 'MRCS Question Extractor';
  }
};

const getPageDescription = (pathname: string): string => {
  switch (pathname) {
    case '/':
      return 'Overview and quick actions for your MRCS question bank';
    case '/extraction':
      return 'Monitor AI-powered question extraction progress';
    case '/questions':
      return 'Browse, filter, and manage your question database';
    case '/categories':
      return 'Organize questions by medical categories';
    case '/intakes':
      return 'Manage examination periods and intakes';
    case '/settings':
      return 'System configuration and data management';
    default:
      if (pathname.startsWith('/questions/')) {
        return 'View detailed question information';
      }
      return 'Advanced medical exam preparation platform';
  }
};

export const Header = () => {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);
  const pageDescription = getPageDescription(location.pathname);
  const { data: extractionStatus } = useGetExtractionStatusQuery();

  // Get extraction status for header
  const getExtractionStatus = () => {
    if (!extractionStatus) return null;

    switch (extractionStatus.status) {
      case 'processing':
        return {
          text: 'Extraction Running',
          color: 'bg-green-100 text-green-800',
          icon: 'animate-pulse'
        };
      case 'completed':
        return {
          text: 'Extraction Complete',
          color: 'bg-blue-100 text-blue-800',
          icon: ''
        };
      case 'failed':
        return {
          text: 'Extraction Failed',
          color: 'bg-red-100 text-red-800',
          icon: ''
        };
      default:
        return null;
    }
  };

  const extractionStatusInfo = getExtractionStatus();

  return (
    <header className="bg-white/80 backdrop-blur-sm border-b border-gray-800">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left side - Page info */}
          <div className="flex items-center gap-6">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  {pageTitle}
                </h1>
                {extractionStatusInfo && (
                  <Badge
                    variant="secondary"
                    className={cn('text-xs px-2 py-1', extractionStatusInfo.color)}
                  >
                    <div className={cn('w-1 h-1 bg-current rounded-full mr-1', extractionStatusInfo.icon)}></div>
                    {extractionStatusInfo.text}
                  </Badge>
                )}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                {pageDescription}
              </p>
            </div>
          </div>

          {/* Right side - Actions and status */}
          <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-gray-50 to-gray-100/50 rounded-xl border border-gray-200/50">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-gray-700">System Online</span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-blue-600" />
              <span className="text-xs text-gray-600">AI Ready</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}; 
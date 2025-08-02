import { useLocation } from 'react-router-dom';

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

export const Header = () => {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">{pageTitle}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and extract MRCS questions with AI
          </p>
        </div>
      </div>
    </header>
  );
}; 
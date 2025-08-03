import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const AppLayout = () => {
  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-50 to-gray-100/50 overflow-hidden">
      {/* Main container - full screen flex layout */}
      <div className="flex h-full w-full">
        {/* Sidebar - fixed width with proper height */}
        <div className="w-68 shrink-0 h-full">
          <Sidebar />
        </div>

        {/* Main content area - takes remaining width */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          {/* Header - same height as sidebar header */}
          <div className="h-[88px] shrink-0">
            <Header />
          </div>

          {/* Main content - full width with proper scrolling */}
          <main className="flex-1 overflow-auto w-full bg-white/50 backdrop-blur-sm mb-4">
            <div className="w-full h-full p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}; 
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';

export const AppLayout = () => {
  return (
    <div className="h-screen w-screen bg-background overflow-hidden">
      {/* Main container - full screen flex layout */}
      <div className="flex h-full w-full">
        {/* Sidebar - fixed width */}
        <div className="w-64 shrink-0">
          <Sidebar />
        </div>

        {/* Main content area - takes remaining width */}
        <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
          {/* Header */}
          <Header />

          {/* Main content - full width with proper scrolling */}
          <main className="flex-1 overflow-auto w-full">
            <div className="w-full h-full p-6">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}; 
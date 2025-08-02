import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { LoadingSpinner } from '../components/common/LoadingSpinner';
import { AppLayout } from '../components/layout/AppLayout';

// Lazy load components for better performance
const Dashboard = lazy(() => import('../pages/Dashboard'));
const QuestionsList = lazy(() => import('../pages/Questions/QuestionsPage'));
const QuestionDetail = lazy(() => import('../pages/Questions/QuestionDetail'));
const ExtractionMonitor = lazy(() => import('../pages/Extraction/ExtractionMonitor'));
const CategoriesPage = lazy(() => import('../pages/Categories/CategoriesPage'));
const IntakesPage = lazy(() => import('../pages/Intakes/IntakesPage'));
const Settings = lazy(() => import('../pages/Settings/Settings'));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <LoadingSpinner size="lg" />
  </div>
);

// Main application routes
export const AppRoutes = () => {
  return (
    <Routes>
      {/* Main app routes with layout */}
      <Route path="/" element={<AppLayout />}>
        {/* Dashboard */}
        <Route
          index
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Dashboard />
            </Suspense>
          }
        />

        {/* Extraction routes */}
        <Route path="extraction">
          <Route
            index
            element={
              <Suspense fallback={<LoadingFallback />}>
                <ExtractionMonitor />
              </Suspense>
            }
          />
        </Route>

        {/* Questions routes */}
        <Route path="questions">
          <Route
            index
            element={
              <Suspense fallback={<LoadingFallback />}>
                <QuestionsList />
              </Suspense>
            }
          />
          <Route
            path=":id"
            element={
              <Suspense fallback={<LoadingFallback />}>
                <QuestionDetail />
              </Suspense>
            }
          />
        </Route>

        {/* Categories routes */}
        <Route path="categories">
          <Route
            index
            element={
              <Suspense fallback={<LoadingFallback />}>
                <CategoriesPage />
              </Suspense>
            }
          />
        </Route>

        {/* Intakes routes */}
        <Route path="intakes">
          <Route
            index
            element={
              <Suspense fallback={<LoadingFallback />}>
                <IntakesPage />
              </Suspense>
            }
          />
        </Route>

        {/* Settings routes */}
        <Route path="settings">
          <Route
            index
            element={
              <Suspense fallback={<LoadingFallback />}>
                <Settings />
              </Suspense>
            }
          />
        </Route>

        {/* Catch all - redirect to dashboard */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes; 
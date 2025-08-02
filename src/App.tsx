import { ToastProvider } from './components/ui/toast';
import { AppRoutes } from './routes';

function App() {
  return (
    <ToastProvider>
      <AppRoutes />
    </ToastProvider>
  );
}

export default App;

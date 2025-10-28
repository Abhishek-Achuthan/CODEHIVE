import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from './shared/components/ErrorBoundary';
import AppRoutes from './routes/AppRoutes';


const App = () => {
  return (
    <>
      <ErrorBoundary>
        <AppRoutes />
      </ErrorBoundary>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: { background: '#333', color: '#fff' },
        }}
      />
    </>
  );
};

export default App;

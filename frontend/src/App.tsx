import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from './shared/ui/ErrorBoundary';
import AppRoutes from './routes/AppRoutes';


const App = () => {
  return (
    <>
      <ErrorBoundary>
        <AppRoutes />
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: { background: '#333', color: '#fff' },
        }}
        />
     </ErrorBoundary>
    </>
  );
};

export default App;

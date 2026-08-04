import { Toaster } from 'react-hot-toast';
import { ErrorBoundary } from './shared/ui/ErrorBoundary';
import AppRoutes from './routes/AppRoutes';
import { SocketProvider } from './shared/socket/SocketProvider';

const App = () => {
  return (
    <>
      <ErrorBoundary>
        <SocketProvider>
          <AppRoutes />
        </SocketProvider>
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

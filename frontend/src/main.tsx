import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from './store/index.ts';
import { GoogleOAuthProvider } from '@react-oauth/google'
const clientID = import.meta.env.VITE_GOOGLE_CLIENT_ID


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      {clientID ? (
        <GoogleOAuthProvider clientId={clientID}>
          <App />
        </GoogleOAuthProvider>
      ) : (
        <App />
      )}
    </Provider>
  </StrictMode>,
);

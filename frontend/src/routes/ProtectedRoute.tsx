import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../shared/hooks/storeHooks';
import type { JSX } from 'react';


const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const token = localStorage.getItem('accessToken');
  const isReallyAuthenticated = isAuthenticated || !!token;

  return isReallyAuthenticated ?  <>{children}</> : <Navigate to='/' replace />;
};

export default ProtectedRoute;

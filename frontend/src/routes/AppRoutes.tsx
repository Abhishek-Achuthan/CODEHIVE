import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import RegisterPage from '../features/auth/pages/RegisterPage';
import LoginPage from '../features/auth/pages/LoginPage';
import LandingPage from '../features/home/components/LandingPage';
import ProtectedRoute from './ProtectedRoute';


export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path='/' element={<LoginPage/>} />
        <Route path='/home' element={
          <ProtectedRoute>
            <LandingPage/>
          </ProtectedRoute>
        }
           />
       <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

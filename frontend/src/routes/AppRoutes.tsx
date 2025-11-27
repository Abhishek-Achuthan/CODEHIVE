import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "../features/auth/pages/RegisterPage";
import LoginPage from "../features/auth/pages/LoginPage";
import LandingPage from "../features/home/components/LandingPage";
import ProtectedRoute from "./ProtectedRoute";
import { ForgotPasswordPage } from "../features/auth/pages/ForgotPasswordPage";
import { ResetPasswordPage } from "../features/auth/pages/ResetPasswordPage";
import AuthCallbackPage from "../features/auth/pages/AuthCallbackPage";
import { UserManagementPage } from "../features/admin/pages/UserManagementPage";
import { MentorManagementPage } from "../features/admin/pages/MentorManagementPage";
import PublicRoute from "./PublicRoute";
import QnaLandigPage from "../features/qna/page/QnaLandingPage";
import AskQuestionPage from "../features/qna/page/AskQuestionPage";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          {/*Landing page route*/}
          <Route path="/home" element={<LandingPage />} />

          {/*admin routes*/}
          <Route path="/admin/users" element={<UserManagementPage />} />
          <Route path="/admin/mentors" element={<MentorManagementPage />} />

          {/*qna routes*/}
          <Route path="/qna" element={<QnaLandigPage/>} />
          <Route path="/qna/ask-question" element={<AskQuestionPage/>} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

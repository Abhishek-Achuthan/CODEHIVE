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
import QuestionDetailsPage from "../features/qna/page/QuestionDetailsPage";
import EditQuestionPage from "../features/qna/page/EditQuestionPage";
import EditAnswerPage from "../features/qna/page/EditAnswerPage";
import AnsweredByMePage from "../features/qna/page/AnsweredByMePage";
import MyQuestionsPage from "../features/qna/page/MyQuestionsPage";
import SavedQuestionsPage from "../features/qna/page/SavedQuestionsPage";
import AiAssistPage from "../features/qna/page/AiAssistPage";
import ProfilePage from "../features/profile/pages/ProfilePage";

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

          <Route path="/profile" element={<ProfilePage />} />

          {/*admin routes*/}
          <Route path="/admin/users" element={<UserManagementPage />} />
          <Route path="/admin/mentors" element={<MentorManagementPage />} />

          {/*qna routes*/}
          <Route path="/qna" element={<QnaLandigPage />} />
          <Route path="/qna/ask-question" element={<AskQuestionPage />} />
          <Route path="/qna/question/:questionId" element={<QuestionDetailsPage />} />
          <Route path="/qna/question/:questionId/edit" element={<EditQuestionPage />} />
          <Route path="/qna/answers/:answerId/edit" element={<EditAnswerPage />} />
          <Route path="/qna/answered-by-me" element={<AnsweredByMePage />} />
          <Route path="/qna/my-questions" element={<MyQuestionsPage />} />
          <Route path="/qna/saved" element={<SavedQuestionsPage />} />
          <Route path="/qna/ai-assist" element={<AiAssistPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import { RouteLoadingFallback } from "../shared/ui/RouteLoadingFallback";

// Auth pages
const RegisterPage = lazy(() => import("../features/auth/pages/RegisterPage"));
const LoginPage = lazy(() => import("../features/auth/pages/LoginPage"));
const ForgotPasswordPage = lazy(() => import("../features/auth/pages/ForgotPasswordPage").then(module => ({ default: module.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import("../features/auth/pages/ResetPasswordPage").then(module => ({ default: module.ResetPasswordPage })));
const AuthCallbackPage = lazy(() => import("../features/auth/pages/AuthCallbackPage"));

// Home
const LandingPage = lazy(() => import("../features/home/components/LandingPage"));

// Profile & Wallet
const ProfilePage = lazy(() => import("../features/profile/pages/ProfilePage"));
const WalletPage = lazy(() => import("../features/wallet/pages/WalletPage"));

// Admin pages
const UserManagementPage = lazy(() => import("../features/admin/pages/UserManagementPage").then(module => ({ default: module.UserManagementPage })));
const MentorManagementPage = lazy(() => import("../features/admin/pages/MentorManagementPage").then(module => ({ default: module.MentorManagementPage })));
const MentorApplicationsManagementPage = lazy(() => import("../features/admin/pages/MentorApplicationsManagementPage").then(module => ({ default: module.MentorApplicationsManagementPage })));

// QnA pages
const QnaLandigPage = lazy(() => import("../features/qna/page/QnaLandingPage"));
const AskQuestionPage = lazy(() => import("../features/qna/page/AskQuestionPage"));
const QuestionDetailsPage = lazy(() => import("../features/qna/page/QuestionDetailsPage"));
const EditQuestionPage = lazy(() => import("../features/qna/page/EditQuestionPage"));
const EditAnswerPage = lazy(() => import("../features/qna/page/EditAnswerPage"));
const AnsweredByMePage = lazy(() => import("../features/qna/page/AnsweredByMePage"));
const MyQuestionsPage = lazy(() => import("../features/qna/page/MyQuestionsPage"));
const SavedQuestionsPage = lazy(() => import("../features/qna/page/SavedQuestionsPage"));
const AiAssistPage = lazy(() => import("../features/qna/page/AiAssistPage"));

// Session/Mentorship pages
const MentorListingPage = lazy(() => import("../features/session/pages/MentorListingPage"));
const MentorAvailabilityPage = lazy(() => import("../features/session/pages/MentorAvailabilityPage"));
const BookingPage = lazy(() => import("../features/session/pages/BookingPage"));
const PaymentPage = lazy(() => import("../features/session/pages/PaymentPage"));
const MySessionsPage = lazy(() => import("../features/session/pages/MySessionsPage"));

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Suspense fallback={<RouteLoadingFallback />}>
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
            <Route path="/wallet" element={<WalletPage />} />

            {/*admin routes*/}
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route path="/admin/mentors" element={<MentorManagementPage />} />
            <Route path="/admin/applications" element={<MentorApplicationsManagementPage />} />

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

            {/* Mentorship Routes */}
            <Route path="/session" element={<MentorListingPage />} />
            <Route path="/mentors/availability" element={<MentorAvailabilityPage />} />
            <Route path="/mentors/:mentorId/book" element={<BookingPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/my-sessions" element={<MySessionsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

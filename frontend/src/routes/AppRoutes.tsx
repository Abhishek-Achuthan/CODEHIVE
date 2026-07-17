import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import { RouteLoadingFallback } from "../shared/ui/RouteLoadingFallback";
import { UserRole } from "../shared/constants/auth";

// Auth pages
const RegisterPage = lazy(() => import("../features/auth/pages/RegisterPage"));
const LoginPage = lazy(() => import("../features/auth/pages/LoginPage"));
const ForgotPasswordPage = lazy(() => import("../features/auth/pages/ForgotPasswordPage").then(module => ({ default: module.ForgotPasswordPage })));
const ResetPasswordPage = lazy(() => import("../features/auth/pages/ResetPasswordPage").then(module => ({ default: module.ResetPasswordPage })));
const AuthCallbackPage = lazy(() => import("../features/auth/pages/AuthCallbackPage"));

// Home
const DashboardPage = lazy(() => import("../features/dashboard/pages/DashboardPage"));
const PricingPage = lazy(() => import("../features/home/components/PricingPage"));
const SubscriptionSuccessPage = lazy(
  () => import("../features/home/pages/SubscriptionSuccessPage"),
);

// Profile & Wallet
const ProfilePage = lazy(() => import("../features/profile/pages/ProfilePage"));
const WalletPage = lazy(() => import("../features/wallet/pages/WalletPage"));

// Admin pages
const AdminDashboardPage = lazy(() => import("../features/admin/pages/AdminDashboardPage").then(module => ({ default: module.AdminDashboardPage })));
const UserManagementPage = lazy(() => import("../features/admin/pages/UserManagementPage").then(module => ({ default: module.UserManagementPage })));
const MentorManagementPage = lazy(() => import("../features/admin/pages/MentorManagementPage").then(module => ({ default: module.MentorManagementPage })));
const MentorApplicationsManagementPage = lazy(() => import("../features/admin/pages/MentorApplicationsManagementPage").then(module => ({ default: module.MentorApplicationsManagementPage })));
const PlanManagementPage = lazy(() => import("../features/admin/pages/PlanManagementPage").then(module => ({ default: module.PlanManagementPage })));
const ReportsManagementPage = lazy(() => import("../features/admin/pages/ReportsManagementPage").then(module => ({ default: module.ReportsManagementPage })));

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
const MentorListingPage = lazy(() => import("../features/mentor/pages/MentorListingPage"));
const MentorProfilePage = lazy(() => import("../features/mentor/pages/MentorProfilePage"));
const MentorAvailabilityPage = lazy(() => import("../features/mentor/pages/MentorAvailabilityPage"));
const BookingPage = lazy(() => import("../features/session/pages/BookingPage"));
const PaymentPage = lazy(() => import("../features/session/pages/PaymentPage"));
const MySessionsPage = lazy(() => import("../features/session/pages/MySessionsPage"));
const MentorSessionsPage = lazy(() => import("../features/session/pages/MentorSessionsPage"));
const BookingSuccessPage = lazy(() => import("../features/session/pages/BookingSuccessPage"));

// Room pages
const RoomsPage = lazy(() => import("../features/room/pages/RoomsPage"));
const CollaborationRoom = lazy(() => import("../features/room/pages/CollaborationRoom"));
const JoinViaInvitePage = lazy(() => import("../features/room/pages/JoinViaInvitePage"));

// Layout
const SessionsLayout = lazy(() => import("../features/session/components/SessionsLayout"));
const AppLayout = lazy(() => import("../layouts/AppLayout"));

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

          <Route
            element={
              <ProtectedRoute allowedRoles={[UserRole.USER, UserRole.MENTOR]} />
            }
          >
            <Route element={<AppLayout />}>
              <Route path="/home" element={<DashboardPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/pricing/success" element={<SubscriptionSuccessPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/wallet" element={<WalletPage />} />

              <Route path="/qna" element={<QnaLandigPage />} />
              <Route path="/qna/ask-question" element={<AskQuestionPage />} />
              <Route path="/qna/question/:questionId" element={<QuestionDetailsPage />} />
              <Route path="/qna/question/:questionId/edit" element={<EditQuestionPage />} />
              <Route path="/qna/answers/:answerId/edit" element={<EditAnswerPage />} />
              <Route path="/qna/answered-by-me" element={<AnsweredByMePage />} />
              <Route path="/qna/my-questions" element={<MyQuestionsPage />} />
              <Route path="/qna/saved" element={<SavedQuestionsPage />} />
              <Route path="/qna/ai-assist" element={<AiAssistPage />} />

              <Route path="/sessions" element={<SessionsLayout />}>
                <Route index element={<Navigate to="/sessions/discover" replace />} />
                <Route path="discover" element={<MentorListingPage />} />
                <Route path="my-sessions" element={<MySessionsPage />} />
                <Route
                  element={
                    <ProtectedRoute
                      allowedRoles={[UserRole.MENTOR]}
                      requireApprovedMentor
                    />
                  }
                >
                  <Route path="hosting" element={<MentorSessionsPage />} />
                  <Route path="availability" element={<MentorAvailabilityPage />} />
                </Route>
              </Route>

              <Route path="/mentors/:mentorId" element={<MentorProfilePage />} />
              <Route path="/mentors/:mentorId/book" element={<BookingPage />} />
              <Route path="/mentors/:mentorId/book/payment" element={<PaymentPage />} />
              <Route path="/mentors/:mentorId/book/success" element={<BookingSuccessPage />} />

              <Route path="/rooms" element={<RoomsPage />} />
            </Route>

            <Route path="/join/:inviteCode" element={<JoinViaInvitePage />} />
            <Route path="/room/:roomId" element={<CollaborationRoom />} />
          </Route>



          <Route element={<ProtectedRoute allowedRoles={[UserRole.ADMIN]} />}>
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/users" element={<UserManagementPage />} />
            <Route path="/admin/mentors" element={<MentorManagementPage />} />
            <Route path="/admin/applications" element={<MentorApplicationsManagementPage />} />
            <Route path="/admin/plans" element={<PlanManagementPage />} />
            <Route path="/admin/reports" element={<ReportsManagementPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

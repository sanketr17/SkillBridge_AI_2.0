import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Context Providers
import { AuthProvider, useAuth } from "./context/AuthContext";
import { SkillProvider } from "./context/SkillContext";
import { DashboardProvider } from "./context/DashboardContext";

// Master Layout
import AppLayout from "./components/layout/AppLayout";

// Page Views
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import SkillsPage from "./pages/SkillsPage";
import ProjectsPage from "./pages/ProjectsPage";
import RoadmapPage from "./pages/RoadmapPage";
import InterviewPage from "./pages/InterviewPage";
import ResumeAnalyzerPage from "./pages/ResumeAnalyzerPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/NotFoundPage";

// Loading Component
import LoadingSpinner from "./components/ui/LoadingSpinner";
import PremiumCursor from "./components/ui/PremiumCursor";

// Protected Route Guard Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner size="lg" fullPage />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Public Only Route Guard (re-routes authenticated students to dashboard console)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner size="lg" fullPage />;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SkillProvider>
          <DashboardProvider>
            {/* Global Styled Toaster Alerts */}
            <Toaster position="top-right" reverseOrder={false} />
            
            {/* Global 3D Interactive Cursor Follower */}
            <PremiumCursor />

            <Routes>
              {/* Public Marketing Route */}
              <Route path="/" element={<LandingPage />} />

              {/* Public Entry Credentials Guarded Routes */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <LoginPage />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <RegisterPage />
                  </PublicRoute>
                }
              />

              {/* Secured Console Router Tree */}
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                {/* Fallback to dashboard */}
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="skills" element={<SkillsPage />} />
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="roadmap" element={<RoadmapPage />} />
                <Route path="interview" element={<InterviewPage />} />
                <Route path="resume" element={<ResumeAnalyzerPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* 404 Route */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </DashboardProvider>
        </SkillProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

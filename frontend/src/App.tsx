import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { ProtectedRoute } from './components/ProtectedRoute';
import { PublicLandingPage } from './pages/PublicLandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { AuthenticatedAppHome } from './pages/AuthenticatedAppHome';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { CabBookingPage } from './pages/CabBookingPage';
import { AiConciergePage } from './pages/AiConciergePage';
import { MyTripsPage } from './pages/MyTripsPage';
import { ProfilePage } from './pages/ProfilePage';
import { DriverDashboard } from './pages/DriverDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminAiActivity } from './pages/AdminAiActivity';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { RagPolicyModal } from './components/RagPolicyModal';
import { HowItWorksModal } from './components/HowItWorksModal';
import { SafetyModal } from './components/SafetyModal';
import { useAppStore } from './store/useAppStore';

export const App: React.FC = () => {
  const [showRag, setShowRag] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showSafety, setShowSafety] = useState(false);
  const { isAuthenticated } = useAppStore();

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#F8F8F8] text-[#111111] selection:bg-black selection:text-white font-sans">
        
        {/* Navigation Topbar */}
        <Navbar
          onOpenRag={() => setShowRag(true)}
          onOpenHowItWorks={() => setShowHowItWorks(true)}
          onOpenSafety={() => setShowSafety(true)}
        />
        
        {/* Main Application Routes */}
        <main className="flex-1">
          <Routes>
            {/* PUBLIC UNAUTHENTICATED ROUTES */}
            <Route path="/" element={<PublicLandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* PROTECTED AUTHENTICATED CUSTOMER ROUTES */}
            <Route
              path="/app"
              element={
                <ProtectedRoute>
                  <AuthenticatedAppHome />
                </ProtectedRoute>
              }
            />
            <Route
              path="/customer"
              element={
                <ProtectedRoute>
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/cab"
              element={
                <ProtectedRoute>
                  <CabBookingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/driver"
              element={
                <ProtectedRoute>
                  <CustomerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/ai"
              element={
                <ProtectedRoute>
                  <AiConciergePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/trips"
              element={
                <ProtectedRoute>
                  <MyTripsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            {/* PROTECTED DRIVER PORTAL */}
            <Route
              path="/driver-portal"
              element={
                <ProtectedRoute requiredRole="DRIVER">
                  <DriverDashboard />
                </ProtectedRoute>
              }
            />

            {/* PROTECTED ADMIN PORTAL */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/ai-activity"
              element={
                <ProtectedRoute requiredRole="ADMIN">
                  <AdminAiActivity />
                </ProtectedRoute>
              }
            />

            {/* CATCH ALL FALLBACK */}
            <Route
              path="*"
              element={<Navigate to={isAuthenticated ? "/app" : "/"} replace />}
            />
          </Routes>
        </main>

        {/* Global Interactive Modals */}
        {showRag && <RagPolicyModal onClose={() => setShowRag(false)} />}
        {showHowItWorks && <HowItWorksModal onClose={() => setShowHowItWorks(false)} />}
        {showSafety && <SafetyModal onClose={() => setShowSafety(false)} />}
      </div>
    </Router>
  );
};

export default App;

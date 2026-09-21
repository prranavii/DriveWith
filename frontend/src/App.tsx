import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { DriverDashboard } from './pages/DriverDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminAiActivity } from './pages/AdminAiActivity';
import { RagPolicyModal } from './components/RagPolicyModal';
import { HowItWorksModal } from './components/HowItWorksModal';
import { SafetyModal } from './components/SafetyModal';

export const App: React.FC = () => {
  const [showRag, setShowRag] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [showSafety, setShowSafety] = useState(false);

  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#F8F8F8] text-[#111111] selection:bg-black selection:text-white font-sans">
        
        {/* Navigation Topbar */}
        <Navbar
          onOpenRag={() => setShowRag(true)}
          onOpenHowItWorks={() => setShowHowItWorks(true)}
          onOpenSafety={() => setShowSafety(true)}
        />
        
        {/* Main Application Body */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/customer" replace />} />
            <Route path="/customer/*" element={<CustomerDashboard />} />
            <Route path="/driver/*" element={<DriverDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/ai-activity" element={<AdminAiActivity />} />
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

import React, { useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useApp } from './context/AppContext';
import AuthScreen from './components/auth/AuthScreen';
import Navbar from './components/layout/Navbar';
import NotificationToast from './components/shared/NotificationToast';
import JudgeControlPanel from './components/shared/JudgeControlPanel';
import PatientDashboard from './components/patient/PatientDashboard';
import DoctorDashboard from './components/doctor/DoctorDashboard';
import StudentPortal from './components/student/StudentPortal';
import AdminPlatform from './components/admin/AdminPlatform';

const DASHBOARDS = {
  patient: PatientDashboard,
  doctor: DoctorDashboard,
  student: StudentPortal,
  admin: AdminPlatform,
};

export default function App() {
  const { isAuthenticated, user } = useAuth();
  const { darkMode, resetPatientData } = useApp();

  // Reset stale patient data and scroll to top whenever the user session changes
  useEffect(() => {
    resetPatientData();
    window.scrollTo(0, 0);
  }, [user?.email, user?.role]);

  // Route guard: show auth screen if not logged in
  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  const Dashboard = DASHBOARDS[user.role] || PatientDashboard;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-gray-50 text-gray-900'
    }`}>
      <Navbar />
      <NotificationToast />
      <main className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6">
        <Dashboard key={`${user.role}-${user.email}`} />
      </main>

      {/* Footer */}
      <footer className={`border-t py-4 mt-8 ${darkMode ? 'border-slate-800' : 'border-gray-200'}`}>
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>
            CareConnect AI — Hackathon Prototype · Not for clinical use
          </p>
          <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>
            Core Diagnosis Engine: <span className={darkMode ? 'text-emerald-400' : 'text-emerald-600'}>LIVE (Gemini API)</span> · Workflows: Simulated Demo View
          </p>
        </div>
      </footer>

      {/* Judge escape hatch */}
      <JudgeControlPanel />
    </div>
  );
}

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  Activity, Mail, Lock, User, Calendar, AlertCircle,
  ChevronRight, Eye, EyeOff, Sparkles, Shield, Zap,
  Stethoscope, GraduationCap, Settings, Heart, ArrowRight,
  CheckCircle, Plus, X, MapPin
} from 'lucide-react';

const ROLE_OPTIONS = [
  { key: 'patient', label: 'Patient', icon: User, color: 'from-cyan-500 to-blue-500' },
  { key: 'doctor', label: 'Doctor', icon: Stethoscope, color: 'from-emerald-500 to-teal-500' },
  { key: 'student', label: 'Student', icon: GraduationCap, color: 'from-violet-500 to-purple-500' },
  { key: 'admin', label: 'Admin', icon: Settings, color: 'from-amber-500 to-orange-500' },
];

const DEMO_CREDS = [
  { role: 'Admin', email: 'admin@careconnect.ai', password: 'admin123', icon: '🛠️', color: 'border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/10' },
  { role: 'Doctor', email: 'dr.smith@careconnect.ai', password: 'doc123', icon: '🩺', color: 'border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/10' },
  { role: 'Student', email: 'student@medu.edu', password: 'student123', icon: '🎓', color: 'border-violet-500/30 bg-violet-500/5 hover:bg-violet-500/10' },
  { role: 'Patient', email: 'jane.doe@gmail.com', password: 'patient123', icon: '👤', color: 'border-cyan-500/30 bg-cyan-500/5 hover:bg-cyan-500/10' },
];

export default function AuthScreen() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showDemo, setShowDemo] = useState(false);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRole, setLoginRole] = useState('patient');

  // Signup state
  const [signupStep, setSignupStep] = useState(1);
  const [signupName, setSignupName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupCity, setSignupCity] = useState('');
  const [signupDob, setSignupDob] = useState('');
  const [signupAllergies, setSignupAllergies] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      const result = login(loginEmail, loginPassword);
      if (!result.success) {
        setError(result.error);
      }
      setIsSubmitting(false);
    }, 600);
  };

  const handleDemoLogin = (cred) => {
    setLoginEmail(cred.email);
    setLoginPassword(cred.password);
    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      const result = login(cred.email, cred.password);
      if (!result.success) {
        setError(result.error);
      }
      setIsSubmitting(false);
    }, 400);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setError('');

    if (signupStep === 1) {
      if (!signupName.trim()) { setError('Please enter your name.'); return; }
      setSignupStep(2);
      return;
    }
    if (signupStep === 2) {
      if (!signupEmail.trim() || !signupPassword.trim() || !signupCity.trim()) { setError('Email, password, and city are required.'); return; }
      if (signupPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }
      setSignupStep(3);
      return;
    }

    // Step 3 — submit
    setIsSubmitting(true);
    setTimeout(() => {
      const allergies = signupAllergies.split(',').map(a => a.trim()).filter(Boolean);
      const result = signup({
        name: signupName,
        email: signupEmail,
        password: signupPassword,
        city: signupCity,
        dob: signupDob,
        allergies,
      });
      if (!result.success) {
        setError(result.error);
      }
      setIsSubmitting(false);
    }, 800);
  };

  const resetSignup = () => {
    setSignupStep(1);
    setSignupName('');
    setSignupEmail('');
    setSignupPassword('');
    setSignupCity('');
    setSignupDob('');
    setSignupAllergies('');
    setError('');
  };

  const inputClass = 'w-full rounded-xl px-4 py-3 text-sm bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all';

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent-cyan/5 blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-accent-emerald/3 blur-[200px]" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '50px 50px'
      }} />

      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* LEFT: Branding Panel */}
        <div className="hidden lg:flex flex-col items-start justify-center p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent-cyan flex items-center justify-center shadow-lg shadow-primary/20">
                <Activity className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-accent-emerald border-2 border-slate-950 animate-pulse" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">CareConnect AI</h1>
              <p className="text-xs text-slate-400 font-medium">Clinical Decision Intelligence</p>
            </div>
          </div>

          <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
            AI-Powered
            <br />
            <span className="bg-gradient-to-r from-primary-light via-accent-cyan to-accent-emerald bg-clip-text text-transparent">
              Clinical Insights
            </span>
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-md">
            Real-time differential diagnosis, explainable AI reasoning, drug interaction detection, and
            intelligent triage — powered by Google's Gemini AI.
          </p>

          {/* Feature chips */}
          <div className="space-y-3">
            {[
              { icon: Sparkles, text: 'Live Gemini AI Diagnosis Engine', color: 'text-primary-light' },
              { icon: Shield, text: 'HIPAA-Compliant Data Architecture', color: 'text-emerald-400' },
              { icon: Heart, text: 'Real-Time Drug Interaction Alerts', color: 'text-accent-rose' },
              { icon: Zap, text: 'Sub-Second Triage Classification', color: 'text-amber-400' },
            ].map((feat, i) => (
              <div key={i} className="flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-8 h-8 rounded-lg bg-slate-800/80 border border-slate-700/50 flex items-center justify-center">
                  <feat.icon className={`w-4 h-4 ${feat.color}`} />
                </div>
                <span className="text-sm text-slate-300">{feat.text}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] font-semibold text-emerald-400 tracking-wide">HACKATHON PROTOTYPE · LIVE DEMO ENVIRONMENT</span>
          </div>
        </div>

        {/* RIGHT: Auth Form */}
        <div className="w-full max-w-md mx-auto lg:mx-0">
          {/* Mobile branding */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent-cyan flex items-center justify-center">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">CareConnect AI</h1>
              <p className="text-[10px] text-slate-400">Clinical Decision Intelligence</p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 sm:p-8">
            {/* Mode Toggle */}
            <div className="flex gap-1 p-1 rounded-xl bg-slate-800/50 mb-6">
              <button
                onClick={() => { setMode('login'); setError(''); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  mode === 'login'
                    ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sign In
              </button>
              <button
                onClick={() => { setMode('signup'); setError(''); resetSignup(); }}
                className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                  mode === 'signup'
                    ? 'bg-gradient-to-r from-primary to-primary-dark text-white shadow-lg'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Patient Sign Up
              </button>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2 animate-slide-up">
                <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                <p className="text-xs text-red-400 font-medium">{error}</p>
              </div>
            )}

            {/* LOGIN FORM */}
            {mode === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      id="login-email"
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="your@email.com"
                      className={`${inputClass} pl-10`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`${inputClass} pl-10 pr-10`}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Role selector */}
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Portal Access</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {ROLE_OPTIONS.map(role => {
                      const Icon = role.icon;
                      const isActive = loginRole === role.key;
                      return (
                        <button
                          key={role.key}
                          type="button"
                          onClick={() => setLoginRole(role.key)}
                          className={`flex flex-col items-center gap-1 py-2.5 rounded-xl text-[10px] font-semibold transition-all ${
                            isActive
                              ? `bg-gradient-to-r ${role.color} text-white shadow-lg scale-105`
                              : 'bg-slate-800/50 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700/50'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          {role.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  id="login-submit"
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                    isSubmitting
                      ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-95'
                  }`}
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-slate-500 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Shield className="w-4 h-4" />
                      Secure Sign In
                    </>
                  )}
                </button>
              </form>
            )}

            {/* SIGNUP FORM */}
            {mode === 'signup' && (
              <form onSubmit={handleSignup} className="space-y-4">
                {/* Progress indicator */}
                <div className="flex items-center gap-2 mb-2">
                  {[1, 2, 3].map(step => (
                    <React.Fragment key={step}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        signupStep >= step
                          ? 'bg-gradient-to-br from-primary to-accent-cyan text-white'
                          : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}>
                        {signupStep > step ? <CheckCircle className="w-4 h-4" /> : step}
                      </div>
                      {step < 3 && (
                        <div className={`flex-1 h-0.5 rounded-full ${signupStep > step ? 'bg-primary' : 'bg-slate-700'}`} />
                      )}
                    </React.Fragment>
                  ))}
                </div>

                {signupStep === 1 && (
                  <div className="space-y-4 animate-fade-in">
                    <p className="text-sm text-slate-300 font-medium">What's your name?</p>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        id="signup-name"
                        type="text"
                        value={signupName}
                        onChange={(e) => setSignupName(e.target.value)}
                        placeholder="Full name"
                        className={`${inputClass} pl-10`}
                        autoFocus
                      />
                    </div>
                  </div>
                )}

                {signupStep === 2 && (
                  <div className="space-y-4 animate-fade-in">
                    <p className="text-sm text-slate-300 font-medium">Create your credentials</p>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        id="signup-email"
                        type="email"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        placeholder="your@email.com"
                        className={`${inputClass} pl-10`}
                        autoFocus
                      />
                    </div>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        id="signup-city"
                        type="text"
                        value={signupCity}
                        onChange={(e) => setSignupCity(e.target.value)}
                        placeholder="Your city (e.g. San Francisco)"
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        id="signup-password"
                        type={showPassword ? 'text' : 'password'}
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        placeholder="Create password (min 6 chars)"
                        className={`${inputClass} pl-10 pr-10`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {signupStep === 3 && (
                  <div className="space-y-4 animate-fade-in">
                    <p className="text-sm text-slate-300 font-medium">Medical profile (optional)</p>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        id="signup-dob"
                        type="date"
                        value={signupDob}
                        onChange={(e) => setSignupDob(e.target.value)}
                        className={`${inputClass} pl-10`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-400 mb-1.5">
                        Known Allergies <span className="text-slate-600">(comma-separated)</span>
                      </label>
                      <div className="relative">
                        <AlertCircle className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                        <input
                          id="signup-allergies"
                          type="text"
                          value={signupAllergies}
                          onChange={(e) => setSignupAllergies(e.target.value)}
                          placeholder="e.g., Penicillin, Sulfa, Latex"
                          className={`${inputClass} pl-10`}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3">
                  {signupStep > 1 && (
                    <button
                      type="button"
                      onClick={() => { setSignupStep(signupStep - 1); setError(''); }}
                      className="px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:text-white bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800 transition-all"
                    >
                      Back
                    </button>
                  )}
                  <button
                    id="signup-submit"
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                      isSubmitting
                        ? 'bg-slate-700 text-slate-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-95'
                    }`}
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-slate-500 border-t-white rounded-full animate-spin" />
                    ) : signupStep < 3 ? (
                      <>
                        Continue
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        Create Account
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700/50" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-surface-card text-slate-500 font-medium">Demo Quick-Login</span>
              </div>
            </div>

            {/* Demo Credentials Toggle */}
            <button
              id="demo-toggle"
              onClick={() => setShowDemo(!showDemo)}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-slate-800/30 border border-slate-700/30 text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition-all"
            >
              <span className="flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Hackathon Judge Quick Access
              </span>
              <ChevronRight className={`w-4 h-4 transition-transform ${showDemo ? 'rotate-90' : ''}`} />
            </button>

            {showDemo && (
              <div className="mt-3 space-y-2 animate-slide-up">
                {DEMO_CREDS.map((cred, i) => (
                  <button
                    key={i}
                    id={`demo-login-${cred.role.toLowerCase()}`}
                    onClick={() => handleDemoLogin(cred)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left border transition-all ${cred.color}`}
                  >
                    <span className="text-lg">{cred.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-white">{cred.role}</p>
                      <p className="text-[10px] text-slate-400 truncate">{cred.email}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <p className="text-center text-[10px] text-slate-600 mt-4">
            CareConnect AI · Hackathon Prototype · Not for clinical use
          </p>
        </div>
      </div>
    </div>
  );
}

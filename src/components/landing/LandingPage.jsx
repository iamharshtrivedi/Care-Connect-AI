import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Activity, Sparkles, Shield, Heart, Zap, Search, Building2, Pill,
  UserPlus, ChevronRight, AlertTriangle, CheckCircle, Clock, Brain,
  Monitor, Users, ExternalLink, ArrowRight, Menu, X, Loader2,
  Lock, Globe, FileCheck, Award, Stethoscope, BarChart3, Sun, Moon
} from 'lucide-react';

// ─── Preset Symptom Scenarios ────────────────────────────────────────────────
const PRESET_SYMPTOMS = [
  { label: 'Chest Pain', text: 'Crushing chest pain radiating to left arm, shortness of breath, sweating', urgency: 'emergency' },
  { label: 'Meningitis Signs', text: 'Fever with stiff neck, severe headache, sensitivity to light, nausea', urgency: 'high' },
  { label: 'Skin Rash', text: 'Mild rash on lower forearm, slight itching, no fever or swelling', urgency: 'low' },
  { label: 'Abdominal Pain', text: 'Sharp abdominal pain in lower right quadrant, nausea, low-grade fever', urgency: 'moderate' },
];

// ─── Simulated Diagnosis Responses ───────────────────────────────────────────
const DIAGNOSIS_RESPONSES = {
  emergency: {
    urgency: 'Emergency',
    urgencyColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    urgencyDot: 'bg-red-500',
    differentials: [
      { condition: 'Acute Myocardial Infarction', probability: '78%', reasoning: 'Classic presentation: crushing substernal chest pain with radiation to the left arm, diaphoresis, and dyspnea strongly suggests acute coronary syndrome.' },
      { condition: 'Pulmonary Embolism', probability: '14%', reasoning: 'Sudden dyspnea and chest pain could indicate PE, though left arm radiation is atypical.' },
      { condition: 'Aortic Dissection', probability: '6%', reasoning: 'Severe tearing chest pain with radiation is possible, but classic presentation is toward the back.' },
    ],
    actions: [
      { type: 'triage', text: 'IMMEDIATE — Activate cardiac catheterization lab' },
      { type: 'treatment', text: 'Administer 325mg aspirin, obtain 12-lead ECG within 10 minutes' },
      { type: 'department', text: 'Emergency Cardiology / Cardiac ICU' },
    ],
  },
  high: {
    urgency: 'High',
    urgencyColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    urgencyDot: 'bg-orange-500',
    differentials: [
      { condition: 'Bacterial Meningitis', probability: '62%', reasoning: 'Classic Brudzinski triad: fever, neck stiffness, and headache with photophobia strongly suggests meningeal inflammation.' },
      { condition: 'Viral Meningitis', probability: '24%', reasoning: 'Similar presentation but typically less severe; lumbar puncture needed to differentiate.' },
      { condition: 'Subarachnoid Hemorrhage', probability: '8%', reasoning: 'Sudden severe headache with neck stiffness warrants urgent CT ruling.' },
    ],
    actions: [
      { type: 'triage', text: 'URGENT — Immediate neurological evaluation required' },
      { type: 'treatment', text: 'Blood cultures, empiric IV antibiotics, lumbar puncture if no contraindications' },
      { type: 'department', text: 'Neurology / Infectious Disease' },
    ],
  },
  moderate: {
    urgency: 'Moderate',
    urgencyColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    urgencyDot: 'bg-amber-500',
    differentials: [
      { condition: 'Acute Appendicitis', probability: '58%', reasoning: 'RLQ pain with nausea and low-grade fever follows classic McBurney point tenderness pattern.' },
      { condition: 'Ovarian Torsion', probability: '18%', reasoning: 'Sudden-onset unilateral lower abdominal pain in reproductive-age patients warrants consideration.' },
      { condition: 'Mesenteric Lymphadenitis', probability: '14%', reasoning: 'Viral illness can mimic appendicitis with RLQ pain and mild fever.' },
    ],
    actions: [
      { type: 'triage', text: 'SEMI-URGENT — Surgical consult within 2 hours' },
      { type: 'treatment', text: 'Abdominal CT with contrast, CBC with differential, NPO status' },
      { type: 'department', text: 'General Surgery / Emergency Medicine' },
    ],
  },
  low: {
    urgency: 'Low',
    urgencyColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    urgencyDot: 'bg-emerald-500',
    differentials: [
      { condition: 'Contact Dermatitis', probability: '52%', reasoning: 'Localized rash with itching on the forearm without systemic symptoms suggests allergic or irritant contact exposure.' },
      { condition: 'Eczema (Atopic Dermatitis)', probability: '28%', reasoning: 'Chronic pattern with pruritus on extremities is consistent with atopic dermatitis.' },
      { condition: 'Fungal Infection (Tinea)', probability: '12%', reasoning: 'Ring-shaped lesion or scaling pattern could indicate dermatophyte infection.' },
    ],
    actions: [
      { type: 'triage', text: 'NON-URGENT — Outpatient evaluation appropriate' },
      { type: 'treatment', text: 'Topical hydrocortisone 1%, allergen avoidance, follow-up if no improvement in 7 days' },
      { type: 'department', text: 'Dermatology / Primary Care' },
    ],
  },
};

// ─── Feature Cards Data ──────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Sparkles,
    title: 'Gemini AI Diagnosis',
    description: 'Sub-second symptom analysis powered by Google\'s Vertex AI and Gemini 2.5 Flash. Real-time differential diagnosis with explainable reasoning chains.',
    color: 'from-indigo-500 to-purple-600',
    accent: 'text-indigo-400',
    badge: 'Core Engine',
  },
  {
    icon: Users,
    title: 'Role-Based Workspaces',
    description: 'Context-aware dashboards for Patients, Doctors, Medical Students, and Administrators — each with tailored features and data access levels.',
    color: 'from-cyan-500 to-blue-600',
    accent: 'text-cyan-400',
    badge: 'Multi-Role',
  },
  {
    icon: AlertTriangle,
    title: 'Drug Interaction Engine',
    description: 'Scans patient medication profiles against new prescriptions in real-time. Flags contraindications, allergies, and dangerous combinations instantly.',
    color: 'from-rose-500 to-pink-600',
    accent: 'text-rose-400',
    badge: 'Safety',
  },
  {
    icon: BarChart3,
    title: 'Triage Urgency Grading',
    description: 'Dynamic classification across Low, Moderate, High, and Emergency levels. AI-powered urgency scoring routes patients to the right care pathway.',
    color: 'from-amber-500 to-orange-600',
    accent: 'text-amber-400',
    badge: 'Classification',
  },
  {
    icon: Search,
    title: 'Care Provider Search',
    description: 'Location-based search engine to look up provisioned doctors and hospitals by city, specialty, or name. Integrated with admin-provisioned provider networks.',
    color: 'from-emerald-500 to-teal-600',
    accent: 'text-emerald-400',
    badge: 'Discovery',
  },
  {
    icon: Pill,
    title: 'Medication Tracker',
    description: 'Interactive medication adherence checklists with daily tracking, schedule management, and compliance metrics. Add, toggle, and remove medications.',
    color: 'from-violet-500 to-purple-600',
    accent: 'text-violet-400',
    badge: 'Adherence',
  },
];

// ─── Trust Badges ────────────────────────────────────────────────────────────
const TRUST_BADGES = [
  { icon: Shield, label: 'SOC 2 Type II', sublabel: 'Certified' },
  { icon: Lock, label: 'HIPAA', sublabel: 'Compliant' },
  { icon: Globe, label: 'GDPR', sublabel: 'Ready' },
  { icon: FileCheck, label: 'ISO 27001', sublabel: 'Aligned' },
];

// ─── Animated ECG Waveform ───────────────────────────────────────────────────
function ECGWaveform() {
  return (
    <svg viewBox="0 0 300 60" className="w-full h-12" preserveAspectRatio="none">
      <defs>
        <linearGradient id="ecg-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#34d399" stopOpacity="0" />
          <stop offset="30%" stopColor="#34d399" stopOpacity="1" />
          <stop offset="70%" stopColor="#22d3ee" stopOpacity="1" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
        <filter id="ecg-glow">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <path
        d="M0,30 L40,30 L50,30 L55,28 L60,30 L70,30 L75,30 L80,10 L85,50 L90,5 L95,55 L100,30 L110,30 L120,30 L125,28 L130,30 L145,30 L155,30 L160,28 L165,30 L175,30 L180,30 L185,10 L190,50 L195,5 L200,55 L205,30 L215,30 L225,30 L230,28 L235,30 L250,30 L260,30 L265,28 L270,30 L300,30"
        fill="none"
        stroke="url(#ecg-grad)"
        strokeWidth="2"
        filter="url(#ecg-glow)"
      />
    </svg>
  );
}

// ─── Navigation ──────────────────────────────────────────────────────────────
function NavBar({ onLaunch }) {
  const { darkMode, setDarkMode } = useApp();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'Interactive Demo', href: '#demo' },
    { label: 'Security', href: '#security' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? darkMode
          ? 'bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/60 shadow-2xl shadow-black/20'
          : 'bg-white/85 backdrop-blur-xl border-b border-gray-200/80 shadow-lg shadow-black/5'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent-cyan flex items-center justify-center shadow-lg shadow-primary/25 group-hover:shadow-primary/40 transition-shadow">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-pulse" />
          </div>
          <div className="flex items-center gap-2">
            <span className={`font-bold text-base tracking-tight ${darkMode ? 'text-white' : 'text-slate-950'}`}>CareConnect AI</span>
            <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold bg-primary/15 text-primary-light border border-primary/25">
              v1.0 Hackathon Live
            </span>
          </div>
        </a>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                darkMode ? 'text-slate-400 hover:text-white hover:bg-white/5' : 'text-gray-600 hover:text-gray-950 hover:bg-gray-100'
              }`}
            >
              {link.label}
            </a>
          ))}
          <div className="w-px h-6 bg-slate-700/50 mx-2" />
          
          {/* Theme Toggle Button */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-xl transition-all duration-300 mr-2 border ${
              darkMode
                ? 'hover:bg-slate-800 text-slate-400 border-slate-800'
                : 'hover:bg-gray-100 text-gray-700 border-gray-200 shadow-sm'
            }`}
            title="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onLaunch}
            className="ml-2 px-5 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-lg hover:shadow-primary/25 hover:scale-105 active:scale-95 transition-all"
          >
            Launch Platform
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className={`md:hidden border-b transition-colors duration-300 ${
          darkMode ? 'bg-slate-950/95 border-slate-800/60' : 'bg-white/95 border-gray-200/80 shadow-lg'
        }`}>
          <div className="px-6 py-4 space-y-1">
            {navLinks.map(link => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                  darkMode ? 'text-slate-300 hover:text-white hover:bg-white/5' : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {link.label}
              </a>
            ))}
            
            {/* Theme Toggle for Mobile */}
            <button
              onClick={() => { setDarkMode(!darkMode); setMobileOpen(false); }}
              className={`w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-xl transition-all ${
                darkMode ? 'text-slate-300 hover:bg-white/5' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span>Appearance</span>
              <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] text-primary-light">
                {darkMode ? 'Dark' : 'Light'}
              </span>
            </button>

            <button onClick={onLaunch} className="block w-full mt-3 px-4 py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-primary to-primary-dark text-white text-center">
              Launch Platform
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── Hero Section ────────────────────────────────────────────────────────────
function HeroSection() {
  const { darkMode } = useApp();
  const labelClass = darkMode ? 'text-slate-400' : 'text-gray-600';
  const headingClass = darkMode ? 'text-white' : 'text-gray-900';

  return (
    <section className="relative pt-32 pb-20 lg:pb-28 overflow-hidden">
      {/* Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 -left-32 w-[500px] h-[500px] rounded-full bg-primary/8 blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-accent-cyan/6 blur-[120px]" />
        <div className="absolute top-0 right-1/3 w-[300px] h-[300px] rounded-full bg-accent-emerald/4 blur-[100px]" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
        backgroundSize: '60px 60px'
      }} />

      <div className="relative z-10 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left: Copy */}
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-bold text-emerald-400 tracking-wide uppercase">All Systems Operational</span>
          </div>

          <h1 className={`text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight ${headingClass}`}>
            Clinical Decision{' '}
            <br className="hidden sm:block" />
            Intelligence,{' '}
            <br />
            <span className="bg-gradient-to-r from-primary-light via-accent-cyan to-accent-emerald bg-clip-text text-transparent">
              Powered by Gemini AI
            </span>
          </h1>

          <p className={`${labelClass} text-lg leading-relaxed max-w-lg`}>
            Real-time differential diagnosis, explainable AI reasoning, drug interaction detection,
            and sub-second patient triage — built on Google's Gemini 2.5 Flash for modern clinical workflows.
          </p>

          <div className="flex flex-wrap gap-4">
            <a
              href="#demo"
              className="group px-7 py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-xl hover:shadow-primary/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
            >
              Enter Demo Portal
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href="#features"
              className={`px-7 py-3.5 rounded-xl text-sm font-semibold border transition-all flex items-center gap-2 ${darkMode ? 'text-slate-300 border-slate-700/60 hover:bg-white/5 hover:text-white hover:border-slate-600' : 'text-gray-600 border-gray-300 hover:bg-gray-100 hover:text-gray-900 hover:border-gray-400'}`}
            >
              Explore Features
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {/* Stats Row */}
          <div className="flex items-center gap-8 pt-4">
            {[
              { value: '<200ms', label: 'Avg Response' },
              { value: '4 Roles', label: 'Workspaces' },
              { value: '99.9%', label: 'Uptime SLA' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className={`text-xl font-extrabold ${headingClass}`}>{stat.value}</p>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Dashboard Mockup */}
        <div className="relative">
          <div className={`relative rounded-2xl overflow-hidden border transition-all ${
            darkMode
              ? 'border-slate-800/60 bg-slate-900/60 backdrop-blur-md shadow-2xl shadow-black/30'
              : 'border-gray-200 bg-white shadow-2xl shadow-black/5'
          }`}>
            {/* Mockup Header */}
            <div className={`flex items-center gap-2 px-5 py-3 border-b ${
              darkMode ? 'border-slate-800/50 bg-slate-900/40' : 'border-gray-150 bg-gray-50/50'
            }`}>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-amber-500/60" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
              </div>
              <div className="flex-1 flex justify-center">
                <div className={`px-4 py-1 rounded-md text-[10px] font-mono ${
                  darkMode ? 'bg-slate-800/60 text-slate-500' : 'bg-gray-100 text-gray-500'
                }`}>
                  careconnect.ai/dashboard
                </div>
              </div>
            </div>

            {/* Mockup Body */}
            <div className="p-5 space-y-4">
              {/* Status Bar */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-primary-light" />
                  <span className={`text-xs font-bold ${headingClass}`}>Clinical Console</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[10px] text-emerald-400 font-semibold">LIVE</span>
                </div>
              </div>

              {/* ECG */}
              <div className={`rounded-xl p-3 border ${
                darkMode ? 'bg-slate-800/40 border-slate-700/40' : 'bg-gray-50 border-gray-150'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-slate-500 font-semibold">ECG — Lead II</span>
                  <span className="text-[10px] text-emerald-400 font-mono">72 BPM</span>
                </div>
                <ECGWaveform />
              </div>

              {/* AI Diagnosis Card */}
              <div className={`rounded-xl p-4 space-y-3 border ${
                darkMode ? 'bg-gradient-to-br from-primary/10 to-transparent border-primary/20' : 'bg-gradient-to-br from-primary/5 to-transparent border-primary/15'
              }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-3.5 h-3.5 text-primary-light" />
                    <span className={`text-[11px] font-bold ${headingClass}`}>AI Differential Diagnosis</span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                    Emergency
                  </span>
                </div>
                <div className="space-y-1.5">
                  {[
                    { name: 'Acute MI', pct: 78, color: 'bg-red-500' },
                    { name: 'Pulmonary Embolism', pct: 14, color: 'bg-orange-500' },
                    { name: 'Aortic Dissection', pct: 6, color: 'bg-amber-500' },
                  ].map((dx, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className={`text-[10px] w-28 truncate ${darkMode ? 'text-slate-400' : 'text-gray-600'}`}>{dx.name}</span>
                      <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700/50' : 'bg-gray-200'}`}>
                        <div className={`h-full rounded-full ${dx.color} animate-progress-fill`} style={{ width: `${dx.pct}%`, animationDelay: `${i * 200}ms` }} />
                      </div>
                      <span className={`text-[10px] font-mono w-8 text-right ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{dx.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Doctor Status Row */}
              <div className="flex gap-3">
                {[
                  { name: 'Dr. Smith', status: 'On-Call', dot: 'bg-emerald-400' },
                  { name: 'Dr. Patel', status: 'In Surgery', dot: 'bg-amber-400' },
                  { name: 'Dr. Lee', status: 'Available', dot: 'bg-emerald-400' },
                ].map((doc, i) => (
                  <div key={i} className={`flex-1 rounded-lg px-3 py-2 border ${
                    darkMode ? 'bg-slate-800/40 border-slate-700/30' : 'bg-gray-50 border-gray-150'
                  }`}>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-1.5 h-1.5 rounded-full ${doc.dot}`} />
                      <span className={`text-[10px] font-bold truncate ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{doc.name}</span>
                    </div>
                    <p className="text-[9px] text-slate-500 mt-0.5">{doc.status}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Floating accent glow behind mockup */}
          <div className="absolute -inset-8 -z-10 rounded-3xl bg-gradient-to-br from-primary/5 via-transparent to-accent-cyan/5 blur-2xl" />
        </div>
      </div>
    </section>
  );
}

// ─── Features Grid ───────────────────────────────────────────────────────────
function FeaturesSection() {
  const { darkMode } = useApp();
  const labelClass = darkMode ? 'text-slate-400' : 'text-gray-600';
  const headingClass = darkMode ? 'text-white' : 'text-gray-900';

  return (
    <section id="features" className="relative py-24 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-primary/3 blur-[200px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-2">
            <Zap className="w-3.5 h-3.5 text-primary-light" />
            <span className="text-[11px] font-bold text-primary-light uppercase tracking-wider">Platform Capabilities</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${headingClass}`}>
            Everything You Need for
            <br />
            <span className="bg-gradient-to-r from-primary-light to-accent-cyan bg-clip-text text-transparent">
              Intelligent Clinical Workflows
            </span>
          </h2>
          <p className={`${labelClass} max-w-2xl mx-auto text-sm leading-relaxed`}>
            Six core modules working in harmony — from AI diagnosis to medication tracking — providing a complete clinical decision support system.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((feat, i) => (
            <div
              key={i}
              className={`group relative rounded-2xl p-6 border shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-default ${
                darkMode
                  ? 'bg-slate-900/60 backdrop-blur-md border-slate-800/60 hover:shadow-2xl hover:border-slate-700/60'
                  : 'bg-white border-gray-200/80 shadow-md hover:border-gray-300'
              }`}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              {/* Gradient icon container */}
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} flex items-center justify-center mb-4 shadow-lg group-hover:shadow-xl transition-shadow`}>
                <feat.icon className="w-6 h-6 text-white" />
              </div>

              {/* Badge */}
              <span className={`inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                darkMode
                  ? 'bg-slate-800/80 border-slate-700/50'
                  : 'bg-gray-100 border-gray-200/80'
              } ${feat.accent} mb-3`}>
                {feat.badge}
              </span>

              <h3 className={`text-base font-bold mb-2 ${headingClass}`}>{feat.title}</h3>
              <p className={`text-sm leading-relaxed ${labelClass}`}>{feat.description}</p>

              {/* Hover glow */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feat.color} opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Interactive Demo Section ────────────────────────────────────────────────
function DemoSection() {
  const { darkMode } = useApp();
  const [symptoms, setSymptoms] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const resultRef = useRef(null);

  const labelClass = darkMode ? 'text-slate-400' : 'text-gray-600';
  const headingClass = darkMode ? 'text-white' : 'text-gray-900';

  const handleAnalyze = (urgencyOverride) => {
    if (!symptoms.trim() && !urgencyOverride) return;
    setIsAnalyzing(true);
    setResult(null);

    const urgency = urgencyOverride || detectUrgency(symptoms);

    // Simulate AI processing delay
    setTimeout(() => {
      setResult(DIAGNOSIS_RESPONSES[urgency]);
      setIsAnalyzing(false);
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    }, 1800 + Math.random() * 800);
  };

  const detectUrgency = (text) => {
    const lower = text.toLowerCase();
    if (lower.includes('chest pain') || lower.includes('crushing') || lower.includes('heart attack')) return 'emergency';
    if (lower.includes('stiff neck') || lower.includes('meningitis') || lower.includes('severe headache')) return 'high';
    if (lower.includes('abdominal') || lower.includes('appendix') || lower.includes('sharp pain')) return 'moderate';
    return 'low';
  };

  const handlePreset = (preset) => {
    setSymptoms(preset.text);
    setResult(null);
    handleAnalyze(preset.urgency);
  };

  return (
    <section id="demo" className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] rounded-full bg-accent-cyan/4 blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-primary/4 blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-cyan/10 border border-accent-cyan/20">
            <Stethoscope className="w-3.5 h-3.5 text-accent-cyan" />
            <span className="text-[11px] font-bold text-accent-cyan uppercase tracking-wider">Try It Live</span>
          </div>
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${headingClass}`}>
            Interactive Symptom{' '}
            <span className="bg-gradient-to-r from-accent-cyan to-accent-emerald bg-clip-text text-transparent">
              Parser Sandbox
            </span>
          </h2>
          <p className={`${labelClass} max-w-xl mx-auto text-sm`}>
            Type or select symptoms below and watch CareConnect AI generate a differential diagnosis in real-time.
          </p>
        </div>

        {/* Demo Card */}
        <div className={`rounded-2xl border overflow-hidden transition-all ${
          darkMode
            ? 'border-slate-800/60 bg-slate-900/60 backdrop-blur-md shadow-2xl'
            : 'border-gray-200 bg-white shadow-2xl shadow-black/5'
        }`}>
          {/* Top bar */}
          <div className={`flex items-center gap-2 px-6 py-3 border-b ${
            darkMode ? 'border-slate-800/50 bg-slate-900/40' : 'border-gray-150 bg-gray-50/50'
          }`}>
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500/50" />
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/50" />
            </div>
            <div className="flex-1 flex justify-center">
              <span className={`px-3 py-0.5 rounded text-[10px] font-mono ${
                darkMode ? 'bg-slate-800/60 text-slate-500' : 'bg-gray-100 text-gray-500'
              }`}>
                gemini-diagnosis-engine v2.5-flash
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Preset Buttons */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">Quick Presets</label>
              <div className="flex flex-wrap gap-2">
                {PRESET_SYMPTOMS.map((preset, i) => (
                  <button
                    key={i}
                    onClick={() => handlePreset(preset)}
                    disabled={isAnalyzing}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border disabled:opacity-40 disabled:cursor-not-allowed ${
                      darkMode
                        ? 'bg-slate-800/60 border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-800 hover:border-slate-600'
                        : 'bg-gray-50 border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:border-gray-300 shadow-sm'
                    }`}
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Symptom Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wider">Describe Symptoms</label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="e.g. Crushing chest pain radiating to left arm, shortness of breath, sweating..."
                rows={3}
                disabled={isAnalyzing}
                className={`w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/40 transition-all resize-none disabled:opacity-50 ${
                  darkMode
                    ? 'bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-600'
                    : 'bg-gray-50 border border-gray-250 text-gray-900 placeholder-gray-400 focus:border-primary/60'
                }`}
              />
            </div>

            {/* Analyze Button */}
            <button
              onClick={() => handleAnalyze(null)}
              disabled={isAnalyzing || !symptoms.trim()}
              className="w-full py-3.5 rounded-xl text-sm font-bold bg-gradient-to-r from-primary to-accent-cyan text-white hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.01] active:scale-[0.99] transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Analyzing with Gemini AI...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Analyze Symptoms
                </>
              )}
            </button>

            {/* Loading Shimmer */}
            {isAnalyzing && (
              <div className="space-y-3 animate-fade-in">
                <div className="h-6 rounded-lg bg-slate-800/50 animate-shimmer" />
                <div className="h-4 rounded-lg bg-slate-800/40 animate-shimmer w-3/4" style={{ animationDelay: '0.2s' }} />
                <div className="h-4 rounded-lg bg-slate-800/40 animate-shimmer w-1/2" style={{ animationDelay: '0.4s' }} />
              </div>
            )}

            {/* Result */}
            {result && !isAnalyzing && (
              <div ref={resultRef} className="space-y-5 animate-slide-up">
                {/* Urgency Banner */}
                <div className={`flex items-center gap-3 px-5 py-4 rounded-xl border ${result.urgencyColor}`}>
                  <div className={`w-3 h-3 rounded-full ${result.urgencyDot} animate-pulse`} />
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider">Triage Classification</p>
                    <p className="text-lg font-extrabold">{result.urgency} Priority</p>
                  </div>
                </div>

                {/* Differential Diagnoses Table */}
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <Brain className="w-3.5 h-3.5" />
                    Differential Diagnoses
                  </h4>
                  <div className="space-y-2">
                    {result.differentials.map((dx, i) => (
                      <div key={i} className={`rounded-xl border p-4 transition-all ${
                        darkMode ? 'bg-slate-800/40 border-slate-700/30' : 'bg-gray-50 border-gray-150 shadow-sm'
                      }`}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className={`text-sm font-bold ${headingClass}`}>{dx.condition}</p>
                              <span className={`shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                                darkMode ? 'bg-slate-700/60 text-slate-300 border-slate-600/40' : 'bg-gray-200 text-gray-700 border-gray-300/50'
                              }`}>
                                {dx.probability}
                              </span>
                            </div>
                            <p className={`text-xs leading-relaxed ${labelClass}`}>{dx.reasoning}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Actions */}
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Recommended Actions
                  </h4>
                  <div className="space-y-2">
                    {result.actions.map((action, i) => {
                      const icons = { triage: AlertTriangle, treatment: Pill, department: Building2 };
                      const labels = { triage: 'Triage Priority', treatment: 'Treatment Protocol', department: 'Department Routing' };
                      const Icon = icons[action.type] || CheckCircle;
                      return (
                        <div key={i} className={`flex items-start gap-3 px-4 py-3 rounded-xl border ${
                          darkMode ? 'bg-slate-800/30 border-slate-700/20' : 'bg-gray-50 border-gray-150/70'
                        }`}>
                          <Icon className="w-4 h-4 text-primary-light shrink-0 mt-0.5" />
                          <div>
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{labels[action.type]}</p>
                            <p className={`text-xs font-medium ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{action.text}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Gemini Badge */}
                <div className="flex items-center justify-center gap-2 pt-2">
                  <Sparkles className="w-3 h-3 text-primary-light" />
                  <span className="text-[10px] text-slate-500 font-semibold">Powered by Google Gemini 2.5 Flash · Response simulated for demo</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Security & Trust Banner ─────────────────────────────────────────────────
function SecuritySection() {
  const { darkMode } = useApp();
  const labelClass = darkMode ? 'text-slate-400' : 'text-gray-600';
  const headingClass = darkMode ? 'text-white' : 'text-gray-900';

  return (
    <section id="security" className="relative py-20 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full bg-emerald-500/3 blur-[180px]" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center space-y-10">
        {/* Shield Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-xl shadow-emerald-500/20">
            <Shield className="w-8 h-8 text-white" />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className={`text-3xl sm:text-4xl font-extrabold tracking-tight ${headingClass}`}>
            HIPAA Secured &{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              End-to-End Encrypted
            </span>
          </h2>
          <p className={`${labelClass} max-w-2xl mx-auto text-sm leading-relaxed`}>
            Every patient record, diagnosis, and interaction is protected with enterprise-grade
            encryption and compliance frameworks. Your data never leaves the secure perimeter.
          </p>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {TRUST_BADGES.map((badge, i) => (
            <div
              key={i}
              className={`rounded-2xl p-5 border hover:scale-[1.03] transition-all duration-300 group ${
                darkMode
                  ? 'bg-slate-900/60 backdrop-blur-md border-slate-800/60 hover:border-emerald-500/20'
                  : 'bg-white border-gray-200 shadow-sm hover:border-emerald-500/30'
              }`}
            >
              <badge.icon className="w-8 h-8 text-emerald-400 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <p className={`text-sm font-bold ${headingClass}`}>{badge.label}</p>
              <p className="text-[11px] text-slate-500 font-medium">{badge.sublabel}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Footer ──────────────────────────────────────────────────────────────────
function LandingFooter() {
  const { darkMode } = useApp();
  const productLinks = ['Clinical Console', 'Diagnosis Engine', 'Medication Tracker', 'Provider Search'];
  const devLinks = ['API Reference', 'SDK Documentation', 'Webhook Events', 'Status Page'];
  const legalLinks = ['Privacy Policy', 'Terms of Service', 'HIPAA Compliance', 'Data Processing'];

  return (
    <footer className={`relative border-t transition-colors duration-300 ${
      darkMode ? 'border-slate-800 bg-slate-950 text-slate-400' : 'border-gray-200 bg-white text-gray-650'
    }`}>
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand Column */}
          <div className="space-y-4 lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent-cyan flex items-center justify-center">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-gray-900'}`}>CareConnect AI</span>
            </div>
            <p className="text-xs leading-relaxed">
              AI-powered clinical decision intelligence for modern healthcare systems.
              Built with Google's Gemini 2.5 Flash.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] text-emerald-400 font-bold">All Systems Operational</span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-4 ${darkMode ? 'text-slate-400' : 'text-gray-700'}`}>Product</h4>
            <ul className="space-y-2.5">
              {productLinks.map(link => (
                <li key={link}>
                  <a href="#" className={`text-sm transition-colors ${darkMode ? 'text-slate-500 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Developers */}
          <div>
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-4 ${darkMode ? 'text-slate-400' : 'text-gray-700'}`}>Developers</h4>
            <ul className="space-y-2.5">
              {devLinks.map(link => (
                <li key={link}>
                  <a href="#" className={`text-sm transition-colors ${darkMode ? 'text-slate-500 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>{link}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className={`text-xs font-bold uppercase tracking-wider mb-4 ${darkMode ? 'text-slate-400' : 'text-gray-700'}`}>Legal</h4>
            <ul className="space-y-2.5">
              {legalLinks.map(link => (
                <li key={link}>
                  <a href="#" className={`text-sm transition-colors ${darkMode ? 'text-slate-500 hover:text-white' : 'text-gray-500 hover:text-gray-900'}`}>{link}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`mt-12 pt-8 border-t flex flex-col sm:flex-row items-center justify-between gap-4 ${
          darkMode ? 'border-slate-800/40' : 'border-gray-150'
        }`}>
          <p className="text-[11px] text-slate-500">
            &copy; 2026 CareConnect AI. All rights reserved.
          </p>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span className="text-[10px] text-amber-400 font-semibold">
              Hackathon prototype — not for clinical diagnostic use
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default function LandingPage({ onLaunchPlatform }) {
  const { darkMode } = useApp();
  return (
    <div className={`min-h-screen transition-colors duration-300 overflow-x-hidden ${
      darkMode ? 'bg-slate-950 text-slate-100' : 'bg-gray-50 text-gray-900'
    }`}>
      <NavBar onLaunch={onLaunchPlatform} />
      <HeroSection />
      <FeaturesSection />
      <DemoSection />
      <SecuritySection />
      <LandingFooter />
    </div>
  );
}

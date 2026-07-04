import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import { fetchAIDiagnosis } from '../../services/geminiService';
import { MOCK_PATIENT_PROFILE, MOCK_VOICE_SYMPTOMS, MOCK_IMAGE_ANALYSIS, MOCK_WEARABLE_DATA } from '../../data/mockData';
import {
  Mic, MicOff, Camera, Send, AlertTriangle, AlertCircle, CheckCircle, Shield,
  Heart, Moon as MoonIcon, Footprints, Flame, Droplets, ChevronDown, ChevronUp,
  Clock, Pill, Activity, Sparkles, Loader2, FileText, Eye, Search, Building2, MapPin, Plus, X, Calendar, Trash2
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import TypewriterText from '../shared/TypewriterText';
import GeminiBadge from '../shared/GeminiBadge';

export default function PatientDashboard() {
  const { user } = useAuth();
  const { darkMode, addCaseToQueue, medications, toggleMedication, addMedication, deleteMedication, patientDiagnosis, setPatientDiagnosis, addNotification, doctors, hospitals } = useApp();
  const patientName = user?.name || MOCK_PATIENT_PROFILE.name;
  const [symptoms, setSymptoms] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [waveformBars, setWaveformBars] = useState(Array(20).fill(4));
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showImageAnalysis, setShowImageAnalysis] = useState(false);
  const [expandedDiff, setExpandedDiff] = useState(null);
  const waveformInterval = useRef(null);
  const textareaRef = useRef(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Medication form states
  const [showAddMed, setShowAddMed] = useState(false);
  const [medForm, setMedForm] = useState({ name: '', schedule: '', time: '' });
  const [medError, setMedError] = useState('');

  const handleAddMed = (e) => {
    e.preventDefault();
    setMedError('');
    if (!medForm.name.trim() || !medForm.schedule.trim() || !medForm.time.trim()) {
      setMedError('All fields are required.');
      return;
    }
    addMedication(medForm);
    setMedForm({ name: '', schedule: '', time: '' });
    setShowAddMed(false);
  };

  const handleProviderSearch = () => {
    if (!searchQuery.trim()) {
      addNotification('Please enter a doctor name, hospital name, or city.', 'warning');
      return;
    }
    const query = searchQuery.toLowerCase().trim();
    const matchedDocs = (doctors || []).filter(doc => 
      (doc.name || '').toLowerCase().includes(query) ||
      (doc.specialty || '').toLowerCase().includes(query) ||
      (doc.city || '').toLowerCase().includes(query) ||
      (doc.email || '').toLowerCase().includes(query)
    );
    const matchedHospitals = (hospitals || []).filter(h => 
      (h.name || '').toLowerCase().includes(query) ||
      (h.city || '').toLowerCase().includes(query) ||
      (h.address || '').toLowerCase().includes(query)
    );
    setSearchResults({ doctors: matchedDocs, hospitals: matchedHospitals });
    setHasSearched(true);
  };

  // Waveform animation
  useEffect(() => {
    if (isRecording) {
      waveformInterval.current = setInterval(() => {
        setWaveformBars(prev => prev.map(() => Math.random() * 28 + 4));
      }, 100);

      const timeout = setTimeout(() => {
        setIsRecording(false);
        clearInterval(waveformInterval.current);
        const randomSymptom = MOCK_VOICE_SYMPTOMS[Math.floor(Math.random() * MOCK_VOICE_SYMPTOMS.length)];
        setSymptoms(randomSymptom);
        setWaveformBars(Array(20).fill(4));
      }, 3000);

      return () => {
        clearInterval(waveformInterval.current);
        clearTimeout(timeout);
      };
    }
  }, [isRecording]);

  const handleAnalyze = async () => {
    if (!symptoms.trim()) return;
    setIsAnalyzing(true);
    setPatientDiagnosis(null);

    try {
      const result = await fetchAIDiagnosis(symptoms);
      setPatientDiagnosis(result);

      // Add to doctor's case queue
      const newCase = {
        id: `CASE-${String(Date.now()).slice(-3)}`,
        patientName: patientName,
        age: MOCK_PATIENT_PROFILE.age,
        symptoms: symptoms,
        submittedAt: new Date().toLocaleTimeString('en-US', { hour12: false }),
        urgency: result.urgency,
        status: 'pending',
        aiDiagnosis: result,
        medications: MOCK_PATIENT_PROFILE.currentMedications,
      };
      addCaseToQueue(newCase);
      addNotification('Symptoms analyzed — case sent to doctor queue', 'success');
    } catch (err) {
      addNotification('Analysis failed. Please try again.', 'error');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const urgencyConfig = {
    low: { color: 'bg-emerald-500', textColor: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/30', label: 'LOW URGENCY', icon: CheckCircle },
    moderate: { color: 'bg-amber-500', textColor: 'text-amber-400', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/30', label: 'MODERATE URGENCY', icon: AlertCircle },
    high: { color: 'bg-orange-500', textColor: 'text-orange-400', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/30', label: 'HIGH URGENCY', icon: AlertTriangle },
    emergency: { color: 'bg-red-500', textColor: 'text-red-400', bgColor: 'bg-red-500/10', borderColor: 'border-red-500/30', label: '🚨 EMERGENCY', icon: AlertTriangle },
  };

  const cardClass = darkMode
    ? 'glass-card rounded-2xl p-5'
    : 'glass-card-light rounded-2xl p-5 shadow-sm';
  const labelClass = darkMode ? 'text-slate-400' : 'text-gray-500';
  const headingClass = darkMode ? 'text-white' : 'text-gray-900';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${headingClass}`}>
            Welcome back, {patientName.split(' ')[0]} 👋
          </h2>
          <p className={`text-sm mt-1 ${labelClass}`}>
            Patient ID: {MOCK_PATIENT_PROFILE.id} · Blood Type: {MOCK_PATIENT_PROFILE.bloodType}
          </p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
          darkMode ? 'bg-primary/10 text-primary-light border border-primary/20' : 'bg-indigo-50 text-indigo-600 border border-indigo-200'
        }`}>
          <Shield className="w-3.5 h-3.5" />
          <span>HIPAA Secured · End-to-End Encrypted</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN: Symptom Input + Image Upload */}
        <div className="lg:col-span-2 space-y-6">
          {/* Symptom Input Card */}
          <div className={cardClass}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${headingClass}`}>
                <Sparkles className="inline w-5 h-5 mr-2 text-primary-light" />
                AI Symptom Analyzer
              </h3>
              <span className={`text-xs px-2 py-1 rounded-full ${
                darkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
              }`}>
                Powered by Gemini
              </span>
            </div>

            <div className="relative">
              <textarea
                ref={textareaRef}
                id="symptom-input"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Describe your symptoms in detail..."
                rows={4}
                className={`w-full rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                  darkMode
                    ? 'bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500'
                    : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'
                }`}
              />

              {/* Voice Recording Overlay */}
              {isRecording && (
                <div className="absolute inset-0 rounded-xl bg-primary/10 border-2 border-primary/40 flex items-center justify-center gap-1 backdrop-blur-sm">
                  {waveformBars.map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-primary rounded-full transition-all duration-100"
                      style={{ height: `${h}px` }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <button
                  id="voice-input-btn"
                  onClick={() => setIsRecording(!isRecording)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isRecording
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse-glow'
                      : darkMode
                        ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600/50'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  {isRecording ? 'Listening...' : 'Voice Input'}
                </button>

                <button
                  id="image-upload-btn"
                  onClick={() => setShowImageAnalysis(true)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    darkMode
                      ? 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600/50'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  Sample Rash/Wound Photo
                </button>
              </div>

              <button
                id="analyze-btn"
                onClick={handleAnalyze}
                disabled={!symptoms.trim() || isAnalyzing}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  !symptoms.trim() || isAnalyzing
                    ? darkMode
                      ? 'bg-slate-800/40 border border-slate-700/40 text-slate-500 cursor-not-allowed'
                      : 'bg-gray-150 text-gray-400 border border-gray-200 cursor-not-allowed'
                    : 'bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-lg hover:shadow-primary/25 hover:scale-105 active:scale-95'
                }`}
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Analyze Symptoms
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Loading State */}
          {isAnalyzing && (
            <div className={cardClass}>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/20 to-accent-cyan/20 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-primary-light animate-pulse" />
                  </div>
                </div>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${headingClass}`}>CareConnect AI is analyzing your symptoms...</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
              <div className="mt-4 h-1.5 rounded-full overflow-hidden bg-slate-800">
                <div className="h-full rounded-full bg-gradient-to-r from-primary to-accent-cyan animate-shimmer" style={{ width: '80%' }} />
              </div>
            </div>
          )}

          {/* AI Diagnosis Results */}
          {patientDiagnosis && !isAnalyzing && (
            <div className="space-y-4 animate-slide-up">
              {/* Triage Banner */}
              {(() => {
                const urg = urgencyConfig[patientDiagnosis.urgency] || urgencyConfig.moderate;
                const UrgIcon = urg.icon;
                return (
                  <div className={`${urg.bgColor} ${urg.borderColor} border rounded-2xl p-4 flex items-center gap-4`}>
                    <div className={`w-12 h-12 rounded-xl ${urg.color} flex items-center justify-center`}>
                      <UrgIcon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className={`text-sm font-bold ${urg.textColor} tracking-wider`}>{urg.label}</p>
                      <p className={`text-xs mt-0.5 ${labelClass}`}>
                        AI Triage Assessment · {patientDiagnosis.disclaimer}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* Differential Diagnosis */}
              <div className={cardClass}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg font-semibold ${headingClass}`}>
                    <FileText className="inline w-5 h-5 mr-2 text-primary-light" />
                    Differential Diagnosis
                  </h3>
                  <GeminiBadge />
                </div>
                <div className="space-y-3">
                  {patientDiagnosis.differential.map((d, i) => (
                    <div
                      key={i}
                      className={`rounded-xl p-4 transition-all cursor-pointer ${
                        darkMode
                          ? 'bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50'
                          : 'bg-gray-50 hover:bg-gray-100 border border-gray-200'
                      }`}
                      onClick={() => setExpandedDiff(expandedDiff === i ? null : i)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className={`text-xs font-bold px-2 py-1 rounded-lg ${
                            i === 0
                              ? darkMode ? 'bg-primary/20 text-primary-light' : 'bg-indigo-100 text-indigo-700'
                              : darkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-200 text-gray-600'
                          }`}>
                            #{i + 1}
                          </span>
                          <span className={`font-semibold text-sm ${headingClass}`}>{d.condition}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`text-sm font-bold ${
                            d.confidencePct >= 70 ? 'text-emerald-400' :
                            d.confidencePct >= 40 ? 'text-amber-400' : 'text-slate-400'
                          }`}>
                            {d.confidencePct}%
                          </span>
                          {expandedDiff === i ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                        </div>
                      </div>

                      {/* Confidence Bar */}
                      <div className={`mt-3 h-2 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                        <div
                          className={`h-full rounded-full animate-progress-fill ${
                            d.confidencePct >= 70 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
                            d.confidencePct >= 40 ? 'bg-gradient-to-r from-amber-500 to-amber-400' :
                            'bg-gradient-to-r from-slate-500 to-slate-400'
                          }`}
                          style={{ width: `${d.confidencePct}%` }}
                        />
                      </div>

                      {/* Expanded Reasoning */}
                      {expandedDiff === i && (
                        <div className={`mt-3 pt-3 border-t text-sm ${
                          darkMode ? 'border-slate-700 text-slate-300' : 'border-gray-200 text-gray-600'
                        } animate-fade-in`}>
                          <p className="flex items-start gap-2">
                            <Eye className="w-4 h-4 mt-0.5 text-primary-light shrink-0" />
                            <TypewriterText text={d.reasoning} speed={15} />
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Self-Care Remedies */}
              <div className={cardClass}>
                <h3 className={`text-lg font-semibold mb-4 ${headingClass}`}>
                  <Heart className="inline w-5 h-5 mr-2 text-accent-rose" />
                  Recommended Self-Care
                </h3>
                <div className="space-y-2">
                  {patientDiagnosis.remedies.map((r, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl ${
                        darkMode ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-gray-50 border border-gray-200'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span className={`text-sm ${darkMode ? 'text-slate-200' : 'text-gray-700'}`}>{r}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Image Analysis Panel */}
          {showImageAnalysis && (
            <div className={`${cardClass} animate-slide-up`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className={`text-lg font-semibold ${headingClass}`}>
                  <Camera className="inline w-5 h-5 mr-2 text-accent-cyan" />
                  AI Visual Analysis
                </h3>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                  darkMode ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' : 'bg-cyan-50 text-cyan-700 border border-cyan-200'
                }`}>
                  {MOCK_IMAGE_ANALYSIS.confidence}% Confidence
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {MOCK_IMAGE_ANALYSIS.findings.map((f, i) => (
                  <div key={i} className={`p-3 rounded-xl ${darkMode ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-gray-50 border border-gray-200'}`}>
                    <p className={`text-xs font-medium mb-1 ${labelClass}`}>{f.label}</p>
                    <p className={`text-sm ${darkMode ? 'text-slate-200' : 'text-gray-700'}`}>{f.value}</p>
                  </div>
                ))}
              </div>

              <div className={`p-4 rounded-xl ${darkMode ? 'bg-cyan-500/5 border border-cyan-500/20' : 'bg-cyan-50 border border-cyan-200'}`}>
                <p className={`text-sm leading-relaxed ${darkMode ? 'text-cyan-300' : 'text-cyan-800'}`}>
                  <Sparkles className="inline w-4 h-4 mr-1" />
                  {MOCK_IMAGE_ANALYSIS.aiAssessment}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Medication + Wearable */}
        <div className="space-y-6">
          {/* City-Wise Care Search */}
          <div className={cardClass}>
            <h3 className={`text-lg font-semibold mb-4 ${headingClass}`}>
              <Building2 className="inline w-5 h-5 mr-2 text-primary-light" />
              Care Provider Search
            </h3>
            <p className={`text-xs ${labelClass} mb-3`}>
              Search by doctor name, hospital name, specialty, or city.
            </p>
            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${labelClass}`} />
                <input
                  id="care-search-input"
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter doctor, hospital, or city..."
                  className={`w-full pl-10 pr-4 py-2.5 text-xs rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
                    darkMode
                      ? 'bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500'
                      : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'
                  }`}
                  onKeyDown={(e) => e.key === 'Enter' && handleProviderSearch()}
                />
              </div>
              <button
                id="care-search-btn"
                onClick={handleProviderSearch}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-primary to-primary-dark text-white hover:shadow-lg hover:shadow-primary/25 transition-all flex items-center gap-1.5"
              >
                <Search className="w-3.5 h-3.5" />
                Search
              </button>
            </div>

            {hasSearched && searchResults && (
              <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1 animate-fade-in">
                {/* Matching Doctors */}
                <div>
                  <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
                    Doctors ({searchResults.doctors.length})
                  </h4>
                  {searchResults.doctors.length === 0 ? (
                    <p className={`text-xs ${labelClass} italic pl-1`}>No doctors found in this city.</p>
                  ) : (
                    <div className="space-y-2">
                      {searchResults.doctors.map((doc, idx) => (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-xl border text-left ${
                            darkMode ? 'bg-slate-800/30 border-slate-700/50' : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <p className={`text-xs font-bold ${headingClass}`}>{doc.name}</p>
                          <p className={`text-[10px] ${darkMode ? 'text-primary-light' : 'text-indigo-600'} font-medium`}>{doc.specialty}</p>
                          <p className={`text-[10px] ${labelClass}`}>{doc.email}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Matching Hospitals */}
                <div>
                  <h4 className={`text-xs font-semibold uppercase tracking-wider mb-2 ${darkMode ? 'text-cyan-400' : 'text-cyan-600'}`}>
                    Hospitals ({searchResults.hospitals.length})
                  </h4>
                  {searchResults.hospitals.length === 0 ? (
                    <p className={`text-xs ${labelClass} italic pl-1`}>No hospitals found in this city.</p>
                  ) : (
                    <div className="space-y-2">
                      {searchResults.hospitals.map((h, idx) => (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-xl border text-left ${
                            darkMode ? 'bg-slate-800/30 border-slate-700/50' : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          <p className={`text-xs font-bold ${headingClass}`}>{h.name}</p>
                          <p className={`text-[10px] ${labelClass}`}>{h.address}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Medication Adherence */}
          <div className={cardClass}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${headingClass}`}>
                <Pill className="inline w-5 h-5 mr-2 text-accent-violet" />
                Medication Tracker
              </h3>
              <button
                id="add-med-btn"
                onClick={() => setShowAddMed(true)}
                className={`p-1.5 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-slate-800 text-slate-400 hover:text-white' : 'hover:bg-gray-150 text-gray-500 hover:text-gray-900'
                }`}
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-2">
              {medications.map(med => (
                <div
                  key={med.id}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    med.taken
                      ? darkMode ? 'bg-emerald-500/10 border border-emerald-500/20' : 'bg-emerald-50 border border-emerald-200'
                      : darkMode ? 'bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800' : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <button
                    id={`med-toggle-${med.id}`}
                    onClick={() => toggleMedication(med.id)}
                    className="flex flex-1 items-center gap-3 text-left focus:outline-none min-w-0"
                  >
                    <div className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors shrink-0 ${
                      med.taken
                        ? 'bg-emerald-500 text-white'
                        : darkMode ? 'border-2 border-slate-600' : 'border-2 border-gray-300'
                    }`}>
                      {med.taken && <CheckCircle className="w-3.5 h-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${med.taken ? (darkMode ? 'text-emerald-300 line-through opacity-70' : 'text-emerald-700 line-through opacity-70') : headingClass}`}>
                        {med.name}
                      </p>
                      <p className={`text-xs ${labelClass}`}>{med.schedule}</p>
                    </div>
                  </button>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className={`text-xs ${labelClass}`}>{med.time}</span>
                    <button
                      id={`med-delete-${med.id}`}
                      onClick={() => deleteMedication(med.id)}
                      className={`p-1.5 rounded-lg hover:bg-red-500/10 text-slate-500 hover:text-red-400 transition-colors`}
                      title="Delete medication"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className={`text-xs ${labelClass}`}>Today's adherence</span>
              <span className={`text-sm font-bold ${
                medications.filter(m => m.taken).length === medications.length ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {medications.filter(m => m.taken).length}/{medications.length}
              </span>
            </div>
          </div>

          {/* Wearable Data */}
          <div className={cardClass}>
            <h3 className={`text-lg font-semibold mb-4 ${headingClass}`}>
              <Activity className="inline w-5 h-5 mr-2 text-accent-cyan" />
              Wearable Sync
            </h3>

            {/* Heart Rate Chart */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-medium ${labelClass}`}>Heart Rate (BPM)</span>
                <span className="text-lg font-bold text-accent-rose flex items-center gap-1">
                  <Heart className="w-4 h-4" /> {MOCK_WEARABLE_DATA.heartRate.current}
                </span>
              </div>
              <div className="h-32 -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={MOCK_WEARABLE_DATA.heartRate.data}>
                    <defs>
                      <linearGradient id="hrGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#fb7185" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#252d4a' : '#e5e7eb'} />
                    <XAxis dataKey="time" tick={{ fontSize: 10, fill: darkMode ? '#5a6484' : '#9ca3af' }} />
                    <YAxis domain={[50, 100]} tick={{ fontSize: 10, fill: darkMode ? '#5a6484' : '#9ca3af' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkMode ? '#1a2139' : '#fff',
                        border: `1px solid ${darkMode ? '#2a3354' : '#e5e7eb'}`,
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: darkMode ? '#fff' : '#111',
                      }}
                    />
                    <Area type="monotone" dataKey="bpm" stroke="#fb7185" fill="url(#hrGradient)" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Vitals Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className={`p-3 rounded-xl text-center ${darkMode ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                <MoonIcon className="w-4 h-4 mx-auto mb-1 text-accent-violet" />
                <p className={`text-lg font-bold ${headingClass}`}>{MOCK_WEARABLE_DATA.sleepQuality}%</p>
                <p className={`text-[10px] ${labelClass}`}>Sleep Quality</p>
              </div>
              <div className={`p-3 rounded-xl text-center ${darkMode ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                <Footprints className="w-4 h-4 mx-auto mb-1 text-accent-cyan" />
                <p className={`text-lg font-bold ${headingClass}`}>{(MOCK_WEARABLE_DATA.steps / 1000).toFixed(1)}k</p>
                <p className={`text-[10px] ${labelClass}`}>Steps</p>
              </div>
              <div className={`p-3 rounded-xl text-center ${darkMode ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                <Flame className="w-4 h-4 mx-auto mb-1 text-accent-amber" />
                <p className={`text-lg font-bold ${headingClass}`}>{MOCK_WEARABLE_DATA.calories}</p>
                <p className={`text-[10px] ${labelClass}`}>Calories</p>
              </div>
              <div className={`p-3 rounded-xl text-center ${darkMode ? 'bg-slate-800/50' : 'bg-gray-50'}`}>
                <Droplets className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                <p className={`text-lg font-bold ${headingClass}`}>{MOCK_WEARABLE_DATA.bloodOxygen}%</p>
                <p className={`text-[10px] ${labelClass}`}>SpO₂</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Add Medication Modal */}
      {showAddMed && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setShowAddMed(false)}>
          <div className={`w-full max-w-md rounded-2xl shadow-2xl border ${
            darkMode ? 'bg-slate-900 border-slate-700/60' : 'bg-white border-gray-200'
          }`} onClick={(e) => e.stopPropagation()}>
            <div className={`flex items-center justify-between px-6 py-4 border-b ${darkMode ? 'border-slate-700/50' : 'border-gray-200'}`}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-accent-violet to-purple-500 flex items-center justify-center">
                  <Pill className="w-4 h-4 text-white" />
                </div>
                <h3 className={`text-lg font-semibold ${headingClass}`}>Add Medication</h3>
              </div>
              <button
                onClick={() => setShowAddMed(false)}
                className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMed} className="px-6 py-5 space-y-4">
              {medError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <p className="text-xs text-red-400 font-medium">{medError}</p>
                </div>
              )}

              <div>
                <label className={`block text-xs font-medium mb-1.5 ${labelClass}`}>Medication Name</label>
                <div className="relative">
                  <Pill className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${labelClass}`} />
                  <input
                    id="med-name"
                    type="text"
                    value={medForm.name}
                    onChange={(e) => setMedForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Aspirin 81mg"
                    className={`w-full pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all rounded-xl ${
                      darkMode ? 'bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500' : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1.5 ${labelClass}`}>Schedule</label>
                <div className="relative">
                  <Calendar className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${labelClass}`} />
                  <input
                    id="med-schedule"
                    type="text"
                    value={medForm.schedule}
                    onChange={(e) => setMedForm(f => ({ ...f, schedule: e.target.value }))}
                    placeholder="e.g. Daily — Morning"
                    className={`w-full pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all rounded-xl ${
                      darkMode ? 'bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500' : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1.5 ${labelClass}`}>Time</label>
                <div className="relative">
                  <Clock className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${labelClass}`} />
                  <input
                    id="med-time"
                    type="text"
                    value={medForm.time}
                    onChange={(e) => setMedForm(f => ({ ...f, time: e.target.value }))}
                    placeholder="e.g. 08:00 AM"
                    className={`w-full pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all rounded-xl ${
                      darkMode ? 'bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500' : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'
                    }`}
                  />
                </div>
              </div>

              <button
                id="submit-med"
                type="submit"
                className="w-full py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-accent-violet to-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Medication
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

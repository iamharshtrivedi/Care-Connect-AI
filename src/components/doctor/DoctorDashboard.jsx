import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MOCK_DOCTOR_ANALYTICS, DRUG_INTERACTIONS, COMMON_PRESCRIPTIONS, MOCK_PATIENT_PROFILE } from '../../data/mockData';
import {
  Users, AlertTriangle, CheckCircle, XCircle, Edit3, Clock,
  ChevronRight, FileText, Pill, TrendingUp, BarChart3, Eye,
  ShieldAlert, ArrowUpRight, Stethoscope, Search, ChevronDown, ChevronUp
} from 'lucide-react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import TypewriterText from '../shared/TypewriterText';
import GeminiBadge from '../shared/GeminiBadge';

export default function DoctorDashboard() {
  const { darkMode, caseQueue, updateCaseStatus, addNotification, selectedCaseId, setSelectedCaseId } = useApp();
  const [prescriptionDrug, setPrescriptionDrug] = useState('');
  const [drugWarning, setDrugWarning] = useState(null);
  const [showPrescription, setShowPrescription] = useState(false);
  const [expandedReasoning, setExpandedReasoning] = useState(null);

  const selectedCase = caseQueue.find(c => c.id === selectedCaseId);

  const urgencyOrder = { emergency: 0, high: 1, moderate: 2, low: 3 };
  const sortedQueue = [...caseQueue].sort((a, b) => (urgencyOrder[a.urgency] ?? 4) - (urgencyOrder[b.urgency] ?? 4));

  const handleDecision = (caseId, decision) => {
    updateCaseStatus(caseId, 'reviewed', decision);
    addNotification(`Case ${caseId} — ${decision === 'accepted' ? 'Accepted' : decision === 'rejected' ? 'Rejected' : 'Modified'}`, 'success');
  };

  const checkDrugInteraction = (drug) => {
    setPrescriptionDrug(drug);
    if (!selectedCase) return;

    const patientMeds = selectedCase.medications || MOCK_PATIENT_PROFILE.currentMedications;
    let warning = null;

    const drugName = drug.split(' ')[0]; // Get just the drug name without dosage
    if (DRUG_INTERACTIONS[drugName]) {
      for (const med of patientMeds) {
        const medName = med.split(' ')[0];
        if (DRUG_INTERACTIONS[drugName].includes(medName)) {
          warning = { drug: drugName, conflicting: medName, full: med };
          break;
        }
      }
    }

    // Also check reverse
    if (!warning) {
      for (const med of patientMeds) {
        const medName = med.split(' ')[0];
        if (DRUG_INTERACTIONS[medName]) {
          if (DRUG_INTERACTIONS[medName].includes(drugName)) {
            warning = { drug: drugName, conflicting: medName, full: med };
            break;
          }
        }
      }
    }

    setDrugWarning(warning);
  };

  const urgencyBadge = (urgency) => {
    const config = {
      emergency: 'bg-red-500/20 text-red-400 border-red-500/30',
      high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      moderate: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      low: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    };
    return config[urgency] || config.moderate;
  };

  const statusBadge = (status, decision) => {
    if (status === 'reviewed') {
      if (decision === 'accepted') return 'bg-emerald-500/20 text-emerald-400';
      if (decision === 'rejected') return 'bg-red-500/20 text-red-400';
      return 'bg-blue-500/20 text-blue-400';
    }
    return darkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-200 text-gray-600';
  };

  const cardClass = darkMode ? 'glass-card rounded-2xl p-5' : 'glass-card-light rounded-2xl p-5 shadow-sm';
  const labelClass = darkMode ? 'text-slate-400' : 'text-gray-500';
  const headingClass = darkMode ? 'text-white' : 'text-gray-900';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${headingClass}`}>
            <Stethoscope className="inline w-6 h-6 mr-2 text-emerald-400" />
            Doctor Dashboard
          </h2>
          <p className={`text-sm mt-1 ${labelClass}`}>
            Dr. Aisha Patel · Internal Medicine · {caseQueue.filter(c => c.status === 'pending').length} pending cases
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className={`px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 ${
            darkMode ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}>
            <TrendingUp className="w-4 h-4" />
            AI Accuracy: {MOCK_DOCTOR_ANALYTICS.aiAccuracy}%
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LEFT: Case Queue */}
        <div className="xl:col-span-1 space-y-4">
          <div className={cardClass}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${headingClass}`}>
                <Users className="inline w-5 h-5 mr-2 text-primary-light" />
                Case Queue
              </h3>
              <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-primary/10 text-primary-light' : 'bg-indigo-50 text-indigo-600'}`}>
                {caseQueue.length} total
              </span>
            </div>

            <div className="space-y-2 max-h-[520px] overflow-y-auto">
              {sortedQueue.map(c => (
                <button
                  key={c.id}
                  id={`case-${c.id}`}
                  onClick={() => { setSelectedCaseId(c.id); setShowPrescription(false); setDrugWarning(null); }}
                  className={`w-full text-left p-3.5 rounded-xl transition-all ${
                    selectedCaseId === c.id
                      ? darkMode ? 'bg-primary/10 border-2 border-primary/40' : 'bg-indigo-50 border-2 border-indigo-300'
                      : darkMode ? 'bg-slate-800/50 border border-slate-700/50 hover:bg-slate-800' : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-sm font-semibold ${headingClass}`}>{c.patientName}</span>
                    <ChevronRight className="w-4 h-4 text-slate-500" />
                  </div>
                  <p className={`text-xs ${labelClass} line-clamp-2 mb-2`}>{c.symptoms}</p>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${urgencyBadge(c.urgency)}`}>
                      {c.urgency}
                    </span>
                    <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full capitalize ${statusBadge(c.status, c.doctorDecision)}`}>
                      {c.status === 'reviewed' ? c.doctorDecision || 'reviewed' : c.status}
                    </span>
                    <span className={`text-[10px] ${labelClass} ml-auto flex items-center gap-1`}>
                      <Clock className="w-3 h-3" /> {c.submittedAt}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MIDDLE + RIGHT: Case Details + Analytics */}
        <div className="xl:col-span-2 space-y-6">
          {selectedCase ? (
            <>
              {/* Explainable AI Panel */}
              <div className={cardClass}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className={`text-lg font-semibold ${headingClass}`}>
                      <FileText className="inline w-5 h-5 mr-2 text-primary-light" />
                      AI Explainable Report — {selectedCase.patientName}
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5">
                      <p className={`text-xs ${labelClass}`}>
                        Age: {selectedCase.age} · Case: {selectedCase.id} · Submitted: {selectedCase.submittedAt}
                      </p>
                      <GeminiBadge className="scale-90 origin-left" />
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full border uppercase tracking-wider ${urgencyBadge(selectedCase.urgency)}`}>
                    {selectedCase.urgency}
                  </span>
                </div>

                {/* Patient Symptoms */}
                <div className={`p-4 rounded-xl mb-4 ${darkMode ? 'bg-slate-800/50 border border-slate-700/50' : 'bg-gray-50 border border-gray-200'}`}>
                  <p className={`text-xs font-medium mb-1.5 ${labelClass}`}>Patient Reported Symptoms</p>
                  <p className={`text-sm ${darkMode ? 'text-slate-200' : 'text-gray-700'}`}>"{selectedCase.symptoms}"</p>
                </div>

                {/* Differential List */}
                {selectedCase.aiDiagnosis && (
                  <div className="space-y-3">
                    {selectedCase.aiDiagnosis.differential.map((d, i) => (
                      <div
                        key={i}
                        className={`rounded-xl p-4 ${darkMode ? 'bg-slate-800/30 border border-slate-700/40' : 'bg-gray-50/50 border border-gray-200'}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className={`text-xs font-bold w-7 h-7 rounded-lg flex items-center justify-center ${
                              i === 0
                                ? 'bg-gradient-to-br from-primary to-accent-cyan text-white'
                                : darkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-200 text-gray-600'
                            }`}>
                              {i + 1}
                            </span>
                            <span className={`font-semibold text-sm ${headingClass}`}>{d.condition}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`text-base font-bold ${
                              d.confidencePct >= 70 ? 'text-emerald-400' :
                              d.confidencePct >= 40 ? 'text-amber-400' : (darkMode ? 'text-slate-400' : 'text-gray-500')
                            }`}>
                              {d.confidencePct}%
                            </span>
                            <button
                              onClick={() => setExpandedReasoning(expandedReasoning === `${selectedCase.id}-${i}` ? null : `${selectedCase.id}-${i}`)}
                              className={`p-1 rounded-lg ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-gray-200'}`}
                            >
                              {expandedReasoning === `${selectedCase.id}-${i}` ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                            </button>
                          </div>
                        </div>

                        <div className={`mt-2 h-1.5 rounded-full overflow-hidden ${darkMode ? 'bg-slate-700' : 'bg-gray-200'}`}>
                          <div
                            className={`h-full rounded-full ${
                              d.confidencePct >= 70 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' :
                              d.confidencePct >= 40 ? 'bg-gradient-to-r from-amber-500 to-amber-400' :
                              'bg-gradient-to-r from-slate-500 to-slate-400'
                            }`}
                            style={{ width: `${d.confidencePct}%` }}
                          />
                        </div>

                        {expandedReasoning === `${selectedCase.id}-${i}` && (
                          <div className={`mt-3 pt-3 border-t text-sm ${
                            darkMode ? 'border-slate-700 text-slate-300' : 'border-gray-200 text-gray-600'
                          } animate-fade-in`}>
                            <div className="flex items-start gap-2">
                              <Eye className="w-4 h-4 mt-0.5 text-primary-light shrink-0" />
                              <TypewriterText text={d.reasoning} speed={15} />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Action Buttons */}
                {selectedCase.status === 'pending' && (
                  <div className="flex items-center gap-3 mt-5 pt-4 border-t border-slate-700/50">
                    <button
                      id={`accept-${selectedCase.id}`}
                      onClick={() => handleDecision(selectedCase.id, 'accepted')}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 transition-all"
                    >
                      <CheckCircle className="w-4 h-4" /> Accept
                    </button>
                    <button
                      id={`edit-${selectedCase.id}`}
                      onClick={() => handleDecision(selectedCase.id, 'modified')}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-all"
                    >
                      <Edit3 className="w-4 h-4" /> Edit
                    </button>
                    <button
                      id={`reject-${selectedCase.id}`}
                      onClick={() => handleDecision(selectedCase.id, 'rejected')}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 transition-all"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                    <button
                      onClick={() => setShowPrescription(!showPrescription)}
                      className={`ml-auto flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        darkMode
                          ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      <Pill className="w-4 h-4" /> Prescribe
                    </button>
                  </div>
                )}

                {selectedCase.status === 'reviewed' && (
                  <div className={`mt-4 p-3 rounded-xl flex items-center gap-3 ${
                    selectedCase.doctorDecision === 'accepted' ? 'bg-emerald-500/10 border border-emerald-500/20' :
                    selectedCase.doctorDecision === 'rejected' ? 'bg-red-500/10 border border-red-500/20' :
                    'bg-blue-500/10 border border-blue-500/20'
                  }`}>
                    <CheckCircle className={`w-5 h-5 ${
                      selectedCase.doctorDecision === 'accepted' ? 'text-emerald-400' :
                      selectedCase.doctorDecision === 'rejected' ? 'text-red-400' : 'text-blue-400'
                    }`} />
                    <span className={`text-sm font-medium capitalize ${
                      selectedCase.doctorDecision === 'accepted' ? 'text-emerald-400' :
                      selectedCase.doctorDecision === 'rejected' ? 'text-red-400' : 'text-blue-400'
                    }`}>
                      Decision: {selectedCase.doctorDecision}
                    </span>
                  </div>
                )}
              </div>

              {/* Prescription Builder */}
              {showPrescription && (
                <div className={`${cardClass} animate-slide-up`}>
                  <h3 className={`text-lg font-semibold mb-4 ${headingClass}`}>
                    <Pill className="inline w-5 h-5 mr-2 text-accent-violet" />
                    Prescription Builder
                  </h3>

                  <div className="flex items-center gap-2 mb-3">
                    <p className={`text-xs ${labelClass}`}>Patient Current Medications:</p>
                    {(selectedCase.medications || []).map((m, i) => (
                      <span key={i} className={`text-xs px-2 py-0.5 rounded-full ${
                        darkMode ? 'bg-slate-700 text-slate-300' : 'bg-gray-200 text-gray-600'
                      }`}>{m}</span>
                    ))}
                  </div>

                  <div className="relative">
                    <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${labelClass}`} />
                    <select
                      id="prescription-select"
                      value={prescriptionDrug}
                      onChange={(e) => checkDrugInteraction(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
                        darkMode
                          ? 'bg-slate-800/50 border border-slate-600/50 text-white'
                          : 'bg-gray-50 border border-gray-200 text-gray-900'
                      }`}
                    >
                      <option value="">Select a medication...</option>
                      {COMMON_PRESCRIPTIONS.map(p => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  {/* Drug Interaction Warning */}
                  {drugWarning && (
                    <div className="mt-4 p-4 rounded-xl bg-red-500/10 border-2 border-red-500/30 animate-slide-up">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center shrink-0">
                          <ShieldAlert className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-red-400">
                            ⚠️ Drug-Drug Interaction Detected by CareConnect AI
                          </p>
                          <p className="text-xs text-red-300/80 mt-1">
                            <strong>{drugWarning.drug}</strong> has a known interaction with patient's current medication <strong>{drugWarning.full}</strong>. 
                            Risk of increased bleeding, reduced efficacy, or adverse effects.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {prescriptionDrug && !drugWarning && (
                    <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 animate-fade-in">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                        <p className="text-sm text-emerald-400 font-medium">
                          No known interactions detected. Safe to prescribe {prescriptionDrug}.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </>
          ) : (
            <div className={`${cardClass} flex flex-col items-center justify-center py-16`}>
              <FileText className={`w-16 h-16 mb-4 ${darkMode ? 'text-slate-700' : 'text-gray-300'}`} />
              <p className={`text-lg font-medium ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>Select a case to view AI analysis</p>
              <p className={`text-sm mt-1 ${labelClass}`}>Click on any case in the queue to see the explainable AI report</p>
            </div>
          )}

          {/* Analytics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Time Saved Chart */}
            <div className={cardClass}>
              <h3 className={`text-base font-semibold mb-4 ${headingClass}`}>
                <BarChart3 className="inline w-5 h-5 mr-2 text-accent-cyan" />
                AI-Assisted Time Saved
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={MOCK_DOCTOR_ANALYTICS.timeSaved}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#252d4a' : '#e5e7eb'} />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: darkMode ? '#5a6484' : '#9ca3af' }} />
                    <YAxis tick={{ fontSize: 11, fill: darkMode ? '#5a6484' : '#9ca3af' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkMode ? '#1a2139' : '#fff',
                        border: `1px solid ${darkMode ? '#2a3354' : '#e5e7eb'}`,
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: darkMode ? '#fff' : '#111',
                      }}
                      formatter={(value) => [`${value} min`, 'Time Saved']}
                    />
                    <Bar dataKey="minutes" radius={[6, 6, 0, 0]}>
                      {MOCK_DOCTOR_ANALYTICS.timeSaved.map((_, i) => (
                        <Cell key={i} fill={`hsl(${175 + i * 8}, 70%, 55%)`} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Override Rates Chart */}
            <div className={cardClass}>
              <h3 className={`text-base font-semibold mb-4 ${headingClass}`}>
                <TrendingUp className="inline w-5 h-5 mr-2 text-accent-violet" />
                Doctor Override Rate (%)
              </h3>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={MOCK_DOCTOR_ANALYTICS.overrideRates}>
                    <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#252d4a' : '#e5e7eb'} />
                    <XAxis dataKey="week" tick={{ fontSize: 11, fill: darkMode ? '#5a6484' : '#9ca3af' }} />
                    <YAxis tick={{ fontSize: 11, fill: darkMode ? '#5a6484' : '#9ca3af' }} domain={[0, 35]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: darkMode ? '#1a2139' : '#fff',
                        border: `1px solid ${darkMode ? '#2a3354' : '#e5e7eb'}`,
                        borderRadius: '12px',
                        fontSize: '12px',
                        color: darkMode ? '#fff' : '#111',
                      }}
                      formatter={(value) => [`${value}%`, 'Override Rate']}
                    />
                    <Line
                      type="monotone"
                      dataKey="rate"
                      stroke="#a78bfa"
                      strokeWidth={2.5}
                      dot={{ fill: '#a78bfa', strokeWidth: 0, r: 4 }}
                      activeDot={{ r: 6, fill: '#a78bfa', stroke: '#1a2139', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ADMIN_METRICS, ADMIN_CONFIDENCE_DISTRIBUTION, ADMIN_AUDIT_LOG } from '../../data/mockData';
import {
  Settings, Zap, Clock, Users, Server, Cpu, TrendingUp,
  CheckCircle, AlertTriangle, AlertCircle, Info, Shield,
  BarChart3, Activity, Globe, ArrowUpRight, ArrowDownRight,
  UserPlus, X, Stethoscope, Mail, Hash, Briefcase, MapPin, Building2
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, Cell
} from 'recharts';
import GeminiBadge from '../shared/GeminiBadge';

export default function AdminPlatform() {
  const { darkMode, caseQueue, doctors, addDoctor, hospitals, addHospital } = useApp();
  const [metrics, setMetrics] = useState(ADMIN_METRICS);
  const [liveLatency, setLiveLatency] = useState(ADMIN_METRICS.apiLatency);
  
  // Doctor form states
  const [showAddDoctor, setShowAddDoctor] = useState(false);
  const [doctorForm, setDoctorForm] = useState({ name: '', license: '', specialty: '', email: '', city: '' });
  const [formError, setFormError] = useState('');

  // Hospital form states
  const [showAddHospital, setShowAddHospital] = useState(false);
  const [hospitalForm, setHospitalForm] = useState({ name: '', city: '', address: '' });
  const [hospitalFormError, setHospitalFormError] = useState('');

  // Simulate live metric updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveLatency(Math.floor(280 + Math.random() * 120));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleAddDoctor = (e) => {
    e.preventDefault();
    setFormError('');
    if (!doctorForm.name.trim() || !doctorForm.license.trim() || !doctorForm.specialty.trim() || !doctorForm.email.trim() || !doctorForm.city.trim()) {
      setFormError('All fields are required.');
      return;
    }
    addDoctor(doctorForm);
    setDoctorForm({ name: '', license: '', specialty: '', email: '', city: '' });
    setShowAddDoctor(false);
  };

  const handleAddHospital = (e) => {
    e.preventDefault();
    setHospitalFormError('');
    if (!hospitalForm.name.trim() || !hospitalForm.city.trim() || !hospitalForm.address.trim()) {
      setHospitalFormError('All fields are required.');
      return;
    }
    addHospital(hospitalForm);
    setHospitalForm({ name: '', city: '', address: '' });
    setShowAddHospital(false);
  };

  const cardClass = darkMode ? 'glass-card rounded-2xl p-5' : 'glass-card-light rounded-2xl p-5 shadow-sm';
  const labelClass = darkMode ? 'text-slate-400' : 'text-gray-500';
  const headingClass = darkMode ? 'text-white' : 'text-gray-900';

  const healthTiles = [
    {
      label: 'API Latency',
      value: `${liveLatency}ms`,
      icon: Zap,
      color: 'from-cyan-500 to-blue-500',
      change: liveLatency < 350 ? 'Good' : 'Elevated',
      changeColor: liveLatency < 350 ? 'text-emerald-400' : 'text-amber-400',
      changeIcon: liveLatency < 350 ? ArrowDownRight : ArrowUpRight,
    },
    {
      label: 'Gemini Token Uptime',
      value: `${metrics.tokenUptime}%`,
      icon: Shield,
      color: 'from-emerald-500 to-teal-500',
      change: 'Excellent',
      changeColor: 'text-emerald-400',
      changeIcon: ArrowUpRight,
    },
    {
      label: 'Requests / Day',
      value: metrics.requestsPerDay.toLocaleString(),
      icon: Globe,
      color: 'from-violet-500 to-purple-500',
      change: '+12% ↑',
      changeColor: 'text-emerald-400',
      changeIcon: ArrowUpRight,
    },
    {
      label: 'Active Users',
      value: metrics.activeUsers,
      icon: Users,
      color: 'from-amber-500 to-orange-500',
      change: '47 online',
      changeColor: 'text-emerald-400',
      changeIcon: ArrowUpRight,
    },
    {
      label: 'Models Deployed',
      value: metrics.modelsDeployed,
      icon: Cpu,
      color: 'from-rose-500 to-pink-500',
      change: 'All Healthy',
      changeColor: 'text-emerald-400',
      changeIcon: CheckCircle,
    },
    {
      label: 'Avg Response Time',
      value: `${metrics.avgResponseTime}s`,
      icon: Clock,
      color: 'from-blue-500 to-indigo-500',
      change: '< 2s target',
      changeColor: 'text-emerald-400',
      changeIcon: CheckCircle,
    },
  ];

  const auditTypeColors = {
    success: { bg: darkMode ? 'bg-emerald-500/10' : 'bg-emerald-50', icon: CheckCircle, color: 'text-emerald-400' },
    warning: { bg: darkMode ? 'bg-amber-500/10' : 'bg-amber-50', icon: AlertTriangle, color: 'text-amber-400' },
    emergency: { bg: darkMode ? 'bg-red-500/10' : 'bg-red-50', icon: AlertCircle, color: 'text-red-400' },
    info: { bg: darkMode ? 'bg-blue-500/10' : 'bg-blue-50', icon: Info, color: 'text-blue-400' },
  };

  const inputClass = `w-full rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all ${
    darkMode
      ? 'bg-slate-800/50 border border-slate-600/50 text-white placeholder-slate-500'
      : 'bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400'
  }`;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className={`text-2xl font-bold ${headingClass}`}>
            <Settings className="inline w-6 h-6 mr-2 text-amber-400" />
            Admin Platform
          </h2>
          <p className={`text-sm mt-1 ${labelClass}`}>
            System operations, AI quality monitoring, and doctor provisioning
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            id="add-doctor-btn"
            onClick={() => setShowAddDoctor(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Add New Doctor
          </button>
          <button
            id="add-hospital-btn"
            onClick={() => setShowAddHospital(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Building2 className="w-4 h-4" />
            Add Hospital
          </button>
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${
            darkMode ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
          }`}>
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            All Systems Operational
          </div>
        </div>
      </div>

      {/* Add Doctor Modal */}
      {showAddDoctor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setShowAddDoctor(false)}>
          <div className={`w-full max-w-md rounded-2xl shadow-2xl border ${
            darkMode ? 'bg-slate-900 border-slate-700/60' : 'bg-white border-gray-200'
          }`} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b ${darkMode ? 'border-slate-700/50' : 'border-gray-200'}`}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                  <UserPlus className="w-4 h-4 text-white" />
                </div>
                <h3 className={`text-lg font-semibold ${headingClass}`}>Provision New Doctor</h3>
              </div>
              <button
                onClick={() => setShowAddDoctor(false)}
                className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleAddDoctor} className="px-6 py-5 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <p className="text-xs text-red-400 font-medium">{formError}</p>
                </div>
              )}

              <div>
                <label className={`block text-xs font-medium mb-1.5 ${labelClass}`}>Full Name</label>
                <div className="relative">
                  <Stethoscope className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${labelClass}`} />
                  <input
                    id="doctor-name"
                    type="text"
                    value={doctorForm.name}
                    onChange={(e) => setDoctorForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Dr. Jane Smith"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1.5 ${labelClass}`}>Medical License Number</label>
                <div className="relative">
                  <Hash className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${labelClass}`} />
                  <input
                    id="doctor-license"
                    type="text"
                    value={doctorForm.license}
                    onChange={(e) => setDoctorForm(f => ({ ...f, license: e.target.value }))}
                    placeholder="MD-2024-XXXX"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1.5 ${labelClass}`}>Specialty</label>
                <div className="relative">
                  <Briefcase className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${labelClass}`} />
                  <select
                    id="doctor-specialty"
                    value={doctorForm.specialty}
                    onChange={(e) => setDoctorForm(f => ({ ...f, specialty: e.target.value }))}
                    className={`${inputClass} pl-10`}
                  >
                    <option value="">Select specialty...</option>
                    <option value="Internal Medicine">Internal Medicine</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Orthopedics">Orthopedics</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="Emergency Medicine">Emergency Medicine</option>
                    <option value="General Surgery">General Surgery</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1.5 ${labelClass}`}>Email Address</label>
                <div className="relative">
                  <Mail className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${labelClass}`} />
                  <input
                    id="doctor-email"
                    type="email"
                    value={doctorForm.email}
                    onChange={(e) => setDoctorForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="doctor@careconnect.ai"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1.5 ${labelClass}`}>City</label>
                <div className="relative">
                  <MapPin className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${labelClass}`} />
                  <input
                    id="doctor-city"
                    type="text"
                    value={doctorForm.city}
                    onChange={(e) => setDoctorForm(f => ({ ...f, city: e.target.value }))}
                    placeholder="e.g. San Francisco"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <button
                id="submit-doctor"
                type="submit"
                className="w-full py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-emerald-500 to-teal-500 text-white hover:shadow-lg hover:shadow-emerald-500/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                Provision Doctor Access
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Add Hospital Modal */}
      {showAddHospital && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in" onClick={() => setShowAddHospital(false)}>
          <div className={`w-full max-w-md rounded-2xl shadow-2xl border ${
            darkMode ? 'bg-slate-900 border-slate-700/60' : 'bg-white border-gray-200'
          }`} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className={`flex items-center justify-between px-6 py-4 border-b ${darkMode ? 'border-slate-700/50' : 'border-gray-200'}`}>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-white" />
                </div>
                <h3 className={`text-lg font-semibold ${headingClass}`}>Provision New Hospital</h3>
              </div>
              <button
                onClick={() => setShowAddHospital(false)}
                className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-100 text-gray-500'}`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleAddHospital} className="px-6 py-5 space-y-4">
              {hospitalFormError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
                  <p className="text-xs text-red-400 font-medium">{hospitalFormError}</p>
                </div>
              )}

              <div>
                <label className={`block text-xs font-medium mb-1.5 ${labelClass}`}>Hospital Name</label>
                <div className="relative">
                  <Building2 className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${labelClass}`} />
                  <input
                    id="hospital-name"
                    type="text"
                    value={hospitalForm.name}
                    onChange={(e) => setHospitalForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="e.g. Chicago Memorial Hospital"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1.5 ${labelClass}`}>City</label>
                <div className="relative">
                  <MapPin className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${labelClass}`} />
                  <input
                    id="hospital-city"
                    type="text"
                    value={hospitalForm.city}
                    onChange={(e) => setHospitalForm(f => ({ ...f, city: e.target.value }))}
                    placeholder="e.g. Chicago"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label className={`block text-xs font-medium mb-1.5 ${labelClass}`}>Address</label>
                <div className="relative">
                  <Globe className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${labelClass}`} />
                  <input
                    id="hospital-address"
                    type="text"
                    value={hospitalForm.address}
                    onChange={(e) => setHospitalForm(f => ({ ...f, address: e.target.value }))}
                    placeholder="e.g. 303 E Superior St, Chicago, IL"
                    className={`${inputClass} pl-10`}
                  />
                </div>
              </div>

              <button
                id="submit-hospital"
                type="submit"
                className="w-full py-3 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:shadow-lg hover:shadow-cyan-500/25 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <Building2 className="w-4 h-4" />
                Provision Hospital Access
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Health Tiles */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {healthTiles.map((tile, i) => {
          const Icon = tile.icon;
          const ChangeIcon = tile.changeIcon;
          return (
            <div
              key={i}
              className={`${cardClass} relative overflow-hidden group hover:scale-[1.03] transition-transform`}
            >
              <div className={`absolute top-0 right-0 w-20 h-20 rounded-bl-[40px] bg-gradient-to-br ${tile.color} opacity-5 group-hover:opacity-10 transition-opacity`} />
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${tile.color} flex items-center justify-center mb-3`}>
                <Icon className="w-4.5 h-4.5 text-white" />
              </div>
              <p className={`text-[10px] font-medium mb-1 uppercase tracking-wider ${labelClass}`}>{tile.label}</p>
              <p className={`text-xl font-bold ${headingClass}`}>{tile.value}</p>
              <div className={`flex items-center gap-1 mt-1 text-[10px] font-medium ${tile.changeColor}`}>
                <ChangeIcon className="w-3 h-3" />
                {tile.change}
              </div>
            </div>
          );
        })}
      </div>

      {/* Side-by-Side Lists: Provisioned Doctors & Hospitals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Provisioned Doctors Table */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${headingClass}`}>
              <Stethoscope className="inline w-5 h-5 mr-2 text-emerald-400" />
              Provisioned Doctors
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-600'}`}>
              {doctors.length} active
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`text-xs font-medium uppercase tracking-wider ${labelClass}`}>
                  <th className="text-left pb-3 pr-4">Name</th>
                  <th className="text-left pb-3 pr-4">License</th>
                  <th className="text-left pb-3 pr-4">Specialty</th>
                  <th className="text-left pb-3 pr-4">City</th>
                  <th className="text-left pb-3">Email</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {doctors.map((doc) => (
                  <tr key={doc.id} className={`${darkMode ? 'hover:bg-slate-800/30' : 'hover:bg-gray-50'} transition-colors`}>
                    <td className={`py-3 pr-4 font-medium ${headingClass}`}>{doc.name}</td>
                    <td className={`py-3 pr-4 font-mono text-xs ${labelClass}`}>{doc.license}</td>
                    <td className="py-3 pr-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${darkMode ? 'bg-primary/10 text-primary-light' : 'bg-indigo-50 text-indigo-600'}`}>
                        {doc.specialty}
                      </span>
                    </td>
                    <td className={`py-3 pr-4 text-xs ${labelClass}`}>{doc.city || 'N/A'}</td>
                    <td className={`py-3 text-xs ${labelClass}`}>{doc.email}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Provisioned Hospitals Table */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${headingClass}`}>
              <Building2 className="inline w-5 h-5 mr-2 text-cyan-400" />
              Provisioned Hospitals
            </h3>
            <span className={`text-xs px-2 py-1 rounded-full ${darkMode ? 'bg-cyan-500/10 text-cyan-400' : 'bg-cyan-50 text-cyan-600'}`}>
              {hospitals.length} active
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`text-xs font-medium uppercase tracking-wider ${labelClass}`}>
                  <th className="text-left pb-3 pr-4">Name</th>
                  <th className="text-left pb-3 pr-4">City</th>
                  <th className="text-left pb-3">Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {hospitals.map((h) => (
                  <tr key={h.id} className={`${darkMode ? 'hover:bg-slate-800/30' : 'hover:bg-gray-50'} transition-colors`}>
                    <td className={`py-3 pr-4 font-medium ${headingClass}`}>{h.name}</td>
                    <td className={`py-3 pr-4 text-xs ${labelClass}`}>{h.city}</td>
                    <td className={`py-3 text-xs ${labelClass}`}>{h.address}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Confidence Distribution Histogram */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${headingClass}`}>
              <BarChart3 className="inline w-5 h-5 mr-2 text-primary-light" />
              AI Confidence Score Distribution
            </h3>
            <GeminiBadge className="scale-75 origin-right hidden sm:flex" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ADMIN_CONFIDENCE_DISTRIBUTION}>
                <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? '#252d4a' : '#e5e7eb'} />
                <XAxis
                  dataKey="range"
                  tick={{ fontSize: 10, fill: darkMode ? '#5a6484' : '#9ca3af' }}
                  angle={-30}
                  textAnchor="end"
                  height={50}
                />
                <YAxis tick={{ fontSize: 10, fill: darkMode ? '#5a6484' : '#9ca3af' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: darkMode ? '#1a2139' : '#fff',
                    border: `1px solid ${darkMode ? '#2a3354' : '#e5e7eb'}`,
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: darkMode ? '#fff' : '#111',
                  }}
                  formatter={(value) => [value, 'Diagnoses']}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {ADMIN_CONFIDENCE_DISTRIBUTION.map((entry, i) => {
                    const hue = (i / ADMIN_CONFIDENCE_DISTRIBUTION.length) * 120; // red → green
                    return <Cell key={i} fill={`hsl(${hue}, 65%, 55%)`} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-between mt-3">
            <span className={`text-xs ${labelClass}`}>Total diagnoses: {ADMIN_CONFIDENCE_DISTRIBUTION.reduce((s, d) => s + d.count, 0)}</span>
            <span className={`text-xs font-medium ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`}>
              Median confidence: 75-85% range
            </span>
          </div>
        </div>

        {/* Audit Trail */}
        <div className={cardClass}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-semibold ${headingClass}`}>
              <Activity className="inline w-5 h-5 mr-2 text-accent-cyan" />
              System Audit Trail
            </h3>
            <span className={`text-xs ${labelClass}`}>Last 24h</span>
          </div>

          <div className="space-y-2 max-h-[420px] overflow-y-auto">
            {ADMIN_AUDIT_LOG.map((entry, i) => {
              const config = auditTypeColors[entry.type] || auditTypeColors.info;
              const AuditIcon = config.icon;
              return (
                <div
                  key={i}
                  className={`flex items-start gap-3 p-3 rounded-xl ${config.bg} animate-fade-in`}
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <AuditIcon className={`w-4 h-4 mt-0.5 shrink-0 ${config.color}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium ${headingClass}`}>{entry.action}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[10px] font-medium ${config.color}`}>{entry.result}</span>
                      <span className={`text-[10px] ${labelClass}`}>·</span>
                      <span className={`text-[10px] ${labelClass}`}>{entry.match}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-mono shrink-0 ${labelClass}`}>
                    <Clock className="inline w-3 h-3 mr-0.5" />
                    {entry.timestamp}
                  </span>
                </div>
              );
            })}

            {/* Live Case Queue Events */}
            {caseQueue.filter(c => c.status === 'pending').slice(0, 2).map((c, i) => (
              <div
                key={`live-${c.id}`}
                className={`flex items-start gap-3 p-3 rounded-xl ${darkMode ? 'bg-primary/5' : 'bg-indigo-50'}`}
              >
                <Info className="w-4 h-4 mt-0.5 shrink-0 text-primary-light" />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${headingClass}`}>
                    New Case: {c.patientName} — {c.aiDiagnosis?.differential?.[0]?.condition || 'Analysis Pending'}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-medium text-primary-light">Pending Review</span>
                    <span className={`text-[10px] ${labelClass}`}>·</span>
                    <span className={`text-[10px] ${labelClass}`}>Urgency: {c.urgency}</span>
                  </div>
                </div>
                <span className={`text-[10px] font-mono shrink-0 ${labelClass}`}>
                  <Clock className="inline w-3 h-3 mr-0.5" />
                  {c.submittedAt}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

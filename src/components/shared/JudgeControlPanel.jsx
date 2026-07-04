import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Wrench, User, Stethoscope, GraduationCap, Settings, RotateCcw, X, ChevronUp } from 'lucide-react';

const ROLES = [
  { key: 'patient', label: 'Patient', icon: User, color: 'hover:bg-cyan-500/20 hover:text-cyan-400' },
  { key: 'doctor', label: 'Doctor', icon: Stethoscope, color: 'hover:bg-emerald-500/20 hover:text-emerald-400' },
  { key: 'student', label: 'Student', icon: GraduationCap, color: 'hover:bg-violet-500/20 hover:text-violet-400' },
  { key: 'admin', label: 'Admin', icon: Settings, color: 'hover:bg-amber-500/20 hover:text-amber-400' },
];

export default function JudgeControlPanel() {
  const { user, switchRole } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-[200]">
      {isOpen && (
        <div className="mb-2 w-56 rounded-2xl bg-slate-900/95 border border-slate-700/60 backdrop-blur-xl shadow-2xl shadow-black/40 animate-slide-up overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-700/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wrench className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-semibold text-slate-200">Judge Control Panel</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-0.5 rounded-lg hover:bg-slate-800 text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Current role indicator */}
          {user && (
            <div className="px-4 py-2 bg-slate-800/50">
              <p className="text-[10px] text-slate-500 font-medium">Active session</p>
              <p className="text-xs text-slate-300 font-medium">{user.name} <span className="text-slate-500">·</span> <span className="capitalize text-primary-light">{user.role}</span></p>
            </div>
          )}

          {/* Role buttons */}
          <div className="p-2 space-y-1">
            {ROLES.map(role => {
              const Icon = role.icon;
              const isActive = user?.role === role.key;
              return (
                <button
                  key={role.key}
                  id={`judge-switch-${role.key}`}
                  onClick={() => { switchRole(role.key); }}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-primary/10 text-primary-light border border-primary/20'
                      : `text-slate-400 ${role.color}`
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{role.label}</span>
                  {isActive && <span className="ml-auto text-[9px] font-bold text-primary-light">ACTIVE</span>}
                </button>
              );
            })}
          </div>

          <div className="px-2 pb-2">
            <div className="border-t border-slate-700/50 pt-2">
              <p className="text-[9px] text-slate-600 text-center">Instant role switch · No re-login needed</p>
            </div>
          </div>
        </div>
      )}

      {/* Toggle button */}
      <button
        id="judge-panel-toggle"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[10px] font-semibold transition-all shadow-lg ${
          isOpen
            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            : 'bg-slate-800/90 text-slate-500 hover:text-amber-400 border border-slate-700/50 hover:border-amber-500/30 backdrop-blur-xl'
        }`}
      >
        <Wrench className="w-3 h-3" />
        <span>Judge</span>
        {isOpen && <ChevronUp className="w-3 h-3" />}
      </button>
    </div>
  );
}

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import {
  Activity, Sun, Moon, Zap, Bell, LogOut, ChevronDown,
  User, Shield
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { darkMode, setDarkMode, notifications } = useApp();
  const [showProfile, setShowProfile] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const roleColors = {
    patient: 'from-cyan-500 to-blue-500',
    doctor: 'from-emerald-500 to-teal-500',
    student: 'from-violet-500 to-purple-500',
    admin: 'from-amber-500 to-orange-500',
  };

  const roleBadgeColors = {
    patient: darkMode ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20' : 'bg-cyan-50 text-cyan-600 border-cyan-200',
    doctor: darkMode ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-200',
    student: darkMode ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' : 'bg-violet-50 text-violet-600 border-violet-200',
    admin: darkMode ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 'bg-amber-50 text-amber-600 border-amber-200',
  };

  return (
    <nav className={`sticky top-0 z-50 border-b ${darkMode
      ? 'bg-slate-900/95 border-slate-700/50 backdrop-blur-xl'
      : 'bg-white/95 border-gray-200/50 backdrop-blur-xl'}`}
    >
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="relative">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent-cyan flex items-center justify-center">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-accent-emerald border-2 border-slate-900 animate-pulse" />
            </div>
            <div className="hidden sm:block">
              <h1 className={`text-base font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                CareConnect AI
              </h1>
              <p className={`text-[10px] font-medium ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                {user?.role === 'admin' ? 'Admin Console' :
                 user?.role === 'doctor' ? 'Physician Portal' :
                 user?.role === 'student' ? 'Learning Portal' :
                 'Patient Portal'}
              </p>
            </div>
          </div>

          {/* Center: Role badge + LIVE indicator */}
          <div className="flex items-center gap-3">
            {/* Role badge */}
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border capitalize ${roleBadgeColors[user?.role] || roleBadgeColors.patient}`}>
              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${roleColors[user?.role] || roleColors.patient}`} />
              {user?.role} Portal
            </div>

            {/* Live Badge */}
            <div className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-semibold tracking-wide ${
              darkMode ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
            }`}>
              <Zap className="w-3 h-3" />
              <span>LIVE</span>
              <span className={darkMode ? 'text-slate-500' : 'text-gray-400'}>|</span>
              <span className={darkMode ? 'text-slate-400' : 'text-gray-500'}>Workflows: Simulated</span>
            </div>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Notifications */}
            <button className={`relative p-2 rounded-lg transition-colors ${
              darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-100 text-gray-500'
            }`}>
              <Bell className="w-4 h-4" />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-accent-rose" />
              )}
            </button>

            {/* Theme Toggle */}
            <button
              id="theme-toggle"
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg transition-all duration-300 ${
                darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-gray-100 text-gray-500'
              }`}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                id="profile-dropdown-toggle"
                onClick={() => setShowProfile(!showProfile)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all ${
                  showProfile
                    ? darkMode ? 'bg-slate-800 border border-slate-600' : 'bg-gray-100 border border-gray-300'
                    : darkMode ? 'hover:bg-slate-800/80 border border-transparent' : 'hover:bg-gray-100 border border-transparent'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${roleColors[user?.role] || roleColors.patient} flex items-center justify-center text-white text-sm font-bold`}>
                  {user?.avatar || user?.name?.charAt(0) || '?'}
                </div>
                <div className="hidden sm:block text-left">
                  <p className={`text-xs font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {user?.name || 'User'}
                  </p>
                  <p className={`text-[10px] ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
                    {user?.email || ''}
                  </p>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showProfile ? 'rotate-180' : ''} ${darkMode ? 'text-slate-400' : 'text-gray-500'}`} />
              </button>

              {/* Dropdown */}
              {showProfile && (
                <div className={`absolute right-0 top-full mt-2 w-64 rounded-2xl overflow-hidden shadow-2xl shadow-black/30 border animate-slide-up ${
                  darkMode ? 'bg-slate-900 border-slate-700/60' : 'bg-white border-gray-200'
                }`}>
                  {/* User info */}
                  <div className={`px-4 py-3 border-b ${darkMode ? 'border-slate-700/50' : 'border-gray-100'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${roleColors[user?.role] || roleColors.patient} flex items-center justify-center text-white text-lg font-bold`}>
                        {user?.avatar || user?.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>{user?.name}</p>
                        <p className={`text-[10px] ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>{user?.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border capitalize ${roleBadgeColors[user?.role] || roleBadgeColors.patient}`}>
                        {user?.role}
                      </span>
                      <span className={`text-[10px] flex items-center gap-1 ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>
                        <Shield className="w-3 h-3" />
                        Session Active
                      </span>
                    </div>
                  </div>

                  {/* Token info */}
                  <div className={`px-4 py-2 border-b ${darkMode ? 'border-slate-700/50 bg-slate-800/30' : 'border-gray-100 bg-gray-50'}`}>
                    <p className={`text-[9px] font-mono truncate ${darkMode ? 'text-slate-600' : 'text-gray-400'}`}>
                      Token: {user?.token?.slice(0, 32)}...
                    </p>
                  </div>

                  {/* Logout */}
                  <div className="p-2">
                    <button
                      id="logout-btn"
                      onClick={() => { logout(); setShowProfile(false); }}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        darkMode
                          ? 'text-red-400 hover:bg-red-500/10'
                          : 'text-red-600 hover:bg-red-50'
                      }`}
                    >
                      <LogOut className="w-4 h-4" />
                      Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

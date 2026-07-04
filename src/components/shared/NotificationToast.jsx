import React from 'react';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle, AlertTriangle, Info, AlertOctagon } from 'lucide-react';

export default function NotificationToast() {
  const { notifications, darkMode } = useApp();

  if (notifications.length === 0) return null;

  const icons = {
    success: CheckCircle,
    warning: AlertTriangle,
    error: AlertOctagon,
    info: Info,
  };

  const colors = {
    success: 'from-emerald-500/20 to-emerald-500/5 border-emerald-500/30 text-emerald-400',
    warning: 'from-amber-500/20 to-amber-500/5 border-amber-500/30 text-amber-400',
    error: 'from-red-500/20 to-red-500/5 border-red-500/30 text-red-400',
    info: 'from-blue-500/20 to-blue-500/5 border-blue-500/30 text-blue-400',
  };

  return (
    <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      {notifications.map(n => {
        const Icon = icons[n.type] || Info;
        return (
          <div
            key={n.id}
            className={`animate-slide-up flex items-center gap-3 px-4 py-3 rounded-xl border bg-gradient-to-r ${colors[n.type] || colors.info}`}
          >
            <Icon className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium flex-1">{n.message}</p>
          </div>
        );
      })}
    </div>
  );
}

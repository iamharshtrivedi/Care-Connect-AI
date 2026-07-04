import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles } from 'lucide-react';

export default function GeminiBadge({ className = "" }) {
  const { darkMode } = useApp();
  
  return (
    <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-medium tracking-wide border ${
      darkMode 
        ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' 
        : 'bg-indigo-50 text-indigo-700 border-indigo-200'
    } ${className}`}>
      <Sparkles className="w-3 h-3 text-indigo-400" />
      <span>Powered by Gemini Vertex AI</span>
      <span className="opacity-50 mx-0.5">|</span>
      <span>RAG-Grounded</span>
    </div>
  );
}

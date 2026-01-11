'use client';

import type { RegisterHeaderProps } from '@/types/register.types';

export default function RegisterHeader({ isDark }: RegisterHeaderProps) {
  return (
    <div className="mb-8">
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded mb-4 ${
        isDark 
          ? 'bg-teal-500/10' 
          : 'bg-teal-50'
      }`}>
        <svg className={`w-6 h-6 ${isDark ? 'text-teal-400' : 'text-teal-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
        </svg>
      </div>
      <h1 className={`text-2xl font-semibold mb-1 ${
        isDark ? 'text-slate-100' : 'text-slate-900'
      }`}>
        Create your account
      </h1>
      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
        Sign up to get started with Task Manager
      </p>
    </div>
  );
}

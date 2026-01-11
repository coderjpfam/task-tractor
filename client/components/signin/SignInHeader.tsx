'use client';

import type { SignInHeaderProps } from '@/types/signin.types';

export default function SignInHeader({ isDark }: SignInHeaderProps) {
  return (
    <div className="mb-8">
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded mb-4 ${
        isDark 
          ? 'bg-teal-500/10' 
          : 'bg-teal-50'
      }`}>
        <svg className={`w-6 h-6 ${isDark ? 'text-teal-400' : 'text-teal-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
        </svg>
      </div>
      <h1 className={`text-2xl font-semibold mb-1 ${
        isDark ? 'text-slate-100' : 'text-slate-900'
      }`}>
        Welcome back
      </h1>
      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
        Sign in to continue to Task Manager
      </p>
    </div>
  );
}

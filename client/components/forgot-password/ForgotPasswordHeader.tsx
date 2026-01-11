'use client';

import type { ForgotPasswordHeaderProps } from '@/types/forgot-password.types';

export default function ForgotPasswordHeader({ isDark }: ForgotPasswordHeaderProps) {
  return (
    <div className="mb-8">
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded mb-4 ${
        isDark 
          ? 'bg-teal-500/10' 
          : 'bg-teal-50'
      }`}>
        <svg className={`w-6 h-6 ${isDark ? 'text-teal-400' : 'text-teal-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      </div>
      <h1 className={`text-2xl font-semibold mb-1 ${
        isDark ? 'text-slate-100' : 'text-slate-900'
      }`}>
        Forgot password?
      </h1>
      <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
        Enter your email address and we'll send you a reset link
      </p>
    </div>
  );
}

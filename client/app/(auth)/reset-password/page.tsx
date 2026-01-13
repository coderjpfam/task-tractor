'use client';

import { Suspense } from 'react';
import { useTheme } from '@/components/signin/useTheme';
import ResetPasswordForm from '@/components/reset-password/ResetPasswordForm';

function ResetPasswordContent() {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-200 ${
      isDark 
        ? 'bg-slate-950' 
        : 'bg-neutral-100'
    }`}>
      <ResetPasswordForm />
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center p-4 bg-neutral-100">
        <div className="w-full max-w-md rounded-lg p-8 bg-white border border-neutral-200">
          <div className="animate-pulse">
            <div className="h-12 w-12 rounded mb-4 bg-neutral-200"></div>
            <div className="h-8 w-48 rounded mb-2 bg-neutral-200"></div>
            <div className="h-4 w-64 rounded bg-neutral-200"></div>
          </div>
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}

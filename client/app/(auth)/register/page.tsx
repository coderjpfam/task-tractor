'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '@/components/signin/useTheme';
import RegisterForm from '@/components/register/RegisterForm';

function RegisterContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || undefined;

  return <RegisterForm token={token} />;
}

export default function RegisterPage() {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-200 ${
      isDark 
        ? 'bg-slate-950' 
        : 'bg-neutral-100'
    }`}>
      <Suspense fallback={
        <div className={`w-full max-w-md rounded-lg p-8 transition-colors duration-200 ${
          isDark 
            ? 'bg-slate-900 border border-slate-800' 
            : 'bg-white border border-neutral-200'
        }`}>
          <div className="animate-pulse">
            <div className={`h-12 w-12 rounded mb-4 ${isDark ? 'bg-slate-700' : 'bg-neutral-200'}`}></div>
            <div className={`h-8 w-48 rounded mb-2 ${isDark ? 'bg-slate-700' : 'bg-neutral-200'}`}></div>
            <div className={`h-4 w-64 rounded ${isDark ? 'bg-slate-700' : 'bg-neutral-200'}`}></div>
          </div>
        </div>
      }>
        <RegisterContent />
      </Suspense>
    </div>
  );
}

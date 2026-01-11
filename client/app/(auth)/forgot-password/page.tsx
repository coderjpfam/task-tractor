'use client';

import { useTheme } from '@/components/signin/useTheme';
import ForgotPasswordForm from '@/components/forgot-password/ForgotPasswordForm';

export default function ForgotPasswordPage() {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-200 ${
      isDark 
        ? 'bg-slate-950' 
        : 'bg-neutral-100'
    }`}>
      <ForgotPasswordForm />
    </div>
  );
}

'use client';

import Link from 'next/link';
import type { ForgotPasswordLinkProps } from '@/types/signin.types';

export default function ForgotPasswordLink({ isDark }: ForgotPasswordLinkProps) {
  return (
    <div className="flex justify-end">
      <Link href="/forgot-password" className={`text-sm font-medium transition-colors duration-200 ${
        isDark 
          ? 'text-teal-400 hover:text-teal-300' 
          : 'text-teal-600 hover:text-teal-700'
      }`}>
        Forgot password?
      </Link>
    </div>
  );
}

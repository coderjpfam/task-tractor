'use client';

import Link from 'next/link';
import type { SignInLinkProps } from '@/types/forgot-password.types';

export default function SignInLink({ isDark }: SignInLinkProps) {
  return (
    <p className={`text-center text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
      Remember your password?{' '}
      <Link href="/signin" className={`font-medium transition-colors duration-200 ${
        isDark 
          ? 'text-teal-400 hover:text-teal-300' 
          : 'text-teal-600 hover:text-teal-700'
      }`}>
        Sign in
      </Link>
    </p>
  );
}

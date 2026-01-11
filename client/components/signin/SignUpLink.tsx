'use client';

import type { SignUpLinkProps } from '@/types/signin.types';

export default function SignUpLink({ isDark }: SignUpLinkProps) {
  return (
    <p className={`text-center text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
      Don't have an account?{' '}
      <a href="#" className={`font-medium transition-colors duration-200 ${
        isDark 
          ? 'text-teal-400 hover:text-teal-300' 
          : 'text-teal-600 hover:text-teal-700'
      }`}>
        Create account
      </a>
    </p>
  );
}

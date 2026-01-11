'use client';

import type { ResetPasswordButtonProps } from '@/types/reset-password.types';

export default function ResetPasswordButton({ onClick, disabled, isDark }: ResetPasswordButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-2.5 px-4 rounded font-medium transition-all duration-200 ${
        disabled
          ? 'opacity-60 cursor-not-allowed' 
          : 'hover:opacity-90'
      } ${
        isDark
          ? 'bg-teal-500 text-white'
          : 'bg-teal-600 text-white'
      } focus:outline-none focus:ring-2 ${
        isDark ? 'focus:ring-teal-400' : 'focus:ring-teal-500'
      } focus:ring-offset-2 ${
        isDark ? 'focus:ring-offset-slate-900' : 'focus:ring-offset-white'
      }`}
    >
      {disabled ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Resetting...
        </span>
      ) : (
        'Reset password'
      )}
    </button>
  );
}

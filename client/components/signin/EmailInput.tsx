'use client';

import type { EmailInputProps } from '@/types/signin.types';

export default function EmailInput({ value, onChange, error, isDark }: EmailInputProps) {
  return (
    <div>
      <label htmlFor="email" className={`block text-sm font-medium mb-1.5 ${
        isDark ? 'text-slate-300' : 'text-slate-700'
      }`}>
        Email
      </label>
      <input
        type="text"
        id="email"
        name="email"
        value={value}
        onChange={onChange}
        className={`w-full px-3 py-2 rounded border transition-colors duration-200 ${
          error 
            ? isDark
              ? 'border-red-500 bg-slate-900 text-slate-100 focus:border-red-400 focus:ring-1 focus:ring-red-400'
              : 'border-red-500 bg-white text-slate-900 focus:border-red-500 focus:ring-1 focus:ring-red-500'
            : isDark 
              ? 'bg-slate-900 border-slate-700 text-slate-100 placeholder-slate-500 focus:border-teal-500 focus:ring-1 focus:ring-teal-500' 
              : 'bg-white border-neutral-300 text-slate-900 placeholder-slate-400 focus:border-teal-600 focus:ring-1 focus:ring-teal-600'
        } focus:outline-none`}
        placeholder="name@company.com"
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

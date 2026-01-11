'use client';

import type { DepartmentInputProps } from '@/types/register.types';

export default function DepartmentInput({ value, onChange, error, isDark }: DepartmentInputProps) {
  return (
    <div>
      <label htmlFor="department" className={`block text-sm font-medium mb-1.5 ${
        isDark ? 'text-slate-300' : 'text-slate-700'
      }`}>
        Department
      </label>
      <input
        type="text"
        id="department"
        name="department"
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
        placeholder="Engineering, Marketing, etc."
      />
      {error && (
        <p className="mt-1.5 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

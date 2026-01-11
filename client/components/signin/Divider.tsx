'use client';

import type { DividerProps } from '@/types/signin.types';

export default function Divider({ isDark }: DividerProps) {
  return (
    <div className="relative my-6">
      <div className="absolute inset-0 flex items-center">
        <div className={`w-full border-t ${isDark ? 'border-slate-800' : 'border-neutral-200'}`}></div>
      </div>
      <div className="relative flex justify-center text-sm">
        <span className={`px-2 ${isDark ? 'bg-slate-900 text-slate-400' : 'bg-white text-slate-500'}`}>
          or
        </span>
      </div>
    </div>
  );
}

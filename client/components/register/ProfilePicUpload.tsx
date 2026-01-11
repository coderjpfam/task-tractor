'use client';

import { useRef, useState } from 'react';
import type { ProfilePicUploadProps } from '@/types/register.types';

export default function ProfilePicUpload({ value, onChange, error, isDark }: ProfilePicUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        onChange(null);
        setPreview(null);
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        onChange(null);
        setPreview(null);
        return;
      }
      
      onChange(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      onChange(null);
      setPreview(null);
    }
  };

  const handleRemove = () => {
    onChange(null);
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className={`block text-sm font-medium mb-1.5 ${
        isDark ? 'text-slate-300' : 'text-slate-700'
      }`}>
        Profile Picture
      </label>
      
      <div className="flex items-center gap-4">
        {/* Preview */}
        <div className={`flex-shrink-0 w-20 h-20 rounded-full overflow-hidden border-2 ${
          error 
            ? 'border-red-500' 
            : isDark 
              ? 'border-slate-700' 
              : 'border-neutral-300'
        } ${isDark ? 'bg-slate-800' : 'bg-neutral-100'}`}>
          {preview || value ? (
            <img 
              src={preview || (value ? URL.createObjectURL(value) : '')} 
              alt="Profile preview" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${
              isDark ? 'text-slate-500' : 'text-neutral-400'
            }`}>
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}
        </div>

        {/* Upload Button */}
        <div className="flex-1">
          <input
            ref={fileInputRef}
            type="file"
            id="profilePic"
            name="profilePic"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`px-4 py-2 text-sm font-medium rounded border transition-colors duration-200 ${
                isDark
                  ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                  : 'border-neutral-300 text-slate-700 hover:bg-neutral-50'
              }`}
            >
              {value ? 'Change' : 'Upload'}
            </button>
            {value && (
              <button
                type="button"
                onClick={handleRemove}
                className={`px-4 py-2 text-sm font-medium rounded border transition-colors duration-200 ${
                  isDark
                    ? 'border-red-500/50 text-red-400 hover:bg-red-500/10'
                    : 'border-red-300 text-red-600 hover:bg-red-50'
                }`}
              >
                Remove
              </button>
            )}
          </div>
          <p className={`mt-1 text-xs ${
            isDark ? 'text-slate-500' : 'text-slate-500'
          }`}>
            JPG, PNG or GIF (max 5MB)
          </p>
        </div>
      </div>
      
      {error && (
        <p className="mt-1.5 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}

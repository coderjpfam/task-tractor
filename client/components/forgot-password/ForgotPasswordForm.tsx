'use client';

import { useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { forgotPasswordThunk } from '@/store/auth/authThunks';
import { useTheme } from '@/components/signin/useTheme';
import { validateEmail } from '@/components/signin/validation';
import EmailInput from '@/components/signin/EmailInput';
import ForgotPasswordHeader from './ForgotPasswordHeader';
import ResetButton from './ResetButton';
import SignInLink from './SignInLink';
import type { ForgotPasswordFormData, ForgotPasswordFormErrors } from '@/types/forgot-password.types';

export default function ForgotPasswordForm() {
  const { isDark } = useTheme();
  const dispatch = useAppDispatch();
  const { forgotPassword } = useAppSelector((state) => state.auth);
  
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: ''
  });
  const [errors, setErrors] = useState<ForgotPasswordFormErrors>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const prevLoadingRef = useRef<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name as keyof ForgotPasswordFormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ForgotPasswordFormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle forgot password errors
  useEffect(() => {
    if (forgotPassword.error) {
      toast.error(forgotPassword.error);
    }
  }, [forgotPassword.error]);

  // Handle successful forgot password request
  useEffect(() => {
    // Track when loading transitions from true to false (request completed)
    if (prevLoadingRef.current && !forgotPassword.loading && !forgotPassword.error) {
      toast.success('If the email exists, a password reset link has been sent');
      setIsSuccess(true);
    }
    prevLoadingRef.current = forgotPassword.loading;
  }, [forgotPassword.loading, forgotPassword.error]);

  const handleSubmit = async () => {
    if (validateForm()) {
      dispatch(forgotPasswordThunk({
        email: formData.email
      }));
    }
  };

  if (isSuccess) {
    return (
      <div className={`w-full max-w-md rounded-lg p-8 transition-colors duration-200 ${
        isDark 
          ? 'bg-slate-900 border border-slate-800' 
          : 'bg-white border border-neutral-200'
      }`}>
        <div className="mb-8 text-center">
          <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
            isDark 
              ? 'bg-teal-500/10' 
              : 'bg-teal-50'
          }`}>
            <svg className={`w-8 h-8 ${isDark ? 'text-teal-400' : 'text-teal-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className={`text-2xl font-semibold mb-2 ${
            isDark ? 'text-slate-100' : 'text-slate-900'
          }`}>
            Check your email
          </h1>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            We've sent a password reset link to <strong>{formData.email}</strong>
          </p>
        </div>
        <SignInLink isDark={isDark} />
      </div>
    );
  }

  return (
    <div className={`w-full max-w-md rounded-lg p-8 transition-colors duration-200 ${
      isDark 
        ? 'bg-slate-900 border border-slate-800' 
        : 'bg-white border border-neutral-200'
    }`}>
      <ForgotPasswordHeader isDark={isDark} />

      <div className="space-y-5">
        <EmailInput
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          isDark={isDark}
        />

        <ResetButton
          onClick={handleSubmit}
          disabled={forgotPassword.loading}
          isDark={isDark}
        />
      </div>

      <div className="mt-6">
        <SignInLink isDark={isDark} />
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { resetPasswordThunk } from '@/store/auth/authThunks';
import { useTheme } from '@/components/signin/useTheme';
import PasswordInput from '@/components/signin/PasswordInput';
import ResetPasswordHeader from './ResetPasswordHeader';
import ConfirmPasswordInput from './ConfirmPasswordInput';
import ResetPasswordButton from './ResetPasswordButton';
import SignInLink from '@/components/forgot-password/SignInLink';
import type { ResetPasswordFormData, ResetPasswordFormErrors } from '@/types/reset-password.types';

export default function ResetPasswordForm() {
  const { isDark } = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const { resetPassword } = useAppSelector((state) => state.auth);
  
  const [formData, setFormData] = useState<ResetPasswordFormData>({
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<ResetPasswordFormErrors>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const prevLoadingRef = useRef<boolean>(false);
  
  // Get token and email from URL query params
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name as keyof ResetPasswordFormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ResetPasswordFormErrors = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validate token and email on mount
  useEffect(() => {
    if (!token || !email) {
      toast.error('Invalid reset link. Please request a new password reset.');
      router.push('/forgot-password');
    }
  }, [token, email, router]);

  // Handle reset password errors
  useEffect(() => {
    if (resetPassword.error) {
      toast.error(resetPassword.error);
    }
  }, [resetPassword.error]);

  // Handle successful password reset
  useEffect(() => {
    // Track when loading transitions from true to false (request completed)
    if (prevLoadingRef.current && !resetPassword.loading && !resetPassword.error) {
      toast.success('Password reset successfully!');
      setIsSuccess(true);
    }
    prevLoadingRef.current = resetPassword.loading;
  }, [resetPassword.loading, resetPassword.error]);

  const handleSubmit = async () => {
    if (!token || !email) {
      toast.error('Invalid reset link. Please request a new password reset.');
      return;
    }

    if (validateForm()) {
      dispatch(resetPasswordThunk({
        token,
        email,
        password: formData.password,
        password_confirmation: formData.confirmPassword
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
            Password reset successful
          </h1>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Your password has been reset successfully. You can now sign in with your new password.
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
      <ResetPasswordHeader isDark={isDark} />

      <div className="space-y-5">
        <PasswordInput
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          isDark={isDark}
        />

        <ConfirmPasswordInput
          value={formData.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          isDark={isDark}
        />

        <ResetPasswordButton
          onClick={handleSubmit}
          disabled={resetPassword.loading || !token || !email}
          isDark={isDark}
        />
      </div>

      <div className="mt-6">
        <SignInLink isDark={isDark} />
      </div>
    </div>
  );
}

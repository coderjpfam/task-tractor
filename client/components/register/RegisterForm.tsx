'use client';

import { useState } from 'react';
import { useTheme } from '@/components/signin/useTheme';
import { validateEmail } from '@/components/signin/validation';
import EmailInput from '@/components/signin/EmailInput';
import PasswordInput from '@/components/signin/PasswordInput';
import ConfirmPasswordInput from '@/components/reset-password/ConfirmPasswordInput';
import RegisterHeader from './RegisterHeader';
import ProfilePicUpload from './ProfilePicUpload';
import NameInput from './NameInput';
import DepartmentInput from './DepartmentInput';
import RegisterButton from './RegisterButton';
import SignInLink from '@/components/forgot-password/SignInLink';
import type { RegisterFormData, RegisterFormErrors } from '@/types/register.types';

interface RegisterFormProps {
  token?: string;
}

export default function RegisterForm({ token }: RegisterFormProps) {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState<RegisterFormData>({
    profilePic: null,
    name: '',
    email: '',
    department: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name as keyof RegisterFormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (file: File | null) => {
    setFormData(prev => ({
      ...prev,
      profilePic: file
    }));
    
    if (errors.profilePic) {
      setErrors(prev => ({ ...prev, profilePic: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: RegisterFormErrors = {};

    if (!formData.profilePic) {
      newErrors.profilePic = 'Profile picture is required';
    }

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
    }

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

  const handleSubmit = async () => {
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        console.log('Registration successful:', {
          token,
          ...formData,
          profilePic: formData.profilePic?.name
        });
        setIsSubmitting(false);
        setIsSuccess(true);
      }, 1500);
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
            Account created successfully
          </h1>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Your account has been created. You can now sign in.
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
      <RegisterHeader isDark={isDark} />

      <div className="space-y-5">
        <ProfilePicUpload
          value={formData.profilePic}
          onChange={handleFileChange}
          error={errors.profilePic}
          isDark={isDark}
        />

        <NameInput
          value={formData.name}
          onChange={handleInputChange}
          error={errors.name}
          isDark={isDark}
        />

        <EmailInput
          value={formData.email}
          onChange={handleInputChange}
          error={errors.email}
          isDark={isDark}
        />

        <DepartmentInput
          value={formData.department}
          onChange={handleInputChange}
          error={errors.department}
          isDark={isDark}
        />

        <PasswordInput
          value={formData.password}
          onChange={handleInputChange}
          error={errors.password}
          isDark={isDark}
        />

        <ConfirmPasswordInput
          value={formData.confirmPassword}
          onChange={handleInputChange}
          error={errors.confirmPassword}
          isDark={isDark}
        />

        <RegisterButton
          onClick={handleSubmit}
          disabled={isSubmitting}
          isDark={isDark}
        />
      </div>

      <div className="mt-6">
        <SignInLink isDark={isDark} />
      </div>
    </div>
  );
}

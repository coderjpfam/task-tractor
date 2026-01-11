'use client';

import { useState } from 'react';
import { useTheme } from './useTheme';
import { validateForm } from './validation';
import type { SignInFormData, SignInFormErrors } from '@/types/signin.types';
import SignInHeader from './SignInHeader';
import EmailInput from './EmailInput';
import PasswordInput from './PasswordInput';
import ForgotPasswordLink from './ForgotPasswordLink';
import SignInButton from './SignInButton';
import Divider from './Divider';
import SignUpLink from './SignUpLink';

export default function SignInForm() {
  const { isDark } = useTheme();
  const [formData, setFormData] = useState<SignInFormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<SignInFormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name as keyof SignInFormErrors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async () => {
    const newErrors = validateForm(formData);
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      setIsSubmitting(true);
      
      setTimeout(() => {
        console.log('Sign in successful:', formData);
        setIsSubmitting(false);
        alert('Sign in successful! (Demo only)');
      }, 1500);
    }
  };

  return (
    <div className={`w-full max-w-md rounded-lg p-8 transition-colors duration-200 ${
      isDark 
        ? 'bg-slate-900 border border-slate-800' 
        : 'bg-white border border-neutral-200'
    }`}>
      <SignInHeader isDark={isDark} />

      <div className="space-y-5">
        <EmailInput
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          isDark={isDark}
        />

        <PasswordInput
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          isDark={isDark}
        />

        <ForgotPasswordLink isDark={isDark} />

        <SignInButton
          onClick={handleSubmit}
          disabled={isSubmitting}
          isDark={isDark}
        />
      </div>
    </div>
  );
}

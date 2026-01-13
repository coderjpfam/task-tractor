'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loginThunk } from '@/store/auth/authThunks';
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
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { login, user, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [formData, setFormData] = useState<SignInFormData>({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState<SignInFormErrors>({});

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      router.push('/');
    }
  }, [isAuthenticated, user, router]);

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

  // Handle login errors
  useEffect(() => {
    if (login.error) {
      toast.error(login.error);
    }
  }, [login.error]);

  // Handle successful login
  useEffect(() => {
    if (login.loading === false && !login.error && user && isAuthenticated) {
      toast.success('Sign in successful!');
      router.push('/'); // Redirect to home page or dashboard
    }
  }, [login.loading, login.error, user, isAuthenticated, router]);

  const handleSubmit = async () => {
    const newErrors = validateForm(formData);
    setErrors(newErrors);
    
    if (Object.keys(newErrors).length === 0) {
      dispatch(loginThunk({
        email: formData.email,
        password: formData.password
      }));
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
          disabled={login.loading}
          isDark={isDark}
        />
      </div>
    </div>
  );
}

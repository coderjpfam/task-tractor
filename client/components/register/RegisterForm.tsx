'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { verifyRegisterTokenThunk, registerInvitedUserThunk } from '@/store/auth/authThunks';
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
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { verifyRegisterToken, registerInvitedUser, user, isAuthenticated } = useAppSelector((state) => state.auth);
  
  const [formData, setFormData] = useState<RegisterFormData>({
    profilePic: null,
    name: '',
    email: '',
    department: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [tokenValidated, setTokenValidated] = useState(false);
  const prevLoadingRef = useRef<boolean>(false);

  // Redirect if already authenticated (unless registering with token)
  useEffect(() => {
    if (isAuthenticated && user && !token) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, user, token, router]);

  // Validate token and prefill form when token is available
  useEffect(() => {
    if (token && !tokenValidated) {
      const validateToken = async () => {
        try {
          const result = await dispatch(verifyRegisterTokenThunk({ token })).unwrap();
          
          if (result.success && result.data) {
            // Prefill form with data from token validation
            // Use departmentName for display, fallback to departmentId if name not available
            setFormData(prev => ({
              ...prev,
              name: result.data.fullName || '',
              email: result.data.email || '',
              department: result.data.department?.name || ''
            }));
            setTokenValidated(true);
          }
        } catch (error) {
          // Token validation failed - error is already in Redux state
          console.error('Token validation failed:', error);
        }
      };

      validateToken();
    } else if (!token) {
      // No token provided, mark as validated to show form
      setTokenValidated(true);
    }
  }, [token, tokenValidated, dispatch]);

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

  // Handle register errors
  useEffect(() => {
    if (registerInvitedUser.error) {
      toast.error(registerInvitedUser.error);
    }
  }, [registerInvitedUser.error]);

  // Handle successful registration
  useEffect(() => {
    // Track when loading transitions from true to false (request completed)
    if (prevLoadingRef.current && !registerInvitedUser.loading && !registerInvitedUser.error) {
      toast.success('Registration completed successfully!');
      setIsSuccess(true);
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    }
    prevLoadingRef.current = registerInvitedUser.loading;
  }, [registerInvitedUser.loading, registerInvitedUser.error, router]);

  const handleSubmit = async () => {
    if (!token) {
      toast.error('Registration token is required');
      return;
    }

    if (validateForm()) {
      dispatch(registerInvitedUserThunk({
        token,
        fullName: formData.name.trim(),
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        profilePic: formData.profilePic || undefined
      }));
    }
  };

  // Show loading state while validating token
  if (token && !tokenValidated && verifyRegisterToken.loading) {
    return (
      <div className={`w-full max-w-md rounded-lg p-8 transition-colors duration-200 ${
        isDark 
          ? 'bg-slate-900 border border-slate-800' 
          : 'bg-white border border-neutral-200'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500 mx-auto mb-4"></div>
          <p className={`text-sm ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
            Validating invitation token...
          </p>
        </div>
      </div>
    );
  }

  // Show error if token validation failed
  if (token && !tokenValidated && verifyRegisterToken.error) {
    return (
      <div className={`w-full max-w-md rounded-lg p-8 transition-colors duration-200 ${
        isDark 
          ? 'bg-slate-900 border border-slate-800' 
          : 'bg-white border border-neutral-200'
      }`}>
        <RegisterHeader isDark={isDark} />
        <div className={`mt-4 p-4 rounded border ${
          isDark 
            ? 'bg-red-500/10 border-red-500/50' 
            : 'bg-red-50 border-red-200'
        }`}>
          <p className={`text-sm font-medium ${
            isDark ? 'text-red-400' : 'text-red-600'
          }`}>
            {verifyRegisterToken.error}
          </p>
          <p className={`text-xs mt-2 ${
            isDark ? 'text-slate-400' : 'text-slate-600'
          }`}>
            The invitation link may be invalid or expired. Please contact your administrator for a new invitation.
          </p>
        </div>
        <div className="mt-6">
          <SignInLink isDark={isDark} />
        </div>
      </div>
    );
  }

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

  // Don't show form until token is validated (if token exists)
  if (token && !tokenValidated) {
    return null;
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
          disabled={!!token}
        />

        <DepartmentInput
          value={formData.department}
          onChange={handleInputChange}
          error={errors.department}
          isDark={isDark}
          disabled={!!token}
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
          disabled={registerInvitedUser.loading || !token}
          isDark={isDark}
        />
      </div>

      <div className="mt-6">
        <SignInLink isDark={isDark} />
      </div>
    </div>
  );
}

/**
 * Register related types
 */

import type { ThemeProps, ButtonProps, InputFieldProps } from './common.types';

/**
 * Register form data
 */
export interface RegisterFormData {
  profilePic: File | null;
  name: string;
  email: string;
  department: string;
  password: string;
  confirmPassword: string;
}

/**
 * Register form validation errors
 */
export interface RegisterFormErrors {
  profilePic?: string;
  name?: string;
  email?: string;
  department?: string;
  password?: string;
  confirmPassword?: string;
}

/**
 * Register header component props
 */
export interface RegisterHeaderProps extends ThemeProps {}

/**
 * Register button component props
 */
export interface RegisterButtonProps extends ButtonProps {}

/**
 * Name input component props
 */
export interface NameInputProps extends InputFieldProps {
  disabled?: boolean;
}

/**
 * Department input component props
 */
export interface DepartmentInputProps extends InputFieldProps {
  disabled?: boolean;
}

/**
 * Profile picture upload component props
 */
export interface ProfilePicUploadProps extends ThemeProps {
  value: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}

/**
 * Sign-in related types
 */

import type { ThemeProps, InputFieldProps, ButtonProps } from './common.types';

/**
 * Sign-in form data
 */
export interface SignInFormData {
  email: string;
  password: string;
}

/**
 * Sign-in form validation errors
 */
export interface SignInFormErrors {
  email?: string;
  password?: string;
}

/**
 * Email input component props
 */
export interface EmailInputProps extends InputFieldProps {
  disabled?: boolean;
}

/**
 * Password input component props
 */
export interface PasswordInputProps extends InputFieldProps {}

/**
 * Sign-in button component props
 */
export interface SignInButtonProps extends ButtonProps {}

/**
 * Sign-in header component props
 */
export interface SignInHeaderProps extends ThemeProps {}

/**
 * Forgot password link component props
 */
export interface ForgotPasswordLinkProps extends ThemeProps {}

/**
 * Sign-up link component props
 */
export interface SignUpLinkProps extends ThemeProps {}

/**
 * Divider component props
 */
export interface DividerProps extends ThemeProps {}

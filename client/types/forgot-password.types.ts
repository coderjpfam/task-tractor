/**
 * Forgot password related types
 */

import type { ThemeProps, InputFieldProps, ButtonProps } from './common.types';

/**
 * Forgot password form data
 */
export interface ForgotPasswordFormData {
  email: string;
}

/**
 * Forgot password form validation errors
 */
export interface ForgotPasswordFormErrors {
  email?: string;
}

/**
 * Forgot password header component props
 */
export interface ForgotPasswordHeaderProps extends ThemeProps {}

/**
 * Reset button component props
 */
export interface ResetButtonProps extends ButtonProps {}

/**
 * Sign-in link component props (used in forgot password page)
 */
export interface SignInLinkProps extends ThemeProps {}

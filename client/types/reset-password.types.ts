/**
 * Reset password related types
 */

import type { ThemeProps, ButtonProps, InputFieldProps } from './common.types';

/**
 * Reset password form data
 */
export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

/**
 * Reset password form validation errors
 */
export interface ResetPasswordFormErrors {
  password?: string;
  confirmPassword?: string;
}

/**
 * Reset password header component props
 */
export interface ResetPasswordHeaderProps extends ThemeProps {}

/**
 * Reset password button component props
 */
export interface ResetPasswordButtonProps extends ButtonProps {}

/**
 * Confirm password input component props
 */
export interface ConfirmPasswordInputProps extends InputFieldProps {}

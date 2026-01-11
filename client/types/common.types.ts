/**
 * Common types used across multiple features
 */

/**
 * Theme props used by components that need theme information
 */
export interface ThemeProps {
  isDark: boolean;
}

/**
 * Common input field props
 */
export interface InputFieldProps extends ThemeProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

/**
 * Common button props
 */
export interface ButtonProps extends ThemeProps {
  onClick: () => void;
  disabled: boolean;
}

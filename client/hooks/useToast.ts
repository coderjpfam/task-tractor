import { toast, ToastOptions, Id } from 'react-toastify';

type ToastType = 'success' | 'error' | 'info' | 'warning' | 'default';

interface ToastConfig extends ToastOptions {
  type?: ToastType;
}

/**
 * Custom hook for toast notifications
 * Provides a simple interface for displaying toast messages across the app
 */
export const useToast = () => {
  /**
   * Show a toast message
   * @param message - The message to display
   * @param config - Optional toast configuration
   * @returns Toast ID
   */
  const showToast = (message: string, config?: ToastConfig): Id => {
    const type = config?.type || 'default';
    const toastOptions: ToastOptions = {
      position: config?.position || 'top-right',
      autoClose: config?.autoClose ?? 3000,
      hideProgressBar: config?.hideProgressBar ?? true,
      closeOnClick: config?.closeOnClick ?? true,
      pauseOnHover: config?.pauseOnHover ?? true,
      draggable: config?.draggable ?? true,
      ...config,
    };

    // Remove type from toastOptions as it's not a valid ToastOptions property
    delete (toastOptions as any).type;

    switch (type) {
      case 'success':
        return toast.success(message, toastOptions);
      case 'error':
        return toast.error(message, toastOptions);
      case 'info':
        return toast.info(message, toastOptions);
      case 'warning':
        return toast.warning(message, toastOptions);
      default:
        return toast(message, toastOptions);
    }
  };

  /**
   * Show a success toast
   * @param message - Success message
   * @param config - Optional toast configuration
   */
  const success = (message: string, config?: ToastOptions) => {
    return showToast(message, { ...config, type: 'success' });
  };

  /**
   * Show an error toast
   * @param message - Error message
   * @param config - Optional toast configuration
   */
  const error = (message: string, config?: ToastOptions) => {
    return showToast(message, { ...config, type: 'error' });
  };

  /**
   * Show an info toast
   * @param message - Info message
   * @param config - Optional toast configuration
   */
  const info = (message: string, config?: ToastOptions) => {
    return showToast(message, { ...config, type: 'info' });
  };

  /**
   * Show a warning toast
   * @param message - Warning message
   * @param config - Optional toast configuration
   */
  const warning = (message: string, config?: ToastOptions) => {
    return showToast(message, { ...config, type: 'warning' });
  };

  /**
   * Dismiss a toast by ID
   * @param toastId - Toast ID to dismiss
   */
  const dismiss = (toastId?: Id) => {
    toast.dismiss(toastId);
  };

  /**
   * Dismiss all toasts
   */
  const dismissAll = () => {
    toast.dismiss();
  };

  return {
    showToast,
    success,
    error,
    info,
    warning,
    dismiss,
    dismissAll,
  };
};

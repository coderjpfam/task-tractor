'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { verifyTokenThunk } from '@/store/auth/authThunks';

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * Protected Route Component
 * Verifies authentication before rendering children
 * Redirects to signin if not authenticated
 */
export default function ProtectedRoute({ 
  children, 
  redirectTo = '/signin' 
}: ProtectedRouteProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { verifyToken, user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [hasChecked, setHasChecked] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Check if access token exists in localStorage
      if (typeof window !== 'undefined') {
        const accessToken = localStorage.getItem('accessToken');
        
        if (!accessToken) {
          // No token, redirect to signin
          router.push(redirectTo);
          return;
        }

        // Verify token with server
        try {
          await dispatch(verifyTokenThunk());
          setHasChecked(true);
        } catch (error) {
          // Error verifying token, redirect to signin
          router.push(redirectTo);
        }
      }
    };

    if (!hasChecked) {
      checkAuth();
    }
  }, [dispatch, router, redirectTo, hasChecked]);

  // Handle verification result - redirect if invalid
  useEffect(() => {
    if (hasChecked && !verifyToken.loading) {
      if (verifyToken.error || !isAuthenticated || !user) {
        // Token verification failed or user not authenticated, redirect
        router.push(redirectTo);
      }
    }
  }, [hasChecked, verifyToken.loading, verifyToken.error, isAuthenticated, user, router, redirectTo]);

  // Show loading state while checking
  if (!hasChecked || verifyToken.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-zinc-600 dark:text-zinc-400">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Show children if authenticated
  if (isAuthenticated && user) {
    return <>{children}</>;
  }

  // Default: redirect will happen, but show nothing in the meantime
  return null;
}

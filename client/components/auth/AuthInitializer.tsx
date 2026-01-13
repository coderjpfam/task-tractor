'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { verifyTokenThunk } from '@/store/auth/authThunks';

/**
 * Auth Initializer Component
 * Verifies token on app load if tokens exist in localStorage
 * Should be placed in the root layout
 */
export default function AuthInitializer() {
  const dispatch = useAppDispatch();
  const { accessToken, isAuthenticated } = useAppSelector((state) => state.auth);
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      if (hasInitialized) return;

      if (typeof window !== 'undefined') {
        const storedAccessToken = localStorage.getItem('accessToken');
        const storedRefreshToken = localStorage.getItem('refreshToken');

        // Only verify if we have tokens but user is not authenticated
        // Also check if accessToken in state doesn't match localStorage (state might be stale)
        if (storedAccessToken && storedRefreshToken) {
          // If we have tokens but not authenticated, or state token doesn't match, verify
          if (!isAuthenticated || accessToken !== storedAccessToken) {
            try {
              await dispatch(verifyTokenThunk());
            } catch (error) {
              // Token verification failed - tokens will be cleared by the thunk
              console.log('Token verification failed on initialization');
            }
          }
        }

        setHasInitialized(true);
      }
    };

    initializeAuth();
  }, [dispatch, isAuthenticated, accessToken, hasInitialized]);

  // This component doesn't render anything
  return null;
}

'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { restoreSession } from '@/store/slices/authSlice';

export default function SessionLoader() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetch('https://digital-heaven-store.onrender.com/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.user) {
            dispatch(restoreSession({ user: data.user, token }));
          }
        })
        .catch(() => {
          localStorage.removeItem('token');
        });
    }
  }, [dispatch]);

  return null;
}

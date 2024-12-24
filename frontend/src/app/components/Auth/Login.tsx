'use client';

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import { authStart, authSuccess, authFailure } from '@/store/slices/authSlice';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(authStart());

    try {
      const response = await fetch('http://localhost:4000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });


      if (!response.ok) {
        throw new Error('Failed to login');
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      dispatch(authSuccess({ user: data.user, token: data.token }));

      if (data.user.role === 'user') {
        router.push('/cart');
      } else {
        router.push('/dashboard');
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        dispatch(authFailure(err.message));  
      } else {
        dispatch(authFailure("Неизвестная ошибка"));
      }
    }
  };

  return (
    <form onSubmit={handleLogin} className="auth-form">
      <h2>Войдите в систему</h2>
      <div>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder='Введите e-mail'
        />
      </div>
      <div>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder='Введите пароль'
        />
      </div>
      <button type="submit">Войти</button>
    </form>
  );
}

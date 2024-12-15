'use client';

import { useState } from 'react';
import Login from './Login';
import SignUp from './SignUp';

export default function AuthTabs() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  return (
    <div className='auth-tabs'>
      <div className='auth-tabs-header'>
        <button onClick={() => setActiveTab('login')} className={activeTab === 'login' ? 'active' : ''}>
          Войти по логину
        </button>
        <button onClick={() => setActiveTab('signup')} className={activeTab === 'signup' ? 'active' : ''}>
          Зарегистрироваться
        </button>
      </div>
      <div className="auth-tabs-content">{activeTab === 'login' ? <Login /> : <SignUp />}</div>
    </div>
  );
}

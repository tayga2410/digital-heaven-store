'use client';

import { useState } from 'react';
import Login from './Login';
import SignUp from './SignUp';

export default function AuthTabs() {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');

  return (
    <div className='auth-tabs container'>
      <div className='auth-tabs__wrapper'>
      <div className='auth-tabs__header'>
        <button onClick={() => setActiveTab('login')} className={activeTab === 'login' ? 'active' : ''}>
          Войти по логину
        </button>
        <button onClick={() => setActiveTab('signup')} className={activeTab === 'signup' ? 'active' : ''}>
          Зарегистрироваться
        </button>
      </div>
      <div className="auth-tabs__content">{activeTab === 'login' ? <Login /> : <SignUp />}</div>
      </div>
    </div>
  );
}

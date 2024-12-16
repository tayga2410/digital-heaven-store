'use client';

import { useState, useEffect } from 'react';
import ManageUsers from '@/app/components/Dashboard/ManageUsers';
import ManageBanners from '@/app/components/Dashboard/ManageBanners';
import ManageProducts from '@/app/components/Dashboard/ManageProducts';
import ManageCategories from '../components/Dashboard/ManageCategories';

export default function Dashboard() {
    useEffect(() => {
        async function fetchData() {
          const res = await fetch('http://localhost:4000/api/admin/users', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
    
          if (res.ok) {
            const data = await res.json();
            console.log(data);
          } else {
            console.error('Failed to fetch data');
          }
        }
    
        fetchData();
      }, []);


      const [activeTab, setActiveTab] = useState<'users' | 'banners' | 'categories' | 'products'>('users');

  return (
    <div className="dashboard">
      <div className="dashboard__tabs">
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          Редактирование пользователей
        </button>
        <button
          className={activeTab === 'banners' ? 'active' : ''}
          onClick={() => setActiveTab('banners')}
        >
          Редактирование баннеров
        </button>
        <button
          className={activeTab === 'categories' ? 'active' : ''}
          onClick={() => setActiveTab('categories')}
        >
          Редактирование категорий
        </button>
        <button
          className={activeTab === 'products' ? 'active' : ''}
          onClick={() => setActiveTab('products')}
        >
          Редактирование продуктов
        </button>
      </div>

      <div className="dashboard__content">
        {activeTab === 'users' && <ManageUsers />}
        {activeTab === 'banners' && <ManageBanners />}
        {activeTab === 'categories' && <ManageCategories />}
        {activeTab === 'products' && <ManageProducts />}
      </div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { fetchUsers, updateUserRole, deleteUser } from '@/store/slices/userSlice';
import { useAppDispatch, useAppSelector } from '@/store/hooks';

export default function ManageUsers() {
  const dispatch = useAppDispatch(); 
  const { users, loading, error } = useAppSelector((state) => state.users); 

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleRoleChange = (id: string, role: string) => {
    dispatch(updateUserRole({ id, role }))
      .unwrap() 
      .then(() => alert('Role updated successfully'))
      .catch((err) => alert(err.message));
  };

  const handleDeleteUser = (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      dispatch(deleteUser(id))
        .unwrap()
        .then(() => alert('User deleted successfully'))
        .catch((err) => alert(err.message));
    }
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="manage-users">
      <h2>Редактирование пользователей</h2>
      <table>
        <thead>
          <tr>
            <th>Email</th>
            <th>Роль</th>
            <th>Время создания</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => handleRoleChange(user.id, e.target.value)}
                >
                  <option value="user">Пользователь</option>
                  <option value="editor">Менеджер</option>
                </select>
              </td>
              <td>{new Date(user.createdAt).toLocaleString()}</td>
              <td>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  style={{ color: 'red' }}
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

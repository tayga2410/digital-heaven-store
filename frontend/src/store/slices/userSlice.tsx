import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Интерфейс параметров для обновления роли пользователя
interface UpdateUserRoleParams {
  id: string;
  role: string;
}

// Интерфейс ответа от API при обновлении роли пользователя
interface UpdateUserRoleResponse {
  user: {
    id: string;
    email: string;
    role: string;
    createdAt: string;
  };
  message: string;
  success: boolean;
}

// Интерфейс для пользователя
interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

// Состояние users
interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
};

export const fetchUsers = createAsyncThunk<User[]>('users/fetchUsers', async () => {
  const response = await fetch('http://localhost:4000/api/admin/users', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return await response.json();
});

export const updateUserRole = createAsyncThunk<
  UpdateUserRoleResponse,
  UpdateUserRoleParams,
  { rejectValue: string }
>(
  'users/updateUserRole',
  async ({ id, role }: UpdateUserRoleParams) => {
    const response = await fetch(`http://localhost:4000/api/admin/users/${id}/role`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({ role }),
    });

    if (!response.ok) {
      throw new Error('Failed to update user role');
    }

    return await response.json();
  }
);

export const deleteUser = createAsyncThunk<string, string, { rejectValue: string }>(
  'users/deleteUser',
  async (id) => {
    const response = await fetch(`https://digital-heaven-store.onrender.com/api/admin/users/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }

    return id;
  }
);

// Срез (slice) для управления состоянием пользователей
const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        const updatedUser = action.payload.user;
        const index = state.users.findIndex((user) => user.id === updatedUser.id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
      });
  },
});

export default userSlice.reducer;

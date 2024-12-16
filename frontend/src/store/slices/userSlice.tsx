import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async (_, thunkAPI) => {
  const response = await fetch('http://localhost:4000/api/admin/users', {
    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch users');
  }

  return await response.json();
});

export const updateUserRole = createAsyncThunk(
  'users/updateUserRole',
  async ({ id, role }: { id: string; role: string }, thunkAPI) => {
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

export const deleteUser = createAsyncThunk('users/deleteUser', async (id: string, thunkAPI) => {
  const response = await fetch(`http://localhost:4000/api/admin/users/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete user');
  }

  return id;
});

const userSlice = createSlice({
  name: 'users',
  initialState: {
    users: [] as Array<{ id: string; email: string; role: string; createdAt: string }>,
    loading: false,
    error: null as string | null,
  },
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

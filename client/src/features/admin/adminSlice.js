import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/axiosInstance.js'

const initialState = {
  users: [],
  allItems: [],
  isLoading: false,
  error: null,
}

// GET /admin/users
export const fetchAllUsers = createAsyncThunk('admin/fetchUsers', async (_, thunkAPI) => {
  try {
    const { data } = await api.get('/admin/users')
    return data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to load users')
  }
})

// GET /admin/items
export const fetchAllItems = createAsyncThunk('admin/fetchItems', async (_, thunkAPI) => {
  try {
    const { data } = await api.get('/admin/items')
    return data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to load items')
  }
})

// PUT /admin/users/:id/role
export const setUserRole = createAsyncThunk(
  'admin/setUserRole',
  async ({ id, role }, thunkAPI) => {
    try {
      const { data } = await api.put(`/admin/users/${id}/role`, { role })
      return data
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to update role')
    }
  },
)

// DELETE /admin/users/:id
export const deleteUserById = createAsyncThunk('admin/deleteUser', async (id, thunkAPI) => {
  try {
    await api.delete(`/admin/users/${id}`)
    return id
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to delete user')
  }
})

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    clearAdminError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false
        state.users = action.payload
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      .addCase(fetchAllItems.fulfilled, (state, action) => {
        state.allItems = action.payload
      })
      .addCase(setUserRole.fulfilled, (state, action) => {
        const idx = state.users.findIndex((u) => u._id === action.payload._id)
        if (idx !== -1) state.users[idx] = action.payload
      })
      .addCase(setUserRole.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(deleteUserById.fulfilled, (state, action) => {
        state.users = state.users.filter((u) => u._id !== action.payload)
      })
      .addCase(deleteUserById.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export const { clearAdminError } = adminSlice.actions
export default adminSlice.reducer
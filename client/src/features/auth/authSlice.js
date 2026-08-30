import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/axiosInstance.js'

const parse = (value) => { try { return value ? JSON.parse(value) : null } catch { return null } }
const initialState = { user: parse(localStorage.getItem('user')), token: localStorage.getItem('token'), isLoading: false, error: null }

export const registerUser = createAsyncThunk('auth/register', async (form, thunkAPI) => {
  try { const { data } = await api.post('/auth/signup', form); return data }
  catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || 'Registration failed') }
})
export const loginUser = createAsyncThunk('auth/login', async (form, thunkAPI) => {
  try { const { data } = await api.post('/auth/login', form); return data }
  catch (err) { return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed') }
})

const saveSession = (state, payload) => {
  state.user = payload.user; state.token = payload.token
  localStorage.setItem('user', JSON.stringify(payload.user)); localStorage.setItem('token', payload.token)
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => { state.user = null; state.token = null; localStorage.removeItem('user'); localStorage.removeItem('token') },
    clearAuthError: (state) => { state.error = null },
    updateUser: (state, action) => {
      state.user = action.payload
      localStorage.setItem('user', JSON.stringify(action.payload))
    },
  },
  extraReducers: (builder) => builder
    .addCase(registerUser.pending, (s) => { s.isLoading = true; s.error = null })
    .addCase(registerUser.fulfilled, (s,a) => { s.isLoading = false; saveSession(s,a.payload) })
    .addCase(registerUser.rejected, (s,a) => { s.isLoading = false; s.error = a.payload })
    .addCase(loginUser.pending, (s) => { s.isLoading = true; s.error = null })
    .addCase(loginUser.fulfilled, (s,a) => { s.isLoading = false; saveSession(s,a.payload) })
    .addCase(loginUser.rejected, (s,a) => { s.isLoading = false; s.error = a.payload }),
})

export const { logout, clearAuthError, updateUser } = authSlice.actions
export default authSlice.reducer
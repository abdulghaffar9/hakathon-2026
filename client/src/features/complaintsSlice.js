import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from '../utils/axiosInstance.js'

const message = (err, fallback) => err.response?.data?.message || fallback
export const fetchComplaints = createAsyncThunk('complaints/fetchAll', async (params = {}, thunkAPI) => {
  try { const { data } = await api.get('/complaints', { params }); return data }
  catch (err) { return thunkAPI.rejectWithValue(message(err, 'Unable to load complaints')) }
})
export const fetchMyComplaints = createAsyncThunk('complaints/fetchMine', async (_, thunkAPI) => {
  try { const { data } = await api.get('/complaints/my'); return data }
  catch (err) { return thunkAPI.rejectWithValue(message(err, 'Unable to load your complaints')) }
})
export const fetchComplaint = createAsyncThunk('complaints/fetchOne', async (id, thunkAPI) => {
  try { const { data } = await api.get(`/complaints/${id}`); return data }
  catch (err) { return thunkAPI.rejectWithValue(message(err, 'Complaint not found')) }
})
export const createComplaint = createAsyncThunk('complaints/create', async (form, thunkAPI) => {
  try { const { data } = await api.post('/complaints', form); return data }
  catch (err) { return thunkAPI.rejectWithValue({ message: message(err, 'Unable to submit complaint'), duplicates: err.response?.data?.duplicates || [] }) }
})
export const upvoteComplaint = createAsyncThunk('complaints/upvote', async (id, thunkAPI) => {
  try { const { data } = await api.post(`/complaints/${id}/upvote`); return data }
  catch (err) { return thunkAPI.rejectWithValue(message(err, 'Unable to upvote')) }
})
export const checkDuplicate = createAsyncThunk('complaints/checkDuplicate', async ({ category, area }, thunkAPI) => {
  try { const { data } = await api.get('/complaints/check-duplicate', { params: { category, area } }); return data.duplicates }
  catch (err) { return thunkAPI.rejectWithValue(message(err, 'Unable to check duplicates')) }
})
export const updateStatus = createAsyncThunk('complaints/updateStatus', async ({ id, status, remark }, thunkAPI) => {
  try { const { data } = await api.patch(`/complaints/${id}/status`, { status, remark }); return data }
  catch (err) { return thunkAPI.rejectWithValue(message(err, 'Unable to update complaint')) }
})
export const submitFeedback = createAsyncThunk('complaints/feedback', async ({ id, rating, comment }, thunkAPI) => {
  try { const { data } = await api.post(`/complaints/${id}/feedback`, { rating, comment }); return data }
  catch (err) { return thunkAPI.rejectWithValue(message(err, 'Unable to submit feedback')) }
})
export const fetchSatisfaction = createAsyncThunk('complaints/satisfaction', async (_, thunkAPI) => {
  try { const { data } = await api.get('/complaints/officer/satisfaction'); return data }
  catch (err) { return thunkAPI.rejectWithValue(message(err, 'Unable to load satisfaction')) }
})

const replace = (items, item) => items.map((x) => x._id === item._id ? item : x)
const slice = createSlice({ name: 'complaints', initialState: { items: [], mine: [], current: null, satisfaction: null, duplicates: [], isLoading: false, error: null }, reducers: { clearError: (s) => { s.error = null }, clearDuplicates: (s) => { s.duplicates = [] } }, extraReducers: (b) => b
  .addCase(fetchComplaints.pending, (s) => { s.isLoading = true; s.error = null })
  .addCase(fetchComplaints.fulfilled, (s,a) => { s.isLoading = false; s.items = a.payload })
  .addCase(fetchComplaints.rejected, (s,a) => { s.isLoading = false; s.error = a.payload })
  .addCase(fetchMyComplaints.pending, (s) => { s.isLoading = true; s.error = null })
  .addCase(fetchMyComplaints.fulfilled, (s,a) => { s.isLoading = false; s.mine = a.payload })
  .addCase(fetchMyComplaints.rejected, (s,a) => { s.isLoading = false; s.error = a.payload })
  .addCase(fetchComplaint.fulfilled, (s,a) => { s.current = a.payload })
  .addCase(createComplaint.fulfilled, (s,a) => { s.mine = [a.payload, ...s.mine]; s.items = [a.payload, ...s.items] })
  .addCase(createComplaint.rejected, (s,a) => { s.error = a.payload?.message || a.payload })
  .addCase(checkDuplicate.fulfilled, (s,a) => { s.duplicates = a.payload })
  .addCase(upvoteComplaint.fulfilled, (s,a) => { s.items = replace(s.items,a.payload); s.mine = replace(s.mine,a.payload); if(s.current?._id===a.payload._id) s.current=a.payload })
  .addCase(updateStatus.fulfilled, (s,a) => { s.items = replace(s.items,a.payload); s.mine = replace(s.mine,a.payload); if(s.current?._id===a.payload._id) s.current=a.payload })
  .addCase(submitFeedback.fulfilled, (s,a) => { s.mine = replace(s.mine,a.payload); if(s.current?._id===a.payload._id) s.current=a.payload })
  .addCase(fetchSatisfaction.fulfilled, (s,a) => { s.satisfaction = a.payload }),
})
export const { clearError, clearDuplicates } = slice.actions
export default slice.reducer

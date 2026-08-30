import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../utils/axiosInstance.js'

const initialState = {
  items: [],
  isLoading: false,
  error: null,
}

// GET /items
export const fetchItems = createAsyncThunk('items/fetchAll', async (_, thunkAPI) => {
  try {
    const { data } = await api.get('/items')
    return data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to load items')
  }
})

// POST /items
export const createItem = createAsyncThunk('items/create', async (itemData, thunkAPI) => {
  try {
    const { data } = await api.post('/items', itemData)
    return data
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to create item')
  }
})

// PUT /items/:id
export const updateItem = createAsyncThunk(
  'items/update',
  async ({ id, ...updates }, thunkAPI) => {
    try {
      const { data } = await api.put(`/items/${id}`, updates)
      return data
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to update item')
    }
  },
)

// DELETE /items/:id
export const deleteItem = createAsyncThunk('items/delete', async (id, thunkAPI) => {
  try {
    await api.delete(`/items/${id}`)
    return id
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to delete item')
  }
})

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    clearItemsError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch
      .addCase(fetchItems.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = action.payload
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // create
      .addCase(createItem.fulfilled, (state, action) => {
        state.items.unshift(action.payload)
      })
      .addCase(createItem.rejected, (state, action) => {
        state.error = action.payload
      })
      // update
      .addCase(updateItem.fulfilled, (state, action) => {
        const idx = state.items.findIndex((i) => i._id === action.payload._id)
        if (idx !== -1) state.items[idx] = action.payload
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.error = action.payload
      })
      // delete
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i._id !== action.payload)
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export const { clearItemsError } = itemsSlice.actions
export default itemsSlice.reducer

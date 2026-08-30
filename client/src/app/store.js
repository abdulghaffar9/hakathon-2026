import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice.js'
import itemsReducer from '../features/items/itemsSlice.js'
import adminReducer from '../features/admin/adminSlice.js'
import complaintsReducer from '../features/complaintsSlice.js'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    items: itemsReducer,
    admin: adminReducer,
    complaints: complaintsReducer,
  },
})

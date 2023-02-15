import { configureStore } from '@reduxjs/toolkit'
import blogReducer from 'blog/blog.reducer'
import { useDispatch } from 'react-redux'
export const store = configureStore({
  reducer: { blog: blogReducer }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// useAppDispatch này là cấu hình 1 xíu để nó không bị lỗi
export const useAppDispatch = () => useDispatch<AppDispatch>()

import { useDispatch, useSelector } from 'react-redux'

// Thin wrappers so components don't need to import `dispatch`/`RootState`
// typing boilerplate every time — same idea as the typed hooks pattern
// from the TS docs, just plain JS.
export const useAppDispatch = () => useDispatch()
export const useAppSelector = (selector) => useSelector(selector)

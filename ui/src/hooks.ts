import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './redux/store';

// Use this instead of plain `useDispatch` in your components
export const useAppDispatch: () => AppDispatch = useDispatch;

// Use this instead of plain `useSelector` in your components
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

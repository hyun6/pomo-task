import { configureStore } from '@reduxjs/toolkit';
import { useSelector } from 'react-redux';
import todosReducer from '../features/todos/todos.slice';

export const store = configureStore({
  reducer: {
    todos: todosReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
type StateSelector<T> = (state: RootState) => T;
type EqualityFn<T> = (left: T, right: T) => boolean;

export function useRootState<T>(selector: StateSelector<T>, equalityFn?: EqualityFn<T>): T {
  return useSelector(selector, equalityFn);
}

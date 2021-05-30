import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { nanoid } from 'nanoid';

export interface TodoItem {
  id: string;
  title: string;
  description?: string;
  done: boolean;
}

interface TodoList {
  todos: TodoItem[];
}

const initialState: TodoList = {
  todos: [{ id: nanoid(), title: 'test', done: false }],
};

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    add: {
      prepare: (title: string, description?: string) => ({
        payload: {
          id: nanoid(),
          title,
          description,
          done: false,
        },
      }),
      reducer(state, { payload }: PayloadAction<TodoItem>) {
        state.todos.push(payload);
      },
    },
    toggle(state, { payload }: PayloadAction<string>) {
      const todo = state.todos.find((todo) => todo.id === payload);
      if (!todo) return;
      todo.done = !todo.done;
    },
    remove(state, { payload }: PayloadAction<string>) {
      state.todos = state.todos.filter((todo) => todo.id !== payload);
    },
  },
});

export const todosActions = todosSlice.actions;
export default todosSlice.reducer;

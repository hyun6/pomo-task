import React from 'react';
import { useRootState } from '../../lib/store';

const TodoList: React.FC = () => {
  const { todos } = useRootState((state) => state.todos);

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </ul>
  );
};

export default TodoList;

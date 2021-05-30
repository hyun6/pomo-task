import { combineReducers } from 'redux';
import todosSlice from './todos/todos.slice';

const rootReducer = combineReducers({
  todosSlice,
});

export default rootReducer;

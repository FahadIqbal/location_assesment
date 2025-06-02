import { combineReducers } from 'redux';
import { autocompleteReducer } from './autocompleteReducer';

export const rootReducer = combineReducers({
  autocomplete: autocompleteReducer,
  // Add your reducers here
}); 
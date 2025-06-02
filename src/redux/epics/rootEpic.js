import { combineEpics } from 'redux-observable';
import { autocompleteEpic } from './autocompleteEpic';

export const rootEpic = combineEpics(
  autocompleteEpic
); 
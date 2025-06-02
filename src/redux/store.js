import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { rootEpic } from './epics/rootEpic';
import { rootReducer } from './reducers/rootReducer';

const epicMiddleware = createEpicMiddleware();

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(epicMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

epicMiddleware.run(rootEpic);

export default store; 
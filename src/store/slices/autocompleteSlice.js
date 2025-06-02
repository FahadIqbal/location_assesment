import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  loading: false,
  results: [],
  error: null,
  history: [],
};

const autocompleteSlice = createSlice({
  name: 'autocomplete',
  initialState,
  reducers: {
    autocompleteRequest: (state, action) => {
      state.loading = true;
      state.error = null;
    },
    autocompleteSuccess: (state, action) => {
      state.loading = false;
      state.results = action.payload;
    },
    autocompleteFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addToHistory: (state, action) => {
      // Remove if exists and add to beginning
      state.history = state.history.filter(item => item !== action.payload);
      state.history.unshift(action.payload);
    },
    clearResults: (state) => {
      state.results = [];
      state.loading = false;
      state.error = null;
    },
    clearHistory: (state) => {
      state.history = [];
    },
    removeFromHistory: (state, action) => {
      state.history = state.history.filter(item => item !== action.payload);
    },
  },
});

export const {
  autocompleteRequest,
  autocompleteSuccess,
  autocompleteFailure,
  addToHistory,
  clearResults,
  clearHistory,
  removeFromHistory,
} = autocompleteSlice.actions;

export default autocompleteSlice.reducer;
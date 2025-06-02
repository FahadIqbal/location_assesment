export const AUTOCOMPLETE_REQUEST = 'AUTOCOMPLETE_REQUEST';
export const AUTOCOMPLETE_SUCCESS = 'AUTOCOMPLETE_SUCCESS';
export const AUTOCOMPLETE_FAILURE = 'AUTOCOMPLETE_FAILURE';
export const ADD_TO_HISTORY = 'ADD_TO_HISTORY';
export const CLEAR_RESULTS = 'CLEAR_RESULTS';
export const CLEAR_HISTORY = 'CLEAR_HISTORY';
export const REMOVE_FROM_HISTORY = 'REMOVE_FROM_HISTORY';

export const autocompleteRequest = (query) => ({
  type: AUTOCOMPLETE_REQUEST,
  payload: query,
});

export const autocompleteSuccess = (results) => ({
  type: AUTOCOMPLETE_SUCCESS,
  payload: results,
});

export const autocompleteFailure = (error) => ({
  type: AUTOCOMPLETE_FAILURE,
  payload: error,
});

export const addToHistory = (search) => ({
  type: ADD_TO_HISTORY,
  payload: search,
});

export const clearResults = () => ({
  type: CLEAR_RESULTS,
});

export const clearHistory = () => ({
  type: CLEAR_HISTORY,
});

export const removeFromHistory = (item) => ({
  type: REMOVE_FROM_HISTORY,
  payload: item,
});
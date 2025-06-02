import {
  AUTOCOMPLETE_REQUEST,
  AUTOCOMPLETE_SUCCESS,
  AUTOCOMPLETE_FAILURE,
  ADD_TO_HISTORY,
  CLEAR_RESULTS,
  CLEAR_HISTORY,
  REMOVE_FROM_HISTORY,
} from '../actions/autocompleteActions';

const initialState = {
  loading: false,
  results: [],
  error: null,
  history: [],
};

export const autocompleteReducer = (state = initialState, action) => {
  switch (action.type) {
    case AUTOCOMPLETE_REQUEST:
      return { ...state, loading: true, error: null };
    case AUTOCOMPLETE_SUCCESS:
      return { ...state, loading: false, results: action.payload };
    case AUTOCOMPLETE_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case ADD_TO_HISTORY:
      // Prevent duplicates in history
      return { 
        ...state, 
        history: state.history.includes(action.payload) 
          ? [action.payload, ...state.history.filter(item => item !== action.payload)] 
          : [action.payload, ...state.history] 
      };
    case CLEAR_RESULTS:
      return { ...state, results: [], loading: false, error: null };
    case CLEAR_HISTORY:
      return { ...state, history: [] };
    case REMOVE_FROM_HISTORY:
      return { 
        ...state, 
        history: state.history.filter(item => item !== action.payload) 
      };
    default:
      return state;
  };
};
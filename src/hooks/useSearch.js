import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  autocompleteRequest, 
  clearResults, 
  addToHistory 
} from '../store/slices/autocompleteSlice';

export const useSearch = () => {
  const dispatch = useDispatch();
  const { results, loading, error, history } = useSelector((state) => state.autocomplete);
  const [searchValue, setSearchValue] = useState('');
  const [showResults, setShowResults] = useState(true);
  const [recentSearches, setRecentSearches] = useState([]);

  const handleChange = useCallback((e) => {
    const query = e.target.value;
    setSearchValue(query);
    
    if (query) {
      dispatch(autocompleteRequest(query));
      setShowResults(true);
    } else {
      dispatch(clearResults());
      setRecentSearches(history.slice(0, 5));
      setShowResults(true);
    }
  }, [dispatch, history]);

  const handleSelect = useCallback((item) => {
    dispatch(addToHistory(item.description));
    setSearchValue(item.description);
    setShowResults(false);
    return item;
  }, [dispatch]);

  const handleSearch = useCallback((value) => {
    if (value) {
      dispatch(autocompleteRequest(value));
    }
  }, [dispatch]);

  const handleClear = useCallback(() => {
    setSearchValue('');
    dispatch(clearResults());
    setRecentSearches(history.slice(0, 5));
    setShowResults(true);
  }, [dispatch, history]);

  return {
    searchValue,
    setSearchValue,
    results,
    loading,
    error,
    history,
    recentSearches,
    showResults,
    setShowResults,
    handleChange,
    handleSelect,
    handleSearch,
    handleClear,
  };
};
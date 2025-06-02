import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, List, Spin, Typography, Tag, Tooltip, Button, Card, Empty, Badge } from 'antd';
import { SearchOutlined, EnvironmentOutlined, CloseCircleOutlined, HistoryOutlined, LoadingOutlined } from '@ant-design/icons';
import {
  autocompleteRequest,
  addToHistory,
  clearResults,
} from '../redux/actions/autocompleteActions';

const { Text, Title } = Typography;

const SearchBox = ({ onSelect, showResults = true, setShowResults }) => {
  const dispatch = useDispatch();
  const { results, loading, error, history } = useSelector((state) => state.autocomplete);
  const [searchValue, setSearchValue] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);

  const handleChange = useCallback((e) => {
    const query = e.target.value;
    setSearchValue(query);
    
    if (query) {
      dispatch(autocompleteRequest(query));
      setShowResults(true);
    } else {
      dispatch(clearResults());
      // Show recent searches when input is empty
      setRecentSearches(history.slice(0, 5));
      setShowResults(true);
    }
  }, [dispatch, setShowResults, history]);

  const handleSelect = (item) => {
    dispatch(addToHistory(item.description));
    setSearchValue(item.description);
    if (onSelect) onSelect(item);
  };

  const handleSearch = (value) => {
    if (value) {
      dispatch(autocompleteRequest(value));
    }
  };

  const handleClear = () => {
    setSearchValue('');
    dispatch(clearResults());
    setRecentSearches(history.slice(0, 5));
    setShowResults(true);
  };

  const handleHistoryItemClick = (item) => {
    setSearchValue(item);
    dispatch(autocompleteRequest(item));
    setShowResults(true);
  };

  return (
    <Card className="search-card" title={<Title level={4}>Find Places</Title>}>
      <Input.Search
        className="search-input"
        placeholder="Search for places..."
        value={searchValue}
        onChange={handleChange}
        onSearch={handleSearch}
        loading={loading}
        enterButton={<SearchOutlined />}
        onFocus={() => {
          setShowResults(true);
          if (!searchValue) {
            setRecentSearches(history.slice(0, 5));
          }
        }}
        size="large"
        allowClear
        prefix={<EnvironmentOutlined style={{ color: '#1a2a6c' }} />}
        suffix={
          loading ? <LoadingOutlined style={{ color: '#1a2a6c' }} /> : null
        }
      />
      
      {error && <Text type="danger" style={{ marginTop: 10, display: 'block' }}>{error}</Text>}
      
      {showResults && (
        <div className="search-results-container">
          {searchValue && results.length > 0 && (
            <div className="search-results-header">
              <Badge count={results.length} style={{ backgroundColor: '#1a2a6c' }}>
                <Text strong>Search Results</Text>
              </Badge>
              <Button 
                type="text" 
                size="small" 
                icon={<CloseCircleOutlined />} 
                onClick={() => setShowResults(false)}
              />
            </div>
          )}
          
          {searchValue && results.length > 0 ? (
            <List
              className="search-results"
              dataSource={results}
              renderItem={item => (
                <List.Item 
                  onClick={() => handleSelect(item)} 
                  className="search-result-item"
                >
                  <div className="search-result-content">
                    <EnvironmentOutlined style={{ marginRight: 8, color: '#1a2a6c' }} />
                    <Text>{item.description}</Text>
                  </div>
                </List.Item>
              )}
              locale={{ emptyText: <Empty description="No results found" /> }}
            />
          ) : searchValue === '' && recentSearches.length > 0 ? (
            <div>
              <div className="search-results-header">
                <Text strong><HistoryOutlined /> Recent Searches</Text>
              </div>
              <List
                className="search-results"
                dataSource={recentSearches}
                renderItem={item => (
                  <List.Item 
                    onClick={() => handleHistoryItemClick(item)} 
                    className="search-result-item"
                  >
                    <div className="search-result-content">
                      <HistoryOutlined style={{ marginRight: 8, color: '#1a2a6c' }} />
                      <Text>{item}</Text>
                    </div>
                  </List.Item>
                )}
              />
            </div>
          ) : null}
        </div>
      )}
    </Card>
  );
};

export default SearchBox;
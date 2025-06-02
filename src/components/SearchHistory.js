import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, Typography, Empty, Button, Tooltip, Input, Tag, Popconfirm, Divider, Badge } from 'antd';
import { HistoryOutlined, ClockCircleOutlined, DeleteOutlined, SearchOutlined, FilterOutlined, ClearOutlined } from '@ant-design/icons';
import { clearHistory, addToHistory, autocompleteRequest, removeFromHistory } from '../redux/actions/autocompleteActions';

const { Title, Text } = Typography;

const SearchHistory = ({ onSelect }) => {
  const dispatch = useDispatch();
  const history = useSelector((state) => state.autocomplete.history);
  const [filterText, setFilterText] = useState('');
  const [showFilter, setShowFilter] = useState(false);

  const handleClearHistory = () => {
    dispatch(clearHistory());
  };

  const handleSearchAgain = (item) => {
    // Dispatch the autocomplete request to update the search box
    dispatch(autocompleteRequest(item));
    
    // Create a more comprehensive mock data set for better matching
    const mockResults = [
      { description: 'Kuala Lumpur, Federal Territory of Kuala Lumpur, Malaysia', place_id: 'ChIJ5-rvAcdJzDERfSgcL1uO2fQ', coordinates: { lat: 3.1390, lng: 101.6869 } },
      { description: 'Penang, Malaysia', place_id: 'ChIJf5XDJqVMzDERlYNg2EdXvRc', coordinates: { lat: 5.4141, lng: 100.3288 } },
      { description: 'Johor Bahru, Johor, Malaysia', place_id: 'ChIJK4g9PVkR2jERLQXXXQXXXXX', coordinates: { lat: 1.4927, lng: 103.7414 } },
      { description: 'Malacca, Malaysia', place_id: 'ChIJOWfZXXXXXXXXXXXXXXXXXXX', coordinates: { lat: 2.1896, lng: 102.2501 } },
      { description: 'Ipoh, Perak, Malaysia', place_id: 'ChIJXXXXXXXXXXXXXXXXXXXXXXX', coordinates: { lat: 4.5975, lng: 101.0901 } },
      // Fallback for any unmatched items
      { description: item, place_id: `generated_${Date.now()}`, coordinates: { lat: 3.1390, lng: 101.6869 } }
    ];
    
    // Find exact match first
    let matchedItem = mockResults.find(result => result.description === item);
    
    // If no exact match, find partial match
    if (!matchedItem) {
      matchedItem = mockResults.find(result => 
        item.includes(result.description) || result.description.includes(item)
      );
    }
    
    // If still no match, use the fallback
    if (!matchedItem) {
      matchedItem = mockResults[mockResults.length - 1];
    }
    
    // Update the map by calling onSelect with the matched item
    if (onSelect && matchedItem) {
      onSelect(matchedItem);
    }
  };

  const handleRemoveFromHistory = (item, e) => {
    e.stopPropagation();
    dispatch(removeFromHistory(item));
  };

  const filteredHistory = filterText 
    ? history.filter(item => item.toLowerCase().includes(filterText.toLowerCase()))
    : history;

  const getRelativeTime = (index) => {
    if (index === 0) return 'Just now';
    if (index === 1) return '1 minute ago';
    if (index < 5) return `${index} minutes ago`;
    if (index < 60) return 'Today';
    return 'Earlier';
  };

  return (
    <div className="history-container">
      <div className="history-header">
        <Title level={4} className="history-title">
          <HistoryOutlined style={{ marginRight: 8 }} />
          Search History
        </Title>
        <div className="history-actions">
          <Tooltip title="Filter history">
            <Button 
              type="text" 
              icon={<FilterOutlined />} 
              onClick={() => setShowFilter(!showFilter)}
              style={{ color: showFilter ? '#1a2a6c' : undefined }}
            />
          </Tooltip>
          {history.length > 0 && (
            <Popconfirm
              title="Clear all search history?"
              onConfirm={handleClearHistory}
              okText="Yes"
              cancelText="No"
            >
              <Tooltip title="Clear history">
                <Button type="text" icon={<ClearOutlined />} />
              </Tooltip>
            </Popconfirm>
          )}
        </div>
      </div>
      
      {showFilter && (
        <div className="history-filter">
          <Input 
            placeholder="Filter history..." 
            prefix={<SearchOutlined />}
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            allowClear
            size="middle"
          />
        </div>
      )}
      
      <Divider style={{ margin: '12px 0' }} />
      
      <div className="history-content">
        {/* Move the Badge outside the conditional rendering to prevent collapsing */}
        <div className="history-header-section">
          {filteredHistory.length > 0 ? (
            <Badge count={filteredHistory.length} style={{ backgroundColor: '#1a2a6c', marginBottom: 12 }}>
              <Text strong>Recent Searches</Text>
            </Badge>
          ) : (
            <Text strong style={{ marginBottom: 12, display: 'inline-block' }}>Recent Searches</Text>
          )}
        </div>
        
        {filteredHistory.length > 0 ? (
          <List
            className="history-list"
            dataSource={filteredHistory}
            renderItem={(item, index) => (
              <List.Item 
                className="history-item"
                onClick={() => handleSearchAgain(item)} // Make the entire item clickable
              >
                <div className="history-item-content">
                  <ClockCircleOutlined style={{ marginRight: 10, color: '#1a2a6c' }} />
                  <div className="history-item-details">
                    <Text ellipsis>{item}</Text>
                    <div>
                      <Tag color="blue" size="small" style={{ marginTop: 4 }}>{getRelativeTime(index)}</Tag>
                    </div>
                  </div>
                  <div className="history-item-actions">
                    <Tooltip title="Search again">
                      <Button 
                        type="text" 
                        size="small" 
                        icon={<SearchOutlined />} 
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering the List.Item onClick
                          handleSearchAgain(item);
                        }}
                      />
                    </Tooltip>
                    <Tooltip title="Remove from history">
                      <Button 
                        type="text" 
                        size="small" 
                        icon={<DeleteOutlined />} 
                        onClick={(e) => handleRemoveFromHistory(item, e)}
                      />
                    </Tooltip>
                  </div>
                </div>
              </List.Item>
            )}
          />
        ) : (
          <Empty 
            description={filterText ? "No matching history items" : "No search history yet"} 
            image={Empty.PRESENTED_IMAGE_SIMPLE} 
          />
        )}
      </div>
    </div>
  );
};

export default SearchHistory;
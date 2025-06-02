import React, { useState } from 'react';
import { Layout, Typography, ConfigProvider, theme } from 'antd';
import 'antd/dist/reset.css';
import './App.css';
import SearchBox from './components/SearchBox';
import SearchHistory from './components/SearchHistory';
import MapView from './components/MapView';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

function App() {
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [showResults, setShowResults] = useState(true);
  const [collapsed, setCollapsed] = useState(false);

  const handlePlaceSelect = (place) => {
    setSelectedPlace(place);
    setShowResults(false); // Hide results list when a place is selected
  };

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.defaultAlgorithm,
        token: {
          colorPrimary: '#1a2a6c',
          borderRadius: 8,
          fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        },
      }}
    >
      <Layout className="app-layout">
        <Header className="app-header">
          <Title level={3} className="app-title">Places Explorer</Title>
        </Header>
        <Layout>
          <Content className="app-content">
            <SearchBox 
              onSelect={handlePlaceSelect} 
              showResults={showResults} 
              setShowResults={setShowResults} 
            />
            <MapView place={selectedPlace} />
          </Content>
          <Sider 
            width={300} 
            className="app-sider"
            breakpoint="lg"
            collapsedWidth={0}
            collapsed={collapsed}
            onCollapse={(collapsed) => setCollapsed(collapsed)}
            theme="light"
          >
            <SearchHistory onSelect={handlePlaceSelect} />
          </Sider>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}

export default App;

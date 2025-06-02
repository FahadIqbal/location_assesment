import React, { useEffect, useRef, useState } from 'react';
import { Typography, Spin, Card, Empty, Button } from 'antd';
import { EnvironmentOutlined, FullscreenOutlined, ReloadOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const MapView = ({ place }) => {
  const mapRef = useRef(null);
  const pinRef = useRef(null);
  const iframeRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(14);
  const [isZooming, setIsZooming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  
  // In the useEffect hook of MapView.js
  useEffect(() => {
    if (place && mapRef.current) {
      // Start loading state
      setIsLoading(true);
      
      // Start zoom animation sequence
      setIsZooming(true);
      
      // Initial zoom out effect
      setZoomLevel(10);
      
      // Then zoom in closer after a short delay
      const zoomTimer = setTimeout(() => {
        setZoomLevel(14); // Slightly less zoomed for better context
        
        // Reset animation by removing and re-adding the class
        if (pinRef.current) {
          pinRef.current.classList.remove('map-pin-drop');
          
          // Force a reflow before adding the class again
          void pinRef.current.offsetWidth;
          
          // Add animation class with a slight delay for better sequence
          setTimeout(() => {
            if (pinRef.current) {
              pinRef.current.classList.add('map-pin-drop');
            }
          }, 200);
          
          // Focus on the pin element
          setTimeout(() => {
            if (pinRef.current) {
              pinRef.current.focus();
              setIsLoading(false);
            }
          }, 800); // Increased delay for smoother transition
        }
        
        // End zoom animation with a longer duration
        setTimeout(() => {
          setIsZooming(false);
        }, 1500);
      }, 600); // Slightly shorter initial delay
      
      return () => clearTimeout(zoomTimer);
    }
  }, [place]); // This will re-run when place changes, including from history clicks

  const handleFullscreen = () => {
    setFullscreen(!fullscreen);
  };

  const handleReload = () => {
    if (iframeRef.current) {
      iframeRef.current.src = iframeRef.current.src;
      setIsLoading(true);
    }
  };

  if (!place) {
    return (
      <Card className="map-card">
        <Empty
          image={<EnvironmentOutlined style={{ fontSize: 60, color: '#1a2a6c' }} />}
          description={
            <Text>Search and select a place to view on the map</Text>
          }
        />
      </Card>
    );
  }

  // Generate map URL using coordinates if available, otherwise fallback to place_id
  const mapUrl = place.coordinates 
    ? `https://www.google.com/maps?q=${place.coordinates.lat},${place.coordinates.lng}&z=${zoomLevel}&output=embed` 
    : `https://www.google.com/maps?q=place_id:${place.place_id}&output=embed&z=${zoomLevel}`;

  return (
    <Card 
      className={`map-card ${fullscreen ? 'map-fullscreen' : ''}`}
      title={<Title level={5}>{place.description}</Title>}
      extra={
        <div>
          <Button 
            type="text" 
            icon={<ReloadOutlined />} 
            onClick={handleReload} 
            title="Reload map"
          />
          <Button 
            type="text" 
            icon={<FullscreenOutlined />} 
            onClick={handleFullscreen} 
            title="Toggle fullscreen"
          />
        </div>
      }
    >
      <div className="map-card-content" style={{ position: 'relative' }}>
        {isLoading && (
          <div className="map-loading">
            <Spin size="large" />
          </div>
        )}
        <div 
          ref={mapRef} 
          className={`map-container ${isZooming ? 'map-zooming' : ''}`}
        >
          <iframe
            ref={iframeRef}
            title="map"
            className="map-iframe"
            frameBorder="0"
            src={mapUrl}
            allowFullScreen
            key={`${place.place_id || 'coords'}-${zoomLevel}`}
            onLoad={() => setIsLoading(false)}
          />
          {/* Custom pin overlay */}
          <div 
            ref={pinRef} 
            className="map-pin" 
            tabIndex="-1"
          >
            <div className="map-pin-head"></div>
            <div className="map-pin-shadow"></div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MapView;
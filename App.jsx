import React, { useEffect, useState } from 'react';
import './App.css';

export default function App() {
  const [netflixUrl, setNetflixUrl] = useState(null);
  const [proxiedUrl, setProxiedUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [desktopMode, setDesktopMode] = useState(true);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get the Netflix URL from Telegram WebApp data
    if (window.Telegram?.WebApp) {
      const webApp = window.Telegram.WebApp;
      const initData = webApp.initData;
      
      // Parse the URL from query parameters or WebApp data
      const params = new URLSearchParams(window.location.search);
      const url = params.get('url');
      
      if (url) {
        const decodedUrl = decodeURIComponent(url);
        setNetflixUrl(decodedUrl);
        setIsLoading(true);
        
        // Route through the Flask proxy to bypass Netflix's iframe blocking
        // The proxy handles authentication and strips security headers
        const proxyUrl = `${window.location.origin}/go?url=${encodeURIComponent(decodedUrl)}`;
        setProxiedUrl(proxyUrl);
      }
    }
  }, []);

  const handleIframeLoad = () => {
    setIframeLoaded(true);
    setIsLoading(false);
    setError(null);
    
    // After Netflix loads, switch from desktop to mobile mode after a short delay
    setTimeout(() => {
      switchToMobileMode();
    }, 1500);
  };

  const switchToMobileMode = () => {
    setDesktopMode(false);
    
    // Try to notify the iframe to switch viewport
    const iframe = document.getElementById('netflix-iframe');
    if (iframe && iframe.contentWindow) {
      try {
        iframe.contentWindow.postMessage(
          { action: 'switch_to_mobile' },
          '*'
        );
      } catch (e) {
        console.log('Could not post message to iframe');
      }
    }
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setError('Failed to load Netflix. The proxy may be unavailable or the link may have expired.');
  };

  return (
    <div className={`app ${desktopMode ? 'desktop-mode' : 'mobile-mode'}`}>
      {isLoading && (
        <div className="loading-overlay">
          <div className="spinner"></div>
          <p>Loading Netflix...</p>
        </div>
      )}

      {error && (
        <div className="error-container">
          <h2>Error Loading Netflix</h2>
          <p>{error}</p>
        </div>
      )}

      {netflixUrl && !error ? (
        <iframe
          id="netflix-iframe"
          src={proxiedUrl || netflixUrl}
          className="netflix-iframe"
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          allow="camera; microphone; payment; usb; magnetometer; gyroscope; accelerometer"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation allow-top-navigation allow-top-navigation-by-user-activation"
        />
      ) : !error && (
        <div className="error-container">
          <h2>No Netflix URL provided</h2>
          <p>Please open this app from the bot with a valid Netflix login link.</p>
        </div>
      )}
    </div>
  );
}

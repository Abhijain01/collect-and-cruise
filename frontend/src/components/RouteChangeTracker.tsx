import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// This component sends page_view events to Google Analytics
// whenever the user navigates between routes in your SPA
const RouteChangeTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Wait until gtag function is loaded
    if (typeof (window as any).gtag === 'function') {
      (window as any).gtag('config', 'G-XXXXXXXXXX', {
        page_path: location.pathname + location.search,
        page_location: window.location.href,
        page_title: document.title,
      });
      console.log('📊 Google Analytics page_view sent:', location.pathname);
    } else {
      console.warn('⚠️ gtag not found on window — script may not have loaded yet.');
    }
  }, [location]); // runs every time the route changes

  return null; // This component renders nothing
};

export default RouteChangeTracker;

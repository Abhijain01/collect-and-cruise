import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// This component renders nothing.
// Its only job is to listen to route changes and send them to Google.
const RouteChangeTracker = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if the Google Analytics 'gtag' function exists
    if (typeof (window as any).gtag === 'function') {
      // Send a 'page_view' event
      (window as any).gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
        page_location: window.location.href,
        page_title: document.title, // Send the title from <Helmet>
      });
    }
  }, [location]); // This effect re-runs every time the 'location' changes

  return null; // This component does not render any HTML
};

export default RouteChangeTracker;

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SearchHighlighter = () => {
  const location = useLocation();

  // Create style for highlight effect
  useEffect(() => {
    // Add highlight styles if they don't exist
    if (!document.getElementById('search-highlight-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'search-highlight-styles';
      styleEl.innerHTML = `
        .search-highlight {
          background-color: rgba(251, 191, 36, 0.2) !important;
          box-shadow: 0 0 0 2px rgba(251, 191, 36, 0.5);
          transition: background-color 0.3s ease;
        }
        .search-highlight.animate-pulse {
          animation: highlight-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        @keyframes highlight-pulse {
          0%, 100% {
            background-color: rgba(251, 191, 36, 0.2);
          }
          50% {
            background-color: rgba(251, 191, 36, 0.5);
          }
        }
      `;
      document.head.appendChild(styleEl);
    }
  }, []);

  // Handle highlight functionality
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const highlightId = searchParams.get('id');
    
    if (highlightId) {
      // Add a slight delay to ensure the element is in the DOM
      setTimeout(() => {
        highlightElement(highlightId);
      }, 100);
    }
    
    // Cleanup highlight when navigating away
    return () => {
      removeHighlights();
    };
  }, [location]);

  // Remove any existing highlights
  const removeHighlights = () => {
    const highlightedElements = document.querySelectorAll('.search-highlight');
    highlightedElements.forEach(el => {
      el.classList.remove('search-highlight', 'animate-pulse');
    });
  };
  
  // Add highlight to element with the matching ID
  const highlightElement = (id: string) => {
    removeHighlights();
    
    // Find elements with the ID or containing the ID (for nested elements)
    const elements = [
      document.getElementById(id),
      ...Array.from(document.querySelectorAll(`[data-id="${id}"]`))
    ].filter(Boolean) as HTMLElement[];
    
    if (elements.length > 0) {
      elements.forEach(el => {
        // Add highlight class and scroll into view
        el.classList.add('search-highlight', 'animate-pulse');
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    }
  };

  return null; // This is a utility component with no UI
};

export default SearchHighlighter;

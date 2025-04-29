
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchAll, SearchResult } from '@/services/search';

export const useSearchLogic = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  // Use a ref to track the latest query for debounce handling
  const latestQueryRef = useRef<string>('');
  
  useEffect(() => {
    // Update the ref immediately for accurate debounce checks
    latestQueryRef.current = query;
    
    // Set loading state immediately when typing starts
    if (query) {
      setIsLoading(true);
    }
    
    // Immediate search for short queries (1-2 chars) for better responsiveness
    if (query && query.length <= 2) {
      const performSearch = async () => {
        const searchResults = await searchAll(query);
        
        // Filter results based on active filter - properly await the results first
        const filteredResults = activeFilter === 'all' 
          ? searchResults 
          : searchResults.filter(result => result.type === activeFilter);
        
        setResults(filteredResults);
        setIsLoading(false);
      };
      
      performSearch();
    }
    
    // Use a shorter debounce time for better responsiveness
    const handler = setTimeout(() => {
      if (query && query === latestQueryRef.current && query.length > 2) {
        const performSearch = async () => {
          const searchResults = await searchAll(query);
          
          // Filter results based on active filter - properly await the results first
          const filteredResults = activeFilter === 'all' 
            ? searchResults 
            : searchResults.filter(result => result.type === activeFilter);
          
          setResults(filteredResults);
          setIsLoading(false);
        };
        
        performSearch();
      } else if (!query) {
        setResults([]);
        setIsLoading(false);
      }
    }, 150);

    return () => clearTimeout(handler);
  }, [query, activeFilter]);

  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    setQuery('');
    
    // Navigate based on result type and pass ID for highlighting
    switch (result.type) {
      case 'transaction':
        navigate(`/transactions?id=${result.id}`);
        break;
      case 'category':
        navigate(`/categories?id=${result.id}`);
        break;
      case 'invoice':
        navigate(`/invoices?id=${result.id}`);
        break;
    }
  };

  const handleFilterChange = (value: string) => {
    setActiveFilter(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const clearSearch = () => {
    setQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const getTypeTitle = (type: string) => {
    switch (type) {
      case 'transaction':
        return 'Transactions';
      case 'category':
        return 'Categories';
      case 'invoice':
        return 'Invoices';
      default:
        return '';
    }
  };

  return {
    open,
    setOpen,
    query,
    results,
    isLoading,
    activeFilter,
    inputRef,
    handleSelect,
    handleFilterChange,
    handleKeyDown,
    handleOpenChange,
    setQuery,
    clearSearch,
    getTypeTitle
  };
};

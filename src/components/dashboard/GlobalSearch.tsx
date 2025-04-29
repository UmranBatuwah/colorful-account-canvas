
import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Search, X, FileText, Tag, DollarSign, Loader2, Calendar } from 'lucide-react';
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from '@/components/ui/command';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { searchAll, SearchResult } from '@/services/search';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const GlobalSearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Use a ref to track the latest query for debounce handling
  const latestQueryRef = useRef<string>('');
  
  // Get any potential highlight ID from the URL
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
  
  useEffect(() => {
    // Update the ref immediately for accurate debounce checks
    latestQueryRef.current = query;
    
    // Set loading state immediately when typing starts
    if (query) {
      setIsLoading(true);
    }
    
    // Immediate search for short queries (1-2 chars) for better responsiveness
    if (query && query.length <= 2) {
      const quickResults = searchAll(query);
      const filteredResults = activeFilter === 'all' 
        ? quickResults 
        : quickResults.filter(result => result.type === activeFilter);
      
      setResults(filteredResults);
      setIsLoading(false);
    }
    
    // Use a shorter debounce time for better responsiveness
    const handler = setTimeout(() => {
      if (query && query === latestQueryRef.current && query.length > 2) {
        const searchResults = searchAll(query);
        
        // Filter results based on active filter
        const filteredResults = activeFilter === 'all' 
          ? searchResults 
          : searchResults.filter(result => result.type === activeFilter);
        
        setResults(filteredResults);
        setIsLoading(false);
      } else if (!query) {
        setResults([]);
        setIsLoading(false);
      }
    }, 150); // Reduced from 300ms to 150ms for more responsiveness

    return () => clearTimeout(handler);
  }, [query, activeFilter]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setOpen(false);
    }
  };
  
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

  const getIcon = (type: string) => {
    switch (type) {
      case 'transaction':
        return <DollarSign className="h-4 w-4 text-emerald-500 shrink-0" />;
      case 'category':
        return <Tag className="h-4 w-4 text-blue-500 shrink-0" />;
      case 'invoice':
        return <FileText className="h-4 w-4 text-purple-500 shrink-0" />;
      default:
        return null;
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

  const handleFilterChange = (value: string) => {
    setActiveFilter(value);
  };

  const clearSearch = () => {
    setQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className="relative w-full md:w-80 lg:w-96">
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <button className="search-trigger relative w-full flex items-center">
            <div className="relative w-full focus-within:ring-2 focus-within:ring-primary/30 rounded-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                className="w-full py-2 pl-10 pr-4 rounded-full bg-gray-100 hover:bg-gray-200/70 transition-colors text-sm focus-visible:ring-0 focus-visible:ring-offset-0 border-none"
                onClick={() => setOpen(true)}
                readOnly
              />
            </div>
            <div className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2">
              <kbd className="hidden md:flex pointer-events-none h-5 select-none items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium text-gray-400">
                ⌘K
              </kbd>
            </div>
          </button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-screen md:w-[500px] shadow-md border-gray-200" align="center" side="bottom">
          <Command className="rounded-lg" onKeyDown={handleKeyDown}>
            <div className="flex items-center border-b px-3">
              <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
              <CommandInput
                placeholder="Search for transactions, categories, invoices..." 
                value={query}
                onValueChange={setQuery}
                ref={inputRef}
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                autoFocus
              />
              {query && (
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-6 w-6" 
                  onClick={clearSearch}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            
            <div className="flex items-center justify-between border-b px-3 py-2 bg-gray-50">
              <div className="text-xs font-medium text-gray-700">Filters:</div>
              <Select 
                value={activeFilter} 
                onValueChange={handleFilterChange}
              >
                <SelectTrigger className="w-[140px] h-7 text-xs">
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center">
                      <Search className="mr-2 h-3 w-3" /> All
                    </div>
                  </SelectItem>
                  <SelectItem value="transaction">
                    <div className="flex items-center">
                      <DollarSign className="mr-2 h-3 w-3 text-emerald-500" /> Transactions
                    </div>
                  </SelectItem>
                  <SelectItem value="category">
                    <div className="flex items-center">
                      <Tag className="mr-2 h-3 w-3 text-blue-500" /> Categories
                    </div>
                  </SelectItem>
                  <SelectItem value="invoice">
                    <div className="flex items-center">
                      <FileText className="mr-2 h-3 w-3 text-purple-500" /> Invoices
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <CommandList className="max-h-[300px]">
              {isLoading ? (
                <div className="py-6 text-center">
                  <Loader2 className="h-5 w-5 animate-spin mx-auto text-gray-400" />
                  <p className="text-xs text-gray-500 mt-2">Searching...</p>
                </div>
              ) : (
                <>
                  <CommandEmpty>
                    <div className="py-6 text-center">
                      <div className="mx-auto w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center mb-1">
                        <Search className="h-3 w-3 text-gray-500" />
                      </div>
                      <p className="text-sm text-gray-500">No results found.</p>
                      <p className="text-xs text-gray-400 mt-1">Try searching for something else.</p>
                    </div>
                  </CommandEmpty>
                  
                  {results.length > 0 && (
                    <div>
                      {(['transaction', 'category', 'invoice'] as const).map(type => {
                        const typeResults = results.filter(r => r.type === type);
                        if (typeResults.length === 0) return null;
                        
                        return (
                          <CommandGroup key={type} heading={getTypeTitle(type)}>
                            {typeResults.map(result => (
                              <CommandItem
                                key={`${result.type}-${result.id}`}
                                onSelect={() => handleSelect(result)}
                                className="flex items-start py-2.5 cursor-pointer"
                              >
                                <div className="flex items-start">
                                  <div className="mr-2 mt-0.5">
                                    {getIcon(result.type)}
                                  </div>
                                  <div>
                                    <div className="font-medium">{result.title}</div>
                                    <div className="text-xs text-muted-foreground line-clamp-1">
                                      {result.description}
                                    </div>
                                    {result.date && (
                                      <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                                        <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                                        {format(new Date(result.date), 'MMM d, yyyy')}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        );
                      })}
                    </div>
                  )}
                </>
              )}
            </CommandList>
            
            <div className="border-t p-2">
              <div className="flex items-center justify-between text-xs text-gray-500 px-2">
                <div className="flex items-center gap-2">
                  <span>Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">↵</kbd> to select</span>
                  <span>Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">Esc</kbd> to close</span>
                </div>
                {results.length > 0 && (
                  <span className="text-xs">{results.length} results</span>
                )}
              </div>
            </div>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default GlobalSearch;


import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, FileText, Tag, DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandItem, 
  CommandList 
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { searchAll, SearchResult } from '@/services/search';

const GlobalSearch = () => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Debounce search to avoid excessive processing
    const handler = setTimeout(() => {
      if (query) {
        const searchResults = searchAll(query);
        setResults(searchResults);
      } else {
        setResults([]);
      }
    }, 300);

    return () => clearTimeout(handler);
  }, [query]);
  
  const handleSelect = (result: SearchResult) => {
    setOpen(false);
    
    // Navigate based on result type
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
        return <DollarSign className="mr-2 h-4 w-4 text-muted-foreground" />;
      case 'category':
        return <Tag className="mr-2 h-4 w-4 text-muted-foreground" />;
      case 'invoice':
        return <FileText className="mr-2 h-4 w-4 text-muted-foreground" />;
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

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <div className="relative w-full md:w-64 lg:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search..."
            className="w-full py-2 pl-10 pr-4 rounded-full bg-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            onClick={() => setOpen(true)}
            readOnly
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-screen md:w-[450px]" align="start" side="bottom">
        <Command className="rounded-lg border shadow-md">
          <CommandInput 
            placeholder="Search for transactions, categories, invoices..." 
            value={query}
            onValueChange={setQuery}
            ref={inputRef}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup>
              {results.map((result) => (
                <CommandItem
                  key={`${result.type}-${result.id}`}
                  onSelect={() => handleSelect(result)}
                  className="flex items-start py-2"
                >
                  <div className="flex items-center">
                    {getIcon(result.type)}
                    <div>
                      <div className="font-medium">{result.title}</div>
                      <div className="text-xs text-muted-foreground">{result.description}</div>
                      {result.date && (
                        <div className="text-xs text-muted-foreground">
                          {format(new Date(result.date), 'MMM d, yyyy')}
                        </div>
                      )}
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default GlobalSearch;


import React from 'react';
import { Loader2, Search, X } from 'lucide-react';
import { 
  Command, 
  CommandEmpty, 
  CommandGroup, 
  CommandInput, 
  CommandList 
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { SearchResult } from '@/services/search';
import SearchResultItem from './SearchResultItem';
import SearchFilters from './SearchFilters';
import SearchHighlighter from './SearchHighlighter';
import { useSearchLogic } from './useSearchLogic';

const GlobalSearch = () => {
  const {
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
  } = useSearchLogic();

  return (
    <div className="relative w-full md:w-80 lg:w-96">
      <SearchHighlighter />
      
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
            
            <SearchFilters 
              activeFilter={activeFilter} 
              onFilterChange={handleFilterChange} 
            />
            
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
                              <SearchResultItem 
                                key={`${result.type}-${result.id}`}
                                result={result}
                                onSelect={handleSelect}
                              />
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


import React from 'react';
import { Calendar, DollarSign, FileText, Tag } from 'lucide-react';
import { CommandItem } from '@/components/ui/command';
import { SearchResult } from '@/services/search';
import { format } from 'date-fns';

interface SearchResultItemProps {
  result: SearchResult;
  onSelect: (result: SearchResult) => void;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ result, onSelect }) => {
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

  return (
    <CommandItem
      key={`${result.type}-${result.id}`}
      onSelect={() => onSelect(result)}
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
  );
};

export default SearchResultItem;

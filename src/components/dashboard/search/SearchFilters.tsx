
import React from 'react';
import { DollarSign, FileText, Search, Tag } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchFiltersProps {
  activeFilter: string;
  onFilterChange: (value: string) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ activeFilter, onFilterChange }) => {
  return (
    <div className="flex items-center justify-between border-b px-3 py-2 bg-gray-50">
      <div className="text-xs font-medium text-gray-700">Filters:</div>
      <Select 
        value={activeFilter} 
        onValueChange={onFilterChange}
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
  );
};

export default SearchFilters;


// Import data services
import { getTransactions } from './transactions';
import { getCategories } from './categories';
import { getInvoices } from './invoices';
import { format } from 'date-fns';

// Define search result type
export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'transaction' | 'category' | 'invoice';
  date?: string;
}

// Cache for search results
let searchCache: {
  query: string;
  results: SearchResult[];
  timestamp: number;
} | null = null;

// Clear search cache
export const clearSearchCache = () => {
  searchCache = null;
};

// Search all data
export const searchAll = async (query: string): Promise<SearchResult[]> => {
  if (!query) return [];
  
  // Check if we have a recent cache for this query
  if (searchCache && 
      searchCache.query === query && 
      (Date.now() - searchCache.timestamp) < 60000) { // Cache valid for 1 minute
    return searchCache.results;
  }
  
  const lowercaseQuery = query.toLowerCase();
  const results: SearchResult[] = [];
  
  // Search transactions
  const transactions = await getTransactions();
  const transactionResults = transactions
    .filter(
      (transaction) =>
        transaction.description.toLowerCase().includes(lowercaseQuery) ||
        transaction.amount.toString().includes(lowercaseQuery) ||
        (transaction.note && transaction.note.toLowerCase().includes(lowercaseQuery))
    )
    .map((transaction) => ({
      id: transaction.id,
      title: transaction.description,
      description: `${transaction.type === 'income' ? '+' : '-'}$${transaction.amount.toFixed(
        2
      )} • ${transaction.category?.name || 'Uncategorized'}`,
      type: 'transaction' as const,
      date: transaction.date.toISOString(),
    }));
  
  results.push(...transactionResults);
  
  // Search categories
  const categories = await getCategories();
  const categoryResults = categories
    .filter(
      (category) =>
        category.name.toLowerCase().includes(lowercaseQuery) ||
        (category.description && category.description.toLowerCase().includes(lowercaseQuery))
    )
    .map((category) => ({
      id: category.id,
      title: category.name,
      description: category.description || `${category.type} category`,
      type: 'category' as const,
    }));
  
  results.push(...categoryResults);
  
  // Search invoices
  const invoices = await getInvoices();
  const invoiceResults = invoices
    .filter(
      (invoice) =>
        invoice.invoiceNumber.toLowerCase().includes(lowercaseQuery) ||
        invoice.customerName.toLowerCase().includes(lowercaseQuery) ||
        invoice.total.toString().includes(lowercaseQuery) ||
        (invoice.notes && invoice.notes.toLowerCase().includes(lowercaseQuery))
    )
    .map((invoice) => ({
      id: invoice.id,
      title: `${invoice.invoiceNumber} - ${invoice.customerName}`,
      description: `$${invoice.total.toFixed(2)} • ${
        invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)
      }`,
      type: 'invoice' as const,
      date: invoice.issueDate.toISOString(),
    }));
  
  results.push(...invoiceResults);
  
  // Update cache
  searchCache = {
    query,
    results,
    timestamp: Date.now()
  };
  
  return results;
};

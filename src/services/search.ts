
import { getTransactions } from './transactions';
import { getCategories } from './categories';
import { getInvoices } from './invoices';

export type SearchResultType = 'transaction' | 'category' | 'invoice';

export interface SearchResult {
  id: string;
  title: string;
  description?: string;
  amount?: number;
  date?: Date;
  type: SearchResultType;
  relevance: number; // For better sorting
}

// Create a memoized results cache to improve performance on repeated searches
let cachedResults: { [key: string]: SearchResult[] } = {};
let lastSearch = '';

export const searchAll = (query: string): SearchResult[] => {
  if (!query || query.trim() === '') {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();
  
  // Check cache for exact match first for instant results
  if (cachedResults[normalizedQuery]) {
    return cachedResults[normalizedQuery];
  }
  
  // Check if this is just extending the previous search query (typing more letters)
  // If so, we can filter the previous results instead of searching everything again
  if (normalizedQuery.startsWith(lastSearch) && lastSearch.length > 0) {
    const filteredResults = cachedResults[lastSearch].filter(result => {
      const titleMatch = result.title.toLowerCase().includes(normalizedQuery);
      const descriptionMatch = result.description?.toLowerCase().includes(normalizedQuery);
      return titleMatch || descriptionMatch;
    });
    
    // Update cache and last search
    cachedResults[normalizedQuery] = filteredResults;
    lastSearch = normalizedQuery;
    
    return filteredResults;
  }
  
  // Full search when needed
  const queryTerms = normalizedQuery.split(/\s+/);
  const results: SearchResult[] = [];

  // Search transactions
  const transactions = getTransactions();
  transactions.forEach(transaction => {
    let relevance = 0;
    const descriptionMatch = transaction.description?.toLowerCase().includes(normalizedQuery);
    const noteMatch = transaction.note?.toLowerCase().includes(normalizedQuery);
    
    // Calculate relevance score
    if (descriptionMatch) relevance += 10;
    if (noteMatch) relevance += 5;
    
    // Check for individual term matches
    queryTerms.forEach(term => {
      if (transaction.description?.toLowerCase().includes(term)) relevance += 3;
      if (transaction.note?.toLowerCase().includes(term)) relevance += 2;
    });
    
    if (relevance > 0) {
      results.push({
        id: transaction.id,
        title: transaction.description || 'Unnamed Transaction',
        description: `${transaction.type === 'income' ? 'Income' : 'Expense'} - ${transaction.amount.toFixed(2)}`,
        amount: transaction.amount,
        date: transaction.date,
        type: 'transaction',
        relevance
      });
    }
  });

  // Search categories
  const categories = getCategories();
  categories.forEach(category => {
    let relevance = 0;
    const nameMatch = category.name.toLowerCase().includes(normalizedQuery);
    const descriptionMatch = category.description?.toLowerCase().includes(normalizedQuery);
    
    // Calculate relevance score
    if (nameMatch) relevance += 12;
    if (descriptionMatch) relevance += 6;
    
    // Check for individual term matches
    queryTerms.forEach(term => {
      if (category.name.toLowerCase().includes(term)) relevance += 4;
      if (category.description?.toLowerCase().includes(term)) relevance += 2;
    });
    
    if (relevance > 0) {
      results.push({
        id: category.id,
        title: category.name,
        description: category.description || 'No description',
        type: 'category',
        relevance
      });
    }
  });

  // Search invoices
  const invoices = getInvoices();
  invoices.forEach(invoice => {
    let relevance = 0;
    const numberMatch = invoice.invoiceNumber.toLowerCase().includes(normalizedQuery);
    const customerNameMatch = invoice.customerName.toLowerCase().includes(normalizedQuery);
    const customerEmailMatch = invoice.customerEmail.toLowerCase().includes(normalizedQuery);
    
    // Calculate relevance score
    if (numberMatch) relevance += 15;
    if (customerNameMatch) relevance += 10;
    if (customerEmailMatch) relevance += 8;
    
    // Check for individual term matches
    queryTerms.forEach(term => {
      if (invoice.invoiceNumber.toLowerCase().includes(term)) relevance += 5;
      if (invoice.customerName.toLowerCase().includes(term)) relevance += 3;
      if (invoice.customerEmail.toLowerCase().includes(term)) relevance += 2;
    });
    
    if (relevance > 0) {
      results.push({
        id: invoice.id,
        title: `Invoice #${invoice.invoiceNumber}`,
        description: `${invoice.customerName} - ${invoice.total.toFixed(2)}`,
        amount: invoice.total,
        date: invoice.issueDate,
        type: 'invoice',
        relevance
      });
    }
  });

  // Sort results by relevance (highest first)
  results.sort((a, b) => b.relevance - a.relevance);
  
  // Update cache and last search term
  cachedResults[normalizedQuery] = results.slice(0, 10); // Limit to 10 results
  lastSearch = normalizedQuery;
  
  return results.slice(0, 10); // Limit to 10 results
};

// Function to clear the cache if needed (e.g., after data changes)
export const clearSearchCache = () => {
  cachedResults = {};
  lastSearch = '';
};

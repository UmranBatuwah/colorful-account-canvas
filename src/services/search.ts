
import { supabase } from '@/integrations/supabase/client';
import { Transaction, Category, Invoice } from '@/types';
import { getTransactions } from './transactions';
import { getCategories } from './categories';
import { getInvoices } from './invoices';

export interface SearchResult {
  id: string;
  title: string;
  description: string;
  type: 'transaction' | 'category' | 'invoice';
  date?: Date;
  amount?: number;
}

let cachedResults: {
  transactions: Transaction[];
  categories: Category[];
  invoices: Invoice[];
} | null = null;

// Clear search cache when data changes
export const clearSearchCache = () => {
  cachedResults = null;
};

// Helper function to load all searchable data
const loadSearchData = async () => {
  if (cachedResults) {
    return cachedResults;
  }

  try {
    // Try to get user session
    const { data: { session } } = await supabase.auth.getSession();
    
    // Get data through service functions
    // These functions already have Supabase implementation with local storage fallback
    const [transactions, categories, invoices] = await Promise.all([
      getTransactions(),
      getCategories(),
      getInvoices()
    ]);
    
    cachedResults = {
      transactions,
      categories, 
      invoices
    };
    
    return cachedResults;
  } catch (error) {
    console.error('Error loading search data:', error);
    // Fall back to local storage sources
    const transactions = await getTransactions();
    const categories = await getCategories();
    const invoices = await getInvoices();
    
    cachedResults = {
      transactions,
      categories,
      invoices
    };
    
    return cachedResults;
  }
};

export const searchAll = async (query: string): Promise<SearchResult[]> => {
  if (!query) return [];
  
  const lowerCaseQuery = query.toLowerCase();
  const data = await loadSearchData();
  
  const results: SearchResult[] = [];
  
  // Search transactions
  data.transactions.forEach(transaction => {
    if (
      transaction.description.toLowerCase().includes(lowerCaseQuery) ||
      (transaction.note && transaction.note.toLowerCase().includes(lowerCaseQuery)) ||
      (transaction.category && transaction.category.name.toLowerCase().includes(lowerCaseQuery))
    ) {
      results.push({
        id: transaction.id,
        title: transaction.description,
        description: transaction.category 
          ? `${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)} - ${transaction.category.name}`
          : `${transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}`,
        type: 'transaction',
        date: new Date(transaction.date),
        amount: transaction.amount,
      });
    }
  });
  
  // Search categories
  data.categories.forEach(category => {
    if (
      category.name.toLowerCase().includes(lowerCaseQuery) ||
      (category.description && category.description.toLowerCase().includes(lowerCaseQuery))
    ) {
      results.push({
        id: category.id,
        title: category.name,
        description: `${category.type.charAt(0).toUpperCase() + category.type.slice(1)} Category${category.description ? ` - ${category.description}` : ''}`,
        type: 'category',
      });
    }
  });
  
  // Search invoices
  data.invoices.forEach(invoice => {
    if (
      invoice.invoiceNumber.toLowerCase().includes(lowerCaseQuery) ||
      invoice.customerName.toLowerCase().includes(lowerCaseQuery) ||
      invoice.customerEmail.toLowerCase().includes(lowerCaseQuery) ||
      (invoice.notes && invoice.notes.toLowerCase().includes(lowerCaseQuery))
    ) {
      results.push({
        id: invoice.id,
        title: `${invoice.invoiceNumber} - ${invoice.customerName}`,
        description: `${invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)} Invoice - $${invoice.total.toFixed(2)}`,
        type: 'invoice',
        date: new Date(invoice.issueDate),
        amount: invoice.total,
      });
    }
  });
  
  return results;
};

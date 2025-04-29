
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
}

export const searchAll = (query: string): SearchResult[] => {
  if (!query || query.trim() === '') {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  // Search transactions
  const transactions = getTransactions();
  const matchingTransactions = transactions.filter(
    transaction => 
      transaction.description?.toLowerCase().includes(normalizedQuery) ||
      transaction.note?.toLowerCase().includes(normalizedQuery)
  );

  matchingTransactions.forEach(transaction => {
    results.push({
      id: transaction.id,
      title: transaction.description || 'Unnamed Transaction',
      description: `${transaction.type === 'income' ? 'Income' : 'Expense'} - ${transaction.amount.toFixed(2)}`,
      amount: transaction.amount,
      date: transaction.date,
      type: 'transaction'
    });
  });

  // Search categories
  const categories = getCategories();
  const matchingCategories = categories.filter(
    category => 
      category.name.toLowerCase().includes(normalizedQuery) ||
      category.description?.toLowerCase().includes(normalizedQuery)
  );

  matchingCategories.forEach(category => {
    results.push({
      id: category.id,
      title: category.name,
      description: category.description || 'No description',
      type: 'category'
    });
  });

  // Search invoices
  const invoices = getInvoices();
  const matchingInvoices = invoices.filter(
    invoice => 
      invoice.invoiceNumber.toLowerCase().includes(normalizedQuery) ||
      invoice.customerName.toLowerCase().includes(normalizedQuery) ||
      invoice.customerEmail.toLowerCase().includes(normalizedQuery)
  );

  matchingInvoices.forEach(invoice => {
    results.push({
      id: invoice.id,
      title: `Invoice #${invoice.invoiceNumber}`,
      description: `${invoice.customerName} - ${invoice.total.toFixed(2)}`,
      amount: invoice.total,
      date: invoice.issueDate,
      type: 'invoice'
    });
  });

  // Sort results by relevance (you can adjust this logic)
  return results.slice(0, 10); // Limit to 10 results
};


import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Transaction } from '@/types';

export function useTransactionFilters(transactions: Transaction[]) {
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const location = useLocation();

  // Apply filters when dependencies change
  useEffect(() => {
    let filtered = [...transactions];
    
    // Filter by search query
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (transaction) =>
          transaction.description.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    // Filter by transaction type
    if (filterType !== 'all') {
      filtered = filtered.filter((transaction) => transaction.type === filterType);
    }
    
    // Sort by date (newest first)
    filtered = filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    setFilteredTransactions(filtered);
  }, [transactions, searchQuery, filterType]);

  // Check for highlighted transaction ID from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const highlightId = searchParams.get('id');
    
    if (highlightId) {
      // If there's an ID in the URL, ensure that transaction is visible
      const transaction = transactions.find(t => t.id === highlightId);
      if (transaction) {
        // Auto-select the transaction type filter if needed
        if (filterType !== 'all' && transaction.type !== filterType) {
          setFilterType(transaction.type);
        }
      }
    }
  }, [location.search, transactions, filterType]);

  // Function to check if a transaction should be highlighted
  const shouldHighlight = (transaction: Transaction) => {
    const searchParams = new URLSearchParams(location.search);
    const highlightId = searchParams.get('id');
    return highlightId === transaction.id;
  };

  return {
    filteredTransactions,
    searchQuery,
    setSearchQuery,
    filterType,
    setFilterType,
    shouldHighlight
  };
}

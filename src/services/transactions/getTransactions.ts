
import { Transaction, TransactionType } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { getLocalStorageData } from '../mockData';
import { mapTransactionData } from './utils';

export const getTransactions = async (): Promise<Transaction[]> => {
  try {
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select(`
        *,
        categories:category_id (
          id,
          name,
          color,
          type,
          description
        )
      `)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching transactions:', error);
      // Fall back to local storage
      const { transactions } = getLocalStorageData();
      return transactions;
    }

    return transactions.map(transaction => mapTransactionData(transaction));
  } catch (error) {
    console.error('Error in getTransactions:', error);
    // Fall back to local storage
    const { transactions } = getLocalStorageData();
    return transactions;
  }
};

export const getTransactionById = async (id: string): Promise<Transaction | undefined> => {
  try {
    const { data: transaction, error } = await supabase
      .from('transactions')
      .select(`
        *,
        categories:category_id (
          id,
          name,
          color,
          type,
          description
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching transaction by ID:', error);
      // Fall back to local storage
      const { transactions } = getLocalStorageData();
      return transactions.find(transaction => transaction.id === id);
    }

    if (!transaction) return undefined;

    return mapTransactionData(transaction);
  } catch (error) {
    console.error('Error in getTransactionById:', error);
    // Fall back to local storage
    const { transactions } = getLocalStorageData();
    return transactions.find(transaction => transaction.id === id);
  }
};

export const getTransactionsByType = async (type: 'income' | 'expense'): Promise<Transaction[]> => {
  try {
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select(`
        *,
        categories:category_id (
          id,
          name,
          color,
          type,
          description
        )
      `)
      .eq('type', type)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching transactions by type:', error);
      // Fall back to local storage
      const { transactions } = getLocalStorageData();
      return transactions.filter(transaction => transaction.type === type);
    }

    return transactions.map(transaction => mapTransactionData(transaction));
  } catch (error) {
    console.error('Error in getTransactionsByType:', error);
    // Fall back to local storage
    const { transactions } = getLocalStorageData();
    return transactions.filter(transaction => transaction.type === type);
  }
};

export const getTransactionsByCategory = async (categoryId: string): Promise<Transaction[]> => {
  try {
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select(`
        *,
        categories:category_id (
          id,
          name,
          color,
          type,
          description
        )
      `)
      .eq('category_id', categoryId)
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching transactions by category:', error);
      // Fall back to local storage
      const { transactions } = getLocalStorageData();
      return transactions.filter(transaction => transaction.categoryId === categoryId);
    }

    return transactions.map(transaction => mapTransactionData(transaction));
  } catch (error) {
    console.error('Error in getTransactionsByCategory:', error);
    // Fall back to local storage
    const { transactions } = getLocalStorageData();
    return transactions.filter(transaction => transaction.categoryId === categoryId);
  }
};

export const getTransactionsByDateRange = async (startDate: Date, endDate: Date): Promise<Transaction[]> => {
  try {
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select(`
        *,
        categories:category_id (
          id,
          name,
          color,
          type,
          description
        )
      `)
      .gte('date', startDate.toISOString())
      .lte('date', endDate.toISOString())
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching transactions by date range:', error);
      // Fall back to local storage
      const { transactions } = getLocalStorageData();
      return transactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate >= startDate && transactionDate <= endDate;
      });
    }

    return transactions.map(transaction => mapTransactionData(transaction));
  } catch (error) {
    console.error('Error in getTransactionsByDateRange:', error);
    // Fall back to local storage
    const { transactions } = getLocalStorageData();
    return transactions.filter(transaction => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= startDate && transactionDate <= endDate;
    });
  }
};

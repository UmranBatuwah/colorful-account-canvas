
import { Transaction } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { getLocalStorageData, saveTransactionsToLocalStorage } from './mockData';

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

    return transactions.map(transaction => ({
      ...transaction,
      id: transaction.id,
      categoryId: transaction.category_id,
      date: new Date(transaction.date),
      createdAt: new Date(transaction.created_at),
      updatedAt: new Date(transaction.updated_at),
      category: transaction.categories ? {
        id: transaction.categories.id,
        name: transaction.categories.name,
        color: transaction.categories.color,
        type: transaction.categories.type,
        description: transaction.categories.description,
        createdAt: new Date()
      } : undefined
    }));
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

    return {
      ...transaction,
      categoryId: transaction.category_id,
      date: new Date(transaction.date),
      createdAt: new Date(transaction.created_at),
      updatedAt: new Date(transaction.updated_at),
      category: transaction.categories ? {
        id: transaction.categories.id,
        name: transaction.categories.name,
        color: transaction.categories.color,
        type: transaction.categories.type,
        description: transaction.categories.description,
        createdAt: new Date()
      } : undefined
    };
  } catch (error) {
    console.error('Error in getTransactionById:', error);
    // Fall back to local storage
    const { transactions } = getLocalStorageData();
    return transactions.find(transaction => transaction.id === id);
  }
};

export const createTransaction = async (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Promise<Transaction> => {
  try {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User not authenticated');
    }

    const newTransaction = {
      description: transaction.description,
      amount: transaction.amount,
      date: transaction.date,
      type: transaction.type,
      category_id: transaction.categoryId,
      note: transaction.note,
      user_id: user.id
    };
    
    const { data, error } = await supabase
      .from('transactions')
      .insert([newTransaction])
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
      .single();
    
    if (error) {
      console.error('Error creating transaction:', error);
      // Fall back to local storage
      const { transactions } = getLocalStorageData();
      
      const localNewTransaction: Transaction = {
        ...transaction,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      const updatedTransactions = [...transactions, localNewTransaction];
      saveTransactionsToLocalStorage(updatedTransactions);
      
      return localNewTransaction;
    }

    return {
      ...data,
      id: data.id,
      categoryId: data.category_id,
      date: new Date(data.date),
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      category: data.categories ? {
        id: data.categories.id,
        name: data.categories.name,
        color: data.categories.color,
        type: data.categories.type,
        description: data.categories.description,
        createdAt: new Date()
      } : undefined
    };
  } catch (error) {
    console.error('Error in createTransaction:', error);
    // Fall back to local storage
    const { transactions } = getLocalStorageData();
    
    const localNewTransaction: Transaction = {
      ...transaction,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    const updatedTransactions = [...transactions, localNewTransaction];
    saveTransactionsToLocalStorage(updatedTransactions);
    
    return localNewTransaction;
  }
};

export const updateTransaction = async (id: string, transaction: Partial<Transaction>): Promise<Transaction> => {
  try {
    // Map to the database column names and remove properties that should not be updated directly
    const { id: _, createdAt: __, updatedAt: ___, category: ____, categoryId, ...rest } = transaction;
    
    const updateData = {
      ...rest,
      category_id: categoryId
    };
    
    const { data, error } = await supabase
      .from('transactions')
      .update(updateData)
      .eq('id', id)
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
      .single();
    
    if (error) {
      console.error('Error updating transaction:', error);
      // Fall back to local storage
      const { transactions } = getLocalStorageData();
      
      const index = transactions.findIndex(t => t.id === id);
      if (index === -1) {
        throw new Error(`Transaction with id ${id} not found`);
      }
      
      const updatedTransaction = {
        ...transactions[index],
        ...transaction,
        updatedAt: new Date(),
      };
      
      const updatedTransactions = [...transactions];
      updatedTransactions[index] = updatedTransaction;
      
      saveTransactionsToLocalStorage(updatedTransactions);
      
      return updatedTransaction;
    }

    return {
      ...data,
      id: data.id,
      categoryId: data.category_id,
      date: new Date(data.date),
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
      category: data.categories ? {
        id: data.categories.id,
        name: data.categories.name,
        color: data.categories.color,
        type: data.categories.type,
        description: data.categories.description,
        createdAt: new Date()
      } : undefined
    };
  } catch (error) {
    console.error('Error in updateTransaction:', error);
    // Fall back to local storage
    const { transactions } = getLocalStorageData();
    
    const index = transactions.findIndex(t => t.id === id);
    if (index === -1) {
      throw new Error(`Transaction with id ${id} not found`);
    }
    
    const updatedTransaction = {
      ...transactions[index],
      ...transaction,
      updatedAt: new Date(),
    };
    
    const updatedTransactions = [...transactions];
    updatedTransactions[index] = updatedTransaction;
    
    saveTransactionsToLocalStorage(updatedTransactions);
    
    return updatedTransaction;
  }
};

export const deleteTransaction = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Error deleting transaction:', error);
      // Fall back to local storage
      const { transactions } = getLocalStorageData();
      
      const filteredTransactions = transactions.filter(t => t.id !== id);
      saveTransactionsToLocalStorage(filteredTransactions);
    }
  } catch (error) {
    console.error('Error in deleteTransaction:', error);
    // Fall back to local storage
    const { transactions } = getLocalStorageData();
    
    const filteredTransactions = transactions.filter(t => t.id !== id);
    saveTransactionsToLocalStorage(filteredTransactions);
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

    return transactions.map(transaction => ({
      ...transaction,
      id: transaction.id,
      categoryId: transaction.category_id,
      date: new Date(transaction.date),
      createdAt: new Date(transaction.created_at),
      updatedAt: new Date(transaction.updated_at),
      category: transaction.categories ? {
        id: transaction.categories.id,
        name: transaction.categories.name,
        color: transaction.categories.color,
        type: transaction.categories.type,
        description: transaction.categories.description,
        createdAt: new Date()
      } : undefined
    }));
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

    return transactions.map(transaction => ({
      ...transaction,
      id: transaction.id,
      categoryId: transaction.category_id,
      date: new Date(transaction.date),
      createdAt: new Date(transaction.created_at),
      updatedAt: new Date(transaction.updated_at),
      category: transaction.categories ? {
        id: transaction.categories.id,
        name: transaction.categories.name,
        color: transaction.categories.color,
        type: transaction.categories.type,
        description: transaction.categories.description,
        createdAt: new Date()
      } : undefined
    }));
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

    return transactions.map(transaction => ({
      ...transaction,
      id: transaction.id,
      categoryId: transaction.category_id,
      date: new Date(transaction.date),
      createdAt: new Date(transaction.created_at),
      updatedAt: new Date(transaction.updated_at),
      category: transaction.categories ? {
        id: transaction.categories.id,
        name: transaction.categories.name,
        color: transaction.categories.color,
        type: transaction.categories.type,
        description: transaction.categories.description,
        createdAt: new Date()
      } : undefined
    }));
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

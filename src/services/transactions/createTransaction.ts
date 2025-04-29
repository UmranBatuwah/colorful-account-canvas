
import { Transaction, TransactionType } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { getLocalStorageData, saveTransactionsToLocalStorage } from '../mockData';
import { mapTransactionData } from './utils';

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
      date: transaction.date.toISOString(), // Convert Date to string for Supabase
      type: transaction.type,
      category_id: transaction.categoryId,
      note: transaction.note || '',  // Include note field with default value
      created_by: user.id // Use created_by instead of user_id
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

    return mapTransactionData(data);
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

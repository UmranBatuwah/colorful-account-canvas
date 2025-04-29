
import { Transaction } from '@/types';
import { supabase } from '@/integrations/supabase/client';
import { getLocalStorageData, saveTransactionsToLocalStorage } from '../mockData';
import { mapTransactionData } from './utils';

export const updateTransaction = async (id: string, transaction: Partial<Transaction>): Promise<Transaction> => {
  try {
    // Map to the database column names and remove properties that should not be updated directly
    const { id: _, createdAt: __, updatedAt: ___, category: ____, categoryId, ...rest } = transaction;
    
    // Create an object with the correct types for Supabase
    const updateData: any = {
      ...rest
    };
    
    // Handle special cases
    if (categoryId) updateData.category_id = categoryId;
    if (transaction.date) updateData.date = transaction.date.toISOString();
    
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

    return mapTransactionData(data);
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

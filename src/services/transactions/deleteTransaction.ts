
import { supabase } from '@/integrations/supabase/client';
import { getLocalStorageData, saveTransactionsToLocalStorage } from '../mockData';

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

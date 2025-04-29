
import { Transaction, TransactionType } from '@/types';

// Helper function to map Supabase transaction data to our Transaction type
export const mapTransactionData = (transaction: any): Transaction => {
  // Cast type to TransactionType to ensure it matches our defined types
  const transactionType = transaction.type as TransactionType;
  
  return {
    id: transaction.id,
    description: transaction.description || '',
    amount: Number(transaction.amount),
    date: new Date(transaction.date),
    type: transactionType,
    categoryId: transaction.category_id,
    note: transaction.note || '',
    createdAt: new Date(transaction.created_at),
    updatedAt: new Date(transaction.updated_at),
    category: transaction.categories ? {
      id: transaction.categories.id,
      name: transaction.categories.name,
      color: transaction.categories.color,
      type: transaction.categories.type as TransactionType,
      description: transaction.categories.description,
      createdAt: new Date()
    } : undefined
  };
};

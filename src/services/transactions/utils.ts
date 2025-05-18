
import { Transaction } from '@/types';

// Map Supabase response to our application's Transaction type
export const mapTransactionData = (data: any): Transaction => {
  return {
    id: data.id,
    description: data.description || '',
    amount: Number(data.amount),
    date: new Date(data.date),
    type: data.type,
    categoryId: data.category_id || '',
    category: data.categories ? {
      id: data.categories.id,
      name: data.categories.name,
      description: data.categories.description,
      color: data.categories.color,
      type: data.categories.type,
      createdAt: new Date(data.categories.created_at)
    } : undefined,
    note: data.note || '',
    createdAt: new Date(data.created_at),
    updatedAt: new Date(data.updated_at)
  };
};

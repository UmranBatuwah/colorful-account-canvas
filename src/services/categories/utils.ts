
import { Category } from '@/types';
import { getLocalStorageData } from '../mockData';

// Helper function to transform database category to application category
export const transformCategory = (category: any): Category => {
  return {
    id: category.id,
    name: category.name,
    description: category.description || undefined,
    color: category.color || '#3B82F6',
    type: category.type as 'income' | 'expense', // Cast to TransactionType
    createdAt: new Date(category.created_at),
  };
};

// Helper function to fall back to local storage
export const getLocalStorageCategories = (): Category[] => {
  const { categories } = getLocalStorageData();
  return categories;
};

// Helper function to find a category by ID in local storage
export const getLocalStorageCategoryById = (id: string): Category | undefined => {
  const { categories } = getLocalStorageData();
  return categories.find(category => category.id === id);
};

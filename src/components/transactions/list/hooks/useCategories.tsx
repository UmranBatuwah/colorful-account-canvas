
import { useState, useEffect } from 'react';
import { getCategories } from '@/services/categories';

export function useCategories() {
  const [categories, setCategories] = useState<any[]>([]);

  // Load all categories
  useEffect(() => {
    const loadCategories = async () => {
      const allCategories = await getCategories();
      setCategories(allCategories);
    };
    
    loadCategories();
  }, []);

  return { categories };
}

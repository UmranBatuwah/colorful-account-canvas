import { Transaction, Category, FinancialSummary, MonthlyData } from '@/types';

// Empty mock data for initialization
export const mockCategories: Category[] = [];
export const mockTransactions: Transaction[] = [];

// Empty monthly data for charts
export const mockMonthlyData: MonthlyData[] = [
  { month: 'Jan', income: 0, expense: 0 },
  { month: 'Feb', income: 0, expense: 0 },
  { month: 'Mar', income: 0, expense: 0 },
  { month: 'Apr', income: 0, expense: 0 },
  { month: 'May', income: 0, expense: 0 },
  { month: 'Jun', income: 0, expense: 0 },
];

// Local storage helpers
const LOCAL_STORAGE_KEYS = {
  TRANSACTIONS: 'account_tracker_transactions',
  CATEGORIES: 'account_tracker_categories',
};

// Initialize local storage with empty arrays
export const initializeLocalStorage = () => {
  // Clear existing data instead of initializing with defaults
  localStorage.setItem(LOCAL_STORAGE_KEYS.TRANSACTIONS, JSON.stringify([]));
  localStorage.setItem(LOCAL_STORAGE_KEYS.CATEGORIES, JSON.stringify([]));
};

// Get all data from local storage
export const getLocalStorageData = () => {
  const transactions = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.TRANSACTIONS) || '[]');
  const categories = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.CATEGORIES) || '[]');
  
  return {
    transactions,
    categories,
  };
};

// Save data to local storage
export const saveTransactionsToLocalStorage = (transactions: Transaction[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
};

export const saveCategoriesToLocalStorage = (categories: Category[]) => {
  localStorage.setItem(LOCAL_STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
};

// Calculate financial summary from transactions and categories
export const calculateFinancialSummary = (transactions: Transaction[], categories: Category[]): FinancialSummary => {
  const totalIncome = transactions
    .filter(transaction => transaction.type === 'income')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  
  const totalExpense = transactions
    .filter(transaction => transaction.type === 'expense')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  
  const balance = totalIncome - totalExpense;
  
  // Sort transactions by date (newest first)
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  // Get recent transactions (last 5)
  const recentTransactions = sortedTransactions.slice(0, 5).map(transaction => {
    return {
      ...transaction,
      category: categories.find(cat => cat.id === transaction.categoryId)
    };
  });
  
  // Calculate income by category
  const incomeByCategory = categories
    .filter(category => category.type === 'income')
    .map(category => {
      const amount = transactions
        .filter(transaction => transaction.categoryId === category.id && transaction.type === 'income')
        .reduce((sum, transaction) => sum + transaction.amount, 0);
      
      return {
        categoryId: category.id,
        categoryName: category.name,
        amount,
        color: category.color,
      };
    })
    .filter(item => item.amount > 0);
  
  // Calculate expenses by category
  const expenseByCategory = categories
    .filter(category => category.type === 'expense')
    .map(category => {
      const amount = transactions
        .filter(transaction => transaction.categoryId === category.id && transaction.type === 'expense')
        .reduce((sum, transaction) => sum + transaction.amount, 0);
      
      return {
        categoryId: category.id,
        categoryName: category.name,
        amount,
        color: category.color,
      };
    })
    .filter(item => item.amount > 0);
  
  return {
    totalIncome,
    totalExpense,
    balance,
    recentTransactions,
    incomeByCategory,
    expenseByCategory,
  };
};

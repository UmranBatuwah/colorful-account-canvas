
import { Transaction, Category, FinancialSummary, MonthlyData } from '@/types';

// Mock Categories
export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Salary',
    description: 'Monthly salary',
    color: '#4CAF50', // Green
    type: 'income',
    createdAt: new Date('2023-01-01'),
  },
  {
    id: '2',
    name: 'Freelance',
    description: 'Freelance projects',
    color: '#2196F3', // Blue
    type: 'income',
    createdAt: new Date('2023-01-02'),
  },
  {
    id: '3',
    name: 'Investments',
    description: 'Investment returns',
    color: '#9C27B0', // Purple
    type: 'income',
    createdAt: new Date('2023-01-03'),
  },
  {
    id: '4',
    name: 'Rent',
    description: 'Monthly rent',
    color: '#F44336', // Red
    type: 'expense',
    createdAt: new Date('2023-01-04'),
  },
  {
    id: '5',
    name: 'Groceries',
    description: 'Food and groceries',
    color: '#FF9800', // Orange
    type: 'expense',
    createdAt: new Date('2023-01-05'),
  },
  {
    id: '6',
    name: 'Utilities',
    description: 'Electricity, water, etc.',
    color: '#795548', // Brown
    type: 'expense',
    createdAt: new Date('2023-01-06'),
  },
  {
    id: '7',
    name: 'Entertainment',
    description: 'Movies, games, etc.',
    color: '#E91E63', // Pink
    type: 'expense',
    createdAt: new Date('2023-01-07'),
  }
];

// Mock Transactions
export const mockTransactions: Transaction[] = [
  {
    id: '1',
    description: 'Monthly salary',
    amount: 5000,
    date: new Date('2023-04-01'),
    type: 'income',
    categoryId: '1',
    createdAt: new Date('2023-04-01'),
    updatedAt: new Date('2023-04-01'),
  },
  {
    id: '2',
    description: 'Website project',
    amount: 2000,
    date: new Date('2023-04-05'),
    type: 'income',
    categoryId: '2',
    createdAt: new Date('2023-04-05'),
    updatedAt: new Date('2023-04-05'),
  },
  {
    id: '3',
    description: 'Dividend payment',
    amount: 500,
    date: new Date('2023-04-10'),
    type: 'income',
    categoryId: '3',
    createdAt: new Date('2023-04-10'),
    updatedAt: new Date('2023-04-10'),
  },
  {
    id: '4',
    description: 'Apartment rent',
    amount: 1500,
    date: new Date('2023-04-02'),
    type: 'expense',
    categoryId: '4',
    createdAt: new Date('2023-04-02'),
    updatedAt: new Date('2023-04-02'),
  },
  {
    id: '5',
    description: 'Supermarket',
    amount: 200,
    date: new Date('2023-04-07'),
    type: 'expense',
    categoryId: '5',
    createdAt: new Date('2023-04-07'),
    updatedAt: new Date('2023-04-07'),
  },
  {
    id: '6',
    description: 'Electricity bill',
    amount: 100,
    date: new Date('2023-04-15'),
    type: 'expense',
    categoryId: '6',
    createdAt: new Date('2023-04-15'),
    updatedAt: new Date('2023-04-15'),
  },
  {
    id: '7',
    description: 'Movie tickets',
    amount: 50,
    date: new Date('2023-04-20'),
    type: 'expense',
    categoryId: '7',
    createdAt: new Date('2023-04-20'),
    updatedAt: new Date('2023-04-20'),
  },
];

// Mock Financial Summary
export const mockFinancialSummary: FinancialSummary = {
  totalIncome: 7500,
  totalExpense: 1850,
  balance: 5650,
  recentTransactions: mockTransactions.slice(0, 5),
  incomeByCategory: [
    { categoryId: '1', categoryName: 'Salary', amount: 5000, color: '#4CAF50' },
    { categoryId: '2', categoryName: 'Freelance', amount: 2000, color: '#2196F3' },
    { categoryId: '3', categoryName: 'Investments', amount: 500, color: '#9C27B0' },
  ],
  expenseByCategory: [
    { categoryId: '4', categoryName: 'Rent', amount: 1500, color: '#F44336' },
    { categoryId: '5', categoryName: 'Groceries', amount: 200, color: '#FF9800' },
    { categoryId: '6', categoryName: 'Utilities', amount: 100, color: '#795548' },
    { categoryId: '7', categoryName: 'Entertainment', amount: 50, color: '#E91E63' },
  ],
};

// Mock Monthly Data for Charts
export const mockMonthlyData: MonthlyData[] = [
  { month: 'Jan', income: 6000, expense: 2000 },
  { month: 'Feb', income: 7000, expense: 1800 },
  { month: 'Mar', income: 6500, expense: 1900 },
  { month: 'Apr', income: 7500, expense: 1850 },
  { month: 'May', income: 8000, expense: 2200 },
  { month: 'Jun', income: 7800, expense: 2100 },
];

// Local storage helpers
const LOCAL_STORAGE_KEYS = {
  TRANSACTIONS: 'account_tracker_transactions',
  CATEGORIES: 'account_tracker_categories',
};

// Initialize local storage with mock data if empty
export const initializeLocalStorage = () => {
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.TRANSACTIONS)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.TRANSACTIONS, JSON.stringify(mockTransactions));
  }
  
  if (!localStorage.getItem(LOCAL_STORAGE_KEYS.CATEGORIES)) {
    localStorage.setItem(LOCAL_STORAGE_KEYS.CATEGORIES, JSON.stringify(mockCategories));
  }
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

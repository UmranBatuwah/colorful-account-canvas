
export type TransactionType = 'income' | 'expense';

export interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  type: TransactionType;
  createdAt: Date;
}

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  date: Date;
  type: TransactionType;
  categoryId: string;
  category?: Category;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
  recentTransactions: Transaction[];
  incomeByCategory: {
    categoryId: string;
    categoryName: string;
    amount: number;
    color: string;
  }[];
  expenseByCategory: {
    categoryId: string;
    categoryName: string;
    amount: number;
    color: string;
  }[];
}

export interface MonthlyData {
  month: string;
  income: number;
  expense: number;
}

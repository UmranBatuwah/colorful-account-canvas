
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

export interface InvoiceStatus {
  value: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  label: string;
  color: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  issueDate: Date;
  dueDate: Date;
  items: InvoiceItem[];
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  total: number;
  notes?: string;
  status: InvoiceStatus['value'];
  createdAt: Date;
  updatedAt: Date;
}

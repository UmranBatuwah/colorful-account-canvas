
import { Transaction } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { getLocalStorageData, saveTransactionsToLocalStorage } from './mockData';

export const getTransactions = (): Transaction[] => {
  const { transactions } = getLocalStorageData();
  return transactions;
};

export const getTransactionById = (id: string): Transaction | undefined => {
  const { transactions } = getLocalStorageData();
  return transactions.find(transaction => transaction.id === id);
};

export const createTransaction = (transaction: Omit<Transaction, 'id' | 'createdAt' | 'updatedAt'>): Transaction => {
  const { transactions } = getLocalStorageData();
  
  const newTransaction: Transaction = {
    ...transaction,
    id: uuidv4(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  const updatedTransactions = [...transactions, newTransaction];
  saveTransactionsToLocalStorage(updatedTransactions);
  
  return newTransaction;
};

export const updateTransaction = (id: string, transaction: Partial<Transaction>): Transaction => {
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
};

export const deleteTransaction = (id: string): void => {
  const { transactions } = getLocalStorageData();
  
  const filteredTransactions = transactions.filter(t => t.id !== id);
  saveTransactionsToLocalStorage(filteredTransactions);
};

export const getTransactionsByType = (type: 'income' | 'expense'): Transaction[] => {
  const { transactions } = getLocalStorageData();
  return transactions.filter(transaction => transaction.type === type);
};

export const getTransactionsByCategory = (categoryId: string): Transaction[] => {
  const { transactions } = getLocalStorageData();
  return transactions.filter(transaction => transaction.categoryId === categoryId);
};

export const getTransactionsByDateRange = (startDate: Date, endDate: Date): Transaction[] => {
  const { transactions } = getLocalStorageData();
  return transactions.filter(transaction => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= startDate && transactionDate <= endDate;
  });
};

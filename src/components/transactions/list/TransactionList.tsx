
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Transaction } from '@/types';
import { getCategories } from '@/services/categories';
import TransactionTable from './TransactionTable';
import TransactionFilters from './TransactionFilters';
import EditTransactionDialog from './EditTransactionDialog';
import DeleteTransactionDialog from './DeleteTransactionDialog';

interface TransactionListProps {
  transactions: Transaction[];
  onEditTransaction: (id: string, data: Partial<Transaction>) => void;
  onDeleteTransaction: (id: string) => void;
}

const TransactionList = ({
  transactions,
  onEditTransaction,
  onDeleteTransaction,
}: TransactionListProps) => {
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const location = useLocation();

  // Load all categories
  useEffect(() => {
    const loadCategories = async () => {
      const allCategories = await getCategories();
      setCategories(allCategories);
    };
    
    loadCategories();
  }, []);

  // Check for highlighted transaction ID from URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const highlightId = searchParams.get('id');
    
    if (highlightId) {
      // If there's an ID in the URL, ensure that transaction is visible
      const transaction = transactions.find(t => t.id === highlightId);
      if (transaction) {
        // Auto-select the transaction type filter if needed
        if (filterType !== 'all' && transaction.type !== filterType) {
          setFilterType(transaction.type);
        }
      }
    }
  }, [location.search, transactions, filterType]);

  // Apply filters when dependencies change
  useEffect(() => {
    let filtered = [...transactions];
    
    // Filter by search query
    if (searchQuery) {
      const lowerCaseQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (transaction) =>
          transaction.description.toLowerCase().includes(lowerCaseQuery)
      );
    }
    
    // Filter by transaction type
    if (filterType !== 'all') {
      filtered = filtered.filter((transaction) => transaction.type === filterType);
    }
    
    // Sort by date (newest first)
    filtered = filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    setFilteredTransactions(filtered);
  }, [transactions, searchQuery, filterType]);

  const handleEdit = (transaction: Transaction) => {
    setCurrentTransaction(transaction);
    setIsEditing(true);
  };
  
  const handleDelete = (transaction: Transaction) => {
    setCurrentTransaction(transaction);
    setIsDeleting(true);
  };
  
  const handleEditSubmit = async (values: any) => {
    if (!currentTransaction) return;
    
    setIsSubmitting(true);
    try {
      await onEditTransaction(currentTransaction.id, values);
      setIsEditing(false);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleDeleteConfirm = async () => {
    if (!currentTransaction) return;
    
    setIsSubmitting(true);
    try {
      await onDeleteTransaction(currentTransaction.id);
      setIsDeleting(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to check if a transaction should be highlighted
  const shouldHighlight = (transaction: Transaction) => {
    const searchParams = new URLSearchParams(location.search);
    const highlightId = searchParams.get('id');
    return highlightId === transaction.id;
  };

  return (
    <div className="space-y-4">
      <TransactionFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterType={filterType}
        setFilterType={setFilterType}
      />
      
      <TransactionTable
        transactions={filteredTransactions}
        categories={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
        shouldHighlight={shouldHighlight}
      />
      
      {/* Edit Transaction Dialog */}
      <EditTransactionDialog
        isOpen={isEditing}
        transaction={currentTransaction}
        onSubmit={handleEditSubmit}
        onCancel={() => setIsEditing(false)}
        isSubmitting={isSubmitting}
      />
      
      {/* Delete Confirmation Dialog */}
      <DeleteTransactionDialog
        isOpen={isDeleting}
        onCancel={() => setIsDeleting(false)}
        onConfirm={handleDeleteConfirm}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default TransactionList;

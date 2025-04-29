
import { Transaction } from '@/types';
import TransactionTable from './TransactionTable';
import TransactionFilters from './TransactionFilters';
import EditTransactionDialog from './EditTransactionDialog';
import DeleteTransactionDialog from './DeleteTransactionDialog';
import { useTransactionFilters } from './hooks/useTransactionFilters';
import { useTransactionOperations } from './hooks/useTransactionOperations'; 
import { useCategories } from './hooks/useCategories';

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
  // Custom hooks for different concerns
  const { categories } = useCategories();
  
  const { 
    filteredTransactions, 
    searchQuery, 
    setSearchQuery, 
    filterType, 
    setFilterType,
    shouldHighlight 
  } = useTransactionFilters(transactions);
  
  const {
    isEditing,
    setIsEditing,
    isDeleting,
    setIsDeleting,
    currentTransaction,
    isSubmitting,
    handleEdit,
    handleDelete,
    handleEditSubmit,
    handleDeleteConfirm
  } = useTransactionOperations({ onEditTransaction, onDeleteTransaction });

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


import { useState } from 'react';
import { Transaction } from '@/types';

interface UseTransactionOperationsProps {
  onEditTransaction: (id: string, data: Partial<Transaction>) => void;
  onDeleteTransaction: (id: string) => void;
}

export function useTransactionOperations({
  onEditTransaction,
  onDeleteTransaction
}: UseTransactionOperationsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTransaction, setCurrentTransaction] = useState<Transaction | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
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

  return {
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
  };
}

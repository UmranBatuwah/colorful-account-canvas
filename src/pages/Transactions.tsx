
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Transaction } from '@/types';
import { 
  getTransactions, 
  createTransaction, 
  updateTransaction, 
  deleteTransaction 
} from '@/services/transactions';
import { getCategories } from '@/services/categories';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import TransactionList from '@/components/transactions/TransactionList';
import TransactionForm from '@/components/transactions/TransactionForm';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Plus } from 'lucide-react';

const Transactions = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState([]);
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Load transactions and categories
    const loadData = async () => {
      const fetchedTransactions = await getTransactions();
      const fetchedCategories = await getCategories();
      
      setTransactions(fetchedTransactions);
      setCategories(fetchedCategories);
    };
    
    loadData();
  }, []);
  
  const handleAddTransaction = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      const newTransaction = await createTransaction(data);
      
      setTransactions([...transactions, newTransaction]);
      
      toast({
        title: 'Transaction added',
        description: 'Your transaction has been added successfully',
      });
      
      setIsAddingTransaction(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to add transaction',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleEditTransaction = async (id: string, data: Partial<Transaction>) => {
    try {
      const updatedTransaction = await updateTransaction(id, data);
      
      setTransactions((prevTransactions) =>
        prevTransactions.map((t) =>
          t.id === id ? updatedTransaction : t
        )
      );
      
      toast({
        title: 'Transaction updated',
        description: 'Your transaction has been updated successfully',
      });
      
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update transaction',
        variant: 'destructive',
      });
      
      return false;
    }
  };
  
  const handleDeleteTransaction = async (id: string) => {
    try {
      await deleteTransaction(id);
      
      setTransactions((prevTransactions) =>
        prevTransactions.filter((t) => t.id !== id)
      );
      
      toast({
        title: 'Transaction deleted',
        description: 'Your transaction has been deleted successfully',
      });
      
      return true;
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete transaction',
        variant: 'destructive',
      });
      
      return false;
    }
  };

  return (
    <DashboardLayout title="Transactions">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Transactions</h2>
        <Button 
          onClick={() => setIsAddingTransaction(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
      </div>
      
      <TransactionList
        transactions={transactions}
        onEditTransaction={handleEditTransaction}
        onDeleteTransaction={handleDeleteTransaction}
      />
      
      {/* Add Transaction Dialog */}
      <Dialog open={isAddingTransaction} onOpenChange={setIsAddingTransaction}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Transaction</DialogTitle>
            <DialogDescription>
              Add a new transaction to your account.
            </DialogDescription>
          </DialogHeader>
          <TransactionForm
            onSubmit={handleAddTransaction}
            onCancel={() => setIsAddingTransaction(false)}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
};

export default Transactions;

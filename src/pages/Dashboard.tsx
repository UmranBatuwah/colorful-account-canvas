import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import DashboardStats from '@/components/dashboard/DashboardStats';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import TransactionChart from '@/components/dashboard/TransactionChart';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import TransactionForm from '@/components/transactions/TransactionForm';
import { Plus } from 'lucide-react';
import { Transaction, FinancialSummary, MonthlyData } from '@/types';
import { getTransactions, createTransaction } from '@/services/transactions';
import { getCategories } from '@/services/categories';
import { calculateFinancialSummary, mockMonthlyData, initializeLocalStorage } from '@/services/mockData';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState([]);
  const [summary, setSummary] = useState<FinancialSummary | null>(null);
  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Clear existing data and start fresh
    initializeLocalStorage();
    
    // Load transactions and categories
    const loadData = async () => {
      const fetchedTransactions = await getTransactions();
      const fetchedCategories = await getCategories();
      
      setTransactions(fetchedTransactions);
      setCategories(fetchedCategories);
      
      // Calculate financial summary
      const financialSummary = calculateFinancialSummary(
        fetchedTransactions,
        fetchedCategories
      );
      
      setSummary(financialSummary);
    };
    
    loadData();
  }, []);
  
  const handleAddTransaction = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      const newTransaction = await createTransaction(data);
      
      setTransactions([...transactions, newTransaction]);
      
      // Update financial summary
      const financialSummary = calculateFinancialSummary(
        [...transactions, newTransaction],
        categories
      );
      
      setSummary(financialSummary);
      
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

  return (
    <DashboardLayout title="Dashboard">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Financial Overview</h2>
        <Button 
          onClick={() => setIsAddingTransaction(true)}
          className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Transaction
        </Button>
      </div>
      
      {summary && <DashboardStats summary={summary} />}
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6">
        <div className="w-full overflow-x-auto">
          <TransactionChart data={mockMonthlyData} />
        </div>
        <div className="w-full">
          {summary && <RecentTransactions transactions={summary.recentTransactions} />}
        </div>
      </div>
      
      {/* Add Transaction Dialog */}
      <Dialog open={isAddingTransaction} onOpenChange={setIsAddingTransaction}>
        <DialogContent className="sm:max-w-[600px] w-[95vw] max-h-[90vh] overflow-y-auto">
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

export default Dashboard;

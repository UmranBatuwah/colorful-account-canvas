
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { useLocation } from 'react-router-dom';
import { ArrowUpRight, ArrowDownRight, Edit2, Trash, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Transaction, Category } from '@/types';
import TransactionForm from './TransactionForm';
import { getCategories } from '@/services/categories';

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
  const [categories, setCategories] = useState<Category[]>([]);
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
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
  
  const getCategoryNameById = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Uncategorized';
  };
  
  const getCategoryColorById = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.color || '#ccc';
  };

  // Check if a transaction should be highlighted
  const shouldHighlight = (transaction: Transaction) => {
    const searchParams = new URLSearchParams(location.search);
    const highlightId = searchParams.get('id');
    return highlightId === transaction.id;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search transactions..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Transactions</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="expense">Expenses</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((transaction) => {
                const isHighlighted = shouldHighlight(transaction);
                return (
                <TableRow 
                  key={transaction.id} 
                  data-id={transaction.id}
                  id={transaction.id}
                  className={isHighlighted ? 'search-highlight bg-amber-50' : ''}
                >
                  <TableCell className="font-medium">
                    {transaction.description}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span
                        className="h-3 w-3 rounded-full mr-2"
                        style={{ 
                          backgroundColor: getCategoryColorById(transaction.categoryId)
                        }}
                      ></span>
                      {getCategoryNameById(transaction.categoryId)}
                    </div>
                  </TableCell>
                  <TableCell>{format(new Date(transaction.date), 'PP')}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <span
                        className={`p-1 rounded-full mr-2 ${
                          transaction.type === 'income'
                            ? 'bg-green-100'
                            : 'bg-red-100'
                        }`}
                      >
                        {transaction.type === 'income' ? (
                          <ArrowUpRight className="h-3 w-3 text-green-600" />
                        ) : (
                          <ArrowDownRight className="h-3 w-3 text-red-600" />
                        )}
                      </span>
                      <span className="capitalize">{transaction.type}</span>
                    </div>
                  </TableCell>
                  <TableCell
                    className={`text-right font-medium ${
                      transaction.type === 'income'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => handleEdit(transaction)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-red-500"
                        onClick={() => handleDelete(transaction)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )})
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                  No transactions found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      {/* Edit Transaction Dialog */}
      <Dialog open={isEditing} onOpenChange={(open) => !isSubmitting && setIsEditing(open)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
            <DialogDescription>
              Make changes to your transaction details below.
            </DialogDescription>
          </DialogHeader>
          {currentTransaction && (
            <TransactionForm
              transaction={currentTransaction}
              onSubmit={handleEditSubmit}
              onCancel={() => setIsEditing(false)}
              isSubmitting={isSubmitting}
            />
          )}
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog 
        open={isDeleting} 
        onOpenChange={(open) => !isSubmitting && setIsDeleting(open)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this transaction and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isSubmitting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default TransactionList;

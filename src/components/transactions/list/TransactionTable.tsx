
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownRight, Edit2, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Transaction, Category } from '@/types';

interface TransactionTableProps {
  transactions: Transaction[];
  categories: Category[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transaction: Transaction) => void;
  shouldHighlight: (transaction: Transaction) => boolean;
}

const TransactionTable = ({
  transactions,
  categories,
  onEdit,
  onDelete,
  shouldHighlight
}: TransactionTableProps) => {
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };
  
  const getCategoryNameById = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Uncategorized';
  };
  
  const getCategoryColorById = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.color || '#ccc';
  };

  return (
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
          {transactions.length > 0 ? (
            transactions.map((transaction) => {
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
                      onClick={() => onEdit(transaction)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 text-red-500"
                      onClick={() => onDelete(transaction)}
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
  );
};

export default TransactionTable;

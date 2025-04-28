
import { Transaction, Category } from '@/types';
import { format } from 'date-fns';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface TransactionItemProps {
  transaction: Transaction;
  category?: Category;
}

const TransactionItem = ({ transaction, category }: TransactionItemProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <Card className="border overflow-hidden card-hover">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div
              className={`h-10 w-10 rounded-full flex items-center justify-center mr-4 ${
                transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
              }`}
            >
              {transaction.type === 'income' ? (
                <ArrowUpRight className="h-5 w-5 text-green-600" />
              ) : (
                <ArrowDownRight className="h-5 w-5 text-red-600" />
              )}
            </div>
            <div>
              <h3 className="text-sm font-medium">{transaction.description}</h3>
              <div className="flex items-center text-xs text-gray-500">
                <span>{format(new Date(transaction.date), 'PPP')}</span>
                {category && (
                  <>
                    <span className="mx-1">•</span>
                    <span
                      className="w-2 h-2 rounded-full mr-1"
                      style={{ backgroundColor: category.color }}
                    ></span>
                    <span>{category.name}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <p
            className={`text-sm font-semibold ${
              transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {transaction.type === 'income' ? '+' : '-'}
            {formatCurrency(transaction.amount)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionItem;

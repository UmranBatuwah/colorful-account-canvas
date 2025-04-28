
import { FinancialSummary } from '@/types';
import { ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardStatsProps {
  summary: FinancialSummary;
}

const DashboardStats = ({ summary }: DashboardStatsProps) => {
  const { totalIncome, totalExpense, balance } = summary;
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="border-0 shadow-md card-hover">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Total Income
          </CardTitle>
          <div className="p-2 bg-green-100 rounded-full">
            <ArrowUpRight className="h-4 w-4 text-green-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalIncome)}</div>
          <p className="text-xs text-gray-500 mt-1">Current Period</p>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-md card-hover">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Total Expenses
          </CardTitle>
          <div className="p-2 bg-red-100 rounded-full">
            <ArrowDownRight className="h-4 w-4 text-red-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(totalExpense)}</div>
          <p className="text-xs text-gray-500 mt-1">Current Period</p>
        </CardContent>
      </Card>
      
      <Card className="border-0 shadow-md card-hover">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-gray-500">
            Current Balance
          </CardTitle>
          <div className="p-2 bg-blue-100 rounded-full">
            <DollarSign className="h-4 w-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(balance)}</div>
          <p className="text-xs text-gray-500 mt-1">Available Funds</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardStats;

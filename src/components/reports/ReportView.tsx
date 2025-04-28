
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Transaction, Category, MonthlyData } from '@/types';
import ReportChart from './ReportChart';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Legend,
  Tooltip
} from 'recharts';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

interface ReportViewProps {
  transactions: Transaction[];
  categories: Category[];
}

const ReportView = ({ transactions, categories }: ReportViewProps) => {
  const [timeRange, setTimeRange] = useState<string>('3months');
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [categoryData, setCategoryData] = useState<{ name: string; value: number; color: string }[]>([]);
  const [activeCategory, setActiveCategory] = useState<'income' | 'expense'>('expense');
  
  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  // Calculate date range based on timeRange selection
  const getDateRange = () => {
    const now = new Date();
    let startDate: Date;
    
    switch (timeRange) {
      case '1month':
        startDate = startOfMonth(subMonths(now, 1));
        break;
      case '6months':
        startDate = startOfMonth(subMonths(now, 6));
        break;
      case '12months':
        startDate = startOfMonth(subMonths(now, 12));
        break;
      case '3months':
      default:
        startDate = startOfMonth(subMonths(now, 3));
    }
    
    return {
      start: startDate,
      end: endOfMonth(now),
    };
  };
  
  // Filter transactions by date range
  const getTransactionsInRange = () => {
    const { start, end } = getDateRange();
    
    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.date);
      return transactionDate >= start && transactionDate <= end;
    });
  };
  
  // Calculate monthly data for charts
  useEffect(() => {
    const filteredTransactions = getTransactionsInRange();
    const monthsMap = new Map<string, { month: string; income: number; expense: number }>();
    
    // Initialize months in the selected range
    const { start, end } = getDateRange();
    let currentDate = new Date(start);
    
    while (currentDate <= end) {
      const monthKey = format(currentDate, 'yyyy-MM');
      const monthLabel = format(currentDate, 'MMM');
      
      monthsMap.set(monthKey, {
        month: monthLabel,
        income: 0,
        expense: 0,
      });
      
      currentDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1
      );
    }
    
    // Aggregate transaction data by month
    filteredTransactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      const monthKey = format(date, 'yyyy-MM');
      
      if (monthsMap.has(monthKey)) {
        const monthData = monthsMap.get(monthKey)!;
        
        if (transaction.type === 'income') {
          monthData.income += transaction.amount;
        } else {
          monthData.expense += transaction.amount;
        }
        
        monthsMap.set(monthKey, monthData);
      }
    });
    
    // Convert map to array and sort by date
    const sortedMonths = Array.from(monthsMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([_, data]) => data);
    
    setMonthlyData(sortedMonths);
    
    // Calculate category data for pie chart
    const categoryMap = new Map<string, { value: number; color: string }>();
    
    // Initialize categories
    categories
      .filter((cat) => cat.type === activeCategory)
      .forEach((category) => {
        categoryMap.set(category.id, {
          value: 0,
          color: category.color,
        });
      });
    
    // Aggregate transaction data by category
    filteredTransactions
      .filter((t) => t.type === activeCategory)
      .forEach((transaction) => {
        if (categoryMap.has(transaction.categoryId)) {
          const categoryData = categoryMap.get(transaction.categoryId)!;
          categoryData.value += transaction.amount;
          categoryMap.set(transaction.categoryId, categoryData);
        }
      });
    
    // Convert map to array, add category names, and filter out zero values
    const categoryDataArray = Array.from(categoryMap.entries())
      .map(([categoryId, data]) => {
        const category = categories.find((c) => c.id === categoryId);
        return {
          name: category ? category.name : 'Uncategorized',
          value: data.value,
          color: data.color,
        };
      })
      .filter((item) => item.value > 0);
    
    setCategoryData(categoryDataArray);
  }, [transactions, categories, timeRange, activeCategory]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Financial Reports</h2>
        <Select
          value={timeRange}
          onValueChange={setTimeRange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1month">Last Month</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="6months">Last 6 Months</SelectItem>
            <SelectItem value="12months">Last 12 Months</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle>Income vs. Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ReportChart data={monthlyData} />
          </div>
        </CardContent>
      </Card>
      
      <Tabs defaultValue="expense" value={activeCategory} onValueChange={(v) => setActiveCategory(v as 'income' | 'expense')}>
        <TabsList className="mb-4">
          <TabsTrigger value="expense">Expenses by Category</TabsTrigger>
          <TabsTrigger value="income">Income by Category</TabsTrigger>
        </TabsList>
        
        <TabsContent value={activeCategory}>
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>
                {activeCategory === 'expense' ? 'Expenses' : 'Income'} by Category
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={130}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({
                        cx,
                        cy,
                        midAngle,
                        innerRadius,
                        outerRadius,
                        percent,
                      }) => {
                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                        const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
                        const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));
                        
                        return percent > 0.05 ? (
                          <text
                            x={x}
                            y={y}
                            fill="white"
                            textAnchor={x > cx ? "start" : "end"}
                            dominantBaseline="central"
                            fontSize={12}
                          >
                            {`${(percent * 100).toFixed(0)}%`}
                          </text>
                        ) : null;
                      }}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              
              {categoryData.length === 0 && (
                <div className="text-center py-10">
                  <p className="text-gray-500">No data available</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportView;

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthlyData } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface TransactionChartProps {
  data: MonthlyData[];
}

const TransactionChart = ({ data }: TransactionChartProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">Income vs. Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px] sm:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
              <Legend />
              <Bar
                name="Income"
                dataKey="income"
                fill="rgba(77, 124, 254, 0.8)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                name="Expenses"
                dataKey="expense"
                fill="rgba(249, 115, 22, 0.8)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionChart;

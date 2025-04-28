
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MonthlyData } from '@/types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface TransactionChartProps {
  data: MonthlyData[];
}

const TransactionChart = ({ data }: TransactionChartProps) => {
  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle>Income vs Expenses</CardTitle>
      </CardHeader>
      <CardContent className="pl-0">
        <div className="h-[300px] w-full">
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
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, '']} />
              <Legend />
              <Bar dataKey="income" name="Income" fill="rgba(77, 124, 254, 0.8)" />
              <Bar dataKey="expense" name="Expense" fill="rgba(249, 115, 22, 0.8)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionChart;

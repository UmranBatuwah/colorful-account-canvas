
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { MonthlyData } from '@/types';

interface ReportChartProps {
  data: MonthlyData[];
}

const ReportChart = ({ data }: ReportChartProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  return (
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
  );
};

export default ReportChart;

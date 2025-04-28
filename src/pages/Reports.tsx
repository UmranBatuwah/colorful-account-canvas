
import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ReportView from '@/components/reports/ReportView';
import { getTransactions } from '@/services/transactions';
import { getCategories } from '@/services/categories';

const Reports = () => {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  
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

  return (
    <DashboardLayout title="Reports">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Financial Reports</h2>
        <p className="text-gray-500">
          Analyze your financial data with visual reports
        </p>
      </div>
      
      <ReportView transactions={transactions} categories={categories} />
    </DashboardLayout>
  );
};

export default Reports;

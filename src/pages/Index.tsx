
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="container mx-auto px-4">
        <header className="flex justify-between items-center py-6">
          <h1 className="text-2xl font-bold text-gradient">FinTrackr</h1>
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="outline">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </header>
        
        <main className="flex flex-col md:flex-row items-center justify-between py-16">
          <div className="max-w-lg mb-10 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">Manage your finances</span> with confidence
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Track expenses, analyze income, and take control of your financial journey
              with our easy-to-use accounting system.
            </p>
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Link to="/signup">
                <Button size="lg" className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600">
                  Get Started - It's Free
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
          
          <div className="w-full max-w-md">
            <div className="bg-white p-6 rounded-2xl shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Financial Overview</h3>
                <div className="bg-primary/10 text-primary font-medium px-3 py-1 rounded-full text-sm">
                  Demo
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-sm text-gray-500 mb-1">Total Balance</p>
                  <p className="text-2xl font-bold">$12,750.00</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Income</p>
                    <p className="text-xl font-bold text-green-600">+$5,240.00</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-xl">
                    <p className="text-sm text-gray-500 mb-1">Expenses</p>
                    <p className="text-xl font-bold text-red-600">-$2,790.00</p>
                  </div>
                </div>
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-gray-500">Expense Breakdown</h4>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-sm mr-4">Rent</span>
                      <div className="flex-grow h-2 bg-gray-100 rounded">
                        <div className="h-full bg-blue-500 rounded" style={{ width: '65%' }}></div>
                      </div>
                      <span className="ml-4 text-sm font-medium">65%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-purple-500 mr-2"></div>
                      <span className="text-sm mr-4">Food</span>
                      <div className="flex-grow h-2 bg-gray-100 rounded">
                        <div className="h-full bg-purple-500 rounded" style={{ width: '20%' }}></div>
                      </div>
                      <span className="ml-4 text-sm font-medium">20%</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 rounded-full bg-orange-500 mr-2"></div>
                      <span className="text-sm mr-4">Transport</span>
                      <div className="flex-grow h-2 bg-gray-100 rounded">
                        <div className="h-full bg-orange-500 rounded" style={{ width: '15%' }}></div>
                      </div>
                      <span className="ml-4 text-sm font-medium">15%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        <section className="py-16 text-center">
          <h2 className="text-3xl font-bold mb-10">Features that empower your financial decisions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <div className="bg-blue-100 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-blue-600">
                  <line x1="12" y1="20" x2="12" y2="10"></line>
                  <line x1="18" y1="20" x2="18" y2="4"></line>
                  <line x1="6" y1="20" x2="6" y2="16"></line>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Expense Tracking</h3>
              <p className="text-gray-600">
                Easily track and categorize all your expenses in one place
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <div className="bg-purple-100 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-purple-600">
                  <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
                  <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Reports & Analytics</h3>
              <p className="text-gray-600">
                Get insightful reports to understand your spending habits
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-md">
              <div className="bg-green-100 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-green-600">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Financial Planning</h3>
              <p className="text-gray-600">
                Plan your financial future and set realistic goals
              </p>
            </div>
          </div>
        </section>
      </div>
      
      <footer className="py-12 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-600">
            © 2025 FinTrackr. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

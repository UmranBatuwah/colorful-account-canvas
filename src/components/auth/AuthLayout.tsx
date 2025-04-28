
import { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  linkText: string;
  linkTo: string;
}

const AuthLayout = ({ 
  children, 
  title, 
  subtitle, 
  linkText, 
  linkTo 
}: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gradient mb-2">{title}</h1>
          <p className="text-gray-500 mb-6">{subtitle}</p>
        </div>
        
        {children}
        
        <div className="text-center mt-6">
          <Link to={linkTo} className="text-sm text-primary hover:underline">
            {linkText}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;

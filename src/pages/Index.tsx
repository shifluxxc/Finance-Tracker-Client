import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthForm } from "@/components/auth/AuthForm";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { ThemeToggle } from "@/components/ThemeToggle"; 
import { ChartBarIcon, ArrowRightIcon } from "lucide-react";

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);
  
  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-2xl font-semibold text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:text-white transition-colors">
      <header className="container mx-auto py-6 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <ChartBarIcon className="h-8 w-8 text-finance-primary mr-2" />
          <h1 className="text-2xl font-bold text-finance-primary">FinanceTracker</h1>
        </div>
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <Button 
            variant="ghost" 
            onClick={() => setShowAuth(true)}
          >
            Login
          </Button>
          <Button 
            onClick={() => setShowAuth(true)}
            variant="default"
          >
            Register
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 md:py-24">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0 md:pr-12">
            <h2 className="text-4xl md:text-5xl font-bold text-finance-text dark:text-white leading-tight mb-6">
              Take Control of Your <span className="text-finance-primary">Financial Life</span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
              Track spending, set budgets, and visualize your financial journey with our powerful dashboard and analytics.
            </p>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-finance-primary rounded-full p-1 mr-3 mt-1">
                  <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-finance-text dark:text-white">Track Your Spending</h3>
                  <p className="text-gray-500 dark:text-gray-400">Easily log and categorize all your expenses</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-finance-primary rounded-full p-1 mr-3 mt-1">
                  <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-finance-text dark:text-white">Set Budgets</h3>
                  <p className="text-gray-500 dark:text-gray-400">Create custom budgets for different expense categories</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-finance-primary rounded-full p-1 mr-3 mt-1">
                  <svg className="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-finance-text dark:text-white">Visualize Data</h3>
                  <p className="text-gray-500 dark:text-gray-400">Powerful charts and reports to understand your spending</p>
                </div>
              </div>
            </div>
            <Button 
              size="lg" 
              className="mt-8"
              onClick={() => setShowAuth(true)}
            >
              Get Started Free <ArrowRightIcon className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="md:w-1/2">
            {showAuth ? (
              <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 animate-fade-in">
                <h3 className="text-2xl font-bold text-center mb-6 dark:text-white">Welcome!</h3>
                <AuthForm />
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                <img 
                  src="https://placehold.co/600x400/0C6291/FFFFFF?text=Financial+Dashboard" 
                  alt="Finance Dashboard Preview" 
                  className="rounded-md"
                />
              </div>
            )}
          </div>
        </div>
      </main>
      <footer className="bg-background py-8 mt-12">
              <hr className=" bg-gray-500 mb-2"></hr>
        <div className="container mx-auto px-4">
          <div className="text-center text-gray-500 dark:text-gray-400 text-sm">
            &copy; 2025 FinanceTracker. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

import React from "react";
import { useFinance } from "@/context/FinanceContext";
import { PiggyBank, CreditCard, Wallet, TrendingUp, Calendar } from "lucide-react";
import StatCard from "./common/StatCard";
import TransactionList from "./TransactionList";
import CategoryChart from "./CategoryChart";
import ExpenseChart from "./ExpenseChart";

const Dashboard: React.FC = () => {
  const { transactions, getTotalExpenses, getTotalIncome } = useFinance();  
  // Get current month in YYYY-MM format
  const currentDate = new Date();
  const currentMonth =currentDate.getMonth() +1 ;
  // Get previous month
  const prevMonthDate = new Date(currentDate);
  prevMonthDate.setMonth(currentDate.getMonth() - 1);
  const previousMonth = (currentMonth - 1 + 12) % 12; 
  // Get total expenses and income for current month
  const monthlyExpenses = getTotalExpenses(currentMonth);
  const monthlyIncome = getTotalIncome(currentMonth);
  const previousMonthExpenses = getTotalExpenses(previousMonth);

  console.log(monthlyExpenses); 
  // Calculate month-over-month change
  const expenseChange = previousMonthExpenses > 0
    ? ((monthlyExpenses - previousMonthExpenses) / previousMonthExpenses) * 100
    : 0;

  // Format amounts as USD
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Get recent transactions (up to 5)
  const recentTransactions = [...transactions]
    .sort((a, b) => (a.month) - (b.month))
    .slice(0, 5);

  // Get current month name
  const currentMonthName = currentDate.toLocaleString("default", {
    month: "long",
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={`${currentMonthName} Expenses`}
          value={formatCurrency(monthlyExpenses)}
          icon={<CreditCard />}
          trend={expenseChange > 0 ? "up" : expenseChange < 0 ? "down" : "neutral"}
          trendValue={`${Math.abs(expenseChange).toFixed(1)}% vs last month`}
        />
        <StatCard
          title={`${currentMonthName} Income`}
          value={formatCurrency(monthlyIncome)}
          icon={<Wallet />}
        />
        <StatCard
          title="Balance"
          value={formatCurrency(monthlyIncome - monthlyExpenses)}
          icon={<TrendingUp />}
          trend={monthlyIncome - monthlyExpenses > 0 ? "up" : "down"}
          trendValue={`${Math.abs(((monthlyIncome - monthlyExpenses) / monthlyIncome) * 100).toFixed(1)}% of income`}
        />
        <StatCard
          title="Budget Status"
          value={monthlyExpenses > 0 ? `${((monthlyExpenses / monthlyIncome) * 100).toFixed(0)}%` : "0%"}
          description={`of income spent this month`}
          icon={<PiggyBank />}
        />
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        <CategoryChart />
        <ExpenseChart />
      </div>

      {/* Transactions */}
      <TransactionList />
    </div>
  );
};

export default Dashboard;

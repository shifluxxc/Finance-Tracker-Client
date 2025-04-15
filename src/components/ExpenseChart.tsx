
import React from "react";
import { useFinance } from "@/context/FinanceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const ExpenseChart: React.FC<{ title?: string }> = ({ title = "Monthly Spending" }) => {
  const { getMonthlyExpenses } = useFinance();
  
  const monthlyData = getMonthlyExpenses()
    .map((item) => {
      // Format the month label to be more readable (e.g., 2023-04 -> Apr)
      const month = item.month; 
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const monthLabel = monthNames[parseInt(month) - 1];
      
      return {
        name: monthLabel,
        spending: item.total,
        month: item.month, // Keep original month format for tooltip
      };
    })
    .slice(-6); // Only show last 6 months for better visibility

  // If there's no data, show an empty state
  if (monthlyData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center flex-col">
          <p className="text-muted-foreground">No monthly data available</p>
          <p className="text-sm text-muted-foreground">
            Add some transactions to see your monthly spending
          </p>
        </CardContent>
      </Card>
    );
  }

  // Custom tooltip for the bar chart
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-500 p-2 border rounded-md shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-sm">${payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="spending"
                fill="hsl(200, 0%, 100%)"
                radius={[4, 4, 0, 0]}
                maxBarSize={60}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpenseChart;

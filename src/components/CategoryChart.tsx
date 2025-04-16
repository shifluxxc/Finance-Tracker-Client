import React from "react";
import { useFinance } from "@/context/FinanceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

// Color map for different categories
const CATEGORY_COLOR_MAP: Record<string, string> = {
  "Food & Dining": "#F87171",       // soft red
  "Housing": "#60A5FA",            // soft blue
  "Transportation": "#FBBF24",     // amber
  "Utilities": "#A78BFA",          // violet
  "Entertainment": "#34D399",      // emerald
  "Shopping": "#FB7185",           // rose
  "HealthCare": "#4ADE80",         // green
  "Personal": "#F472B6",           // pink
  "Income": "#38BDF8",             // sky
};

const CategoryChart: React.FC<{ title?: string }> = ({ title = "Spending by Category" }) => {
  const { getCategoryTotals, getCategory } = useFinance();
  
  // Flatten the category data and map colors to categories
  const categoryData = getCategoryTotals().map((item) => {
    const category = getCategory(item.categoryId);
    return {
      name: category?.name || "Unknown",
      value: item.total,
      color: CATEGORY_COLOR_MAP[category?.name || ""] || "#D1D5DB", // Default to gray if no match
    };
  });

  // If there's no data, show an empty state
  if (categoryData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="flex h-[300px] items-center justify-center flex-col">
          <p className="text-muted-foreground">No spending data available</p>
          <p className="text-sm text-muted-foreground">
            Add some transactions to see your spending breakdown
          </p>
        </CardContent>
      </Card>
    );
  }

  // Custom tooltip for the pie chart
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-500 p-2 border rounded-md shadow-md">
          <p className="font-medium">{payload[0].name}</p>
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
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                labelLine={false}
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryChart;

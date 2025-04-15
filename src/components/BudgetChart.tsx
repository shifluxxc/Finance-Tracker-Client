import React, { useState } from "react";
import { useFinance } from "@/context/FinanceContext";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "next-themes";

// Color maps for light/dark mode
const COLOR_MAP = {
  light: {
    budgeted: "#9b59b6",
    actual: "#e74c3c",
    gridLine: "rgba(148, 163, 184, 0.2)",
    axisLine: "rgba(148, 163, 184, 0.3)",
    tooltip: {
      background: "white",
      text: "#333333",
      border: "rgba(0, 0, 0, 0.1)",
    },
    cursorFill: "rgba(59, 130, 246, 0.1)",
  },
  dark: {
    budgeted: "#bb8fce",
    actual: "#f1948a",
    gridLine: "rgba(148, 163, 184, 0.1)",
    axisLine: "rgba(148, 163, 184, 0.2)",
    tooltip: {
      background: "#1e293b",
      text: "#e2e8f0",
      border: "rgba(255, 255, 255, 0.1)",
    },
    cursorFill: "rgba(59, 130, 246, 0.2)",
  }
};

const BudgetChart: React.FC = () => {
  const { getBudgetComparison, getCategory } = useFinance();
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth());
  const { theme = "light" } = useTheme();
  
  // Determine which color scheme to use based on the current theme
  const colors = theme === "dark" ? COLOR_MAP.dark : COLOR_MAP.light;

  const getMonthOptions = () => {
    const options = [];
    for (let i = -5; i <= 0; i++) {
      const date = new Date();
      date.setMonth(now.getMonth() + i);
      options.push({
        value: date.getMonth() + 1,
        label: date.toLocaleString("default", { month: "long", year: "numeric" }),
      });
    }
    return options;
  };

  const comparisonData = getBudgetComparison(selectedMonth).map((item) => {
    const category = getCategory(item.categoryId);
    return {
      name: category?.name || "Unknown",
      budgeted: item.budgeted,
      actual: item.actual,
    };
  });

  // Custom tooltip component that handles dark/light mode
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    
    return (
      <div className="bg-popover border border-border p-2 rounded-md shadow-md">
        <p className="text-foreground font-medium">{label}</p>
        <div className="mt-2 space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: entry.fill }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="text-foreground font-mono">${entry.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="mb-5">Budget vs Actual</CardTitle>
        <Select 
          value={String(selectedMonth)} 
          onValueChange={(v) => setSelectedMonth(Number(v))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Month" />
          </SelectTrigger>
          <SelectContent>
            {getMonthOptions().map((opt) => (
              <SelectItem key={opt.value} value={String(opt.value)}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        {comparisonData.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            No budget data available for this month.
          </div>
        ) : (
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={comparisonData}
                margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                className="bg-transparent"
              >
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke={colors.gridLine} 
                  vertical={false}
                />
                <XAxis 
                  dataKey="name" 
                  tickLine={false} 
                  axisLine={{ stroke: colors.axisLine }}
                  tick={{ fill: 'var(--foreground)' }}
                />
                <YAxis 
                  tickFormatter={(val) => `$${val}`} 
                  tickLine={false} 
                  axisLine={{ stroke: colors.axisLine }}
                  tick={{ fill: 'var(--foreground)' }}
                />
                <Tooltip 
                  content={<CustomTooltip />}
                  cursor={{ fill: colors.cursorFill }}
                />
                <Legend 
                  verticalAlign="bottom" 
                  height={36} 
                  wrapperStyle={{ paddingTop: '10px' }}
                />
                <Bar 
                  dataKey="budgeted" 
                  fill={colors.budgeted} 
                  name="Budgeted" 
                  className="transition-all duration-300 hover:opacity-90"
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  dataKey="actual" 
                  fill={colors.actual} 
                  name="Actual" 
                  className="transition-all duration-300 hover:opacity-90"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetChart;
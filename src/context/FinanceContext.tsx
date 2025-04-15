import React, { createContext, useContext, useState, useEffect } from "react";
import {
  useTransactions,
  useAddTransaction,
  useEditTransaction,
  useDeleteTransaction,
} from "@/hooks/transaction";
import {
  useCategories,
  useAddBudget,
  useEditBudget,
  useBudgets,
} from "@/hooks/budget";
import { CodeSquare } from "lucide-react";

export type Category = {
  id: string;
  name: string;
  color: string;
};

export type Transaction = {
  id: string;
  amount: number;
  description: string;
  month: number;
  year: number;
  category: Category;
};

export type AddTransaction = {
  amount: number;
  description: string;
  categoryId: string ;
};

export type EditTransaction = {
  amount: number;
  description: string;
  categoryId: string ;
};

export type Budget = {
  id: string;
  categoryId: string;
  amount: number;
  month: number;
  year: number;
  category: Category;
};

export type AddBudget = {
  categoryId: string;
  amount: number;
};

export type EditBudget = {
  amount : number
};

type FinanceContextType = {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  addTransaction: (transaction: Omit<AddTransaction, "id">) => void;
  updateTransaction: (id : string , transaction: Omit<EditTransaction, "id">) => void;
  deleteTransaction: (id: string) => void;
  getCategory: (id: string) => Category | undefined;
  addBudget: (budget: Omit<AddBudget, "id">) => void;
  updateBudget: (id : string , budget: Omit<EditBudget, "id">) => void;
  getCategoryTotals: () => { categoryId: string; total: number }[];
  getMonthlyExpenses: () => { month: string; total: number }[];
  getMonthlyCategoryExpenses: (categoryId: string) => { month: string; total: number }[];
  getBudgetComparison: (month: number) => { categoryId: string; budgeted: number; actual: number }[];
  getTotalExpenses: (month?: number, year?: number) => number;
  getTotalIncome: (month?: number, year?: number) => number;
};

const FinanceContext = createContext<FinanceContextType | undefined>(undefined);

export const FinanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data: transactionsData } = useTransactions();
  const { data: categoriesData } = useCategories();
  const { data: budgetsData } = useBudgets();

  const { mutate: addTransactionMutation } = useAddTransaction();
  const { mutate: updateTransactionMutation } = useEditTransaction();
  const { mutate: deleteTransactionMutation } = useDeleteTransaction();
  const { mutate: addBudgetMutation } = useAddBudget();
  const { mutate: updateBudgetMutation } = useEditBudget();

  const transactions: Transaction[] = Array.isArray(transactionsData)
    ? transactionsData.flat()
    : Object.values(transactionsData ?? {}).flat();

  const budgets: Budget[] = Array.isArray(budgetsData)
    ? budgetsData.flat()
    : Object.values(budgetsData ?? {}).flat();

  const categories: Category[] = Array.isArray(categoriesData)
    ? categoriesData.flat()
    : Object.values(categoriesData ?? {}).flat();

  const addTransaction = (transaction: Omit<AddTransaction, "id">) => {
    addTransactionMutation({
      amount: transaction.amount,
      description: transaction.description,
      categoryId: transaction.categoryId,
    });
  };

  const updateTransaction = (id: string , transaction: Omit<EditTransaction, "id">) => {
    updateTransactionMutation({
      id,
      amount: transaction.amount,
      description: transaction.description,
      categoryId: transaction.categoryId,
    });
  };
  // console.log(transactions);
  const deleteTransaction = (id: string) => {
    deleteTransactionMutation(id);
  };
  // console.log(categories); 
  const getCategory = (id: string) => categories.find((c) => c.id === id);

  const addBudget = (budget: Omit<AddBudget, "id">) => {
    addBudgetMutation({
      categoryId: budget.categoryId,
      amount: budget.amount,
    });
  };

  const updateBudget = (id: string, budget: Omit<EditBudget, "id">) => {
    updateBudgetMutation({
      id,
      amount: budget.amount,
    });
  };

  const getCategoryTotals = () => {
    return categories.map((category) => {
      const total = transactions
        .filter((t) => t.category?.id === category.id && t.amount < 0)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0);
      return { categoryId: category.id, total };
    });
  };

  // console.log(budgets); 
  const getMonthlyExpenses = () => {
    const monthlyData: Record<string, number> = {};
    transactions
      .filter((t) => t.amount < 0)
      .forEach((t) => {
        const month = t.month.toString();
        monthlyData[month] = (monthlyData[month] || 0) + Math.abs(t.amount);
      });

    return Object.entries(monthlyData)
      .map(([month, total]) => ({ month, total }))
      .sort((a, b) => a.month.localeCompare(b.month));
  };

  const getMonthlyCategoryExpenses = (categoryId: string) => {
    const monthlyData: Record<string, number> = {};

    transactions
      .filter((t) => t.category.id === categoryId && t.amount < 0)
      .forEach((t) => {
        const month = t.month.toString();
        monthlyData[month] = (monthlyData[month] || 0) + Math.abs(t.amount);
      });

    return Object.entries(monthlyData)
      .map(([month, total]) => ({ month, total }))
      .sort((a, b) => a.month.localeCompare(b.month));
  };

  const getBudgetComparison = (month: number) => {
    console.log(month); 
    return budgets
      .filter((b) => b.month === month)
      .map((budget) => {
        console.log(budget); 
        const actual = transactions
          .filter(
            (t) =>
              t.category.id === budget.category.id &&
              t.month === month &&
              t.amount < 0
          )
          .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  
        return {
          categoryId: budget.category.id,
          budgeted: budget.amount,
          actual,
        };
      });
  };
  

  const getTotalExpenses = (month?: number, year?: number) => {
    return transactions
      .filter((t) => t.amount < 0 && (month === undefined || t.month === month) && (year === undefined || t.year === year))
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);
  };

  const getTotalIncome = (month?: number, year?: number) => {
    return transactions
      .filter((t) => t.amount > 0 && (month === undefined || t.month === month) && (year === undefined || t.year === year))
      .reduce((sum, t) => sum + t.amount, 0);
  };

  return (
    <FinanceContext.Provider
      value={{
        transactions,
        categories,
        budgets,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        getCategory,
        addBudget,
        updateBudget,
        getCategoryTotals,
        getMonthlyExpenses,
        getMonthlyCategoryExpenses,
        getBudgetComparison,
        getTotalExpenses,
        getTotalIncome,
      }}
    >
      {children}
    </FinanceContext.Provider>
  );
};

export const useFinance = () => {
  const context = useContext(FinanceContext);
  if (!context) {
    throw new Error("useFinance must be used within a FinanceProvider");
  }
  return context;
};

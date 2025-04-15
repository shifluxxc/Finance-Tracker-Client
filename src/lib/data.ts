
import { Transaction, Category, Budget } from "@/context/FinanceContext";

export const initialCategories: Category[] = [
  { id: "food", name: "Food & Dining", color: "#38b26f" },
  { id: "housing", name: "Housing", color: "#e67e22" },
  { id: "transport", name: "Transportation", color: "#3498db" },
  { id: "utilities", name: "Utilities", color: "#9b59b6" },
  { id: "entertainment", name: "Entertainment", color: "#e74c3c" },
  { id: "shopping", name: "Shopping", color: "#1abc9c" },
  { id: "healthcare", name: "Healthcare", color: "#f39c12" },
  { id: "personal", name: "Personal", color: "#34495e" },
  { id: "income", name: "Income", color: "#27ae60" },
];

// Create dates for the past 3 months
const today = new Date();
const getRandomDate = (monthsAgo: number) => {
  const result = new Date(today);
  result.setMonth(today.getMonth() - monthsAgo);
  result.setDate(Math.floor(Math.random() * 28) + 1);
  return result;
};

// Current month in YYYY-MM format
const currentMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
const previousMonth = `${today.getFullYear()}-${String(today.getMonth()).padStart(2, "0")}`;
const twoMonthsAgo = `${today.getFullYear()}-${String(today.getMonth() - 1).padStart(2, "0")}`;

export const initialTransactions: Transaction[] = [
  // Current Month
  { id: "t1", amount: 3500, description: "Salary", date: getRandomDate(0), categoryId: "income" },
  { id: "t2", amount: -1200, description: "Rent", date: getRandomDate(0), categoryId: "housing" },
  { id: "t3", amount: -85, description: "Electricity Bill", date: getRandomDate(0), categoryId: "utilities" },
  { id: "t4", amount: -120, description: "Grocery Shopping", date: getRandomDate(0), categoryId: "food" },
  { id: "t5", amount: -65, description: "Restaurant", date: getRandomDate(0), categoryId: "food" },
  { id: "t6", amount: -35, description: "Gas", date: getRandomDate(0), categoryId: "transport" },
  { id: "t7", amount: -90, description: "Movies & Popcorn", date: getRandomDate(0), categoryId: "entertainment" },
  { id: "t8", amount: -110, description: "New Clothes", date: getRandomDate(0), categoryId: "shopping" },
  
  // Previous Month
  { id: "t9", amount: 3500, description: "Salary", date: getRandomDate(1), categoryId: "income" },
  { id: "t10", amount: -1200, description: "Rent", date: getRandomDate(1), categoryId: "housing" },
  { id: "t11", amount: -95, description: "Internet Bill", date: getRandomDate(1), categoryId: "utilities" },
  { id: "t12", amount: -145, description: "Grocery Shopping", date: getRandomDate(1), categoryId: "food" },
  { id: "t13", amount: -40, description: "Bus Pass", date: getRandomDate(1), categoryId: "transport" },
  { id: "t14", amount: -70, description: "Doctor Visit", date: getRandomDate(1), categoryId: "healthcare" },
  { id: "t15", amount: -55, description: "Concert Tickets", date: getRandomDate(1), categoryId: "entertainment" },
  
  // Two Months Ago
  { id: "t16", amount: 3500, description: "Salary", date: getRandomDate(2), categoryId: "income" },
  { id: "t17", amount: -1200, description: "Rent", date: getRandomDate(2), categoryId: "housing" },
  { id: "t18", amount: -80, description: "Phone Bill", date: getRandomDate(2), categoryId: "utilities" },
  { id: "t19", amount: -130, description: "Grocery Shopping", date: getRandomDate(2), categoryId: "food" },
  { id: "t20", amount: -180, description: "Car Repair", date: getRandomDate(2), categoryId: "transport" },
  { id: "t21", amount: -60, description: "Haircut", date: getRandomDate(2), categoryId: "personal" },
  { id: "t22", amount: -75, description: "Books", date: getRandomDate(2), categoryId: "shopping" },
];

export const initialBudgets: Budget[] = [
  { id: "b1", categoryId: "food", amount: 400, month: currentMonth },
  { id: "b2", categoryId: "housing", amount: 1200, month: currentMonth },
  { id: "b3", categoryId: "transport", amount: 200, month: currentMonth },
  { id: "b4", categoryId: "utilities", amount: 150, month: currentMonth },
  { id: "b5", categoryId: "entertainment", amount: 100, month: currentMonth },
  { id: "b6", categoryId: "shopping", amount: 200, month: currentMonth },
  { id: "b7", categoryId: "healthcare", amount: 100, month: currentMonth },
  { id: "b8", categoryId: "personal", amount: 100, month: currentMonth },
  
  { id: "b9", categoryId: "food", amount: 400, month: previousMonth },
  { id: "b10", categoryId: "housing", amount: 1200, month: previousMonth },
  { id: "b11", categoryId: "transport", amount: 200, month: previousMonth },
  { id: "b12", categoryId: "utilities", amount: 150, month: previousMonth },
  { id: "b13", categoryId: "entertainment", amount: 100, month: previousMonth },
  { id: "b14", categoryId: "shopping", amount: 200, month: previousMonth },
  { id: "b15", categoryId: "healthcare", amount: 100, month: previousMonth },
  { id: "b16", categoryId: "personal", amount: 100, month: previousMonth },
];

import { Category, Budget } from "@/context/FinanceContext";
import graphqlClient, { fetcher } from "@/gqlClient";
import { addBudget, categoriesQuery, categoryWiseBudgetPercentageQuery, editBudget, monthWiseBudgetQuery, budgetsQuery } from "@/graphql/budget";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useCategories = () => {
    return useQuery<Category[]>({
      queryKey: ['categories'],
      queryFn: () => fetcher(categoriesQuery),
    });
};
  
export const useCategoryWiseBudgetPercentage = () => {
    return useQuery({
      queryKey: ['categoryWiseBudgetPercentage'],
      queryFn: () => fetcher(categoryWiseBudgetPercentageQuery),
    });
};
  
export const useMonthWiseBudget = () => {
    return useQuery({
      queryKey: ['monthWiseBudget'],
      queryFn: () => fetcher(monthWiseBudgetQuery),
    });
};
  
export const useRecentBudgets = () => {
    return useQuery({
      queryKey: ['recentBudgets'],
      queryFn: () => fetcher(budgetsQuery),
    });
};

export const useBudgets = () => {
  return useQuery<Budget[]>({
    queryKey: ['budgets'],
    queryFn: () => fetcher(budgetsQuery),
  });
};
  
export const useAddBudget = () =>
  useMutation({
    mutationFn: async (input: { amount: number; categoryId: string }) => {
      const query = addBudget; 
      return graphqlClient.request(query, input);
    },
  });

  export const useEditBudget = () =>
    useMutation({
      mutationFn: async (input: { id: string; amount?: number; month?: number; categoryId?: string }) => {
        const query = editBudget;
        return graphqlClient.request(query, input);
      },
    });



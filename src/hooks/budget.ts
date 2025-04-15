import { Category, Budget } from "@/context/FinanceContext";
import graphqlClient, { fetcher } from "@/gqlClient";
import { addBudget, categoriesQuery, categoryWiseBudgetPercentageQuery, editBudget, monthWiseBudgetQuery, budgetsQuery } from "@/graphql/budget";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
  
export const useAddBudget = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: { amount: number; categoryId: string }) => {
      const query = addBudget; 
      return graphqlClient.request(query, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      queryClient.invalidateQueries({ queryKey: ['categoryWiseBudgetPercentage'] });
      queryClient.invalidateQueries({ queryKey: ['monthWiseBudget'] });
      queryClient.invalidateQueries({ queryKey: ['recentBudgets'] }); // Invalidate recent budgets as well
    },
  });
}

  export const useEditBudget = () =>{
  const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (input: { id: string; amount?: number; month?: number; categoryId?: string }) => {
        const query = editBudget;
        return graphqlClient.request(query, input);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['budgets'] });
        queryClient.invalidateQueries({ queryKey: ['categoryWiseBudgetPercentage'] });
        queryClient.invalidateQueries({ queryKey: ['monthWiseBudget'] });
        queryClient.invalidateQueries({ queryKey: ['recentBudgets'] }); // Invalidate recent budgets as well
      },
    });
  }
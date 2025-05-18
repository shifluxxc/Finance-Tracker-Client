import { Transaction } from "@/context/FinanceContext";
import graphqlClient, { fetcher } from "@/gqlClient";
import { addTransacton, categoryExpensePercentageQuery, deleteTransaction, editTransaction, monthWiseExpensesQuery, transactionsQuery } from "@/graphql/transaction";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";



export const useCategoryExpensePercentage = () => {
    return useQuery({
      queryKey: ['categoryExpensePercentage'],
      queryFn: () => fetcher(categoryExpensePercentageQuery),
    });
};
  

export const useMonthWiseExpenses = () => {
    return useQuery({
      queryKey: ['monthWiseExpenses'],
      queryFn: () => fetcher(monthWiseExpensesQuery),
    });
  };
  

  export const useTransactions = () => {
    return useQuery<Transaction[]>({
      queryKey: ['transactions'],
      queryFn: () => fetcher(transactionsQuery),
    });
};
  

export const useAddTransaction = () => {
const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: { amount: number; description: string; categoryId: string; year: number; month: number }) => {
      const query = addTransacton;
      return graphqlClient.request(query, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      queryClient.invalidateQueries({ queryKey: ['categoryExpensePercentage'] });
      queryClient.invalidateQueries({ queryKey: ['monthWiseExpenses'] });
    },
  });
}

  export const useEditTransaction = () =>{
const queryClient = useQueryClient();

    return useMutation({
      mutationFn: async (input: { editTransactionId: string; amount?: number; description?: string; categoryId?: string; year?: number; month?: number }) => {
        const query =editTransaction ;
        return graphqlClient.request(query, input);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['transactions'] });
        queryClient.invalidateQueries({ queryKey: ['categoryExpensePercentage'] });
        queryClient.invalidateQueries({ queryKey: ['monthWiseExpenses'] });
      },
    });
    
  }
    


    export const useDeleteTransaction = () =>{
const queryClient = useQueryClient();

      return useMutation({
        mutationFn: async (deleteTransactionId : string) => {
          const query = deleteTransaction;
          return graphqlClient.request(query, { deleteTransactionId });
        },
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['transactions'] });
          queryClient.invalidateQueries({ queryKey: ['categoryExpensePercentage'] });
          queryClient.invalidateQueries({ queryKey: ['monthWiseExpenses'] });
        },
      });
    }
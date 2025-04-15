import { Transaction } from "@/context/FinanceContext";
import graphqlClient, { fetcher } from "@/gqlClient";
import { addTransacton, categoryExpensePercentageQuery, deleteTransaction, editTransaction, monthWiseExpensesQuery, transactionsQuery } from "@/graphql/transaction";
import { useMutation, useQuery } from "@tanstack/react-query";


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
  

export const useAddTransaction = () =>
  useMutation({
    mutationFn: async (input: { amount: number; description: string; categoryId: string }) => {
      const query = addTransacton;
      return graphqlClient.request(query, input);
    },
  });

  export const useEditTransaction = () =>
    useMutation({
      mutationFn: async (input: { id: string; amount?: number; description?: string; categoryId?: string }) => {
        const query =editTransaction ;
        return graphqlClient.request(query, input);
      },
    });


    export const useDeleteTransaction = () =>
      useMutation({
        mutationFn: async (id: string) => {
          const query = deleteTransaction;
          return graphqlClient.request(query, { id });
        },
      });
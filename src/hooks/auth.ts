import { useMutation , useQuery} from "@tanstack/react-query";
import graphqlClient from "@/gqlClient";
import { loginMutation, registerMutation } from "@/graphql/auth";


export const useRegister = () => {
  return useMutation({
      mutationFn: async (input: { name: string; email: string; password: string }) => {
          const query = registerMutation; 
      return graphqlClient.request(query , input);
    },
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: async (input: { email: string; password: string }) => {
      return graphqlClient.request(loginMutation, input);
    },
  });
};
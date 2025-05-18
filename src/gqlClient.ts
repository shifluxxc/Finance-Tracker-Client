import { GraphQLClient } from 'graphql-request';
import { RequestDocument } from 'graphql-request';


const getToken = () => localStorage.getItem("financeToken");
const url = import.meta.env.VITE_URL; // replace with your server URL
const graphqlClient = new GraphQLClient(`${url}/graphql`, {
    headers: () => ({
    Authorization: getToken() ? `Bearer ${getToken()}` : "",
  }),
}
    
); // replace with your server URL

export const fetcher = <TData>(query: RequestDocument, variables?: any): Promise<TData> => {
    return graphqlClient.request(query, variables);
};

export default graphqlClient;

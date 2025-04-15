import { GraphQLClient } from 'graphql-request';
import { RequestDocument } from 'graphql-request';
const graphqlClient = new GraphQLClient('http://localhost:8000/graphql'); // replace with your server URL

export const fetcher = <TData>(query: RequestDocument, variables?: any): Promise<TData> => {
    return graphqlClient.request(query, variables);
};

export default graphqlClient;

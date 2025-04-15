import { gql } from "graphql-request";

export const categoryExpensePercentageQuery = gql`
  query {
    categoryExpensePercentage {
      category
      percentage
    }
  }
`;

export const monthWiseExpensesQuery = gql`
  query MonthWiseExpenses {
  monthWiseExpenses {
    month
    total
  }
}
`;


export const transactionsQuery = gql`
  query Transactions {
  transactions {
    amount
    id
    description
    category {
      name
      id
    }
    month
    year
  }
}
`;

export const addTransacton = gql`
mutation AddTransaction($amount: Float!, $description: String!, $categoryId: ID!) {
  addTransaction(amount: $amount, description: $description, categoryId: $categoryId) {
    amount
    category {
      name
      id
    }
    description
    id
    month
    year
  }
}
`

export const editTransaction = gql`
mutation EditTransaction($editTransactionId: ID!, $amount: Float, $description: String, $categoryId: ID) {
  editTransaction(id: $editTransactionId, amount: $amount, description: $description, categoryId: $categoryId) {
    amount
    category {
      name
      id
    }
    description
    id
    month
    year
  }
}
`

export const deleteTransaction = gql`
mutation DeleteTransaction($deleteTransactionId: ID!) {
  deleteTransaction(id: $deleteTransactionId)
}
`
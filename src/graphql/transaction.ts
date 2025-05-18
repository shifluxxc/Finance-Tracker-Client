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
mutation AddTransaction($amount: Float!, $description: String!, $categoryId: ID!, $year: Int!, $month: Int!) {
  addTransaction(amount: $amount, description: $description, categoryId: $categoryId, year: $year, month: $month) {
    amount
    category {
      name
    }
    description
    id
    month
    year
  }
}
`

export const editTransaction = gql`
mutation EditTransaction($amount: Float, $editTransactionId: ID!, $description: String, $categoryId: ID, $year: Int, $month: Int) {
  editTransaction(amount: $amount, id: $editTransactionId, description: $description, categoryId: $categoryId, year: $year, month: $month) {
    amount
    category {
      name
    }
    id
    description
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
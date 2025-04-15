import { gql } from "graphql-request";

export const categoriesQuery = gql`
  query Categories {
    categories {
        id
        name
    }
}
`;

export const categoryWiseBudgetPercentageQuery = gql`
  query CategoryWiseBudgetPercentage {
    categoryWiseBudgetPercentage {
    category {
      name
    }
    percentage
  }
}
`;

export const monthWiseBudgetQuery = gql`
  query MonthWiseBudget {
  monthWiseBudget {
    month
    totalAmount
  }
}
`;


export const addBudget = gql`
mutation Mutation($categoryId: ID!, $amount: Float!) {
  addBudget(categoryId: $categoryId, amount: $amount) {
    amount
    category {
      id
      name
    }
    month
    year
    id
  }
}
`

export const editBudget = gql`
mutation EditBudget($editBudgetId: ID!, $amount: Float!) {
  editBudget(id: $editBudgetId, amount: $amount) {
    amount
    category {
      name
      id
    }
    month
    id
    year
  }
}
`

export const budgetsQuery = gql`
query RecentBudgets {
  recentBudgets {
    amount
    category {
      name
      id
    }
    id
    month
    year
  }
}
`;

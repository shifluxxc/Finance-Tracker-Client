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
mutation AddBudget($categoryId: ID!, $amount: Float!, $year: Int!, $month: Int!) {
  addBudget(categoryId: $categoryId, amount: $amount, year: $year, month: $month) {
    amount
    category {
      name
    }
    id
    month
    year
  }
}
`

export const editBudget = gql`
mutation EditBudget($editBudgetId: ID!, $amount: Float, $year: Int, $month: Int, $categoryId: ID) {
  editBudget(id: $editBudgetId, amount: $amount, year: $year, month: $month, categoryId: $categoryId) {
    amount
    category {
      name
    }
    id
    month
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

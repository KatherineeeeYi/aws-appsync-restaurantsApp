import graphql from "graphql-tag";

export default graphql`
  subscription subscribeToComments($restaurantId: ID!) {
    subscribeToComments(restaurantId: $restaurantId) {
      restaurantId
      id
    }
  }
`
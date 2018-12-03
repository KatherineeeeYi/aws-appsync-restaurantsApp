import graphql from "graphql-tag";

export default graphql`
subscription subscribeToComments($restaurantId: String!) {
  subscribeToComments(restaurantId: $restaurantId) {
    restaurantId
    commentId
  }
}`
import graphql from "graphql-tag";

export default graphql`
mutation deleteRestaurant($id: ID!) {
  deleteRestaurant(id: $id) {
    id
    name
    category
    city
    comments {
      items {
        commentId
      }
    }
  }
}`
import graphql from "graphql-tag";

export default graphql`
mutation deleteRestaurant($id: ID!) {
  deleteRestaurant(input: {
    id: $id 
  }) {
    id
    name
    category
    city
  }
}`
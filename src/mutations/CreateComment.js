import graphql from 'graphql-tag';

export default graphql`
  mutation commentOnRestaurant(
    $restaurantId: ID!,
    $content: String!,
    $createdAt: String!
    ) {
    commentOnRestaurant(input: {
      restaurantId: $restaurantId
      content: $content
      createdAt: $createdAt
    }) {
      id
      restaurantId
      content
      createdAt
    }
  }
`
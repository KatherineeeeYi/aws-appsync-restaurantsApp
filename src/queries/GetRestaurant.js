import graphql from 'graphql-tag';

export default graphql`
  query getRestaurant($id: ID!) {
    getRestaurant(id: $id) {
      id 
      name
      category
      city
      comments {
        items {
          id
          content
          createdAt
        }
      }
    }
  }
`
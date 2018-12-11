import graphql from 'graphql-tag';

export default graphql`
  mutation($name: String! $category: String! $city: String! $address: String) {
    createRestaurant(input: {
      name: $name
      category: $category
      city: $city
      address: $address
    }) {
      id
      name
      category
      city
      address
      comments {
        items {
          id
        }
      }
    }
  }
`
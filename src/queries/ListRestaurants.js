import graphql from 'graphql-tag';

export default graphql`
  query listRestaurants {
    listRestaurants {
      items {
        id 
        name
        category
        city
      }
    }
  }
`


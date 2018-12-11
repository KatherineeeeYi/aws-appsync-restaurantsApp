import graphql from 'graphql-tag';

graphql`
query getRestaurant {
  getRestaurant(id: "033973a9-a6a4-4c54-8752-3b4410537aa2") {
    id 
    name
		category
    city
    comments {
      items {
        id
      }
    }
  }
}

query get {
  queryCommentsByIdRestaurantIdIndex(restaurantId: "033973a9-a6a4-4c54-8752-3b4410537aa2") {
    items {
      id
    }
  }
}



mutation commentOnRestaurant{
  commentOnRestaurant(input: {
      restaurantId: "033973a9-a6a4-4c54-8752-3b4410537aa2"
      content: "GREAT!!!"
      createdAt: "2018-12-03T03:24:45Z"
  }) {
      restaurantId
      id
      content
      createdAt
    }
}

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

query getRestaurant {
  getRestaurant(id: "ab923d25-9adc-4688-b2f5-e0d2dc6eeb10") {
    id
    name
    city
  }
}

mutation createRestaurant {
  createRestaurant(input: {
    name: "Lady MMMMMM"
    # address: "104 14th St NW, Charlottesville, VA 22903"
    category: "Dessert"
    city: "New York"
    # comments: ["Food is great!", "A good restaurant!"]  
  }) {
    id
    name
  }
}
`
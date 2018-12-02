import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import { compose, graphql } from 'react-apollo';
import ListRestaurants from './queries/ListRestaurants';

class App extends Component {
  state = {
    name: '',
    city: '',
    category: ''
  }
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </header>
        {
          this.props.restaurants.map((restaurant, index) => (
            <div>
              <p>{restaurant.name}</p>
            </div>
          ))
        }
      </div>
    );
  }
}

export default graphql(ListRestaurants, {
  options: {
    fetchPolicy: 'cache-and-network'
  },
  props: props => ({
    restaurants: props.data.listRestaurants ? props.data.listRestaurants.items : []
  })
})(App);

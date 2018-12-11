import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import "semantic-ui-css/semantic.min.css";
import AddRestaurant from './Components/AddRestaurant';
import Restaurants from './Components/Restaurants';
import ViewRestaurant from './Components/ViewRestaurant';

import './App.css';
import {AWSAppSyncClient as Client, defaultDataIdFromObject } from "aws-appsync";
import { Rehydrated } from 'aws-appsync-react';
import { ApolloProvider as Provider } from 'react-apollo';
import config from './aws-exports';

const Home = () => (
  <div className="container">
    <Restaurants />
  </div>
);

const App = () => (
  <BrowserRouter>
    <div>
      <Route exact={true} path="/" component={Home} />
      <Route path="/restaurant/:id" component={ViewRestaurant} />
      <Route path="/addRestaurant" component={AddRestaurant} />
    </div>
  </BrowserRouter>
);

const client = new Client({
  url: config.aws_appsync_graphqlEndpoint,
  region: config.aws_appsync_region,
  auth: {
    type: config.aws_appsync_authenticationType,
    apiKey: config.aws_appsync_apiKey,
  },
  cacheOptions: {
    dataIdFromObject: (obj) => {
      let id = defaultDataIdFromObject(obj);

      if (!id) {
        const { __typename: typename } = obj;
        switch (typename) {
          case 'Comment':
            return `${typename}:${obj.id}`;
          default:
            return id;
        }
      }

      return id;
    }
  }
});

const WithProvider = () => (
  <Provider client={client}>
    <Rehydrated>
      <App />
    </Rehydrated>
  </Provider>
);

export default WithProvider;

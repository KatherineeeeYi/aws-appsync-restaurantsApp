import React from 'react';
import ReactDom from 'react-dom';
import './index.css';
import App from './App';

// import Client from 'aws-appsync';

ReactDom.render(<App />, document.getElementById('root'));


// create a client 
// const client = new Client({
//   url: config.aws_appsync_graphqlEndpoint,
//   region: config.aws_appsync_region,
//   auth: {
//     type: config.aws_appsync_authenticationType,
//     apiKey: config.aws_appsync_apiKey
//   }
// });

// 
// const WithProvider = () => (
//   //data is imediately available offline
//   <Provider client={client}>
//     <Rehydrated>
//       <App />
//     </Rehydrated>
//   </Provider>
// );

// export default WithProvider;

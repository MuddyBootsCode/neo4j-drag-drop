import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '@atlaskit/css-reset';
import App from './App';
import {ApolloClient, ApolloProvider, InMemoryCache, makeVar} from "@apollo/client";


const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URI || 'http://localhost:4000',
<<<<<<< HEAD
  cache: new InMemoryCache(),
=======
  cache: new InMemoryCache({
    typePolicies: {
      Tasks: {
        keyFields: false
      }
    }
  }),
>>>>>>> 057942144a5d586729b25c8dabc259bd248b26de
})

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);



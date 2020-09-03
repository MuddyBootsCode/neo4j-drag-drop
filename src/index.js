import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import '@atlaskit/css-reset';
import App from './App';
import {ApolloClient, ApolloProvider, InMemoryCache, makeVar} from "@apollo/client";


const client = new ApolloClient({
  uri: process.env.REACT_APP_GRAPHQL_URI || 'http://localhost:4000',
  cache: new InMemoryCache(),
})

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
);



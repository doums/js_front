import 'core-js/stable'
import 'regenerator-runtime/runtime'
import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloClient } from 'apollo-client'
import { ApolloProvider } from '@apollo/react-hooks'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { setContext } from 'apollo-link-context'
import { BrowserRouter } from 'react-router-dom'
import App from './components/app'
import { AUTH_TOKEN } from './constants'
import './i18n'
import { io, IoContext } from './context'

const env = process.env.NODE_ENV

if (env === 'development') {
  module.hot.addStatusHandler(status => {
    if (status === 'apply') {
      console.log('HMR reloads')
    }
  })
}

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(AUTH_TOKEN)
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : ''
    }
  }
})

const httpLink = new HttpLink({
  uri: env === 'development' ? 'http://localhost:4000' : ''
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <IoContext.Provider value={io}>
        <App />
      </IoContext.Provider>
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById('root')
)

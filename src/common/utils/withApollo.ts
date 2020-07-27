import { createUploadLink } from '@matters/apollo-upload-client'
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory'
import { ApolloClient } from 'apollo-client'
import { ApolloLink } from 'apollo-link'
import { setContext } from 'apollo-link-context'
import { onError } from 'apollo-link-error'
import { createPersistedQueryLink } from 'apollo-link-persisted-queries'
import http from 'http'
import https from 'https'
import withApollo from 'next-with-apollo'

import { AGENT_HASH_PREFIX, STORE_KEY_AGENT_HASH } from '~/common/enums'
import introspectionQueryResultData from '~/common/gql/fragmentTypes.json'
import { randomString } from '~/common/utils'

import resolvers from './resolvers'
import typeDefs from './types'

// import { setupPersistCache } from './cache'

const fragmentMatcher = new IntrospectionFragmentMatcher({
  introspectionQueryResultData,
})

const isProd = process.env.NODE_ENV === 'production'

// toggle http for local dev
const agent =
  (process.env.NEXT_PUBLIC_API_URL || '').split(':')[0] === 'http'
    ? new http.Agent()
    : new https.Agent({
        rejectUnauthorized: isProd, // allow access to https:...matters.news in localhost
      })

// links
const persistedQueryLink = createPersistedQueryLink({
  useGETForHashedQueries: true,
})

const httpLink = ({ headers }: { [key: string]: any }) =>
  createUploadLink({
    uri: process.env.NEXT_PUBLIC_API_URL,
    headers,
    fetchOptions: {
      agent,
    },
  })

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, extensions, path }) =>
      console.log(
        `[GraphQL error]: Message: ${message}, Location: ${JSON.stringify(
          locations
        )}, Path: ${JSON.stringify(path)}, Code: ${
          extensions && extensions.code
        }`
      )
    )
  }
  if (networkError) {
    console.log(`[Network error]: ${networkError}`)
  }
})

const authLink = setContext((operation, { headers, publicQuery }) => {
  const operationName = operation.operationName || ''

  if (process.env.NODE_ENV !== 'production') {
    console.log(`\x1b[32m[GraphQL operation]\x1b[0m`, operationName)
  }

  const isPublicOperation = publicQuery || /Public$/.test(operationName)

  return {
    credentials: isPublicOperation ? 'omit' : 'include',
    headers: {
      ...headers,
      'x-client-name': 'web',
    },
  }
})

const sentryLink = setContext((_, { headers }) => {
  // Add action id for Sentry
  const actionId = randomString()

  import('@sentry/browser').then((Sentry) => {
    Sentry.configureScope((scope: any) => {
      scope.setTag('action-id', actionId)
    })
  })

  return {
    headers: {
      ...headers,
      'x-sentry-action-id': actionId,
    },
  }
})

const agentHashLink = setContext((_, { headers }) => {
  let hash: string | null = null

  if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem(STORE_KEY_AGENT_HASH)
    if (stored && stored.startsWith(AGENT_HASH_PREFIX)) {
      hash = stored
    }
  }

  return {
    headers: {
      ...headers,
      ...(hash ? { 'x-user-agent-hash': hash } : {}),
    },
  }
})

export default withApollo(({ ctx, headers, initialState }) => {
  const cache = new InMemoryCache({ fragmentMatcher })
  cache.restore(initialState || {})

  // setupPersistCache(cache)

  const client = new ApolloClient({
    link: ApolloLink.from([
      persistedQueryLink,
      errorLink,
      sentryLink,
      agentHashLink,
      authLink,
      httpLink({ headers }),
    ]),
    cache,
    resolvers,
    typeDefs,
  })

  return client
})

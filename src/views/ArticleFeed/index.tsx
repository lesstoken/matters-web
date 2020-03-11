import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'

import {
  ArticleDigestFeed,
  EmptyArticle,
  Footer,
  Head,
  InfiniteScroll,
  List,
  PageHeader,
  Spinner,
  Translate
} from '~/components'
import { QueryError } from '~/components/GQL'

import { ANALYTICS_EVENTS, FEED_TYPE } from '~/common/enums'
import { analytics, mergeConnections } from '~/common/utils'

import { AllIcymis } from './__generated__/AllIcymis'
import { AllTopics } from './__generated__/AllTopics'

interface ArticleFeedProp {
  type?: 'icymi' | 'topic'
}

const QUERIES = {
  topic: gql`
    query AllTopics($after: String) {
      viewer {
        id
        recommendation {
          articles: topics(input: { first: 10, after: $after }) {
            pageInfo {
              startCursor
              endCursor
              hasNextPage
            }
            edges {
              cursor
              node {
                ...ArticleDigestFeedArticle
              }
            }
          }
        }
      }
    }
    ${ArticleDigestFeed.fragments.article}
  `,
  icymi: gql`
    query AllIcymis($after: String) {
      viewer {
        id
        recommendation {
          articles: icymi(input: { first: 10, after: $after }) {
            pageInfo {
              startCursor
              endCursor
              hasNextPage
            }
            edges {
              cursor
              node {
                ...ArticleDigestFeedArticle
              }
            }
          }
        }
      }
    }
    ${ArticleDigestFeed.fragments.article}
  `
}

const Feed = ({ type = 'topic' }: ArticleFeedProp) => {
  const { data, loading, error, fetchMore } = useQuery<AllTopics | AllIcymis>(
    QUERIES[type]
  )

  if (loading) {
    return <Spinner />
  }

  if (error) {
    return <QueryError error={error} />
  }

  const connectionPath = 'viewer.recommendation.articles'
  const { edges, pageInfo } = data?.viewer?.recommendation.articles || {}

  if (!edges || edges.length <= 0 || !pageInfo) {
    return <EmptyArticle />
  }

  const loadMore = () => {
    analytics.trackEvent(ANALYTICS_EVENTS.LOAD_MORE, {
      type: type === 'topic' ? FEED_TYPE.ALL_TOPICS : FEED_TYPE.ALL_ICYMI,
      location: edges.length
    })
    return fetchMore({
      variables: {
        after: pageInfo.endCursor
      },
      updateQuery: (previousResult, { fetchMoreResult }) =>
        mergeConnections({
          oldData: previousResult,
          newData: fetchMoreResult,
          path: connectionPath
        })
    })
  }

  return (
    <InfiniteScroll hasNextPage={pageInfo.hasNextPage} loadMore={loadMore}>
      <List hasBorder>
        {edges.map(({ node, cursor }, i) => (
          <List.Item key={cursor}>
            <ArticleDigestFeed
              article={node}
              onClick={() =>
                analytics.trackEvent(ANALYTICS_EVENTS.CLICK_FEED, {
                  type:
                    type === 'topic'
                      ? FEED_TYPE.ALL_TOPICS
                      : FEED_TYPE.ALL_ICYMI,
                  location: i
                })
              }
            />
          </List.Item>
        ))}
      </List>
    </InfiniteScroll>
  )
}

export default ({ type = 'topic' }: ArticleFeedProp) => (
  <main className="l-row">
    <article className="l-col-4 l-col-md-5 l-col-lg-8">
      <Head title={{ id: type === 'topic' ? 'allTopics' : 'allIcymi' }} />

      <PageHeader
        title={<Translate id={type === 'topic' ? 'allTopics' : 'allIcymi'} />}
      />

      <section>
        <Feed type={type} />
      </section>
    </article>

    <aside className="l-col-4 l-col-md-3 l-col-lg-4">
      <Footer />
    </aside>
  </main>
)

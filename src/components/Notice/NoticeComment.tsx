import gql from 'graphql-tag'

import { Card, Expandable } from '~/components'
import CommentContent from '~/components/Comment/Content'

import { toPath } from '~/common/utils'

import styles from './styles.css'

import { NoticeComment as NoticeCommentType } from './__generated__/NoticeComment'

const fragments = {
  comment: gql`
    fragment NoticeComment on Comment {
      id
      state
      type
      node {
        ... on Article {
          id
          title
          slug
          mediaHash
          author {
            id
            userName
          }
        }
        ... on Circle {
          id
          name
        }
      }
      parentComment {
        id
      }
      ...ContentCommentPublic
      ...ContentCommentPrivate
    }
    ${CommentContent.fragments.comment.public}
    ${CommentContent.fragments.comment.private}
  `,
}

const NoticeComment = ({ comment }: { comment: NoticeCommentType | null }) => {
  const article =
    comment?.node.__typename === 'Article' ? comment.node : undefined
  const circle =
    comment?.node.__typename === 'Circle' ? comment.node : undefined

  if (!comment) {
    return null
  }

  const path =
    comment.state === 'active'
      ? toPath({
          page: 'commentDetail',
          comment,
          article,
          circle,
        })
      : {}

  return (
    <section className="sub-content">
      <Card
        {...path}
        bgColor="grey-lighter"
        spacing={['xtight', 'base']}
        borderRadius="xtight"
      >
        <Expandable content={comment.content} size="sm">
          <CommentContent comment={comment} type="article" size="sm" />
        </Expandable>
      </Card>

      <style jsx>{styles}</style>
    </section>
  )
}

NoticeComment.fragments = fragments

export default NoticeComment

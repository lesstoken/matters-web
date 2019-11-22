import classNames from 'classnames'
import _get from 'lodash/get'
import Link from 'next/link'
import { useState } from 'react'

import { Expandable } from '~/components/Expandable'
import CommentForm from '~/components/Form/CommentForm'
import { FeedDigestComment } from '~/components/GQL/fragments/__generated__/FeedDigestComment'
import { FolloweeFeedDigestComment } from '~/components/GQL/fragments/__generated__/FolloweeFeedDigestComment'
import commentFragments from '~/components/GQL/fragments/comment'
import { Icon } from '~/components/Icon'
import { Translate } from '~/components/Language'
import { TextIcon } from '~/components/TextIcon'
import { UserDigest } from '~/components/UserDigest'

import { toPath } from '~/common/utils'
import ICON_MORE_CONTENT from '~/static/icons/more-content.svg?sprite'

import CommentContent from '../Content'
import DropdownActions from '../DropdownActions'
import FooterActions, { FooterActionsControls } from '../FooterActions'
import CancelEditButton from './CancelEditButton'
import CommentToArticle from './CommentToArticle'
import DescendantComment from './DescendantComment'
import PinnedLabel from './PinnedLabel'
import ReplyTo from './ReplyTo'
import styles from './styles.css'

const COLLAPSE_DESCENDANT_COUNT = 2

const fragments = {
  comment: commentFragments.feed
}

const FeedDigest = ({
  comment,
  inArticle,
  expandDescendants,
  commentCallback,
  hasDropdownActions = true,
  inFolloweeFeed,
  ...actionControls
}: {
  comment: FeedDigestComment | FolloweeFeedDigestComment
  inArticle?: boolean
  expandDescendants?: boolean
  commentCallback?: () => void
  hasDropdownActions?: boolean
  inFolloweeFeed?: boolean
} & FooterActionsControls) => {
  const [edit, setEdit] = useState(false)
  const {
    id,
    article,
    state,
    content,
    author,
    replyTo,
    parentComment,
    pinned,
    comments
  } = comment

  // descendant
  const descendantComments = (
    (comment.comments && comments.edges) ||
    []
  ).filter(({ node }) => node.state === 'active')
  const restDescendantCommentCount =
    descendantComments.length - COLLAPSE_DESCENDANT_COUNT
  const [expand, setExpand] = useState(
    expandDescendants || restDescendantCommentCount <= 0
  )

  // UI
  const containerClass = classNames({
    container: true,
    'in-article': inArticle
  })
  const domNodeId = parentComment ? `${parentComment.id}-${comment.id}` : id

  const hasReplyTo =
    replyTo &&
    (!parentComment || replyTo.id !== parentComment.id) &&
    !inFolloweeFeed

  const parentId = comment && parentComment && parentComment.id
  const path = toPath({
    page: 'articleDetail',
    userName: article.author.userName || '',
    slug: article.slug || '',
    mediaHash: article.mediaHash || '',
    fragment: parentId ? `${parentId}-${comment.id}` : id
  })

  return (
    <section
      className={containerClass}
      id={actionControls.hasLink ? domNodeId : ''}
    >
      <div>
        <header className="header">
          <div>
            <section className="author-row">
              <UserDigest.Mini
                user={author}
                avatarSize={inFolloweeFeed ? 'xxsmall' : 'small'}
                textWeight="medium"
                hasUserName={inArticle}
              />

              {inFolloweeFeed && <CommentToArticle comment={comment} />}

              {!!inFolloweeFeed && pinned && <PinnedLabel />}
            </section>

            {hasReplyTo && replyTo && (
              <ReplyTo user={replyTo.author} inArticle={!!inArticle} />
            )}
          </div>

          {hasDropdownActions && (
            <DropdownActions
              comment={comment}
              editComment={() => setEdit(true)}
            />
          )}
        </header>
        <Link {...path}>
          <a className="article-title">{article.title}</a>
        </Link>
      </div>

      <div className="content-wrap">
        {edit && (
          <CommentForm
            commentId={comment.id}
            articleId={comment.article.id}
            submitCallback={() => setEdit(false)}
            extraButton={<CancelEditButton onClick={() => setEdit(false)} />}
            blocked={comment.article.author.isBlocking}
            defaultContent={comment.content}
            defaultExpand={edit}
          />
        )}

        {!edit && inFolloweeFeed && (
          <Expandable limit={5} buffer={2}>
            <Link {...path}>
              <a>
                <CommentContent state={state} content={content} />
              </a>
            </Link>
          </Expandable>
        )}

        {!edit && !inFolloweeFeed && (
          <CommentContent state={state} content={content} />
        )}

        {!edit && (
          <FooterActions
            comment={comment}
            refetch={inArticle}
            commentCallback={commentCallback}
            {...actionControls}
          />
        )}

        {descendantComments.length > 0 && (
          <ul className="descendant-comments">
            {descendantComments
              .slice(0, expand ? undefined : COLLAPSE_DESCENDANT_COUNT)
              .map(({ node, cursor }) => (
                <li key={cursor}>
                  <DescendantComment
                    comment={node}
                    inArticle={inArticle}
                    commentCallback={commentCallback}
                    {...actionControls}
                  />
                </li>
              ))}
            {!expand && (
              <button
                className="more-button"
                type="button"
                onClick={() => setExpand(true)}
              >
                <TextIcon
                  icon={
                    <Icon
                      id={ICON_MORE_CONTENT.id}
                      viewBox={ICON_MORE_CONTENT.viewBox}
                      size="small"
                    />
                  }
                  color="green"
                  size="sm"
                  textPlacement="left"
                  spacing="xxtight"
                >
                  <Translate
                    zh_hant={`查看 ${restDescendantCommentCount} 條回應`}
                    zh_hans={`查看 ${restDescendantCommentCount} 条回应`}
                  />
                </TextIcon>
              </button>
            )}
          </ul>
        )}
      </div>

      <style jsx>{styles}</style>
    </section>
  )
}

FeedDigest.fragments = fragments

export default FeedDigest

import { ANALYTICS, ANALYTIC_TYPES } from '~/common/enums'

const trackAs =
  (type: string) =>
  (...args: EventArgs) => {
    // construct event with details
    const event = new CustomEvent(ANALYTICS, {
      detail: { args, type },
    })

    // dispatch event
    window.dispatchEvent(event)
  }

export const analytics = {
  trackEvent: trackAs(ANALYTIC_TYPES.TRACK),
  trackPage: trackAs(ANALYTIC_TYPES.PAGE),
  identifyUser: trackAs(ANALYTIC_TYPES.IDENTIFY),
}

type EventArgs =
  | [] // identify user
  | ['page_view', PageViewProp] // pageview
  | ['pull_to_refresh']
  | ['click_feed', ClickFeedProp]
  | ['click_button', ClickButtonProp]
  | ['load_more', LoadMoreProp]
  | ['share', ShareProp]
  | ['share_dialog', ViewDialogProp]
  | ['purchase', PurchaseProp]
  | ['subscribe', SubscribeProps]
  | ['view_add_credit_dialog', ViewDialogProp]
  | ['view_donation_dialog', ViewDialogProp]
  | ['view_subscribe_circle_dialog', ViewDialogProp]
  | ['card_exposure', CardExposureProp]
  | ['tag_exposure', TagExposureProp]

/**
 * Event: Page View
 */
interface PageViewProp {
  page_referrer: string
}

/**
 * Event: Click Button
 */
interface ClickButtonProp {
  type:
    | 'checkout' // `next step` after top up dialog
    | 'donate'
    | 'share_article'
    | 'share_user'
    | 'signup'
    | 'login/signup'
    | 'connectorMetaMask'
    | 'connectorWalletConnect'
    | 'top_up'
    | 'translation' // translation button
    | 'write'
    | 'write_collection'
    | 'google_search'
    | 'subscribe_circle_banner'
    | 'subscribe_circle_price'
    | 'subscribe_confirm'
    | 'create_circle'
    | 'finish_circle_creation'
    | 'remove_tag'
    | 'click_tag'
    | 'try_login_from_visitor'
  pageType?: PageType
}

/**
 * Event: Load More
 */
interface LoadMoreProp {
  type:
    | ArticleFeedType
    | CommentFeedType
    | UserFeedType
    | TagFeedType
    | CircleFeedType
  location: number
}

/**
 * Event: Share
 */
interface ShareProp {
  type:
    | 'line'
    | 'whatsapp'
    | 'telegram'
    | 'wechat'
    | 'twitter'
    | 'email'
    | 'facebook'
    | 'weibo'
    | 'douban'
    | 'copy-url'
}

/**
 * Event: Purchase
 */
interface PurchaseProp {
  amount: number | undefined
  success: boolean
  message?: string
}

/**
 * Event: Subscribe
 */
interface SubscribeProps {
  id: string | undefined
  success: boolean
  message?: string
}

/**
 * Event: View Dialog
 */
interface ViewDialogProp {
  step: string
}

/**
 * Event: Click Feed
 */
interface ClickFeedProp {
  type: FeedType
  contentType: ContentType | ActivityType
  location: number | string
  id?: string
}

/**
 * Event: Card Exposure
 */

interface CardExposureProp {
  id: string
  feedType: FeedType
  contentType: ContentType | ActivityType
  location: number | string
  delay_msecs?: number
}

interface TagExposureProp {
  id: string
  location: number | string
  delay_msecs?: number
}

// content type
export type ContentType = 'article' | 'comment' | 'circle' | 'user' | 'tag'
export type ActivityType =
  | 'UserPublishArticleActivity'
  | 'UserBroadcastCircleActivity'
  | 'UserCreateCircleActivity'
  | 'UserCollectArticleActivity'
  | 'UserSubscribeCircleActivity'
  | 'UserFollowUserActivity'
  | 'UserDonateArticleActivity'
  | 'UserBookmarkArticleActivity'
  | 'UserAddArticleTagActivity'
  | 'RecommendArticleActivity'
  | 'ArticleRecommendationActivity'
  | 'CircleRecommendationActivity'
  | 'UserRecommendationActivity'

// feed type
export type FeedType =
  | ArticleFeedType
  | CommentFeedType
  | UserFeedType
  | TagFeedType
  | CircleFeedType
  | 'following'

type ArticleFeedType =
  | 'all_authors'
  | 'appreciations_sent'
  | 'appreciations_received'
  | 'all_icymi'
  | 'all_topics'
  | 'authors' // author feed on home page
  | 'collection'
  | 'hottest'
  | 'icymi'
  | 'newest'
  | 'read_history'
  | 'related_article'
  | 'search'
  | 'search_article'
  | 'tag_detail_latest'
  | 'tag_detail_hottest'
  | 'tag_detail_selected'
  | 'tags' // tag feed with articles on home page
  | 'transaction' // transaction history
  | 'topics'
  | 'user_article'
  | 'wallet'
  | 'related_donations'
  | 'circle_detail'

type CommentFeedType =
  //  'follow-comment' |
  'user_comment'

type UserFeedType =
  | 'all_authors'
  | 'all_icymi'
  | 'all_topics'
  | 'appreciations_sent'
  | 'appreciations_received'
  | 'appreciators'
  | 'donators'
  | 'authors' // author list on home page
  | 'collection'
  | 'follow'
  | 'followee'
  | 'follower'
  | 'hottest'
  | 'icymi'
  | 'newest'
  | 'search'
  | 'search_user'
  | 'tag_detail_latest'
  | 'tag_detail_selected'
  | 'tag_detail_community'
  | 'transaction'

type TagFeedType =
  | 'all_tags' // all tags page (hottest)
  | 'all_tags_recommended' // all tags page (recommended)
  | 'all_tags_sidebar'
  | 'related_tags'
  // | 'follow-tag'
  | 'search'
  | 'search_tag'
  | 'tags' // tag feed on home page
  | 'user_tag'

type CircleFeedType = 'user_circle' | 'circle_follower' | 'circle_member'

type PageType =
  | 'article_detail'
  | 'user_profile'
  | 'circle_detail'
  | 'edit_draft'

export interface UtmParams {
  utm_source?: string // required in most cases
  utm_medium?: string // required in most cases
  utm_campaign?: string // all others are really optional
  utm_content?: string
  utm_term?: string
  utm_id?: string
}

export type UtmParam = keyof UtmParams

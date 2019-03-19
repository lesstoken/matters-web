import { Query } from 'react-apollo'

import { Translate } from '~/components'
import RecallButton from '~/components/DraftDigest/Components/RecallButton'
import { PublishStateDraft } from '~/components/GQL/fragments/__generated__/PublishStateDraft'
import DRAFT_PUBLISH_STATE from '~/components/GQL/queries/draftPublishState'
import { useCountdown } from '~/components/Hook'
import { Toast } from '~/components/Toast'

const PendingState = ({ draft }: { draft: PublishStateDraft }) => {
  const scheduledAt = draft.scheduledAt
  const {
    countdown: { timeLeft },
    formattedTimeLeft
  } = useCountdown({ timeLeft: Date.parse(scheduledAt) - Date.now() })
  const isPublishing = !scheduledAt || !timeLeft || timeLeft <= 0

  return (
    <Query
      variables={{ id: draft.id }}
      query={DRAFT_PUBLISH_STATE}
      pollInterval={1000 * 5}
      errorPolicy="none"
      skip={!process.browser || !isPublishing}
    >
      {() => (
        <Toast
          color="green"
          header={
            isPublishing ? (
              <Translate zh_hant="正在發佈" zh_hans="正在发布" />
            ) : (
              <Translate
                zh_hant={`正在等待發佈 (${formattedTimeLeft.mmss})`}
                zh_hans={`正在等待发布 (${formattedTimeLeft.mmss})`}
              />
            )
          }
          content={
            <Translate
              zh_hant="上鏈後，文章不可刪改，永久保存"
              zh_hans="上链后，文章不可删改，永久保存"
            />
          }
          customButton={
            <RecallButton
              id={draft.id}
              text={<Translate zh_hant="撤銷" zh_hans="撤销" />}
            />
          }
          buttonPlacement="bottom"
        />
      )}
    </Query>
  )
}

export default PendingState

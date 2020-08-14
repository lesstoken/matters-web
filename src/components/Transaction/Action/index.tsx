import { Avatar, IconHeart } from '~/components'

import styles from './styles.css'

import {
  DigestTransaction_recipient as Recipient,
  DigestTransaction_sender as Sender,
} from '../__generated__/DigestTransaction'

/**
 * This a sub component of Transaction that depicts a donation
 * came from current viewer or other user with heaer icon.
 *
 * Usage:
 *
 * ```tsx
 *  <Action
 *    isSender={true}
 *    sender={sender}
 *    recipient={recipient}
 *  />
 * ```
 */

interface ActionProps {
  isSender: boolean
  sender?: Sender | null
  recipient?: Recipient | null
}

const Action = ({ isSender, sender, recipient }: ActionProps) => (
  <>
    {!isSender && sender && (
      <section className="from">
        <Avatar size="sm" user={sender} />
        <div className="outline">
          <IconHeart size="md" color="red" />
        </div>
      </section>
    )}

    {isSender && recipient && (
      <section className="to">
        <IconHeart size="md" color="red" />
        <div className="outline">
          <Avatar size="sm" user={recipient} />
        </div>
      </section>
    )}
    <style jsx>{styles}</style>
  </>
)

export default Action

import { useQuery } from '@apollo/react-hooks'
import { ethers } from 'ethers'
import gql from 'graphql-tag'
import { useContext } from 'react'

import {
  Button,
  CopyToClipboard,
  Form,
  IconCopy16,
  LanguageContext,
  Translate,
  usePullToRefresh,
  ViewerContext,
} from '~/components'

import { OPEN_LIKE_COIN_DIALOG, PATHS } from '~/common/enums'
import { maskAddress, translate } from '~/common/utils'

import styles from './styles.css'

import { ViewerLikeInfo } from './__generated__/ViewerLikeInfo'

const VIEWER_LIKE_INFO = gql`
  query ViewerLikeInfo {
    viewer {
      id
      info {
        email
        ethAddress
      }
      liker {
        total
        rateUSD
      }
    }
  }
`

const WalletSettings = () => {
  const viewer = useContext(ViewerContext)
  const { lang } = useContext(LanguageContext)

  const likerId = viewer.liker.likerId
  const { data, refetch } = useQuery<ViewerLikeInfo>(VIEWER_LIKE_INFO, {
    errorPolicy: 'none',
    skip: typeof window === 'undefined',
  })

  const ethAddress = data?.viewer?.info?.ethAddress
    ? ethers.utils.getAddress(data.viewer.info.ethAddress)
    : ''
  const shortAddress = ethAddress ? maskAddress(ethAddress) : ''

  usePullToRefresh.Handler(refetch)

  return (
    <Form.List groupName={<Translate id="settingsWallet" />}>
      <Form.List.Item
        title="Liker ID"
        onClick={
          !likerId
            ? () =>
                window.dispatchEvent(new CustomEvent(OPEN_LIKE_COIN_DIALOG, {}))
            : undefined
        }
        rightText={likerId || <Translate id="setup" />}
      />

      <Form.List.Item
        title={
          ethAddress ? (
            <Translate id="walletAddress" />
          ) : (
            <Translate id="loginWithWallet" />
          )
        }
        href={ethAddress ? undefined : PATHS.ME_SETTINGS_CONNECT_WALLET}
        rightText={
          ethAddress ? (
            <>
              <span className="address">{shortAddress}</span>
              <CopyToClipboard text={ethAddress}>
                <Button
                  spacing={['xtight', 'xtight']}
                  bgActiveColor="grey-lighter"
                  aria-label={translate({ id: 'copy', lang })}
                >
                  <IconCopy16 color="grey" />
                </Button>
              </CopyToClipboard>
            </>
          ) : (
            <Translate
              zh_hant="前往設定"
              zh_hans="前往设置"
              en="Click to connect"
            />
          )
        }
        rightTextColor={ethAddress ? 'grey-darker' : 'green'}
      />

      <style jsx>{styles}</style>
    </Form.List>
  )
}

export default WalletSettings

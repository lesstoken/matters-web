import { useContext, useState } from 'react'

import {
  Avatar,
  Form,
  IconChecked,
  LanguageContext,
  Translate,
} from '~/components'

import { translate } from '~/common/utils'

import styles from './styles.css'

import { EditProfileDialogUserPrivate_info_cryptoWallet_nfts } from '../__generated__/EditProfileDialogUserPrivate'

type NFTCollectionProps = {
  nfts: EditProfileDialogUserPrivate_info_cryptoWallet_nfts[]
  setField: (url: string) => void
}

const NFTCollectionItem = ({
  index,
  selectedIndex,
  nft: { name, description, imagePreviewUrl },
  onClick,
}: {
  index: number
  selectedIndex: number
  nft: EditProfileDialogUserPrivate_info_cryptoWallet_nfts
  onClick: (event?: React.MouseEvent<HTMLElement>) => any
}) => {
  return (
    <button
      type="button"
      className="nftCollectionItem"
      onClick={onClick}
      title={`${name}\n- ${description}`}
    >
      <Avatar size="xxxl" src={imagePreviewUrl} />

      {index === selectedIndex && (
        <span className="checked">
          <IconChecked size="md-s" color="green" />
        </span>
      )}

      <style jsx>{styles}</style>
    </button>
  )
}

const NFTCollection: React.FC<NFTCollectionProps> = ({ nfts, setField }) => {
  const { lang } = useContext(LanguageContext)
  const [selectedNFTIndex, setSelectedNFTIndex] = useState<number>(-1)
  const fieldId = `field-nft-collection`
  const fieldMsgId = `field-msg-nft-collection`

  return (
    <Form.Field>
      <Form.Field.Header
        label={<Translate id="myNFTCollections" />}
        htmlFor={fieldId}
      />

      <Form.Field.Content>
        <ul className="nftCollection" id={fieldId}>
          {nfts.map((nft, index) => (
            <li key={nft.id}>
              <NFTCollectionItem
                index={index}
                selectedIndex={selectedNFTIndex}
                nft={nft}
                onClick={() => {
                  setSelectedNFTIndex(index)
                  setField(nft.imagePreviewUrl || '')
                }}
              />
            </li>
          ))}
          <style jsx>{styles}</style>
        </ul>
      </Form.Field.Content>

      <Form.Field.Footer
        fieldMsgId={fieldMsgId}
        hint={translate({
          lang,
          zh_hant: '選擇 NFT 作為你的頭像',
          zh_hans: '选择 NFT 作为你的头像',
          en: 'Select NFT as your avatar',
        })}
      />
    </Form.Field>
  )
}

export default NFTCollection

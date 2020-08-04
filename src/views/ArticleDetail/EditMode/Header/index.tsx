import gql from 'graphql-tag'

import { Button, IconSpinner, Tag, TextIcon, Translate } from '~/components'
import { useMutation } from '~/components/GQL'
import articleFragments from '~/components/GQL/fragments/article'

import { ADD_TOAST } from '~/common/enums'

import styles from './styles.css'

import { ArticleDigestDropdownArticle } from '~/components/ArticleDigest/Dropdown/__generated__/ArticleDigestDropdownArticle'
import { EditArticle } from './__generated__/EditArticle'

interface EditModeHeaderProps {
  id: string
  mediaHash: string
  editModeTags: string[]
  editModeCollection: ArticleDigestDropdownArticle[]
  onEditSaved: () => any
}

/**
 * Note:
 *
 * The response of this mutation is aligned with `COLLECTION_LIST` in `CollectionList.tsx`,
 * so that it will auto update the local cache and prevent refetch logics
 */
const EDIT_ARTICLE = gql`
  mutation EditArticle(
    $id: ID!
    $mediaHash: String!
    $tags: [String!]
    $collection: [ID!]
    $after: String
    $first: Int = null
  ) {
    editArticle(input: { id: $id, tags: $tags, collection: $collection }) {
      id
      tags {
        ...DigestTag
        selected(input: { mediaHash: $mediaHash })
      }
      ...ArticleCollection
    }
  }
  ${Tag.fragments.tag}
  ${articleFragments.articleCollection}
`

const EditModeHeader = ({
  id,
  mediaHash,
  editModeTags,
  editModeCollection,
  onEditSaved,
}: EditModeHeaderProps) => {
  const [editArticle, { loading }] = useMutation<EditArticle>(EDIT_ARTICLE)

  const onSave = async () => {
    try {
      await editArticle({
        variables: {
          id,
          mediaHash,
          tags: editModeTags,
          collection: editModeCollection.map(({ id: articleId }) => articleId),
          first: null,
        },
      })
      onEditSaved()
    } catch (e) {
      window.dispatchEvent(
        new CustomEvent(ADD_TOAST, {
          detail: {
            color: 'red',
            content: <Translate zh_hant="保存失敗" zh_hans="保存失敗" />,
          },
        })
      )
    }
  }

  return (
    <>
      <p>
        <Translate
          zh_hant="作品已發佈到 IPFS，無法被修改，但你可以修訂關聯作品和標籤。"
          zh_hans="作品已发布到 IPFS，无法被修改，但你可以修订关联作品和标签。"
        />
      </p>

      <Button
        size={['4rem', '2rem']}
        bgColor="green"
        onClick={onSave}
        aria-haspopup="true"
      >
        <TextIcon
          color="white"
          size="md"
          weight="md"
          icon={loading && <IconSpinner size="sm" />}
        >
          {loading ? null : <Translate id="save" />}
        </TextIcon>
      </Button>

      <style jsx>{styles}</style>
    </>
  )
}

export default EditModeHeader

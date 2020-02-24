import VisuallyHidden from '@reach/visually-hidden'
import gql from 'graphql-tag'

import { Button, Icon, Spinner, TextIcon, Translate } from '~/components'
import { useMutation } from '~/components/GQL'
import UPLOAD_FILE from '~/components/GQL/mutations/uploadFile'

import {
  ACCEPTED_UPLOAD_IMAGE_TYPES,
  ADD_TOAST,
  UPLOAD_IMAGE_SIZE_LIMIT
} from '~/common/enums'

import Cover from '../../../Cover'
import styles from './styles.css'

import { SingleFileUpload } from '~/components/GQL/mutations/__generated__/SingleFileUpload'
import { UpdateUserInfoCover } from './__generated__/UpdateUserInfoCover'

/**
 * This component is for uploading profile cover.
 *
 * Usage:
 *
 * ```jsx
 *   <ProfileCoverUploader user={user} />
 * ```
 */

interface Props {
  user: any
}

const UPDATE_USER_INFO = gql`
  mutation UpdateUserInfoCover($input: UpdateUserInfoInput!) {
    updateUserInfo(input: $input) {
      id
      info {
        profileCover
      }
    }
  }
`

export const ProfileCoverUploader: React.FC<Props> = ({ user }) => {
  const [update, { loading: updateLoading }] = useMutation<UpdateUserInfoCover>(
    UPDATE_USER_INFO
  )
  const [upload, { loading: uploadLoading }] = useMutation<SingleFileUpload>(
    UPLOAD_FILE
  )
  const acceptTypes = ACCEPTED_UPLOAD_IMAGE_TYPES.join(',')

  const handleChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation()

    if (!upload || !event.target || !event.target.files) {
      return
    }

    const file = event.target.files[0]
    event.target.value = ''

    if (file?.size > UPLOAD_IMAGE_SIZE_LIMIT) {
      window.dispatchEvent(
        new CustomEvent(ADD_TOAST, {
          detail: {
            color: 'red',
            content: (
              <Translate
                zh_hant="上傳檔案超過 5 MB"
                zh_hans="上传文件超过 5 MB"
              />
            )
          }
        })
      )
      return
    }

    try {
      const { data } = await upload({
        variables: {
          input: { file, type: 'profileCover', entityType: 'user' }
        }
      })
      const id = data?.singleFileUpload.id

      if (update) {
        return update({ variables: { input: { profileCover: id } } })
      }
    } catch (e) {
      // TODO
    }
  }

  const removeCover = async () => {
    if (!update || !user.info.profileCover) {
      return
    }

    try {
      await update({ variables: { input: { profileCover: null } } })
    } catch (e) {
      // TODO
    }
  }

  return (
    <label htmlFor="profile-input">
      <Cover cover={user.info.profileCover} />

      <div className="mask">
        {uploadLoading || updateLoading ? (
          <Spinner />
        ) : (
          <Icon.CameraMedium color="white" size="xl" />
        )}

        {user.info.profileCover && (
          <section className="delete">
            <Button
              size={[null, '1.25rem']}
              spacing={[0, 'xtight']}
              borderColor="white"
              borderWidth="sm"
              onClick={removeCover}
            >
              <TextIcon color="white" size="xs">
                <Translate id="delete" />
              </TextIcon>
            </Button>
          </section>
        )}
      </div>

      <VisuallyHidden>
        <input
          id="profile-input"
          type="file"
          name="file"
          aria-label="上傳封面"
          accept={acceptTypes}
          multiple={false}
          onChange={handleChange}
        />
      </VisuallyHidden>

      <style jsx>{styles}</style>
    </label>
  )
}

export default ProfileCoverUploader

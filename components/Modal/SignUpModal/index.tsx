import { FC, useContext, useState } from 'react'

import SignUpComplete from '~/components/Form/SignUpComplete'
import { SignUpInitForm, SignUpProfileForm } from '~/components/Form/SignUpForm'
import { LanguageContext } from '~/components/Language'
import { Modal } from '~/components/Modal'

import { TEXT } from '~/common/enums'
import { translate } from '~/common/utils'

/**
 * This component is for sign up modal.
 *
 * Usage:
 *
 * ```jsx
 *   <SignUpModal close={close} />
 * ```
 *
 */

type Step = 'signUp' | 'profile' | 'complete'

const SignUpModal: FC<ModalInstanceProps> = ({ closeable, setCloseable }) => {
  const { lang } = useContext(LanguageContext)

  const [step, setStep] = useState<Step>('signUp')
  const data = {
    signUp: {
      title: translate({
        zh_hant: TEXT.zh_hant.register,
        zh_hans: TEXT.zh_hans.register,
        lang
      })
    },
    profile: {
      title: translate({
        zh_hant: TEXT.zh_hant.userProfile,
        zh_hans: TEXT.zh_hans.userProfile,
        lang
      })
    },
    complete: {
      title: translate({
        zh_hant: TEXT.zh_hant.registerSuccess,
        zh_hans: TEXT.zh_hans.registerSuccess,
        lang
      })
    }
  }

  const signUpCallback = ({ email, codeId, password }: any) => {
    setCloseable(false)
    setStep('profile')
  }

  const profileCallback = () => {
    setStep('complete')
  }

  return (
    <>
      <Modal.Header title={data[step].title} closeable={closeable} />

      {step === 'signUp' && (
        <SignUpInitForm purpose="modal" submitCallback={signUpCallback} />
      )}
      {step === 'profile' && (
        <SignUpProfileForm purpose="modal" submitCallback={profileCallback} />
      )}
      {step === 'complete' && <SignUpComplete />}
    </>
  )
}

export default SignUpModal

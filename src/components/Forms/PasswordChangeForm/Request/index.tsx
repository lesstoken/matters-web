import { useFormik } from 'formik'
import _isEmpty from 'lodash/isEmpty'
import { useContext } from 'react'

import {
  Dialog,
  Form,
  LanguageContext,
  SendCodeButton,
  Translate
} from '~/components'
import { getErrorCodes, useMutation } from '~/components/GQL'
import { CONFIRM_CODE } from '~/components/GQL/mutations/verificationCode'

import { TEXT } from '~/common/enums'
import { translate, validateCode, validateEmail } from '~/common/utils'

import { ConfirmVerificationCode } from '~/components/GQL/mutations/__generated__/ConfirmVerificationCode'

interface FormProps {
  defaultEmail: string
  purpose: 'forget' | 'change'
  submitCallback?: (params: any) => void
}

interface FormValues {
  email: string
  code: string
}

export const PasswordChangeRequestForm: React.FC<FormProps> = formProps => {
  const [confirmCode] = useMutation<ConfirmVerificationCode>(CONFIRM_CODE)
  const { lang } = useContext(LanguageContext)
  const { defaultEmail = '', purpose, submitCallback } = formProps

  const {
    values,
    errors,
    touched,
    handleBlur,
    handleChange,
    handleSubmit,
    isSubmitting
  } = useFormik<FormValues>({
    initialValues: {
      email: defaultEmail,
      code: ''
    },
    validate: ({ email, code }) => {
      const isInvalidEmail = validateEmail(email, lang, { allowPlusSign: true })
      const isInvalidCode = validateCode(code, lang)
      return {
        ...(isInvalidEmail ? { email: isInvalidEmail } : {}),
        ...(isInvalidCode ? { code: isInvalidCode } : {})
      }
    },
    onSubmit: async ({ email, code }, { setFieldError, setSubmitting }) => {
      try {
        const { data } = await confirmCode({
          variables: { input: { email, type: 'password_reset', code } }
        })
        const confirmVerificationCode = data?.confirmVerificationCode

        if (submitCallback && confirmVerificationCode) {
          submitCallback({ email, codeId: confirmVerificationCode })
        }
      } catch (error) {
        const errorCode = getErrorCodes(error)[0]
        const errorMessage = translate({
          zh_hant: TEXT.zh_hant.error[errorCode] || errorCode,
          zh_hans: TEXT.zh_hans.error[errorCode] || errorCode,
          lang
        })

        if (errorCode.indexOf('CODE_') >= 0) {
          setFieldError('code', errorMessage)
        } else {
          setFieldError('email', errorMessage)
        }
      }

      setSubmitting(false)
    }
  })

  return (
    <Form onSubmit={handleSubmit}>
      <Dialog.Content spacing={['xloose', 'xxxloose']}>
        <Form.Input
          label={
            <Translate
              zh_hant={TEXT.zh_hant.email}
              zh_hans={TEXT.zh_hans.email}
            />
          }
          type="email"
          name="email"
          placeholder={
            purpose === 'forget'
              ? translate({
                  zh_hant: TEXT.zh_hant.enterRegisteredEmail,
                  zh_hans: TEXT.zh_hans.enterRegisteredEmail,
                  lang
                })
              : translate({
                  zh_hant: TEXT.zh_hant.enterEmail,
                  zh_hans: TEXT.zh_hans.enterEmail,
                  lang
                })
          }
          value={values.email}
          error={touched.email && errors.email}
          disabled={!!defaultEmail}
          onBlur={handleBlur}
          onChange={handleChange}
        />
        <Form.Input
          label={
            <Translate
              zh_hant={TEXT.zh_hant.verificationCode}
              zh_hans={TEXT.zh_hans.verificationCode}
            />
          }
          type="text"
          name="code"
          autoComplete="off"
          placeholder={translate({
            zh_hant: TEXT.zh_hant.enterVerificationCode,
            zh_hans: TEXT.zh_hans.enterVerificationCode,
            lang
          })}
          value={values.code}
          error={touched.code && errors.code}
          onBlur={handleBlur}
          onChange={handleChange}
          extraButton={
            <SendCodeButton
              email={values.email}
              lang={lang}
              type="password_reset"
            />
          }
        />
      </Dialog.Content>

      <Dialog.Footer>
        <Dialog.Footer.Button
          type="submit"
          disabled={!_isEmpty(errors) || isSubmitting}
          loading={isSubmitting}
        >
          <Translate
            zh_hant={TEXT.zh_hant.nextStep}
            zh_hans={TEXT.zh_hans.nextStep}
          />
        </Dialog.Footer.Button>
      </Dialog.Footer>
    </Form>
  )
}

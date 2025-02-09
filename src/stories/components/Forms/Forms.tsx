import React from 'react'

import { Form, Translate } from '~/components'

import { translate } from '~/common/utils'

const Forms = () => (
  <section>
    <ul>
      {/* Form.Input */}
      <li>
        <Form>
          <Form.Input
            label={<Translate id="email" />}
            type="email"
            name="email"
            required
            placeholder={translate({ id: 'enterEmail', lang: 'zh_hant' })}
          />

          <Form.Input
            label={<Translate id="password" />}
            type="password"
            name="password"
            required
            placeholder={translate({ id: 'enterPassword', lang: 'zh_hant' })}
          />
        </Form>
      </li>

      {/* Form.PinInput */}
      <li>
        <Form noBackground>
          <Form.PinInput
            length={6}
            value=""
            name="password"
            hint={<Translate id="hintPaymentPassword" />}
            onChange={() => null}
          />
        </Form>
      </li>

      {/* Form.DropdownInput & Form.Textarea */}
      <li>
        <Form>
          <Form.Textarea
            label={<Translate id="tagDescription" />}
            name="newDescription"
            placeholder={translate({
              id: 'tagDescriptionPlaceholder',
              lang: 'zh_hant',
            })}
          />
        </Form>
      </li>

      {/* Form.List */}
      <li>
        <Form.List spacing="xloose">
          <Form.List.Item
            title={
              <Translate
                zh_hant="沒有帳戶？"
                zh_hans="沒有帐户？"
                en="Not Registered?"
              />
            }
            rightText={<Translate id="register" />}
            rightTextColor="green"
          />
        </Form.List>
      </li>

      {/* Form.CheckBox */}
      <li>
        <Form.CheckBox
          name="tos"
          hint={
            <Translate
              zh_hant="我已閱讀並同意"
              zh_hans="我已阅读并同意"
              en="I have read and agree to"
            />
          }
          required
        />
      </li>

      {/* Form.Select */}
      <li>
        <Form.Select
          name="select-period"
          onChange={() => null}
          label={
            <Translate
              zh_hant="免費資格時長"
              zh_hans="免费资格时长"
              en="Free trial period"
            />
          }
          options={[30, 90, 180, 360].map((value) => ({
            name: (
              <>
                {value} <Translate id="days" />
              </>
            ),
            value,
            selected: 30 === value,
          }))}
        />
      </li>
    </ul>

    <style jsx>{`
      li {
        @mixin border-bottom-grey;
        padding: var(--spacing-base);

        @media (--sm-down) {
          background: #f7f7f7;
        }
      }
    `}</style>
  </section>
)

export default Forms

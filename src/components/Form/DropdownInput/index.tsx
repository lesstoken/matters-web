import { useQuery } from '@apollo/react-hooks'
import { useState } from 'react'
import { useDebounce } from 'use-debounce'

import { Dropdown, hidePopperOnClick } from '~/components'

import { INPUT_DEBOUNCE } from '~/common/enums'

import Field, { FieldProps } from '../Field'
import styles from './styles.css'

interface DropdownProps {
  dropdownAppendTo?: string
  dropdownAutoSizing?: boolean
  DropdownContent: any
  dropdownCallback?: (params: any) => void
  dropdownZIndex?: number
  query: any
  queryFilter?: Record<string, any>
}

type InputProps = {
  type: 'text' | 'password' | 'email' | 'search'
  name: string
} & Omit<FieldProps, 'fieldMsgId'> &
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >

type DropdownInputProps = InputProps & DropdownProps

const DropdownInput: React.FC<DropdownInputProps> = ({
  type,
  name,
  label,
  extraButton,

  hint,
  error,

  dropdownAppendTo = '',
  dropdownAutoSizing = false,
  DropdownContent,
  dropdownCallback,
  dropdownZIndex,
  query,
  queryFilter,

  ...inputProps
}) => {
  const fieldId = `field-${name}`
  const [search, setSearch] = useState('')
  const [debouncedSearch] = useDebounce(search, INPUT_DEBOUNCE)
  const [showDropdown, setShowDropdown] = useState(false)
  const openDropdown = () => setShowDropdown(true)
  const closeDropdown = () => setShowDropdown(false)

  const dropdownContentCallback = (params: any) => {
    setSearch('')
    if (dropdownCallback) {
      dropdownCallback(params)
    }
  }

  const getDropdownSize = () => {
    if (dropdownAutoSizing) {
      const element = document.getElementById(name)
      if (element) {
        return element.getBoundingClientRect().width
      }
    }
  }

  const { data, loading } = useQuery(query, {
    variables: { search: debouncedSearch, filter: queryFilter },
    skip: !debouncedSearch,
  })

  const items = ((data && data.search.edges) || []).map(({ node }: any) => node)

  const dropdownContentProps = {
    loading,
    search,
    items,
    callback: dropdownContentCallback,
    hideDropdown: closeDropdown,
    width: getDropdownSize(),
  }

  const fieldMsgId = `dropdown-input-msg-${name}`

  return (
    <Field>
      <Field.Header htmlFor={fieldId} label={label} extraButton={extraButton} />

      <Field.Content>
        <Dropdown
          trigger={undefined}
          placement="bottom-start"
          content={<DropdownContent {...dropdownContentProps} />}
          zIndex={dropdownZIndex}
          appendTo={document.getElementById(dropdownAppendTo) || document.body}
          onShown={hidePopperOnClick}
          onClickOutside={closeDropdown}
          visible={showDropdown}
        >
          <input
            {...inputProps}
            id={fieldId}
            name={name}
            type={type}
            aria-describedby={fieldMsgId}
            onClick={(e) => {
              if (inputProps.onClick) {
                inputProps.onClick(e)
              }

              if (search) {
                openDropdown()
              }
            }}
            onFocus={(e) => {
              if (inputProps.onFocus) {
                inputProps.onFocus(e)
              }

              if (search) {
                openDropdown()
              }
            }}
            onChange={(e) => {
              const trimedValue =
                inputProps?.onChange?.(e) ?? e.target.value.trim()

              setSearch(trimedValue)

              if (trimedValue) {
                openDropdown()
              } else {
                closeDropdown()
              }
            }}
          />
        </Dropdown>
      </Field.Content>

      <Field.Footer fieldMsgId={fieldMsgId} hint={hint} error={error} />

      <style jsx>{styles}</style>
    </Field>
  )
}

export default DropdownInput

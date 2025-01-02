import Input from '@/components/input/Input'
import ReactInputMask from 'react-input-mask'

export type MaskedFieldProps = {
  mask: string
  onChange: (e: any) => void
  name: string
  label: string
  required?: boolean
  onBlur?: (e: any) => void | undefined
  value?: string
  disabled?: boolean
}

export const maskedField = (
  mask: string,
  onChange: (e: any) => void,
  name: string,
  label: string,
  required?: boolean,
  onBlur?: (e: any) => void,
  value?: string,
  disabled?: boolean,
) => {
  return (
    <ReactInputMask
      mask={mask}
      alwaysShowMask={false}
      maskPlaceholder={null}
      onChange={onChange}
      name={name}
      onBlur={onBlur}
      value={value}
      disabled={disabled || false}
    >
      <Input label={label} name={name} required={required} />
    </ReactInputMask>
  )
}

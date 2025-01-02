
import {
  InputAdornment,
  InputLabel,
  TextField,
  TextFieldProps,
} from '@mui/material'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa'

interface SpecialInputProps {
  customClass?: string
  hasIcon?: boolean
  breakText?: boolean
  scheduleInput?: boolean
  maxLength?: number
  isKitDate?: boolean
  pattern?: string
}

export type Props = TextFieldProps & SpecialInputProps

const Input = ({
  autoComplete = 'off',
  className,
  defaultValue,
  disabled,
  size,
  error,
  helperText,
  id,
  label,
  type,
  name,
  style,
  placeholder,
  onChange,
  required,
  value,
  hasIcon,
  breakText,
  scheduleInput,
  maxLength,
  isKitDate,
  pattern,
  ...props
}: Props) => {

  const [showPassword, setShowPassword] = useState(false)

  const handleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const currentDate = dayjs().format('YYYY-MM-DD')

  const handleMinDate = () => {
    if (isKitDate) {
      const currentKitDate = dayjs().add(5, 'day').format('YYYY-MM-DD')
      return currentKitDate
    }

    if (scheduleInput) {
      return currentDate
    }

    return null
  }

  return (
    <div className='w-full'>
      <InputLabel>
        <div
          className={`text-sm font-bold mb-2 uppercase ${
            breakText && 'whitespace-break-spaces'
          }`}
          translate='no'
        >
          {label} {required && <span className='text-red-500 ml-1'>*</span>}
        </div>
      </InputLabel>
      <TextField
        autoComplete={autoComplete}
        defaultValue={defaultValue}
        disabled={disabled}
        error={error}
        helperText={helperText}
        id={id}
        name={name}
        required={required}
        size={size}
        type={type === 'password' && showPassword ? 'text' : type || 'text'}
        value={value}
        variant='outlined'
        onChange={onChange}
        className={`${className} disabled:cursor-not-allowed disabled:opacity-70 disabled:bg-gray-500`}
        placeholder={placeholder ? placeholder : 'escreva aqui...'}
        style={style}
        sx={{
          '.MuiOutlinedInput-notchedOutline': {
            borderColor: error
              ? `red !important`
              : `${'#004aad'} !important`,
          },
          '.MuiFormHelperText-root': {
            color: `red !important`,
          },
        }}
        InputProps={{
          type: type === 'date' ? 'date' : showPassword ? 'text' : type,
          endAdornment: hasIcon ? (
            <InputAdornment position='end'>
              {!showPassword ? (
                <FaEye
                  onClick={handleShowPassword}
                  className='cursor-pointer'
                />
              ) : (
                <FaEyeSlash
                  onClick={handleShowPassword}
                  className='cursor-pointer'
                />
              )}
            </InputAdornment>
          ) : null,
        }}
        inputProps={{
          maxLength: maxLength,
          min: type === 'date' ? handleMinDate() : null,
          max: type === 'date' && !scheduleInput ? currentDate : undefined,
          pattern: pattern,
        }}
        {...props}
        fullWidth
      />
    </div>
  )
}

export default Input

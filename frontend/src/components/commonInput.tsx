import React from 'react'
type Props = {
  onChange?: any, 
  value: string, 
  placeholder?: string
}

export default function CommonInput({onChange, value, placeholder}: Props) {
  return (
    <input className='commonInput' type='text' placeholder={placeholder} value={value} onChange={onChange} />
  )
}

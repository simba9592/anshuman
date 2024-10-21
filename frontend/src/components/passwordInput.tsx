import React from 'react'
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './component.scss'

type Props = {
  onClick?: any, 
  onChange?: any, 
  show: boolean, 
  value: string, 
  placeholder?: string
}

export default function PasswordInput({onClick, onChange, show, value, placeholder}: Props) {
  return (
    <div className='passwordBox'>
      <div className='passwordInput'>
        <input type={show ? 'text' : 'password'} value={value} onChange={onChange} placeholder={placeholder} />
        <div className='icon' onClick={onClick}>
          {show ? <FaEyeSlash color='#949CA9' /> : <FaEye color='#949CA9'/>}
        </div>
      </div>
    </div>
  )
}

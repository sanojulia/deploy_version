import React from 'react'
import styles from './Button.module.css'

export default function Button({text, className}) {
  return (
    <button className={`${styles['body-button']} ${className || ''}`}>{text}</button>
  )
}

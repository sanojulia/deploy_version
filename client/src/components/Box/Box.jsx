import React from 'react'
import styles from './Box.module.css'

const Box = ({text, className}) => {
  return (
    <div className={`${styles['box']} ${className || ''}`}>
        <p>{text}</p>
    </div>
  )
};

export default Box;
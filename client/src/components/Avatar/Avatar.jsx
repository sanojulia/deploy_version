import React from 'react'
import styles from './Avatar.module.css';

const Avatar = ({firstName = '', surname = ''}) => {
   const initials = `${firstName.charAt(0).toUpperCase() || ''}${surname.charAt(0).toUpperCase() || ''}`;

  return (
    <div className={styles.avatar}>{initials}</div>
  )
};

export default Avatar;
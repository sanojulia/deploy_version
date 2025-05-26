import React from 'react'
import styles from './ServicesSection.module.css'
import Box from '../Box/Box'
import stylesBox from '../Box/Box.module.css';

const ServicesSection = () => {
  return (
    <div className={styles.container}>
        <Box text="JOIN our Membership Club" className={stylesBox['boxGreen']}/>
        <Box text="SALES UP TO 30%" className={stylesBox['boxRed']}/>
        <Box text="FAST SHIPPING Nationwide" className={stylesBox['boxBlue']}/>
        <Box text="FREE RETURNS" className={stylesBox['boxPurple']}/>
    </div>
  )
};

export default ServicesSection;
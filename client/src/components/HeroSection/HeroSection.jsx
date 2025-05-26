import React from 'react';
import styles from './HeroSection.module.css';
import Button from '../Button/Button';
import stylesButton from '../Button/Button.module.css';
import logo from '../../assets/hero-logo.svg';
import { Link } from 'react-router-dom';

const HeroSection = () => {
  return (
    <div className={styles.heroSection}>                
        <div className={styles.heroImage}>
            <div className={styles.heroText}>
                <h1 className={styles.heroHeading}>THIS IS</h1>
            </div>
            <div className={styles.logoContainer}>
                <img src={logo} alt='JUSA' className={styles.logoImage} />
            </div>
            <div className={styles.buttons}>
                <Link to="/men"><Button text="SHOP MEN" className={stylesButton['hero-button']}/></Link>
                <Link to="/women"><Button text="SHOP WOMEN" className={stylesButton['hero-button']}/></Link>
            </div> 
        </div>                 
    </div>
  )
};

export default HeroSection;
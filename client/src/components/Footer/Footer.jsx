import React from "react";
import styles from "./Footer.module.css";


const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerIcons}>
        <div className={styles.footerLinks}>
            <a href="https://www.facebook.com/" className={styles.footerLink}>
              <span><i className="fa-brands fa-square-facebook" style={{color: "#005eff"}}></i></span>
            </a>
            <a href="https://www.instagram.com/" className={styles.footerLink}>
              <span><i className="fa-brands fa-square-instagram" style={{color: "#962fbf"}}></i></span>
            </a>
            <a href="https://www.youtube.com/" className={styles.footerLink}>
              <span><i className="fa-brands fa-youtube" style={{color: "#ff0000"}}></i></span>
            </a>
            <span className={styles.pipeSymbol}>|</span>
            <span className={styles.footerLink}><i className="fab fa-cc-visa"></i></span>
            <span className={styles.footerLink}><i className="fab fa-cc-mastercard"></i></span>
            <span className={styles.footerLink}><i className="fab fa-cc-amex"></i></span>
        </div>
      </div>
      <div className={styles.footerContainer}>
        <div className={`${styles.innerContainer} ${styles.left}`}>
          <p className={styles.footerText}>
            &copy; {new Date().getFullYear()} JUSA
          </p>
        </div>
        <div className={`${styles.innerContainer} ${styles.right}`}>
          <p className={styles.footerText}>All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
export default Footer;

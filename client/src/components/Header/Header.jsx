import React, { useState, useEffect, useContext } from 'react';
import styles from './Header.module.css';
import logo from '../../assets/logo_adjusted.svg';
import { Link } from 'react-router-dom';
import SearchBar from '../SearchBar/SearchBar'
import { AuthContext } from '../../context/AuthContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user } = useContext(AuthContext);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleResize = () => {
    if (window.innerWidth > 768) {
    setIsMenuOpen(false);
    }
  };  

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.headerTop}>
        <div className={styles.container}>
          <p>Sale: last chance! Up to 30% extra off selected styles!</p>
        </div>
      </div>
      
      <div className={styles.headerMain}>
        <div className={`${styles.container} ${styles.headerMainContainer}`}>
          <button className={styles.mobileMenuToggle} onClick={toggleMenu} aria-label="Toggle Menu">
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>

          <div className={styles.logoContainer}>
            <Link to="/" className={styles.logo}>
              <img src={logo} alt='JUSA' className={styles.logoImage} />
            </Link>
          </div>
          
          <nav className={`${styles.navMenuContainer} ${isMenuOpen ? styles.navMenuActive : ''}`}>
            <ul className={styles.navMenu}>
              {isMenuOpen && (
                <div className={styles.closeNavMenu} onClick={toggleMenu}>
                  <i className="fa-solid fa-xmark fa-xl" style={{ color: "#ffffff" }}></i>
                </div>
              )}
              <li><Link to="/" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>HOME</Link></li>
              <li><Link to="/women" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>WOMEN</Link></li>
              <li><Link to="/men" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>MEN</Link></li>
              <li><Link to="/sale" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>SALE</Link></li>
              <li><Link to="/new-in" className={styles.navLink} onClick={() => setIsMenuOpen(false)}>NEW IN</Link></li>
            </ul>
          </nav>
          
          <div className={styles.headerActions}>
            <SearchBar/>
            <div className={styles.userActions}>
              <Link to={user ? "/customerdetails" : "/account"} className={styles.actionButton} aria-label="Account">
                <i className="far fa-user"></i>
              </Link>
              <Link to="/bag" className={styles.actionButton} aria-label="Shopping Bag">
                <i className="fas fa-shopping-bag"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;

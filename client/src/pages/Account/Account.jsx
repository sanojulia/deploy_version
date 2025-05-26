import React, { useState, useContext } from 'react';
import styles from './Account.module.css';
import { AuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { auth, googleProvider, signInWithPopup } from '../../firebase';


const Account = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const { signin, signinWithGoogle } = useContext(AuthContext);
  
  // Handle Google Sign In
  const handleGoogleSignIn = async () => {
    try {
      await signinWithGoogle();
    } catch (error) {
      console.error("Google sign-in error:", error);
      setError("Google sign-in failed. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isLogin) {
        await signin(email, password);

        setMessage('Login Successful');
      } else {
        const { data } = await axios.post("/api/user/register", {
          firstName,
          lastName,
          email,
          password,
        });
        setMessage(data.message || "Registration successful!");
        setEmail("");
        setPassword("");
        setFirstName("");
        setLastName("");
      } 
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.accountPage}>
      <div className={styles.container}>
        <div className={styles.formContainer}>
          <div className={styles.tabs}>
            <button 
              className={`${styles.tab} ${isLogin ? styles.active : ''}`}
              onClick={() => setIsLogin(true)}
            >
              SIGN IN
            </button>
            <button 
              className={`${styles.tab} ${!isLogin ? styles.active : ''}`}
              onClick={() => setIsLogin(false)}
            >
              JOIN
            </button>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            {!isLogin && (
              <>
                <div className={styles.formGroup}>
                  <label htmlFor="firstName">FIRST NAME:</label>
                  <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="lastName">LAST NAME:</label>
                  <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </div>
              </>
            )}
            <div className={styles.formGroup}>
              <label htmlFor="email">EMAIL ADDRESS:</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">PASSWORD:</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {isLogin && (
                <button type="button" className={styles.forgotPassword}>
                  Forgot password?
                </button>
              )}
            </div>

            <button 
              type="submit" 
              className={styles.submitButton}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : (isLogin ? 'SIGN IN' : 'JOIN JUSA')}
            </button>
            {error && <p className={styles.error}>{error}</p>}
            {message && <p className={styles.message}>{message}</p>}
            {!isLogin && (
              <p className={styles.terms}>
                By creating your account, you agree to our{' '}
                <a href="#terms">Terms & Conditions</a> and{' '}
                <a href="#privacy">Privacy Policy</a>
              </p>
            )}
          </form>

          <div className={styles.socialLogin}>
            <p>OR SIGN IN WITH:</p>
            <div className={styles.socialButtons}>
              <button 
                className={`${styles.socialButton} ${styles.google}`}
                onClick={handleGoogleSignIn}
                type="button"
              >
                <i className="fab fa-google"></i> GOOGLE
              </button>
            </div>
          </div>
        </div>

        <div className={styles.benefits}>
          <h2>BENEFITS OF JOINING JUSA:</h2>
          <ul>
            <li>
              <i className="fas fa-truck"></i>
              <span>Free Delivery</span>
              <p>Get complimentary standard delivery on all orders</p>
            </li>
            <li>
              <i className="fas fa-gift"></i>
              <span>Birthday Treat</span>
              <p>Receive exclusive offers on your birthday</p>
            </li>
            <li>
              <i className="fas fa-percent"></i>
              <span>Exclusive Discounts</span>
              <p>Be the first to know about sales and special offers</p>
            </li>
            <li>
              <i className="fas fa-heart"></i>
              <span>Saved Items</span>
              <p>Create wishlists and save your favorite items</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Account;
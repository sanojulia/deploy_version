import React, { useState, useEffect, useContext } from 'react'
import styles from './MyDetailsBar.module.css';
import Avatar from '../Avatar/Avatar';
import { useNavigate } from 'react-router-dom';
import { AuthContext, getAuthHeaders } from '../../context/AuthContext';
import { apiService } from '../../services/apiService';

const MyDetailsBar = ({ onOptionClick }) => {
    const navigate = useNavigate();
    const { user, signout } = useContext(AuthContext);
    const [userData, setUserData] = useState({ firstName: "User", lastName: "" });

    useEffect(() => {
     const fetchUserData = async () => {
      if (user) {
        try {
          const headers = getAuthHeaders();
          const data = await apiService.get(`/api/user/${user.userId}`, { headers });
          setUserData({ firstName: data.firstName || 'User', lastName: data.lastName || ''});
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };
    fetchUserData();
  }, [user]);

  const handleSignout = () => {
    signout(); // Clear user data from AuthContext
    navigate('/account'); // Redirect to the account page or login
  };

  return (
    <div className={styles.container}>
        <div className={styles.greetingBox}>
            <div>
                <Avatar firstName={userData.firstName} surname={userData.lastName} />
            </div>
            <div>
                <p>Hi,</p> 
                <p className={styles.customerName}>{userData.firstName} {userData.lastName}</p>
            </div>
        </div>
        <div className={styles.myDetailsBox}>
            <ul>
                <li onClick={() => onOptionClick('myDetailsForm')}><span style={{ display: "inline", paddingRight: "15px"}}><i className="fa-solid fa-address-card"></i></span>My Details</li>
                <li onClick={() => onOptionClick('changePasswordForm')}><span style={{ display: "inline", paddingRight: "15px"}}><i className="fa-solid fa-key"></i></span>Change Password</li>
                <li onClick={() => onOptionClick('addressForm')}><span style={{ display: "inline", paddingRight: "15px"}}><i className="fa-solid fa-house"></i></span>Address</li>
                <li onClick={() => onOptionClick('paymentDetails')}><span style={{ display: "inline", paddingRight: "15px"}}><i className="fa-solid fa-credit-card"></i></span>Payment Details</li>
                <li onClick={handleSignout}><span style={{ display: "inline", paddingRight: "15px"}}><i className="fa-solid fa-right-from-bracket"></i></span>Sign Out</li>
            </ul>
        </div>
    </div>
  )
};

export default MyDetailsBar;

import React, {useState, useEffect, useContext} from 'react'
import styles from './MyDetailsForm.module.css';
import { AuthContext, getAuthHeaders } from '../../context/AuthContext';
import { apiService } from '../../services/apiService';  
    
const MyDetailsForm = () => {   
    const { user } = useContext(AuthContext);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
     const fetchUserData = async () => {
      if (user) {
        try {
            const headers = getAuthHeaders();
            const data = await apiService.get(`/api/user/${user.userId}`, {headers});
            setFirstName(data.firstName || '');
            setLastName(data.lastName || '');
            setEmail(data.email || '');
            setPhoneNumber(data.phoneNumber || '');
        } catch (error) {
            console.error("Error fetching user data:", error);
            setMessage('Failed to fetch user details. Please try again.');
        }
      }
    };
    fetchUserData();
    }, [user]);


    const handleUpdateDetails = async (e) => {
        e.preventDefault();
        try {
            const headers = getAuthHeaders();
            const data = await apiService.put(`/api/user/update/${user.userId}`, { firstName, lastName, email, phoneNumber }, { headers });
            setFirstName(data.user.firstName);
            setLastName(data.user.lastName);
            setEmail(data.user.email);
            setPhoneNumber(data.user.phoneNumber);
            setMessage("User details updated successfully!");
        } catch (error) {
            console.error("Update error:", error);
            setMessage(
                error.response?.data?.error || 'Failed to update user details. Please try again.'
            );
        }
    };
    
    return (
        <div className={styles.container}>
            <i className="fa-solid fa-address-card"></i>
            <h2>MY DETAILS</h2>
            <p>Feel free to edit your details so it is up to date.</p>
            <form onSubmit={handleUpdateDetails}>              
                <div className={styles.formField}>
                    <label htmlFor="firstName">FIRST NAME:</label>
                    <input
                    type="text"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    autoComplete="given-name"
                    />
                </div>
                
                <div className={styles.formField}>
                    <label htmlFor="lastName">LAST NAME:</label>
                    <input
                    type="text"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    autoComplete="family-name"
                    />
                </div>

                <div className={styles.formField}>
                    <label htmlFor="email">EMAIL ADDRESS:</label>
                    <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    />
                </div>
                <div className={styles.formField}>
                    <label htmlFor="phoneNumber">PHONE NUMBER:</label>
                    <input
                    type="tel"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    autoComplete="tel"
                    />
                </div>

                <button type="submit" className={styles.submitButton}>
                    SAVE CHANGES
                </button>
                {message && <p className={styles.message}>{message}</p>}
            </form>
        </div>
    )
};

export default MyDetailsForm;

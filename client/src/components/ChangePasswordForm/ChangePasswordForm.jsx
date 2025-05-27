import React, { useState } from 'react'
import styles from './ChangePasswordForm.module.css';
import { apiService } from '../../services/apiService'; 
import { getAuthHeaders } from '../../context/AuthContext';

const ChangePasswordForm = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleChangePassword = async (e) => {
        e.preventDefault();

        try {
            const headers = getAuthHeaders();
            await apiService.put("/api/user/change-password", { currentPassword, newPassword }, { headers });
            setMessage("Password updated successfully!");
            setCurrentPassword('');
            setNewPassword('');
        } catch (error) {
            console.error("Error changing password:", error);
            setMessage(
                error.response?.data?.error || "Failed to update password. Please try again."
            );
        }
    };


  return (
        <div className={styles.container}>
            <i className="fa-solid fa-key"></i>
            <h2>CHANGE PASSWORD</h2>
            <p>Feel free to update your password so your account stays secure.</p>
            <form onSubmit={handleChangePassword}>              
                <div className={styles.formField}>
                    <label htmlFor="currentPassword">CURRENT PASSWORD:</label>
                    <input
                    type="password"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    />
                </div>
                <div className={styles.formField}>
                    <label htmlFor="newPassword">NEW PASSWORD:</label>
                    <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    />
                </div>

                <button type="submit" className={styles.submitButton}>
                    SAVE PASSWORD
                </button>
                {message && <p className={styles.message}>{message}</p>}
            </form>
        </div>
  )
};

export default ChangePasswordForm;

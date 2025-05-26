import React, {useState, useEffect, useContext} from 'react'
import styles from './PaymentDetails.module.css';
import { AuthContext, getAuthHeaders } from '../../context/AuthContext';
import axios from 'axios'; 

const PaymentDetails = () => {
    const [paymentDetails, setPaymentDetails] = useState({  
        cardNumber: '',
        expireMonth: '',
        expireYear: '',
        nameOnCard: ''});
    const { user } = useContext(AuthContext);
    const [message, setMessage] = useState('');


    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                try {
                    const headers = getAuthHeaders();
                    const { data } = await axios.get(`/api/user/${user.userId}`, { headers });
                    setPaymentDetails({
                        cardNumber: data.paymentDetails?.cardNumber || '',
                        expireMonth: data.paymentDetails?.expireMonth || '',
                        expireYear: data.paymentDetails?.expireYear || '',
                        nameOnCard: data.paymentDetails?.nameOnCard || '',
                    });
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setMessage("Failed to fetch user data. Please try again.");
                }
            }
        };
        fetchUserData();
    }, [user]);   
    
    const handleUpdateCard = async (e) => {
        e.preventDefault();

        try {
            const headers = getAuthHeaders();
            await axios.put(`/api/user/update-payment/${user.userId}`, paymentDetails, { headers });
            setMessage("Payment details updated successfully!");
        } catch (error) {
            console.error("Error updating payment details:", error);
            setMessage(
                error.response?.data?.error || "Failed to update payment details. Please try again."
            );
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setPaymentDetails((prevPaymentDetails) => ({ ...prevPaymentDetails, [id]: value }));
    };

  return (
        <div className={styles.container}>
            <i className="fa-solid fa-credit-card"></i>
            <h2>ADD CARD</h2>
            <p>Please fill your card details.</p>
            <form onSubmit={handleUpdateCard}>              
                <div className={styles.formField}>
                    <label htmlFor="cardNumber">CARD NUMBER:</label>
                    <input
                    type="text"
                    id="cardNumber"
                    value={paymentDetails.cardNumber}
                    onChange={handleInputChange}
                    required
                    autoComplete="cc-number"
                    />
                </div>
                <div className={styles.formField}>
                    <label htmlFor="expireMonth">EXPIRE DATE:</label>
                    <div className={styles.expiryDate}>
                        <input
                            type="number"
                            placeholder="MM"
                            id="expireMonth"
                            value={paymentDetails.expireMonth}
                            onChange={handleInputChange}
                            required
                            min="1"
                            max="12"
                            autoComplete="cc-exp"
                        />
                        <span>/</span>
                        <input
                            type="number"
                            placeholder="YY"
                            id="expireYear"
                            value={paymentDetails.expireYear}
                            onChange={handleInputChange}
                            required
                            min="25"
                            autoComplete="cc-exp"
                        />
                    </div>                    
                </div>
                <div className={styles.formField}>
                    <label htmlFor="nameOnCard">NAME ON CARD:</label>
                    <input
                    type="text"
                    id="nameOnCard"
                    value={paymentDetails.nameOnCard}
                    onChange={handleInputChange}
                    required
                    autoComplete="cc-name"
                    />
                </div>

                <button type="submit" className={styles.submitButton}>
                    SAVE CARD
                </button>
                {message && <p className={styles.message}>{message}</p>}
            </form>
            <div className={styles.paymentMethods}>
              <p>WE ACCEPT:</p>
              <div className={styles.paymentIcons}>
                <i className="fab fa-cc-visa"></i>
                <i className="fab fa-cc-mastercard"></i>
                <i className="fab fa-cc-amex"></i>
              </div>
            </div>
        </div>
  )
};

export default PaymentDetails;
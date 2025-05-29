import React, {useState, useEffect, useContext} from 'react'
import styles from './AddressForm.module.css';
import { AuthContext, getAuthHeaders } from '../../context/AuthContext';
import { apiService } from '../../services/apiService';  

const AddressForm = () => {
    const [address, setAddress] = useState({  
        addressLine1: '',
        addressLine2: '',
        city: '',
        postcode: '',
        country: ''});
    const { user } = useContext(AuthContext);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchUserData = async () => {
            if (user) {
                try {
                    const headers = getAuthHeaders();
                    const data = await apiService.get(`/api/user/${user.userId}`, { headers });
                    setAddress({
                        addressLine1: data.address?.addressLine1 || '',
                        addressLine2: data.address?.addressLine2 || '',
                        city: data.address?.city || '',
                        postcode: data.address?.postcode || '',
                        country: data.address?.country || '',      
                    });
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    setMessage("Failed to fetch user data. Please try again.");
                }
            }
        };
        fetchUserData();
    }, [user]);

    const handleUpdateAddress = async (e) => {
        e.preventDefault();

        try {
            const headers = getAuthHeaders();
            await apiService.put(`/api/user/update-address/${user.userId}`, address, { headers });
            setMessage("Address updated successfully!");
        } catch (error) {
            console.error("Error updating address:", error);
            setMessage(
                error.response?.data?.error || "Failed to update address. Please try again."
            );
        }
    };

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setAddress((prevAddress) => ({ ...prevAddress, [id]: value }));
    };

  return (
        <div className={styles.container}>
            <i className="fa-solid fa-house"></i>
            <h2>ADDRESS</h2>
            <p>Please fill the address you would like your items to be posted.</p>
            <form onSubmit={handleUpdateAddress}>              
                <div className={styles.formField}>
                    <label htmlFor="addressLine1">ADDRESS:</label>
                    <input
                    type="text"
                    id="addressLine1"
                    value={address.addressLine1}
                    onChange={handleInputChange}
                    required
                    autoComplete="address-line1"
                    />
                    <input
                    type="text"
                    id="addressLine2"
                    value={address.addressLine2}
                    onChange={handleInputChange}
                    placeholder='Optional'
                    autoComplete="address-line2"
                    />
                </div>
                <div className={styles.formField}>
                    <label htmlFor="city">CITY:</label>
                    <input
                    type="text"
                    id="city"
                    value={address.city}
                    onChange={handleInputChange}
                    required
                    autoComplete="address-level2"
                    />
                </div>

                <div className={styles.formField}>
                    <label htmlFor="postcode">POSTCODE:</label>
                    <input
                    type="text"
                    id="postcode"
                    value={address.postcode}
                    onChange={handleInputChange}
                    required
                    autoComplete="postal-code"
                    />
                </div>

                    <div className={styles.formField}>
                    <label htmlFor="country">COUNTRY:</label>
                    <input
                    type="text"
                    id="country"
                    value={address.country}
                    onChange={handleInputChange}
                    required
                    autoComplete="country"
                    />
                </div>

                <button type="submit" className={styles.submitButton}>
                    SAVE ADDRESS
                </button>
                {message && <p className={styles.message}>{message}</p>}
            </form>
        </div>
  )
};

export default AddressForm;

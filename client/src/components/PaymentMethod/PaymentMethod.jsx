import React, { useState } from 'react';
import styles from './PaymentMethod.module.css';

// Props: paymentDetails (object), onPaymentDetailsChange (function), errors (object)
const PaymentMethod = ({ paymentDetails, onPaymentDetailsChange, errors }) => {
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        onPaymentDetailsChange(id, value);
    };

  return (
        <div className={styles.container}>
            <i className="fa-solid fa-credit-card"></i>
            <h2>PAYMENT METHOD</h2>
            <p>Please fill your card details.</p>
            <form>              
                <div className={styles.formField}>
                    <label htmlFor="cardNumber">CARD NUMBER:</label>
                    <input
                    type="text"
                    id="cardNumber"
                    value={paymentDetails.cardNumber || ''}
                    onChange={handleInputChange}
                    required
                    autoComplete="cc-number"
                    />
                    {errors?.cardNumber && <p className={styles.fieldError}>{errors.cardNumber}</p>}
                </div>
                <div className={styles.formField}>
                    <label htmlFor="expireMonth">EXPIRE DATE:</label>
                    <div className={styles.expiryDate}>
                        <input
                            type="number"
                            placeholder="MM"
                            id="expireMonth"
                            value={paymentDetails.expireMonth || ''}
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
                            value={paymentDetails.expireYear || ''}
                            onChange={handleInputChange}
                            required
                            min="25"
                            autoComplete="cc-exp"
                        />
                    </div>
                    {errors?.expireDate && <p className={styles.fieldError}>{errors.expireDate}</p>}
                    {/* Individual month/year errors can be shown if expireDate is not present but they are */}
                    {(!errors?.expireDate && errors?.expireMonth) && <p className={styles.fieldError}>{errors.expireMonth}</p>}
                    {(!errors?.expireDate && errors?.expireYear) && <p className={styles.fieldError}>{errors.expireYear}</p>}
                </div>
                <div className={styles.formField}>
                    <label htmlFor="nameOnCard">NAME ON CARD:</label>
                    <input
                    type="text"
                    id="nameOnCard"
                    value={paymentDetails.nameOnCard || ''}
                    onChange={handleInputChange}
                    required
                    autoComplete="cc-name"
                    />
                    {errors?.nameOnCard && <p className={styles.fieldError}>{errors.nameOnCard}</p>}
                </div>
                <div className={styles.formField}>
                    <label htmlFor="securityCode">SECURITY CODE:</label>
                    <input
                    type="text"
                    id="securityCode"
                    value={paymentDetails.securityCode || ''}
                    onChange={handleInputChange}
                    required
                    />
                    {errors?.securityCode && <p className={styles.fieldError}>{errors.securityCode}</p>}
                </div>
                {/* {message && <p className={styles.message}>{message}</p>} Removed for now, can be added back if needed */}
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

export default PaymentMethod;
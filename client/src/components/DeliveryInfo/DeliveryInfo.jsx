import React from 'react';
import styles from './DeliveryInfo.module.css';

// Props: deliveryInfo (object), onDeliveryInfoChange (function), errors (object)
const DeliveryInfo = ({ deliveryInfo, onDeliveryInfoChange, errors }) => {

    const handleInputChange = (e) => {
        const { id, value } = e.target;
        const [field, subField] = id.split('.'); // For address fields like 'address.addressLine1'

        if (subField) {
            onDeliveryInfoChange(field, { ...deliveryInfo[field], [subField]: value });
        } else {
            onDeliveryInfoChange(id, value);
        }
    };

  return (
        <div className={styles.container}>
            <i className="fa-solid fa-truck"></i>
            <h2>DELIVERY INFO</h2>
            <p>Please fill the name, phone number and address for delivery.</p>
            <form>
                <div className={styles.formField}>
                    <label htmlFor="firstName">FIRST NAME:</label>
                    <input
                    type="text"
                    id="firstName"
                    value={deliveryInfo.firstName || ''}
                    onChange={handleInputChange}
                    required
                    autoComplete="given-name"
                    />
                    {errors?.firstName && <p className={styles.fieldError}>{errors.firstName}</p>}
                </div>
                <div className={styles.formField}>
                    <label htmlFor="lastName">LAST NAME:</label>
                    <input
                    type="text"
                    id="lastName"
                    value={deliveryInfo.lastName || ''}
                    onChange={handleInputChange}
                    required
                    autoComplete="family-name"
                    />
                    {errors?.lastName && <p className={styles.fieldError}>{errors.lastName}</p>}
                </div>
                <div className={styles.formField}>
                    <label htmlFor="phoneNumber">PHONE NUMBER:</label>
                    <input
                    type="tel"
                    id="phoneNumber"
                    value={deliveryInfo.phoneNumber || ''}
                    onChange={handleInputChange}
                    required
                    autoComplete="tel"
                    />
                    {errors?.phoneNumber && <p className={styles.fieldError}>{errors.phoneNumber}</p>}
                </div>                              
                <div className={styles.formField}>
                    <label htmlFor="addressLine1">ADDRESS:</label>
                    <input
                    type="text"
                    id="address.addressLine1"
                    value={deliveryInfo.address?.addressLine1 || ''}
                    onChange={handleInputChange}
                    required
                    autoComplete="address-line1"
                    />
                    {errors?.addressLine1 && <p className={styles.fieldError}>{errors.addressLine1}</p>}
                    <input
                    type="text"
                    id="address.addressLine2" // Changed id to be unique and parseable
                    value={deliveryInfo.address?.addressLine2 || ''}
                    onChange={handleInputChange}
                    placeholder='Optional'
                    autoComplete="address-line2"
                    />
                </div>
                <div className={styles.formField}>
                    <label htmlFor="city">CITY:</label>
                    <input
                    type="text"
                    id="address.city"
                    value={deliveryInfo.address?.city || ''}
                    onChange={handleInputChange}
                    required
                    autoComplete="address-level2"
                    />
                    {errors?.city && <p className={styles.fieldError}>{errors.city}</p>}
                </div>

                <div className={styles.formField}>
                    <label htmlFor="postcode">POSTCODE:</label>
                    <input
                    type="text"
                    id="address.postcode"
                    value={deliveryInfo.address?.postcode || ''}
                    onChange={handleInputChange}
                    required
                    autoComplete="postal-code"
                    />
                    {errors?.postcode && <p className={styles.fieldError}>{errors.postcode}</p>}
                </div>

                    <div className={styles.formField}>
                    <label htmlFor="country">COUNTRY:</label>
                    <input
                    type="text"
                    id="address.country"
                    value={deliveryInfo.address?.country || ''}
                    onChange={handleInputChange}
                    required
                    autoComplete="country"
                    />
                    {errors?.country && <p className={styles.fieldError}>{errors.country}</p>}
                </div>
            </form>
        </div>
  )
};

export default DeliveryInfo;
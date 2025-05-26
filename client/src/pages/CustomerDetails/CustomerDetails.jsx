import React, {useState} from 'react'
import MyDetailsBar from '../../components/MyDetailsBar/MyDetailsBar';
import styles from './CustomerDetails.module.css';
import MyDetailsForm from '../../components/MyDetailsForm/MyDetailsForm';
import ChangePasswordForm from '../../components/ChangePasswordForm/ChangePasswordForm';
import AddressForm from '../../components/AddressForm/AddressForm';
import PaymentDetails from '../../components/PaymentDetails/PaymentDetails';

const CustomerDetails = () => {
  const [activeForm, setActiveForm] = useState('detailsForm');

  const renderActiveForm = () => {
    switch (activeForm) {
      case 'myDetailsForm':
        return <MyDetailsForm />;
      case 'changePasswordForm':
        return <ChangePasswordForm />;
      case 'addressForm':
        return <AddressForm />;
      case 'paymentDetails':
        return <PaymentDetails />;
      default:
        return <MyDetailsForm />;
    }
  };


  return (

    <div className={styles.customerDetailPage}>
        <div className={styles.container}>
          <div className={styles.flex1}>
            <MyDetailsBar onOptionClick={setActiveForm}/>
          </div>
          <div className={styles.flex2}>
            {renderActiveForm()}
          </div>
        </div>
    </div>
  )
};

export default CustomerDetails;
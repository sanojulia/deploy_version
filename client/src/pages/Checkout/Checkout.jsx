import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirecting after order
import styles from './Checkout.module.css';
import ItemsCheckout from '../../components/ItemsCheckout/ItemsCheckout';
import DeliveryInfo from '../../components/DeliveryInfo/DeliveryInfo';
import PaymentMethod from '../../components/PaymentMethod/PaymentMethod';
import { AuthContext } from '../../context/AuthContext';
import { orderService } from '../../services/orderService';
import { cartService } from '../../services/cartService'; // To get cart for display/ potentially clear
import { apiService } from '../../services/apiService'; // Used for fetching user data
import { useBag } from '../../context/BagContext'; // For refreshing global cart

const Checkout = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext);
  const { loadCart } = useBag(); // Get loadCart from BagContext

  const [deliveryInfo, setDeliveryInfo] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    address: {
      addressLine1: '',
      addressLine2: '',
      city: '',
      postcode: '',
      country: ''
    }
  });

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expireMonth: '',
    expireYear: '',
    nameOnCard: '',
    securityCode: '',
  });

  const [cart, setCart] = useState(null); // To store cart items for display by ItemsCheckout
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', content: '' }); // For general/API messages
  const [fieldErrors, setFieldErrors] = useState({}); // For specific field errors
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastOrderId, setLastOrderId] = useState(null);

  // Helper function for form validation
  const validateCheckoutForm = (delivery, payment) => {
    const errors = {
      deliveryInfo: {},
      paymentDetails: {}
    };

    // Delivery Info Validation
    if (!delivery.firstName?.trim()) errors.deliveryInfo.firstName = 'First name is required.';
    if (!delivery.lastName?.trim()) errors.deliveryInfo.lastName = 'Last name is required.';
    if (!delivery.phoneNumber?.trim()) errors.deliveryInfo.phoneNumber = 'Phone number is required.';
    else if (!/^[\d\s\+\-\(x\)]+$/.test(delivery.phoneNumber.trim())) errors.deliveryInfo.phoneNumber = 'Invalid phone number format.';
    if (!delivery.address?.addressLine1?.trim()) errors.deliveryInfo.addressLine1 = 'Address Line 1 is required.';
    if (!delivery.address?.city?.trim()) errors.deliveryInfo.city = 'City is required.';
    if (!delivery.address?.postcode?.trim()) errors.deliveryInfo.postcode = 'Postcode is required.';
    if (!delivery.address?.country?.trim()) errors.deliveryInfo.country = 'Country is required.';

    // Payment Details Validation
    if (!payment.nameOnCard?.trim()) errors.paymentDetails.nameOnCard = 'Name on card is required.';
    if (!payment.cardNumber?.trim()) errors.paymentDetails.cardNumber = 'Card number is required.';
    else if (!/^\d{13,19}$/.test(payment.cardNumber.replace(/\s/g, ''))) errors.paymentDetails.cardNumber = 'Invalid card number (must be 13-19 digits).';

    const expMonthStr = String(payment.expireMonth || '');
    const expYearStr = String(payment.expireYear || '');
    const securityCodeStr = String(payment.securityCode || '');

    if (!expMonthStr.trim()) errors.paymentDetails.expireMonth = 'Expiry month is required.';
    if (!expYearStr.trim()) errors.paymentDetails.expireYear = 'Expiry year is required.';
    
    if (expMonthStr.trim() && expYearStr.trim()) {
      if (!/^\d{1,2}$/.test(expMonthStr.trim()) || !/^\d{2}$/.test(expYearStr.trim())) { // Month can be 1 or 2 digits, year should be 2
        errors.paymentDetails.expireDate = 'Expiry date must be MM (1 or 2 digits) and YY (2 digits) format.';
      } else {
        const currentYearLastTwoDigits = new Date().getFullYear() % 100;
        const currentMonth = new Date().getMonth() + 1; // JS months are 0-indexed
        const expMonth = parseInt(expMonthStr.trim(), 10);
        const expYear = parseInt(expYearStr.trim(), 10);

        if (expMonth < 1 || expMonth > 12) {
          errors.paymentDetails.expireDate = 'Invalid expiry month (must be 01-12).';
        } else if (expYear < currentYearLastTwoDigits || (expYear === currentYearLastTwoDigits && expMonth < currentMonth)) {
          errors.paymentDetails.expireDate = 'Card has expired.';
        }
      }
    }
    
    // Security Code (CVV/CVC) Validation
    if (!securityCodeStr.trim()) {
      errors.paymentDetails.securityCode = 'Security code is required.';
    } else if (!/^\d{3,4}$/.test(securityCodeStr.trim())) {
      errors.paymentDetails.securityCode = 'Security code must be 3 or 4 digits.';
    }

    return errors;
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      if (user && user.userId) {
        setIsLoading(true);
        try {
          // Fetch user profile data for pre-filling forms
          const userData = await apiService.get(`/api/user/${user.userId}`);
         
          setDeliveryInfo({
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            phoneNumber: userData.phoneNumber || '',
            address: {
              addressLine1: userData.address?.addressLine1 || '',
              addressLine2: userData.address?.addressLine2 || '',
              city: userData.address?.city || '',
              postcode: userData.address?.postcode || '',
              country: userData.address?.country || ''
            }
            
          });
          setPaymentDetails({
            nameOnCard: userData.paymentDetails?.nameOnCard || '',
            cardNumber: userData.paymentDetails?.cardNumber || '',
            expireMonth: userData.paymentDetails?.expireMonth || '',
            expireYear: userData.paymentDetails?.expireYear || '',          
          });
          // Fetch cart details
          const cartData = await cartService.getCart();
          setCart(cartData);

        } catch (error) {
          console.error("Error fetching initial checkout data:", error);
          setMessage({ type: 'error', content: 'Failed to load your information. Please try again.' });
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (!authLoading) {
        fetchInitialData();
    }
  }, [user, authLoading]);

  const handleDeliveryInfoChange = (field, value) => {
    if (field === 'address') {
        setDeliveryInfo(prev => ({ ...prev, address: value }));
    } else {
        setDeliveryInfo(prev => ({ ...prev, [field]: value }));
    }
  };

  const handlePaymentDetailsChange = (field, value) => {
    setPaymentDetails(prev => ({ ...prev, [field]: value }));
  };

  const handlePlaceOrder = async () => {
    setMessage({ type: '', content: '' }); // Clear previous messages
    setIsLoading(true);
    setMessage({ type: '', content: '' }); // Clear previous messages

    try {
      // Client-side validation
      const currentFieldErrors = validateCheckoutForm(deliveryInfo, paymentDetails);
      setFieldErrors(currentFieldErrors);

      if (Object.keys(currentFieldErrors.deliveryInfo).length > 0 || Object.keys(currentFieldErrors.paymentDetails).length > 0) {
        setMessage({ type: 'error', content: 'Please correct the highlighted errors below.' });
        setIsLoading(false);
        return;
      } else {
        setMessage({ type: '', content: '' }); // Clear general error message if form is valid
      }

      const orderPayload = {
        deliveryInfo,
        paymentMethod: { type: 'Card' } 
      };

      const createdOrder = await orderService.createOrder(orderPayload);
      console.log('Checkout.jsx: handlePlaceOrder - createdOrder:', createdOrder); 
      if (!createdOrder || typeof createdOrder._id === 'undefined') {
        console.error('Checkout.jsx: handlePlaceOrder - createdOrder is invalid or missing _id before setMessage:', createdOrder);
        throw new Error('Order data received from server was invalid.'); 
      }
      setLastOrderId(createdOrder._id);
      setShowSuccessModal(true);
      
      // Clear cart, delivery info, and payment details from client state
      // The server-side cart is already cleared by the order creation endpoint.
      setCart({ items: [], total: 0 });
      setDeliveryInfo({
        firstName: '',
        lastName: '',
        phoneNumber: '',
        address: {
          addressLine1: '',
          addressLine2: '',
          city: '',
          postcode: '',
          country: ''
        }
      });
      setPaymentDetails({
        cardNumber: '',
        expireMonth: '',
        expireYear: '',
        nameOnCard: ''
      });
      
      // Refresh global cart state
      if (loadCart) {
        await loadCart();
      }

    } catch (error) {
      console.error('Checkout.jsx: handlePlaceOrder - CATCH BLOCK - Error placing order:', error);
      console.error('Checkout.jsx: handlePlaceOrder - CATCH BLOCK - error.message:', error.message);
      console.error('Checkout.jsx: handlePlaceOrder - CATCH BLOCK - error.stack:', error.stack);
      setMessage({ type: 'error', content: error.message || 'Failed to place order. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || (isLoading && !message.content)) { // Show loading if auth is loading or initial data is loading
    return <div className={styles.checkoutPage}><p>Loading checkout...</p></div>;
  }
  
  if (!user && !authLoading) { // If not logged in and auth is done loading
    return <div className={styles.checkoutPage}><p>Please <a href='/login'>log in</a> to proceed to checkout.</p></div>;
  }

  return (
    <div className={styles.checkoutPage}>
      <h1>CHECKOUT</h1>
      <p>Secure Page</p>
      {
        message.content && !showSuccessModal && // Only show inline error messages, success is via modal
       <div className={styles.messageContainer}>
       <p className={`${styles.message} ${styles.error}`}>
          {message.content}
        </p>
        </div>
      }
      {showSuccessModal && (
        <div className={styles.messageContainer}>
          
            <h3>Order Placed Successfully!</h3>
            {lastOrderId && <p>Your Order ID is: {lastOrderId}</p>}
            <p>Thank you for your purchase.</p>
            <button onClick={() => {setShowSuccessModal(false); navigate('/')}} className={styles.modalCloseButton}>
              Continue Shopping
            </button>
         
        </div>
      )}
      <div className={styles.container}>
        <div className={styles.items}>
          <ItemsCheckout cart={cart} /> 
        </div>  
        <div className={styles.forms}>
          <DeliveryInfo 
            deliveryInfo={deliveryInfo} 
            onDeliveryInfoChange={handleDeliveryInfoChange} 
            errors={fieldErrors.deliveryInfo || {}}
          />
          <PaymentMethod 
            paymentDetails={paymentDetails} 
            onPaymentDetailsChange={handlePaymentDetailsChange} 
            errors={fieldErrors.paymentDetails || {}}
          />
          <button 
            className={styles.placeOrderButton} 
            onClick={handlePlaceOrder} 
            disabled={isLoading}
          >
            {isLoading ? 'PLACING ORDER...' : 'BUY NOW'}
          </button>
          <p>By placing your order you agree to our T&C's, privacy and returns policies. You also consent to your data being stored by JUSA.</p>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
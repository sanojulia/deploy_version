import React, { useState, useContext } from 'react'
import styles from './ProductInfo.module.css'
import AddToCart from '../AddToCart/AddToCart';
import SizeSelector from '../SizeSelector/SizeSelector';
import ColorSelector from '../ColorSelector/ColorSelector';
import { useBag } from '../../context/BagContext';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProductInfo = ({ product }) => {
    const { name, description, price, originalPrice, colors = [], sizes = []} = product;
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [showLoginPopup, setShowLoginPopup] = useState(false);
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const { addToBag } = useBag();
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    // Handle add to bag button click
    const handleAddToBag = async () => {
        if (!selectedSize || !selectedColor) {
            setShowErrorPopup(true);
            return;
        }
        
        // Check if user is authenticated
        if (!user) {
            setShowLoginPopup(true);
            return;
        }
        
        try {
            await addToBag({
                productId: product._id,
                quantity: 1,
                color: selectedColor,
                size: selectedSize,
            });
            setShowSuccessPopup(true);
        } catch (error) {
            alert("Failed to add product to the bag. Please try again.");
        }
    };
    
    const closeErrorPopup = () => {
        setShowErrorPopup(false);
    };
    
    const closeLoginPopup = () => {
        setShowLoginPopup(false);
    };
    
    const closeSuccessPopup = () => {
        setShowSuccessPopup(false);
    };
    
    const goToCheckout = () => {
        navigate('/bag');
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.name}>{name}</h3>
            <div className={styles.priceContainer}>
                {originalPrice ? (
                <>
                    <span className={styles.salePrice}>€{price.toFixed(2)}</span>
                    <span className={styles.originalPrice}>€{originalPrice.toFixed(2)}</span>
                </>
                ) : (
                <span className={styles.price}>€{price.toFixed(2)}</span>
                )}
            </div>
            <p className={styles.descriptionHead}>Description:</p>
            <p className={styles.description}>{description}</p>

            <ColorSelector colors={colors} selectedColor={selectedColor} onSelectColor={setSelectedColor}/>
            <SizeSelector sizes={sizes} selectedSize={selectedSize} onSelectSize={setSelectedSize}/>
            <AddToCart onClick={handleAddToBag}/>
            
            {showLoginPopup && (
                <div className={styles.loginPopupOverlay}>
                    <div className={styles.loginPopup}>
                        <h3>Login Required</h3>
                        <p>Please log in to your account</p>
                        <div className={styles.loginPopupButtons}>
                            <a href="/account" className={styles.loginButton}>Login</a>
                            <button onClick={closeLoginPopup} className={styles.cancelButton}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}
            {showErrorPopup && (
                <div className={styles.loginPopupOverlay}>
                    <div className={styles.loginPopup}>
                        <h3>Error</h3>
                        <p>Please select a size and color before adding to the bag.</p>
                        <div className={styles.loginPopupButtons}>
                            <button onClick={closeErrorPopup} className={styles.cancelButton}>Close</button>
                        </div>
                    </div>
                </div>
            )}
            
            {showSuccessPopup && (
                <div className={styles.loginPopupOverlay}>
                    <div className={styles.loginPopup}>
                        <h3>Success!</h3>
                        <p>Product added to bag!</p>
                        <div className={styles.loginPopupButtons}>
                            <button onClick={closeSuccessPopup} className={styles.cancelButton}>Continue Shopping</button>
                            <button onClick={goToCheckout} className={styles.loginButton}>Go to Checkout</button>
                        </div>
                    </div>
                </div>
            )}
        
        </div>
    )
};

export default ProductInfo;
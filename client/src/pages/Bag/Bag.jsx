import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Bag.module.css';
import { useBag } from '../../context/BagContext';

const Bag = () => {
  // Get cart items and methods from BagContext
  const { bagItems = [], updateQuantity, removeItem } = useBag();
  
  // Update item quantity in cart
  const handleUpdateQuantity = (id, newQuantity, color, size) => {
    updateQuantity(id, newQuantity, color, size);
  };

  // Remove item from cart
  const handleRemoveItem = (id, color, size) => {
    removeItem(id, color, size);
  };

  // Calculate order totals
  const subtotal = bagItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 50 ? 0 : 4.99; // Free shipping over €50
  const total = subtotal + shipping;

  return (
    <div className={styles.bagPage}>
      <div className={styles.container}>
        <h1 className={styles.title}>SHOPPING BAG</h1>
        
        <div className={styles.content}>
          <div className={styles.itemsList}>
            {bagItems.length > 0 ? (
              bagItems.map(item => {
                return (
                <div key={item.id} className={styles.item}>
                  <div className={styles.itemImage}>
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className={styles.itemDetails}>
                    <div className={styles.itemInfo}>
                      <h3>{item.name}</h3>
                      <p className={styles.brand}>{item.brand}</p>
                      <p className={styles.color}>Color: {item.color}</p>
                      <p className={styles.size}>Size: {item.size}</p>
                      <p className={styles.price}>€{(item.price && typeof item.price === 'number' ? item.price : 0).toFixed(2)}</p>
                    </div>
                    {/* Item quantity controls and remove button */}
                    <div className={styles.itemActions}>
                      <div className={styles.quantity}>
                        <label htmlFor={`quantity-${item.id}`}>Qty:</label>
                        <select
                          id={`quantity-${item.id}`}
                          value={item.quantity}
                          onChange={(e) => handleUpdateQuantity(item.id, Number(e.target.value), item.color, item.size)}
                        >
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                            <option key={num} value={num}>{num}</option>
                          ))}
                        </select>
                      </div>
                      <button 
                        className={styles.removeButton}
                        onClick={() => handleRemoveItem(item.id, item.color, item.size)}
                      >
                        <i className="fas fa-times"></i> Remove
                      </button>
                    </div>
                  </div>
                </div>
              )})
            ) : (
              <div className={styles.emptyBag}>
                <i className="fas fa-shopping-bag"></i>
                <h2>Your bag is empty</h2>
                <p>Find something you love from our collection</p>
                <Link to="/" className={styles.shopButton}>
                  CONTINUE SHOPPING
                </Link>
              </div>
            )}
          </div>

          {bagItems.length > 0 && (
            <div className={styles.summary}>
              <h2>TOTAL</h2>
              <div className={styles.summaryDetails}>
                <div className={styles.summaryRow}>
                  <span>Sub-total</span>
                  <span>€{subtotal.toFixed(2)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Delivery</span>
                  <span>{shipping === 0 ? 'FREE' : `€${shipping.toFixed(2)}`}</span>
                </div>
                {shipping > 0 && (
                  <p className={styles.freeShipping}>
                    Add €{(50 - subtotal).toFixed(2)} more for free delivery
                  </p>
                )}
                <div className={`${styles.summaryRow} ${styles.total}`}>
                  <span>Total</span>
                  <span>€{total.toFixed(2)}</span>
                </div>
                <Link to="/checkout"><button className={styles.checkoutButton}>
                  CHECKOUT
                </button></Link>
                <div className={styles.paymentMethods}>
                  <p>WE ACCEPT:</p>
                  <div className={styles.paymentIcons}>
                    <i className="fab fa-cc-visa"></i>
                    <i className="fab fa-cc-mastercard"></i>
                    <i className="fab fa-cc-amex"></i>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Bag;

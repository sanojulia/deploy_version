import React, { useState } from 'react'
import styles from './ItemsCheckout.module.css'
import { Link } from 'react-router-dom';
import { useBag } from '../../context/BagContext';

const ItemsCheckout = () => {
    // Get cart items from context
    const { bagItems = [] } = useBag();

    // Calculate order totals
    const subtotal = bagItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 4.99; // Free shipping for orders over €50
    const total = subtotal + shipping;
  return (
    <div>
        {/* Items list section */}
        <div className={styles.itemsList}>
            {/* Header with item count and edit link */}
            <div className={styles.totalQtyItems}>
                <span>{bagItems.reduce((sum, item) => sum + item.quantity, 0)} ITEMS</span>
                <span><Link to="/bag" className={styles.linkEdit}>EDIT</Link></span>
            </div>

            {bagItems.map(item => (
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
                        <p className={styles.price}>€{item.price.toFixed(2)}</p>
                        <p className={styles.quantity}>Qty: {item.quantity}</p>
                    </div>
                    <div className={styles.itemActions}>
                    </div>
                    </div>
                </div>
            ))}
        </div>
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
            </div>
        </div>
    </div>
)
};

export default ItemsCheckout;
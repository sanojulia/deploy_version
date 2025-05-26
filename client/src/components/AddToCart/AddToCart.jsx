import React from 'react';
import styles from './AddToCart.module.css'

const AddToCart = ({ onClick }) => {
  return (
    <button className={styles.addButton} onClick={onClick}>
        <span style={{ marginRight: "10px" }}>ADD TO BAG</span>
        <span><i className="fa-solid fa-bag-shopping"></i></span>
    </button>
  )
};

export default AddToCart;
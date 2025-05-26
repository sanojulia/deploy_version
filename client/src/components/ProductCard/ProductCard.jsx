import React, { useState } from 'react';
import styles from './ProductCard.module.css';
import { useNavigate } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const { _id, name, price, originalPrice, colors, isNew, image = {} } = product;
  const navigate = useNavigate();
  const defaultImage = '/images/products/placeholder.jpg';
  const mainImage = image?.main || defaultImage;
  const hoverImage = image?.hover || mainImage;

  return (
    <div 
      className={styles.card}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={()=> navigate(`/product/${_id}`)}
    >
      <div className={styles.imageContainer}>
        <img 
          src={isHovered ? hoverImage : mainImage} 
          alt={name} 
          className={styles.image}
        />
        {isNew && <span className={styles.newBadge}>NEW</span>}
      </div>
      
      <div className={styles.details}>
        <h3 className={styles.name}>{name}</h3>
        <div className={styles.colors}>{colors.join(', ')}</div>
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
      </div>
    </div>
  );
};

export default ProductCard;

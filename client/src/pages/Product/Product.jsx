import React, { useState, useEffect } from 'react';
import styles from './Product.module.css'; 
import { useParams } from 'react-router-dom';
import ProductThumbnail from '../../components/ProductThumbnail/ProductThumbnail';
import ProductInfo from '../../components/ProductInfo/ProductInfo';
import axios from 'axios';

const Product = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/product/${id}`);
        setProduct(response.data);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          setError('Product not found');
        } else {
          setError('Failed to fetch product');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
      return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
      return <div className={styles.error}>Error: {error}</div>;
  }

  if (!product) {
      return <div>Product not found.</div>;
  }

  return (
    <div className={styles.productPage}>
        <div className={styles.container}>
            <div className={styles.productGrid}>
                <ProductThumbnail product={product} />
                <ProductInfo product={product} />
            </div>
        </div>
    </div>
  );
};

export default Product;
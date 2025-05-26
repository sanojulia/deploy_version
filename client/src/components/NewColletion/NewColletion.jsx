import React, { useState, useEffect } from 'react';
import styles from './NewColletion.module.css'
import ProductCard from '../../components/ProductCard/ProductCard';
import axios from 'axios';

const NewColletion = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    useEffect(() => {
      const loadProducts = async () => {
        try {
          const response = await axios.get('http://localhost:5000/api/new-in/');
          setProducts(response.data);
          setFilteredProducts(response.data);
        } catch (err) {
          setError(err.message || 'Failed to load new collection products');
          console.error('Error fetching products:', err);
        } finally {
          setLoading(false);
        }
      };

    loadProducts();
  }, [error]);
   
    if (loading) {
        return <div className={styles.loading}>Loading...</div>;
    }

  return (
    <div className={styles.container}>
        <div className={styles.header}>
            <h2>New Colletion</h2>
        </div>

        <div className={styles.productGrid}>
          {filteredProducts.map(product => (
            <ProductCard key={`${product.id}+${product.name}`} product={product} />
          ))}
        </div>
            
    </div>
  )
};

export default NewColletion;
import React, { useState, useEffect } from 'react';
import styles from './Men.module.css';
import ProductCard from '../../components/ProductCard/ProductCard';
import ProductFilters from '../../components/ProductFilters/ProductFilters';
import { apiService } from '../../services/apiService';
import { changeFiltering } from '../../utils/changeFiltering';
import { changeSorting } from '../../utils/changeSorting';
import { useNavigate } from 'react-router-dom';

const Men = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await apiService.get('/api/men');
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        setError(err.message || 'Failed to load men products');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  const handleFilterChange = (filters) => {
    let filtered = changeFiltering(filters, products);
    setFilteredProducts(filtered);
  };
  

  const handleSortChange = (sortBy) => {
    const sorted = changeSorting(sortBy, filteredProducts);
    setFilteredProducts(sorted);
  };

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  return (
    <div className={styles.menPage}>
      <div className={styles.container}>
        <header className={styles.pageHeader}>
          <h1>Men's Clothing & Accessories</h1>
          <p>{filteredProducts.length} styles found</p>
        </header>

        <ProductFilters 
         onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
        />

        <div className={styles.productGrid}>
          {filteredProducts.map(product => (
            <div key={product.id} onClick={() => handleProductClick(product._id)}>
              <ProductCard key={product.id} product={product} />
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className={styles.noResults}>
            <h2>No products found</h2>
            <p>Try adjusting your filters or browse our full collection</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Men;

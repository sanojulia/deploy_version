import React, { useState, useEffect } from 'react';
import styles from './NewIn.module.css';
import ProductCard from '../../components/ProductCard/ProductCard';
import ProductFilters from '../../components/ProductFilters/ProductFilters';
import { apiService } from '../../services/apiService';
import { changeFiltering } from '../../utils/changeFiltering';
import { useNavigate } from 'react-router-dom';
import { changeSorting } from '../../utils/changeSorting';


const NewIn = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
  const navigate = useNavigate();

  
    useEffect(() => {
      const loadProducts = async () => {
        try {
          const data = await apiService.get('/api/new-in');
          setProducts(data);
          setFilteredProducts(data);
        } catch (err) {
          setError(err.message || 'Failed to load new products');
          console.error('Error fetching products:', err);
        } finally {
          setLoading(false);
        }
      };

    loadProducts();
  }, [error]);

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
    <div className={styles.newInPage}>
      <div className={styles.container}>
        <header className={styles.pageHeader}>
          <h1>New Arrivals</h1>
          <p>{filteredProducts.length} new styles added this week</p>
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

export default NewIn;

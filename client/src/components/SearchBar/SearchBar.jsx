import React, { useState, useEffect } from 'react';
import styles from './SearchBar.module.css';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../../services/apiService';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);

    try {
      const data = await apiService.searchProducts(query);
      console.log(data)
      setSearchResults(data);
      setShowResults(true);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProduct = (productId) => {
    navigate(`/product/${productId}`);
    setShowResults(false);
    setQuery('');
  };

  const handleResultsClick = (e) => {
    e.stopPropagation(); // Prevent blur when clicking inside results
  };

  return (
    <div className={styles.searchBarContainer}>
      <div className={styles.searchBar}>
        <input
          type="text"
          id="searchBar"
          placeholder="Search for products..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setShowResults(true)}
          onBlur={(e) => {
            const searchContainer = document.querySelector('.searchBarContainer');
            if (!searchContainer?.contains(e.relatedTarget)) {
              setShowResults(false);
            }
          }}
        />
        <div className={styles.searchIcon} onClick={handleSearch}>
          <i className="fas fa-search"></i>
        </div>
      </div>

      {showResults && (
        <div className={styles.searchResults} onClick={handleResultsClick}>
          {isLoading ? (
            <div className={styles.loading}>Searching...</div>
          ) : searchResults.length > 0 ? (
            <div className={styles.resultsList}>
              {searchResults.map((product) => (
                <div
                  key={product._id || product.id}
                  className={styles.resultItem}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectProduct(product._id || product.id);
                  }}
                >
                  <img 
                    src={product.image?.main || '/default-product.jpg'}
                    alt={product.name}
                    className={styles.productImage}
                  />
                  <div className={styles.productInfo}>
                    <div className={styles.productName}>{product.name}</div>
                    <div className={styles.productPrice}>€{product.price}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.noResults}>
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
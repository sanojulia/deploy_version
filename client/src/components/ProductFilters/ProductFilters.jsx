import React, { useState } from 'react';
import styles from './ProductFilters.module.css';

// Filter and sort component for product listings
const ProductFilters = ({ onFilterChange, onSortChange }) => {
  // Track active filters for each category
  const [activeFilters, setActiveFilters] = useState({
    colors: [],
    types: [],
    sizes: [],
    brands: [],
    priceRanges: []
  });
  // Toggle filter visibility on mobile
  const [showFilters, setShowFilters] = useState(false);
  // Current sort option
  const [sortBy, setSortBy] = useState('recommended');

  // Available filter options for each category
  const filterOptions = {
    types: [
      'Dresses',
      'Tops',
      'T-Shirts',
      'Shirts',
      'Sweaters',
      'Jackets',
      'Coats',
      'Jeans',
      'Pants',
      'Skirts',
      'Shorts',
      'Accessories'
    ],
    colors: [
      'Black',
      'White',
      'Grey',
      'Blue',
      'Navy',
      'Red',
      'Pink',
      'Purple',
      'Green',
      'Yellow',
      'Orange',
      'Brown',
      'Beige',
      'Multi'
    ],
    sizes: [
      'XXS',
      'XS',
      'S',
      'M',
      'L',
      'XL',
      'XXL',
      '2',
      '4',
      '6',
      '8',
      '10',
      '12',
      '14'
    ],
    brands: [
      'JUSA Eco',
      'JUSA Sport',
      'JUSA Pro'
    ],
    priceRanges: [
      'Under €25',
      '€25 - €50',
      '€50 - €100',
      'Over €100'
    ]
  };

  // Available sort options
  const sortOptions = [
    { value: 'recommended', label: 'Recommended' },
    { value: 'newest', label: 'What\'s New' },
    { value: 'price-low', label: 'Price Low to High' },
    { value: 'price-high', label: 'Price High to Low' },
    { value: 'discount', label: 'Biggest Discount' }
  ];

  // Toggle a filter value on/off and notify parent
  const handleFilterChange = (category, value) => {
    const newFilters = { ...activeFilters };
    const categoryFilters = newFilters[category];
    
    // If already selected, remove it; otherwise add it
    if (categoryFilters.includes(value)) {
      newFilters[category] = categoryFilters.filter(item => item !== value);
    } else {
      newFilters[category] = [...categoryFilters, value];
    }
    
    setActiveFilters(newFilters);
    onFilterChange(newFilters); // Notify parent component
  };

  // Update sort option and notify parent
  const handleSortChange = (value) => {
    setSortBy(value);
    onSortChange(value); // Notify parent component
  };

  const clearFilters = () => {
    setActiveFilters({
      colors: [],
      types: [],
      sizes: [],
      brands: [],
      priceRanges: []
    });
    onFilterChange({
      colors: [],
      types: [],
      sizes: [],
      brands: [],
      priceRanges: []
    });
  };

  const totalActiveFilters = Object.values(activeFilters).flat().length;

  return (
    <div className={styles.filtersContainer}>
      <div className={styles.filterHeader}>
        <button 
          className={styles.filterToggle}
          onClick={() => setShowFilters(!showFilters)}
        >
          <i className="fas fa-sliders-h"></i>
          Filter
          {totalActiveFilters > 0 && (
            <span className={styles.filterCount}>{totalActiveFilters}</span>
          )}
        </button>

        <div className={styles.sortContainer}>
          <label htmlFor="sort">Sort by:</label>
          <select 
            id="sort"
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            className={styles.sortSelect}
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showFilters && (
        <div className={styles.filterPanel}>
          <div className={styles.filterPanelHeader}>
            <h3>Filter</h3>
            {totalActiveFilters > 0 && (
              <button 
                className={styles.clearFilters}
                onClick={clearFilters}
              >
                Clear All
              </button>
            )}
          </div>

          <div className={styles.filterGroups}>
            <div className={styles.filterGroup}>
              <h4>Product Type</h4>
              <div className={styles.filterOptions}>
                {filterOptions.types.map(type => (
                  <label key={type} className={styles.filterOption}>
                    <input
                      type="checkbox"
                      checked={activeFilters.types.includes(type)}
                      onChange={() => handleFilterChange('types', type)}
                    />
                    <span className={styles.checkmark}></span>
                    {type}
                  </label>
                ))}
              </div>
            </div>         

            <div className={styles.filterGroup}>
              <h4>Color</h4>
              <div className={styles.colorOptions}>
                {filterOptions.colors.map(color => (
                  <label key={color} className={styles.colorOption}>
                    <input
                      type="checkbox"
                      checked={activeFilters.colors.includes(color)}
                      onChange={() => handleFilterChange('colors', color)}
                    />
                    <span 
                      className={styles.colorSwatch} 
                      style={{ backgroundColor: color.toLowerCase() }}
                    ></span>
                    {color}
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.filterGroup}>
              <h4>Size</h4>
              <div className={styles.sizeOptions}>
                {filterOptions.sizes.map(size => (
                  <label key={size} className={styles.sizeOption}>
                    <input
                      type="checkbox"
                      checked={activeFilters.sizes.includes(size)}
                      onChange={() => handleFilterChange('sizes', size)}
                    />
                    <span className={styles.sizeBox}>{size}</span>
                  </label>
                ))}
              </div>
            </div>
            </div>

          <div className={styles.filterPanelFooter}>
            <button 
              className={styles.viewItems}
              onClick={() => setShowFilters(false)}
            >
              View Items
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductFilters;

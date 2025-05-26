import React from 'react'
import styles from './SizeSelector.module.css'

const SizeSelector = ({sizes, selectedSize, onSelectSize}) => {
 

  const handleSizeChange = (e) => {
      onSelectSize(e.target.value);
  };


  return (
    <div className={styles.container}>
        <p>Select a size:</p>
        <select className={styles.dropDownSelector} value={selectedSize} onChange={handleSizeChange}>
          <option value="" disabled>Select a size</option>
          {sizes.map((size, index) => (
            <option key={index} value={size}>{size}</option>
          ))}
        </select>
    </div>
  )
};

export default SizeSelector;
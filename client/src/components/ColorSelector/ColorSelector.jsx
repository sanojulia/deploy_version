import React from 'react'
import styles from './ColorSelector.module.css'

const ColourSelector = ({colors, selectedColor, onSelectColor}) => {

    const handleColorChange = (e) => {
        onSelectColor(e.target.value);
    };

  return (
    <div className={styles.container}>
        <p>Select a colour:</p>
        <select className={styles.dropDownSelector} value={selectedColor} onChange={handleColorChange}>
            <option value="" disabled>Select a colour</option>
            {colors.map((colour, index) => (
            <option key={index} value={colour}>{colour}</option>
            ))}
        </select>
    </div>
  )
};

export default ColourSelector;
export const changeFiltering = (filters, products) => {
  let filtered = [...products];

  if (filters.colors.length > 0) {
    filtered = filtered.filter(product => 
      product.colors.some(color => filters.colors.includes(color))
    );
  }

  if (filters.types.length > 0) {
    filtered = filtered.filter(product => 
      filters.types.includes(product.type)
    );
  }

  if (filters.sizes.length > 0) {
    filtered = filtered.filter(product => 
      product.sizes.some(size => filters.sizes.includes(size))
    );
  }

  return filtered;
};

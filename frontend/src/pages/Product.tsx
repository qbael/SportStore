import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import ProductList from '../components/layout/ProductList';
import Footer from '../components/layout/Footer';
import { type Product, products as initialProducts } from '../data/products';

function Product() {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(initialProducts);

  const handleSearch = (searchTerm: string) => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setFilteredProducts(initialProducts);
      return;
    }
    const filtered = initialProducts.filter(
      (product) =>
        product.title.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term) ||
        product.description.toLowerCase().includes(term)
    );
    setFilteredProducts(filtered);
  };

  return (
    <>
      <Navbar onSearch={handleSearch} />
      <ProductList products={filteredProducts} />
      <Footer />
    </>
  );
}

export default Product;
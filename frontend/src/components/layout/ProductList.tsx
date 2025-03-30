import React from 'react';
import { Product } from '../../data/products';
import '../../css/ProductList.css';

interface ProductListProps {
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  return (
    <div className="product-list container my-5">
      <h2 className="text-center mb-5 title">Sản Phẩm Nổi Bật</h2>
      <div className="row gy-4">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
              <div className="product-card card h-100">
                <div className="image-wrapper">
                  <img src={product.image} alt={product.title} className="product-image card-img-top" />
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="product-title card-title">{product.title}</h5>
                  <p className="product-category card-text text-muted">{product.category}</p>
                  <p className="product-price card-text">${product.price.toFixed(2)}</p>
                  <p className="product-description card-text">{product.description}</p>
                  <div className="mt-auto d-flex gap-2">
                    <button className="btn btn-dark btn-sm flex-grow-1">Thêm vào giỏ</button>
                    <button className="btn btn-outline-dark btn-sm">Chi tiết</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center">
            <p className="text-muted no-products">Không tìm thấy sản phẩm nào.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;
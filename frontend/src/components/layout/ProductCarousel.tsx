import React, { useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { FaHeart } from 'react-icons/fa';
import { Container, Button } from 'react-bootstrap';
import '../../css/ProductCarousel.css';

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  discountedPrice: string;
  discount: string;
  image: string;
}

interface ResponsiveConfig {
  [key: string]: { breakpoint: { max: number; min: number }; items: number };
}

interface Sport {
  name: string;
  image: string;
}

const products: Product[] = [
  { id: 1, name: 'Duramo 10 Shoes', category: 'Tennis', price: '4,800,000đ', discountedPrice: '2,400,000đ', discount: '-50%', image: 'https://i.pinimg.com/236x/77/7c/10/777c10c20a0c73d59af447d04399afd4.jpg' },
  { id: 2, name: 'Run 60s 2.0 Shoes', category: 'Cầu Lông', price: '1,500,000đ', discountedPrice: '750,000đ', discount: '-50%', image: 'https://i.pinimg.com/236x/77/7c/10/777c10c20a0c73d59af447d04399afd4.jpg' },
  { id: 3, name: 'X Crazyfast.3 Boots', category: 'Bóng Bàn', price: '2,400,000đ', discountedPrice: '1,200,000đ', discount: '-50%', image: 'https://i.pinimg.com/236x/77/7c/10/777c10c20a0c73d59af447d04399afd4.jpg' },
  { id: 4, name: 'Originals', category: 'Tennis', price: '1,500,000đ', discountedPrice: '570,000đ', discount: '-50%', image: 'https://i.pinimg.com/236x/77/7c/10/777c10c20a0c73d59af447d04399afd4.jpg' },
];

const sports: Sport[] = [
  { name: 'Chạy bộ', image: 'https://i.pinimg.com/736x/3b/74/7a/3b747afe0056faf3550c19e07fa4649c.jpg' },
  { name: 'Bóng đá', image: 'https://i.pinimg.com/736x/3b/74/7a/3b747afe0056faf3550c19e07fa4649c.jpg' },
  { name: 'Bóng rổ', image: 'https://i.pinimg.com/736x/3b/74/7a/3b747afe0056faf3550c19e07fa4649c.jpg' },
];

const responsive: ResponsiveConfig = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 4 },
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
};

const sportResponsive: ResponsiveConfig = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 3 },
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
};

const categories = ['Hot', 'Tennis', 'Cầu Lông', 'Bóng Bàn'];

const ProductCarousel: React.FC = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Hot');

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) => prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]);
  };

  const filteredProducts = selectedCategory === 'Hot' ? products : products.filter((p) => p.category === selectedCategory);
  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-uppercase">Khuyến mãi đặc biệt</h2>
        <a href="#all-products" className="text-dark text-decoration-none fw-bold">Xem tất cả</a>
      </div>
      <div className="d-flex flex-wrap gap-2 mb-4">
        {categories.map((category) => (
          <button
            key={category}
            className={`btn ${selectedCategory === category ? 'btn-dark' : 'btn-outline-dark'}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      {/* san pham */}
      <Carousel responsive={responsive} infinite keyBoardControl>
        {filteredProducts.map((product) => (
          <div key={product.id} className="card border-0 p-2 ">
            <div className="position-relative">
              <img src={product.image} className="card-img-top" alt={product.name} style={{ height: '250px', objectFit: 'cover' }} />
              <FaHeart
                className="position-absolute"
                style={{ top: '10px', right: '10px', color: favorites.includes(product.id) ? '#e44d26' : '#ccc', cursor: 'pointer' }}
                onClick={() => toggleFavorite(product.id)}
              />
            </div>
            <div className="card-body text-center">
              <p className="text-danger fw-bold mb-0">{product.discount}</p>
              <p className="text-muted text-decoration-line-through mb-0">{product.price}</p>
              <h6 className="text-dark fw-bold">{product.discountedPrice}</h6>
              <p className="card-text">{product.name}</p>
              <small className="text-muted">{product.category}</small>
            </div>
          </div>
        ))}
      </Carousel>
      <div className="mt-5">
        <h3 className="fw-bold mb-3">Yêu thích của bạn</h3>
        {favoriteProducts.length > 0 ? (
          <div className="row">
            {favoriteProducts.map((product) => (
              <div key={product.id} className="col-md-3 col-sm-6 mb-4">
                <div className="card">
                  <div className="position-relative">
                    <img 
                      src={product.image} 
                      className="card-img-top" 
                      alt={product.name} 
                      style={{ height: '200px', objectFit: 'cover' }} 
                    />
                    <FaHeart
                      className="position-absolute"
                      style={{ 
                        top: '10px', 
                        right: '10px', 
                        color: '#e44d26', 
                        cursor: 'pointer',
                        zIndex: 1 
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(product.id);
                      }}
                    />
                  </div>
                  <div className="card-body text-center">
                    <p className="text-danger fw-bold mb-0">{product.discount}</p>
                    <p className="text-muted text-decoration-line-through mb-0">{product.price}</p>
                    <h6 className="text-dark fw-bold">{product.discountedPrice}</h6>
                    <p className="card-text">{product.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted">Chưa có sản phẩm nào trong danh sách yêu thích.</p>
        )}
      </div>
      <Container className="my-5">
        <h2 className="fw-bold mb-4">Thể thao yêu thích</h2>
        <Carousel responsive={sportResponsive} infinite autoPlay autoPlaySpeed={3000} keyBoardControl arrows showDots>
          {sports.map((sport, index) => (
            <div key={index} className="position-relative">
              <img src={sport.image} alt={sport.name} style={{ width: '100%', height: '350px', objectFit: 'cover' }} />
              <div className="position-absolute bottom-0 start-0 p-3">
                <Button variant="dark" className="rounded-pill">{sport.name}</Button>
              </div>
            </div>
          ))}
        </Carousel>
      </Container>
    </div>
  );
};

export default ProductCarousel;
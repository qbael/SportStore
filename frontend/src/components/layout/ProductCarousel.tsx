import React, { useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { FaHeart } from 'react-icons/fa';
import { Container, Button } from 'react-bootstrap';

// Định nghĩa kiểu cho sản phẩm
interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  discountedPrice: string;
  discount: string;
  image: string;
}

// Định nghĩa kiểu cho responsive của react-multi-carousel
interface ResponsiveConfig {
  [key: string]: {
    breakpoint: { max: number; min: number };
    items: number;
  };
}
// Định nghĩa kiểu cho môn thể thao
interface Sport {
  name: string;
  image: string;
}

// Dữ liệu giả lập
const products: Product[] = [
  {
    id: 1,
    name: 'Duramo 10 Shoes',
    category: 'Tennis',
    price: '4,800,000đ',
    discountedPrice: '2,400,000đ',
    discount: '-50%',
    image: 'https://i.pinimg.com/236x/77/7c/10/777c10c20a0c73d59af447d04399afd4.jpg',
  },
  {
    id: 2,
    name: 'Run 60s 2.0 Shoes',
    category: 'Cầu Lông',
    price: '1,500,000đ',
    discountedPrice: '750,000đ',
    discount: '-50%',
    image: 'https://i.pinimg.com/236x/77/7c/10/777c10c20a0c73d59af447d04399afd4.jpg',
  },
  {
    id: 3,
    name: 'X Crazyfast.3 Firm Ground Boots',
    category: 'Bóng Bàn',
    price: '2,400,000đ',
    discountedPrice: '1,200,000đ',
    discount: '-50%',
    image: 'https://i.pinimg.com/236x/77/7c/10/777c10c20a0c73d59af447d04399afd4.jpg',
  },
  {
    id: 4,
    name: 'Originals',
    category: 'Tennis',
    price: '1,500,000đ',
    discountedPrice: '570,000đ',
    discount: '-50%',
    image: 'https://i.pinimg.com/236x/77/7c/10/777c10c20a0c73d59af447d04399afd4.jpg',
  },
];
// Dữ liệu giả lập cho môn thể thao
const sports: Sport[] = [
  {
    name: 'Chạy bộ',
    image: 'https://i.pinimg.com/736x/3b/74/7a/3b747afe0056faf3550c19e07fa4649c.jpg',
  },
  {
    name: 'Bóng đá',
    image: 'https://i.pinimg.com/736x/3b/74/7a/3b747afe0056faf3550c19e07fa4649c.jpg',
  },
  {
    name: 'Bóng rổ',
    image: 'https://i.pinimg.com/736x/3b/74/7a/3b747afe0056faf3550c19e07fa4649c.jpg',
  },
];
// Cấu hình responsive cho carousel
const responsive: ResponsiveConfig = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 4,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};
// Cấu hình responsive cho carousel môn thể thao
const sportResponsive: ResponsiveConfig = {
  superLargeDesktop: {
    breakpoint: { max: 4000, min: 3000 },
    items: 3,
  },
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 3,
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 2,
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
  },
};

// Danh sách các tab danh mục
const categories = ['Hot', 'Tennis', 'Cầu Lông', 'Bóng Bàn'];

const ProductCarousel: React.FC = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('Hot');

  const toggleFavorite = (productId: number) => {
    let savedFavorites = [...favorites];
    if (favorites.includes(productId)) {
      savedFavorites = favorites.filter((id) => id !== productId);
    } else {
      savedFavorites = [...favorites, productId];
    }
    setFavorites(savedFavorites);
    console.log('Favorites:', savedFavorites);
  };

  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category);
  };

  // Lọc sản phẩm theo danh mục
  const filteredProducts = selectedCategory === 'Hot'
    ? products
    : products.filter((product) => product.category === selectedCategory);

  // Lọc danh sách sản phẩm yêu thích
  const favoriteProducts = products.filter((product) => favorites.includes(product.id));

  return (
    <div className="container my-4">
      {/* Tiêu đề khuyến mãi */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="text-uppercase">
          Up to 50% Off + Extra 10% Off for Members
        </h5>
        <a href="#" className="text-dark text-decoration-none">
          View All
        </a>
      </div>

      {/* Tabs danh mục */}
      <div className="d-flex flex-wrap mb-3">
        {categories.map((category) => (
          <span
            key={category}
            className={`badge me-2 ${selectedCategory === category ? 'bg-dark text-white' : 'bg-light text-dark'}`}
            onClick={() => handleCategoryClick(category)}
            style={{ cursor: 'pointer' }}
            role="button"
            aria-label={`Select ${category} category`}
          >
            {category}
          </span>
        ))}
      </div>

      {/* Carousel sản phẩm */}
      <Carousel
        responsive={responsive}
        infinite={true}
        autoPlay={false}
        keyBoardControl={true}
        containerClass="carousel-container"
        itemClass="carousel-item-padding-40-px"
      >
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div key={product.id} className="card border-0 cursor-pointer">
              <div className="position-relative">
                <img
                  src={product.image}
                  className="card-img-top"
                  alt={product.name}
                  style={{ height: '300px', objectFit: 'contain' } as React.CSSProperties}
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                  }}
                />
                <FaHeart
                  className="position-absolute"
                  style={{
                    top: '15px',
                    right: '10px',
                    color: favorites.includes(product.id) ? '#ff0000' : '#fff',
                    cursor: 'pointer',
                  } as React.CSSProperties}
                  onClick={(e) => {
                    e.stopPropagation(); // Ngăn sự kiện click lan lên thẻ cha
                    toggleFavorite(product.id);
                  }}
                  aria-label={favorites.includes(product.id) ? 'Remove from favorites' : 'Add to favorites'}
                />
              </div>
              <div className="card-body text-center">
                <p className="text-danger mb-0">{product.discount}</p>
                <p className="text-muted text-decoration-line-through mb-0">
                  {product.price}
                </p>
                {product.discountedPrice ? (
                  <h6 className="text-dark">{product.discountedPrice}</h6>
                ) : (
                  <h6 className="text-dark">{product.price}</h6>
                )}
                <p className="card-text">{product.name}</p>
                {product.category && (
                  <small className="text-muted">{product.category}</small>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center p-4">
            <p>Không có sản phẩm nào trong danh mục này.</p>
          </div>
        )}
      </Carousel>

      {/* Danh sách sản phẩm yêu thích */}
      <div className="mt-5">
        <h5 className="text-uppercase mb-3">Danh sách sản phẩm yêu thích</h5>
        {favoriteProducts.length > 0 ? (
          <div className="row">
            {favoriteProducts.map((product) => (
              <div key={product.id} className="col-md-3 col-sm-6 mb-4">
                <div className="card border-0 cursor-pointer">
                  <div className="position-relative">
                    <img
                      src={product.image}
                      className="card-img-top"
                      alt={product.name}
                      style={{ height: '200px', objectFit: 'contain' } as React.CSSProperties}
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                      }}
                    />
                    <FaHeart
                      className="position-absolute"
                      style={{
                        top: '10px',
                        right: '10px',
                        color: '#ff0000',
                        cursor: 'pointer',
                      } as React.CSSProperties}
                      onClick={(e) => {
                        e.stopPropagation(); // Ngăn sự kiện click lan lên thẻ cha
                        toggleFavorite(product.id);
                      }}
                      aria-label="Remove from favorites"
                    />
                  </div>
                  <div className="card-body text-center">
                    <p className="text-danger mb-0">{product.discount}</p>
                    <p className="text-muted text-decoration-line-through mb-0">
                      {product.price}
                    </p>
                    {product.discountedPrice ? (
                      <h6 className="text-dark">{product.discountedPrice}</h6>
                    ) : (
                      <h6 className="text-dark">{product.price}</h6>
                    )}
                    <p className="card-text">{product.name}</p>
                    {product.category && (
                      <small className="text-muted">{product.category}</small>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center p-4">
            <p>Chưa có sản phẩm nào trong danh sách yêu thích.</p>
          </div>
        )}

        {/* Carousel "Mua sắm theo môn thể thao" */}
      <Container className="my-5">
        {/* Tiêu đề */}
        <h2 className="mb-4">Mua sắm theo môn thể thao</h2>

        {/* Carousel */}
        <Carousel
          responsive={sportResponsive}
          infinite={true}
          autoPlay={true}
          autoPlaySpeed={3000}
          keyBoardControl={true}
          containerClass="carousel-container"
          itemClass="carousel-item-padding-40-px"
          arrows={true}
          showDots={true}
        >
          {sports.map((sport, index) => (
            <div key={index} className="position-relative">
              <img
                src={sport.image}
                alt={sport.name}
                style={{
                  width: '100%',
                  height: '400px',
                  objectFit: 'cover',
                  filter: 'grayscale(100%)',
                } as React.CSSProperties}
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/1200x400?text=Image+Not+Found';
                }}
              />
              <div className="position-absolute bottom-0 start-0 p-3">
                <Button variant="light" className="rounded-pill">
                  {sport.name}
                </Button>
              </div>
            </div>
          ))}
        </Carousel>
      </Container>

      </div>
      
    </div>
  );
};

export default ProductCarousel;
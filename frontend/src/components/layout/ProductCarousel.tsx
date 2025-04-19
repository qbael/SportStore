import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import { FaHeart } from 'react-icons/fa';
import { Container, Button } from 'react-bootstrap';
import '../../css/ProductCarousel.css';
import { PRODUCT_IMAGE_BASE_PATH } from '../../util/Constant';
import { useAuth } from '../../hook/useAuth.tsx'; // Thêm useAuth để lấy user

// Định nghĩa type cho Product
type ProductType = {
  id: number;
  name: string;
  image: string;
  price: number;
  category: string;
  discount: string;
  discountedPrice: number;
  type?: string;
};

// Định nghĩa type cho Sport
type SportType = {
  name: string;
  image: string;
};

const responsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 4 },
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 4 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
};

const sportResponsive = {
  superLargeDesktop: { breakpoint: { max: 4000, min: 3000 }, items: 3 },
  desktop: { breakpoint: { max: 3000, min: 1024 }, items: 3 },
  tablet: { breakpoint: { max: 1024, min: 464 }, items: 2 },
  mobile: { breakpoint: { max: 464, min: 0 }, items: 1 },
};

const categories = ['Hot', 'Vợt', 'Quần áo', 'Giày'];

const sports: SportType[] = [
  { name: 'Tennis', image: `${PRODUCT_IMAGE_BASE_PATH}/tennis.jpg` },
  { name: 'Badminton', image: `${PRODUCT_IMAGE_BASE_PATH}/badminton.jpg` },
  { name: 'Table tennis', image: `${PRODUCT_IMAGE_BASE_PATH}/tabletennis.jpg` },
];

const defaultImage = '/images/default-image.jpg';

// Hàm định dạng tiền tệ
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const ProductCarousel: React.FC = () => {
  const { user } = useAuth(); // Lấy thông tin user từ AuthContext
  const [products, setProducts] = useState<ProductType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<number[]>(() => {
    // Tạo key động dựa trên username
    const favoritesKey = user ? `favorites_${user.username}` : 'favorites_guest';
    const saved = localStorage.getItem(favoritesKey);
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('Hot');
  const navigate = useNavigate();

  // Lưu favorites vào localStorage khi favorites hoặc user thay đổi
  useEffect(() => {
    const favoritesKey = user ? `favorites_${user.username}` : 'favorites_guest';
    try {
      localStorage.setItem(favoritesKey, JSON.stringify(favorites));
    } catch (error) {
      console.error('Lỗi khi lưu favorites vào localStorage:', error);
    }
  }, [favorites, user]);

  // Tải lại favorites khi user thay đổi (đăng nhập/đăng xuất)
  useEffect(() => {
    const favoritesKey = user ? `favorites_${user.username}` : 'favorites_guest';
    try {
      const saved = localStorage.getItem(favoritesKey);
      setFavorites(saved ? JSON.parse(saved) : []);
    } catch (error) {
      console.error('Lỗi khi đọc favorites từ localStorage:', error);
      setFavorites([]);
    }
  }, [user]);

  // Gọi API lấy sản phẩm
  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch('http://localhost:8080/api/sanpham?limit=28', {
          signal: abortController.signal,
        });
        if (!response.ok) {
          throw new Error(`Lỗi HTTP! trạng thái: ${response.status}`);
        }
        const ress = await response.json();
        const mappedProducts: ProductType[] = ress.content.map((item: any) => {
          const discountPercent =
            item.giaNhap && item.giaNhap > 0
              ? (item.giaNhap / item.giaBan) * 100
              : 0;
          return {
            id: item.id,
            name: item.tenSanPham || 'Sản phẩm không tên',
            image: item.hinhAnh || '',
            price: item.giaBan || 0,
            category: item.danhMuc?.loai || 'Khác',
            discount: `${discountPercent.toFixed(0)}%`,
            discountedPrice: item.giaNhap || 0,
            type: item.boMon?.tenBoMon || 'Khác',
          };
        });
        setProducts(mappedProducts);
      } catch (error) {
        if (error.name === 'AbortError') {
          console.log('Fetch aborted');
        } else {
          console.error('Lỗi khi lấy sản phẩm:', error);
          setError('Không thể tải sản phẩm. Vui lòng thử lại sau.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, []);

  const toggleFavorite = (productId: number, event: React.MouseEvent) => {
    event.stopPropagation();
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const filteredProducts = useMemo(
    () =>
      selectedCategory === 'Hot'
        ? products
        : products.filter((p) => p.category === selectedCategory),
    [products, selectedCategory]
  );

  const favoriteProducts = products.filter((p) => favorites.includes(p.id));

  if (isLoading) {
    return (
      <div className="container my-5">
        <div className="row">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="col-md-3 col-sm-6 mb-4">
              <div className="card skeleton" style={{ height: '300px', background: '#e0e0e0' }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-center my-5 text-danger">{error}</div>;
  }

  if (products.length === 0) {
    return <div className="text-center my-5">Không có sản phẩm nào.</div>;
  }

  return (
    <div className="container my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold text-uppercase">Khuyến mãi đặc biệt</h2>
        <div
          className="text-dark text-decoration-none fw-bold"
          onClick={() => navigate('/product')}
          style={{ cursor: 'pointer' }}
        >
          Xem tất cả
        </div>
      </div>
      <div className="d-flex flex-wrap gap-2 mb-4">
        {categories.map((category) => (
          <button
            key={category}
            className={`btn ${selectedCategory === category ? 'btn-dark' : 'btn-outline-dark'} rounded-pill px-3 py-1`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>
      <Carousel responsive={responsive} infinite keyBoardControl>
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="card border-0 p-2 shadow-sm"
            onClick={() => navigate(`/product/${product.id}`)}
            style={{ cursor: 'pointer' }}
          >
            <div className="position-relative">
              <img
                src={product.image ? `${PRODUCT_IMAGE_BASE_PATH}${product.image}` : defaultImage}
                className="card-img-top"
                alt={product.name}
                style={{ height: '250px', objectFit: 'cover', borderRadius: '8px' }}
                loading="lazy"
              />
              <FaHeart
                className="position-absolute"
                style={{
                  top: '10px',
                  right: '10px',
                  color: favorites.includes(product.id) ? '#e44d26' : '#ccc',
                  cursor: 'pointer',
                  fontSize: '20px',
                }}
                onClick={(e) => toggleFavorite(product.id, e)}
              />
            </div>
            <div className="card-body text-center">
              <p className="text-danger fw-bold mb-0">{product.discount}</p>
              <p className="text-muted text-decoration-line-through mb-0">{formatCurrency(product.price)}</p>
              <h6 className="text-dark fw-bold">{formatCurrency(product.discountedPrice)}</h6>
              <p className="card-text text-truncate" title={product.name}>
                {product.name}
              </p>
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
                <div
                  className="card shadow-sm"
                  onClick={() => navigate(`/product/${product.id}`)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="position-relative">
                    <img
                      src={product.image ? `${PRODUCT_IMAGE_BASE_PATH}${product.image}` : defaultImage}
                      className="card-img-top"
                      alt={product.name}
                      style={{ height: '200px', objectFit: 'cover', borderRadius: '8px' }}
                      loading="lazy"
                    />
                    <FaHeart
                      className="position-absolute"
                      style={{
                        top: '10px',
                        right: '10px',
                        color: '#e44d26',
                        cursor: 'pointer',
                        fontSize: '20px',
                        zIndex: 1,
                      }}
                      onClick={(e) => toggleFavorite(product.id, e)}
                    />
                  </div>
                  <div className="card-body text-center">
                    <p className="text-danger fw-bold mb-0">{product.discount}</p>
                    <p className="text-muted text-decoration-line-through mb-0">
                      {formatCurrency(product.price)}
                    </p>
                    <h6 className="text-dark fw-bold">{formatCurrency(product.discountedPrice)}</h6>
                    <p className="card-text text-truncate" title={product.name}>
                      {product.name}
                    </p>
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
              <img
                src={sport.image || defaultImage}
                alt={sport.name}
                style={{ width: '100%', height: '350px', objectFit: 'cover', borderRadius: '8px' }}
                loading="lazy"
              />
              <div className="position-absolute bottom-0 start-0 p-3">
                <Button
                  variant="dark"
                  className="rounded-pill px-3 py-1"
                  onClick={() => {
                    const bomonMap: { [key: string]: string } = {
                      Tennis: 'tennis',
                      Badminton: 'cau-long',
                      'Table tennis': 'bong-ban',
                    };
                    const bomonValue = bomonMap[sport.name] || sport.name.toLowerCase();
                    navigate(`/product?bomon=${encodeURIComponent(bomonValue)}`);
                  }}
                >
                  {sport.name}
                </Button>
              </div>
            </div>
          ))}
        </Carousel>
      </Container>
    </div>
  );
};

export default ProductCarousel;
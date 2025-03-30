import React from 'react';
import Navbar from '../components/layout/Navbar';
import VideoLogo from '../components/layout/VideoLogo';
import ProductCarousel from '../components/layout/ProductCarousel';
import Footer from '../components/layout/Footer';

function Home() {
  const handleSearch = (searchTerm: string) => {
    console.log('Tìm kiếm từ Home:', searchTerm);
    // Có thể thêm logic lọc sản phẩm ở đây nếu cần
  };

  return (
    <>
      <Navbar onSearch={handleSearch} />
      <VideoLogo />
      <ProductCarousel />
      <Footer />
    </>
  );
}

export default Home;
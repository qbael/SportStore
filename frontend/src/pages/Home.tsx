import VideoLogo from '../components/layout/VideoLogo';
import ProductCarousel from '../components/layout/ProductCarousel.tsx'
import '../css/Navbar.css'
import '../css/Video.css'

function Home() {
  return (
    <>
      <VideoLogo />
      <ProductCarousel />
    </>
  );
}
export default Home
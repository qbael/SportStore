
import Video from '../components/layout/VideoLogo.tsx'
import Navbar from '../components/layout/Navbar.tsx'
import ProductCarousel from '../components/layout/ProductCarousel.tsx'
import '../css/Navbar.css'
import '../css/video.css'
import '../css/ProductCarousek.css'

function Home() {
  return (
    <>
        <Navbar />
        <Video />
        <ProductCarousel />
    </>
  )
}
export default Home
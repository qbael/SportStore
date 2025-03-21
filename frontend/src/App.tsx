import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import Video from './components/VideoLogo.tsx'
import Navbar from './components/Navbar.tsx'
import './css/Navbar.css'
import './css/video.css'

export default function App() {

  return (
    <>
        <Navbar />
        <Video />
    </>
  )
}
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {BrowserRouter, Route, Routes, useLocation} from "react-router-dom";

<<<<<<< Updated upstream
import Home from './pages/Home.tsx'
import Product from './pages/Product.tsx'
=======
import Home from "./pages/Home.tsx";

import Product from "./pages/Product.tsx";
import Cart from "./pages/Cart.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import NotFound from "./pages/NotFound.tsx"; // Thêm NotFound
import Login from "./pages/Loging.tsx"; // Thêm Admin
>>>>>>> Stashed changes

import './css/Navbar.css'
import './css/Video.css'

import Navbar from "./components/layout/Navbar.tsx";
import Footer from "./components/layout/Footer.tsx";
import Notification from "./components/ui/Notification.tsx";
<<<<<<< Updated upstream
import ProductDetail from "./pages/ProductDetail.tsx";

const Layout = () => {
    const hideLayout = useLocation().pathname === '/admin';
    return (
        <div className="container-fluid p-0"
             style={{ marginTop: '80px'}}
        >
            <Notification/>
            {!hideLayout && <Navbar/>}
            <div className="w-100">
                <Routes>
                    <Route path='/' element={<Home/>}/>
                    <Route path='/product' element={<Product/>}/>
                    <Route path='/product/:id' element={<ProductDetail/>}/>
                </Routes>
            </div>
            {!hideLayout && <Footer/>}
        </div>
    );
}
=======
import Notification2 from "./components/ui/Notification2.tsx";

const Layout = () => {
  const hideLayout = useLocation().pathname === "/admin";
  return (
    <div
      className="container-fluid p-0"
      style={{ marginTop: "80px" }}
    >

      <Notification2 />
      <Notification />
      
      <Routes>
      </Routes>
      {!hideLayout && <Navbar />}
      <div className="w-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product" element={<Product />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/account" element={<Login />} /> 
          <Route path='/cart' element={<Cart/>}/>
          <Route path="*" element={<NotFound />} /> {/* Route mặc định cho 404 */}
         
        </Routes>
      </div>
      {!hideLayout && <Footer />}
     
    </div>
  );
};
>>>>>>> Stashed changes

export const App = () => {
    return (
        <>
            <BrowserRouter>
                <Layout/>
            </BrowserRouter>
        </>
    )
}
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";

import Home from "./pages/Home.tsx";
import Product from "./pages/Product.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import NotFound from "./pages/NotFound.tsx"; // Thêm NotFound

import "./css/Navbar.css";
import "./css/Video.css";

import Navbar from "./components/layout/Navbar.tsx";
import Footer from "./components/layout/Footer.tsx";
import Notification from "./components/ui/Notification.tsx";
import Notification2 from "./components/ui/Notification2.tsx";
import Cart from "./pages/Cart.tsx";
import Login from './pages/Login.tsx';

const Layout = () => {
    const hideLayout = useLocation().pathname === '/admin';
    return (
        <div className="container-fluid p-0"
             style={{ marginTop: '80px'}}
        >
            <Notification2/>
            <Notification/>
            {!hideLayout && <Navbar/>}
            <div className="w-100">
                <Routes>
                    <Route path='/' element={<Home/>}/>
                    <Route path='/product' element={<Product/>}/>
                    <Route path='/product/:id' element={<ProductDetail/>}/>
                    <Route path='/cart' element={<Cart/>}/>
                    <Route path='/account' element={<Login/>}/>
                    <Route path="*" element={<NotFound />} /> {/* Route mặc định cho 404 */}
                </Routes>
            </div>
            {!hideLayout && <Footer/>}
        </div>
    );
}

export const App = () => {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
};
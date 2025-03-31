import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import {BrowserRouter, Route, Routes, useLocation} from "react-router-dom";

import Home from './pages/Home.tsx'
import Product from './pages/Product.tsx'

import './css/Navbar.css'
import './css/Video.css'

import Navbar from "./components/layout/Navbar.tsx";
import Footer from "./components/layout/Footer.tsx";
import Notification from "./components/ui/Notification.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";

const Layout = () => {
    const hideLayout = useLocation().pathname === '/admin';
    return (
        <div className="container-fluid p-0">
            <Notification/>
            {!hideLayout && <Navbar/>}
            <div>
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

export const App = () => {
    return (
        <>
            <BrowserRouter>
                <Layout/>
            </BrowserRouter>
        </>
    )
}
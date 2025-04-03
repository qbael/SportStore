import { Container, Row, Col, Button, Image} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useEffect, useState} from "react";
import {ChiTietSanPhamType, MauType, SizeType} from "../util/types/ProductTypes.tsx";
import {useLocation} from "react-router-dom";
import '../css/ProductDetail.css'

const ProductDetail: React.FC = () => {
    const [selectedSize, setSelectedSize] = useState<SizeType | null>(null);
    const [selectedColor, setSelectedColor] = useState<MauType | null>(null);
    const selectedProduct = JSON.parse(localStorage.getItem('selectedProduct') || '{}');
    const [productImage, setProductImage] = useState<string>(selectedProduct?.hinhAnh || '');

    let chiTietSanPham: ChiTietSanPhamType = {
        sanPham: selectedProduct,
        bienThe: []
    }

    let sizeMap = new Map<number, string>();
    let mauMap = new Map<number, string>();
    const location = useLocation();
    const id = location.pathname.split('/').pop() || '';

    useEffect(() => {
        if (!selectedProduct) return;

        window.scrollTo({ top: 40 });
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchData = async () => {
            try {
                console.log('fetch');
                const response = await fetch(`http://localhost:8080/api/sanpham/${id}`, { signal });
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data = await response.json();
                chiTietSanPham.bienThe = data;
                chiTietSanPham.bienThe.forEach(item => {
                    if (item.size){
                        sizeMap.set(item.id, item.size.size);
                    }
                    if (item.mau) {
                        mauMap.set(item.id, item.mau.tenMau);
                    }
                });
                console.log(sizeMap);
                console.log(mauMap);
            } catch (error: string | any) {
                if (error.name === 'AbortError') {
                    console.log('Fetch aborted');
                } else {
                    console.error(error);
                }
            }
        };

        fetchData();

        return () => controller.abort();
    }, [location.pathname]);

    return (
        <Container fluid={'xxl'} className="my-5 product-detail-container">
            <Row>
                <Col xs={10} md={5} className="position-relative">
                    <Image src={`/product/${productImage}`} fluid className="main-product-image border border-1" />
                </Col>

                <Col xs={12} md={6}>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                        <h1 className="h2">{chiTietSanPham.sanPham?.tenSanPham}</h1>
                        <div className="d-flex">
                        </div>
                    </div>

                    <h2 className="mb-4 text-danger">{chiTietSanPham.sanPham?.giaBan.toLocaleString('de-DE') + 'VND'}</h2>

                    <div className="mb-4">
                        <div className="mb-2">
                            <Button
                                variant="outline-secondary"
                                className="rounded-circle p-0"
                                style={{ width: '40px', height: '40px', backgroundColor: '#f5f5f5', border: '2px solid #000' }}
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h3 className="h5 mb-0">Chọn kích thước</h3>
                        </div>
                        <div className="d-flex flex-wrap">
                            {/*{sizeOptions.map((size) => (*/}
                            {/*    <Button*/}
                            {/*        key={size.value}*/}
                            {/*        variant={selectedSize === size.value ? 'dark' : 'outline-secondary'}*/}
                            {/*        className="me-2 mb-2 rounded-pill px-3"*/}
                            {/*        onClick={() => handleSizeSelect(size.value)}*/}
                            {/*        disabled={!size.available}*/}
                            {/*    >*/}
                            {/*        {size.label}*/}
                            {/*    </Button>*/}
                            {/*))}*/}
                        </div>
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                        variant="dark"
                        size="lg"
                        className="w-100 py-2 mb-3"
                        style={{ height: '40px' }}
                        // disabled={!selectedSize}
                    >
                        Thêm vào giỏ hàng
                    </Button>

                    {/* Product Description */}
                    <div className="mt-4">
                        <h3 className="h5 mb-3">Mô tả sản phẩm</h3>
                        <p>
                            {chiTietSanPham.sanPham?.moTa}
                        </p>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};
export default ProductDetail;
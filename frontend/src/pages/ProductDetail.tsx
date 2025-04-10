import { Container, Row, Col, Button, Image} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useEffect, useState} from "react";
import {BienTheType, ChiTietSanPhamType, MauType, SizeType} from "../util/types/ProductTypes.tsx";
import {useLocation} from "react-router-dom";
import '../css/ProductDetail.css'
import { GiConsoleController } from 'react-icons/gi';
import { useNotification } from '../hook/useNotification2'; // Import hook

import useCart from '../hook/useCart.tsx';
import {CartItem} from '../hook/useCart.tsx';
import {PRODUCT_API_URL, PRODUCT_IMAGE_BASE_PATH} from "../util/Constant.tsx";

const ProductDetail: React.FC = () => {
      const { showNotification } = useNotification(); // Sử dụng hook
    const [chiTietSanPham, setChiTietSanPham] = useState<ChiTietSanPhamType>({
        sanPham: null,
        bienThe: []
    });
    const [selectedBienThe, setSelectedBienThe] = useState<BienTheType | null>(null);
    const [selectedSize, setSelectedSize] = useState<SizeType | null>(null);
    const [selectedColor, setSelectedColor] = useState<MauType | null>(null);
    const [uniqueColors, setUniqueColors] = useState<MauType[]>([]);
    const [availableSizes, setAvailableSizes] = useState<SizeType[]>([]);
    const [productImage, setProductImage] = useState<string>('');
    const {addToCart} = useCart();
  

    const location = useLocation();
    const id = location.pathname.split('/').pop() || '';

    const handleAddToCart = () => {
        console.log("sản phẩm :");
        console.log('Add to cart:', selectedBienThe, chiTietSanPham.sanPham);

        const cartItem: CartItem = {
            bienthesp: selectedBienThe, 
            product: chiTietSanPham.sanPham, 
            quantity: 1, 
        };
        showNotification("Thêm vào giỏ hàng thành công", "success");
        addToCart(cartItem);
    };

    useEffect(() => {

        window.scrollTo({ top: 0 });
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchData = async () => {
            try {
                const response = await fetch(`${PRODUCT_API_URL}/${id}`, { signal });
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                const data: ChiTietSanPhamType = await response.json();
                setChiTietSanPham(data);
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
    }, [id]);

    useEffect(() => {
        if (chiTietSanPham) {
            const colors = Array.from(
                new Map(chiTietSanPham.bienThe.map((bt) => [bt.mau!.id, bt.mau!])).values()
            );
            setProductImage(`${PRODUCT_IMAGE_BASE_PATH}${chiTietSanPham.sanPham?.hinhAnh}`);
            setUniqueColors(colors);
        }
    }, [chiTietSanPham]);

    useEffect(() => {
        if (selectedColor) {
            if (chiTietSanPham.bienThe[0].size !== null) {
                const sizes = Array.from(
                    new Map(
                        chiTietSanPham?.bienThe
                            .filter((bt) => bt.mau?.id === selectedColor.id && bt.soLuongTon > 0)
                            .map((bt) => [bt.size!.id, bt.size!])
                    ).values()
                );
                setAvailableSizes(sizes);
                setSelectedSize(null);
            } else {
                const bienthe = chiTietSanPham?.bienThe.find((bt) => bt.mau?.id === selectedColor.id);
                setSelectedBienThe(bienthe || null);
            }
        } else {
            setAvailableSizes([]);
        }
    }, [selectedColor]);

    useEffect(() => {
        if (selectedSize && selectedColor) {
            const bienThe = chiTietSanPham?.bienThe.find(
                (bt) => bt.size?.id === selectedSize.id && bt.mau?.id === selectedColor.id
            );
            setSelectedBienThe(bienThe || null);
        }
    }, [selectedSize]);

    useEffect(() => {
        if (selectedBienThe) {
            setProductImage(`${PRODUCT_IMAGE_BASE_PATH}${selectedBienThe.hinhAnh}`);
        }
    }, [selectedBienThe]);

    return (
        <>
            {chiTietSanPham.sanPham && (
                <Container fluid={"xxl"} className="my-5 product-detail-container">
                    <Row>
                        <Col xs={10} md={5} className="position-relative">
                            <Image src={productImage? productImage : ''} fluid className="main-product-image border border-1" />
                        </Col>

                        <Col xs={12} md={6}>
                            <div className="d-flex justify-content-between align-items-start mb-3">
                                <h1 className="h2">
                                    {selectedBienThe ? selectedBienThe.tenBienThe : chiTietSanPham?.sanPham?.tenSanPham}
                                </h1>
                            </div>

                            <h2 className="mb-4 text-danger">
                                {chiTietSanPham.sanPham.giaBan?.toLocaleString("de-DE") + " VND"}
                            </h2>

                            {uniqueColors.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="h5 mb-0">Chọn màu sắc</h3>
                                    <div className="d-flex flex-wrap" style={{ marginTop: "30px" }}>
                                        {uniqueColors
                                            .sort((a, b) => a.tenMau.localeCompare(b.tenMau))
                                            .map((mau) => (
                                                <Button
                                                    key={mau.id}
                                                    variant={selectedColor?.id === mau.id ? "dark" : "outline-secondary"}
                                                    className="me-2 mb-2"
                                                    onClick={() => setSelectedColor(mau)}
                                                >
                                                    {mau.tenMau}
                                                </Button>
                                            ))}
                                    </div>
                                </div>
                            )}

                            {availableSizes.length > 0 && (
                                <div className="mb-4">
                                    <h3 className="h5 mb-0">Chọn kích thước</h3>
                                    <div className="d-flex flex-wrap" style={{ marginTop: "30px" }}>
                                        {availableSizes
                                            .sort((a, b) => a.size.localeCompare(b.size))
                                            .map((size) => (
                                                <Button
                                                    key={size.id}
                                                    variant={selectedSize?.id === size.id ? "dark" : "outline-secondary"}
                                                    className="me-2 mb-2"
                                                    onClick={() => setSelectedSize(size)}
                                                >
                                                    {size.size}
                                                </Button>
                                            ))}
                                    </div>
                                </div>
                            )}

                            <Button
                                variant="dark"
                                size="lg"
                                className="w-100 py-1"
                                style={{ height: "35px" }}
                                disabled={!selectedBienThe}
                                onClick={handleAddToCart}
                            >
                                Thêm vào giỏ hàng
                            </Button>

                            <div className="mt-4">
                                <h3 className="h5 mb-3">Mô tả sản phẩm</h3>
                                <p>{chiTietSanPham.sanPham?.moTa}</p>
                            </div>
                        </Col>
                    </Row>
                </Container>
            )}
        </>
    );
};

export default ProductDetail;
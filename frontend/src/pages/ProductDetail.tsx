import React, { useState } from 'react';
import { Container, Row, Col, Button, Image} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

interface SizeOption {
    value: string;
    label: string;
    available: boolean;
}

const ProductDetail: React.FC = () => {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

    const productImages = [
        '/path/to/sneaker-main.jpg',
        '/path/to/sneaker-top.jpg',
        '/path/to/sneaker-side.jpg',
    ];

    const sizeOptions: SizeOption[] = [
        { value: '36.5', label: '36.5', available: true },
        { value: '41', label: '41', available: true },
        { value: '39', label: '39', available: true },
        { value: '38', label: '38', available: true },
        { value: '42.5', label: '42.5', available: true },
    ];

    const handleSizeSelect = (size: string) => {
        setSelectedSize(size);
    };

    return (
        <Container className="my-5">
            <Row>
                <Col xs={10} md={5} className="position-relative">
                    <Image src={productImages[currentImageIndex]} fluid alt="MLB Sneakers" className="main-product-image" />
                </Col>

                <Col xs={12} md={6}>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                        <h1 className="h2">MLB - Giày sneakers unisex cổ thấp Chunky Liner Denim Monogram</h1>
                        <div className="d-flex">
                        </div>
                    </div>

                    <h2 className="h3 mb-4">3,990,000 VND</h2>

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
                            {sizeOptions.map((size) => (
                                <Button
                                    key={size.value}
                                    variant={selectedSize === size.value ? 'dark' : 'outline-secondary'}
                                    className="me-2 mb-2 rounded-pill px-3"
                                    onClick={() => handleSizeSelect(size.value)}
                                    disabled={!size.available}
                                >
                                    {size.label}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Add to Cart Button */}
                    <Button
                        variant="dark"
                        size="lg"
                        className="w-100 py-3 mb-3"
                        disabled={!selectedSize}
                    >
                        Thêm vào giỏ hàng
                    </Button>

                    {/* Product Description */}
                    <div className="mt-4">
                        <h3 className="h5 mb-3">Mô tả sản phẩm</h3>
                        <p>
                            Giày sneakers unisex cổ thấp MLB Chunky Liner Denim Monogram với thiết kế hiện đại,
                            chất liệu cao cấp và logo thương hiệu nổi bật. Phù hợp cho cả nam và nữ.
                        </p>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default ProductDetail;
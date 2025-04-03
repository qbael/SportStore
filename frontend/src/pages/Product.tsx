<<<<<<< HEAD
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../css/Product.css';
import '../css/ui/Card.css';
import { Container, Card, Pagination } from "react-bootstrap";
import { SortFilter } from "../components/ui/SortFilter.tsx";

const PRODUCT_PER_PAGE = 12;

type Product = {
    id: number;
    tenSanPham: string;
    hinhAnh: string;
    giaBan?: number;
    giaNhap?: number;
    moTa: string;
    trangThai: boolean;
    danhMuc: {
        id: number;
        loai: string;
    };
    thuongHieu: {
        id: number;
        tenThuongHieu: string;
    };
    boMon: {
        id: number;
        tenBoMon: string;
    };
};

=======
import {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from 'react-router-dom';
import '../css/Product.css'
import '../css/ui/Card.css'
import {Container, Card, Pagination} from "react-bootstrap";
import {SortFilter} from "../components/ui/SortFilter.tsx";
import {ProductType} from "../util/types/ProductTypes.tsx";

const PRODUCT_PER_PAGE = 12;

>>>>>>> c3e9d6840ea3aaf8cb6f880abaabe3df3e8a6bde
const Product = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [isLastPage, setIsLastPage] = useState<boolean>(false);
    const [isFirstPage, setIsFirstPage] = useState<boolean>(false);
<<<<<<< HEAD
    const navigate = useNavigate();
    const [products, setProducts] = useState<Product[]>([]);
=======
    const navigator = useNavigate();
    const [products, setProducts] = useState<ProductType[]>([])
>>>>>>> c3e9d6840ea3aaf8cb6f880abaabe3df3e8a6bde
    const [searchParams, setSearchParams] = useSearchParams(`limit=${PRODUCT_PER_PAGE}`);
    const [error, setError] = useState<string | null>(null);
    let url = `http://localhost:8080/api/sanpham?${searchParams.toString()}`;

<<<<<<< HEAD
    useEffect(() => {
        window.scrollTo({ top: 70, behavior: "smooth" });
=======
    useEffect( () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
>>>>>>> c3e9d6840ea3aaf8cb6f880abaabe3df3e8a6bde
        const controller = new AbortController();
        const signal = controller.signal;
        const fetchData = async () => {
            try {
                const response = await fetch(url, { signal });
                if (!response.ok) {
                    throw new Error('Không thể tải sản phẩm');
                }
                const data = await response.json();
                // Trích xuất object Product từ mỗi mảng con
                const productList = data.content.map((item: any[]) => item[0]);
                if (!Array.isArray(productList)) {
                    throw new Error('Dữ liệu sản phẩm không hợp lệ');
                }
                setProducts(productList);
                setTotalPage(data.totalPages || 0);
                setCurrentPage(data.number || 0);
                setIsLastPage(data.last || false);
                setIsFirstPage(data.first || false);
                setError(null);
            } catch (error: any) {
                if (error.name !== 'AbortError') {
                    console.error('Fetch error:', error);
                    setError(error.message || 'Đã xảy ra lỗi khi tải sản phẩm');
                    setProducts([]);
                }
            }
        };
        fetchData();
        return () => {
            controller.abort();
        };
    }, [searchParams, url]);


    // neu trang khong load duoc thi hien thi thong bao
    // if (error) {
    //     return (
    //         <Container className="text-center mt-4">
    //             <h1>{error}</h1>
    //             <button
    //                 className="btn btn-primary mt-2"
    //                 onClick={() => window.location.reload()}
    //             >
    //                 Tải lại trang
    //             </button>
    //         </Container>
    //     );
    // }

    return (
        <Container className="align-items-center border-1 border-secondary shadow d-flex custom-container flex-wrap justify-content-start">
            {products.length === 0 ? (
                <h1 className="w-100 text-center mt-4 mb-4">Không tìm thấy sản phẩm</h1>
            ) : (
                <>
                    <SortFilter />
<<<<<<< HEAD
                    {products.map((product: Product) => (
                        <Card
                            key={product.id}
                            className="custom-card"
                            onClick={() => navigate(`/product/${product.id}`)}
                        >
=======
                    {products.map((product: ProductType) => (
                        <Card key={product.id} className="custom-card" onClick={() => {
                            localStorage.setItem("selectedProduct", JSON.stringify(product));
                            navigator(`/product/${product.id}`)
                        }}>
>>>>>>> c3e9d6840ea3aaf8cb6f880abaabe3df3e8a6bde
                            <Card.Img variant="top" src={`./product/${product.hinhAnh}`} />
                            <Card.Body>
                                <Card.Title>{product.tenSanPham}</Card.Title>
                                <Card.Text className="text-danger fs-6">
                                    {product.giaBan !== undefined && product.giaBan !== null
                                        ? `${product.giaBan.toLocaleString('de-DE')} VND`
                                        : 'Giá không khả dụng'}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    ))}
                    <Pagination className="w-100 d-flex justify-content-center mt-4 mb-5">
                        <Pagination.First
                            onClick={() => {
                                searchParams.set('page', '0');
                                setSearchParams(searchParams);
                                setCurrentPage(0);
                            }}
                            disabled={isFirstPage}
                        />
                        <Pagination.Prev
                            onClick={() => {
                                if (!isFirstPage) {
                                    searchParams.set('page', (currentPage - 1).toString());
                                    setSearchParams(searchParams);
                                    setCurrentPage(currentPage - 1);
                                }
                            }}
                            disabled={isFirstPage}
                        />
                        {Array.from({ length: totalPage }, (_, index) => (
                            <Pagination.Item
                                key={index}
                                active={index === currentPage}
                                onClick={() => {
                                    searchParams.set('page', index.toString());
                                    searchParams.set('limit', PRODUCT_PER_PAGE.toString());
                                    setSearchParams(searchParams);
                                    setCurrentPage(index);
                                }}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}
                        <Pagination.Next
                            onClick={() => {
                                if (!isLastPage) {
                                    searchParams.set('page', (currentPage + 1).toString());
                                    setSearchParams(searchParams);
                                    setCurrentPage(currentPage + 1);
                                }
                            }}
                            disabled={isLastPage}
                        />
                        <Pagination.Last
                            onClick={() => {
                                searchParams.set('page', (totalPage - 1).toString());
                                setSearchParams(searchParams);
                                setCurrentPage(totalPage - 1);
                            }}
                            disabled={isLastPage}
                        />
                    </Pagination>
                </>
            )}
        </Container>
    );
};

export default Product;
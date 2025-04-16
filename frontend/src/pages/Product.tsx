import {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from 'react-router-dom';
import '../css/Product.css'
import '../css/ui/Card.css'
import {Card} from "react-bootstrap";
import CustomPagination from "../components/ui/CustomPagination.tsx";
import {SortFilter} from "../components/ui/SortFilter.tsx";
import {ProductType} from "../util/types/ProductTypes.tsx";
import {PRODUCT_API_URL, PRODUCT_IMAGE_BASE_PATH, PRODUCT_PER_PAGE} from "../util/Constant.tsx";

const Product = () => {
    const [products, setProducts] = useState<ProductType[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [isLastPage, setIsLastPage] = useState<boolean>(false);
    const [isFirstPage, setIsFirstPage] = useState<boolean>(false);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [error, setError] = useState<string | null>(null);
    let url = `${PRODUCT_API_URL}?${searchParams.toString()}`;

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        const controller = new AbortController();
        const signal = controller.signal;
        searchParams.set('limit', PRODUCT_PER_PAGE.toString());
        searchParams.set('status', 'true');
        const fetchData = async () => {
            try {
                const response = await fetch(url, { signal });
                if (!response.ok) {
                    throw new Error('Không thể tải sản phẩm');
                }
                const data = await response.json();
                setProducts(data.content);
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
        <div className="align-items-center border-1 border-secondary shadow d-flex custom-container flex-wrap justify-content-start">
            {products.length === 0 ? (
                <h1 className="w-100 text-center mt-4 mb-4">Không tìm thấy sản phẩm</h1>
            ) : (
                <>
                    <SortFilter />
                    {products.map((product: ProductType) => (
                        <Card
                            key={product.id}
                            className="custom-card"
                            onClick={() => navigate(`${PRODUCT_IMAGE_BASE_PATH}${product.id}`)}
                        >
                            <Card.Img className={"w-100 h-50"}
                                      style={{ minWidth: '180px', minHeight: '220px', maxHeight: '220px', maxWidth: '220px' }}
                                      variant="top" src={`${PRODUCT_IMAGE_BASE_PATH}${product.hinhAnh}`} />
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
                    {totalPage > 1 && (
                        <CustomPagination
                            currentPage={currentPage}
                            totalPage={totalPage}
                            searchParams={searchParams}
                            setSearchParams={setSearchParams}
                            isFirstPage={isFirstPage}
                            isLastPage={isLastPage}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default Product;
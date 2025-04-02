import {useEffect, useState} from "react";
import {useNavigate, useSearchParams} from 'react-router-dom';
import '../css/Product.css'
import '../css/ui/Card.css'
import {Container, Card, Pagination} from "react-bootstrap";
import {SortFilter} from "../components/ui/SortFilter.tsx";
import {ProductType} from "../util/types/ProductTypes.tsx";

const PRODUCT_PER_PAGE = 12;

const Product = () => {
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [isLastPage, setIsLastPage] = useState<boolean>(false);
    const [isFirstPage, setIsFirstPage] = useState<boolean>(false);
    const navigator = useNavigate();
    const [products, setProducts] = useState<ProductType[]>([])
    const [searchParams, setSearchParams] = useSearchParams(`limit=${PRODUCT_PER_PAGE}`);
    let url = `http://localhost:8080/api/sanpham?${searchParams.toString()}`;

    useEffect( () => {
        window.scrollTo({ top: 70, behavior: "smooth" });
        const controller = new AbortController();
        const signal = controller.signal;
        const fetchData = async () => {
            try {
                const response = await fetch(url, { signal });
                if (!response.ok) {
                    new Error('Failed to fetch products');
                }
                const data = await response.json();
                setProducts(data.content);
                setTotalPage(data.totalPages);
                setCurrentPage(data.number);
                setIsLastPage(data.last);
                setIsFirstPage(data.first);
            } catch (error: string | any) {
                if (error.name === 'AbortError') {
                    console.log('Fetch aborted');
                } else {
                    console.error(error);
                }
            }
        };
        fetchData()
        return () => {
            controller.abort();
        };
    }, [searchParams]);

    return (
        <Container className="align-items-center border-1 border-secondary shadow
        d-flex custom-container flex-wrap justify-content-start">
            {products.length === 0 ? (
                <h1 className="w-100 text-center mt-4 mb-4">No products found</h1>
            ) : (
                <>
                    <SortFilter />
                    {products.map((product: ProductType) => (
                        <Card key={product.id} className="custom-card" onClick={() => {
                            localStorage.setItem("selectedProduct", JSON.stringify(product));
                            navigator(`/product/${product.id}`)
                        }}>
                            <Card.Img variant="top" src={`./product/${product.hinhAnh}`} />
                            <Card.Body>
                                <Card.Title>{product.tenSanPham}</Card.Title>
                                <Card.Text className="text-danger fs-6">
                                    {product.giaBan.toLocaleString('de-DE')+ ' VND'}
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    ))}
                    <Pagination className={'w-100 d-flex justify-content-center mt-4 mb-5'}>
                        <Pagination.First onClick={() => {
                            searchParams.set('page', '0');
                            setSearchParams(searchParams);
                            setCurrentPage(0);
                        }} />
                        <Pagination.Prev onClick={() => {
                            if (!isFirstPage) {
                                searchParams.set('page', (currentPage - 1).toString());
                                setSearchParams(searchParams);
                                setCurrentPage(currentPage - 1);
                            }
                        }} />
                       {Array.from({length: totalPage}, (_, index) => (
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
                        <Pagination.Next onClick={() => {
                            if (!isLastPage) {
                                searchParams.set('page', (currentPage + 1).toString());
                                setSearchParams(searchParams);
                                setCurrentPage(currentPage + 1);
                            }
                        }} />
                        <Pagination.Last onClick={() => {
                            searchParams.set('page', (totalPage - 1).toString());
                            setSearchParams(searchParams);
                            setCurrentPage(totalPage - 1);
                        }} />
                    </Pagination>
                </>
            )}
        </Container>
    )
}
export default Product;
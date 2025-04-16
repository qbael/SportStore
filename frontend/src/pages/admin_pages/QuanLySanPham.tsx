import {useEffect, useState} from "react";
import {ProductType} from "../../util/types/ProductTypes.tsx";
import '../../css/admin/QuanLySanPham.css'
import {Button, Container, Form, Row, Table} from "react-bootstrap";
import {useAdminContext} from "../../hook/useAdminContext.tsx";
import {ADMIN_PRODUCT_PER_PAGE, PRODUCT_API_URL, PRODUCT_IMAGE_BASE_PATH,} from "../../util/Constant.tsx";
import {useSearchParams} from "react-router-dom";
import CustomPagination from "../../components/ui/CustomPagination.tsx";
import {HanhDong} from "../../util/Enum.tsx";
import {formatPrice} from "../../util/Helper.ts";
import { useNotification } from '../../hook/useNotification2.tsx';


const QuanLySanPham = () => {
    const [dsSanPham, setDsSanPham] = useState<ProductType[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [isLastPage, setIsLastPage] = useState<boolean>(false);
    const [isFirstPage, setIsFirstPage] = useState<boolean>(false);
    const [searchParams, setSearchParams] = useSearchParams()
    const [minPrice, setMinPrice] = useState<string>("");
    const [maxPrice, setMaxPrice] = useState<string>("");
    const {showNotification} = useNotification();
    const [keyword, setKeyword] = useState<string>("");
    const [selectSearchType, setSelectSearchType] = useState<string>("tenSanPham");
    const {dsHanhDong} = useAdminContext();

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        searchParams.set('limit', ADMIN_PRODUCT_PER_PAGE.toString());
        const fecthData = async () => {
            try {
                const response = await fetch(`${PRODUCT_API_URL}?${searchParams.toString()}`, { signal });
                if (!response.ok) {
                    throw new Error('Không thể tải sản phẩm');
                }
                const data = await response.json();
                setDsSanPham(data.content);
                setTotalPage(data.totalPages || 0);
                setCurrentPage(data.number || 0);
                setIsLastPage(data.last || false);
                setIsFirstPage(data.first || false);
            } catch (error: any) {
                if (error.name !== 'AbortError') {
                    console.error('Fetch error:', error);
                    setDsSanPham([]);
                }
            }
        };
        fecthData()
        return () => {
            controller.abort();
        };
    }, [searchParams]);

    const hasPermission = (action: HanhDong) => {
        return dsHanhDong?.includes(action);
    }

    return (
        <Container fluid className={"w-100 h-100 rounded-3"}
                   style={{background: "linear-gradient(to right, rgb(246, 247, 244), rgb(237, 243, 230), rgb(234, 245, 234), rgb(227, 245, 227))"}}
        >
            <Row className={"h-15 align-content-center"}>
                <Form className="d-flex flex-wrap gap-2">
                    <Form.Group controlId="selectSearchType">
                        <Form.Select
                            onChange={(e) => setSelectSearchType(e.target.value)}
                            defaultValue={searchParams.get("searchBy") || "tenSanPham"}
                        >
                            <option value="tenSanPham">Tên sản phẩm</option>
                            <option value="thuongHieu">Thương hiệu</option>
                            <option value="boMon">Bộ môn</option>
                            <option value="danhMuc">Phân loại</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group controlId="searchKeyword">
                        <Form.Control
                            type="text"
                            placeholder="Nhập từ khóa..."
                            onChange={(e) => setKeyword(e.target.value)}
                            value={keyword}
                        />
                    </Form.Group>

                    <Form.Group controlId="minPrice" style={{width:'150px'}}>
                        <Form.Control
                            type="number"
                            placeholder="Giá từ"
                            value={minPrice ? minPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""}
                            onChange={(e) => {
                                const rawValue = e.target.value.replace(/\./g, '');
                                if (!isNaN(Number(rawValue))) {
                                    setMinPrice(rawValue);
                                }
                            }}
                        />
                    </Form.Group>

                    <Form.Group controlId="maxPrice" style={{width:'150px'}}>
                        <Form.Control
                            type="number"
                            placeholder="Đến"
                            value={maxPrice? maxPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""}
                            onChange={(e) => {
                                const rawValue = e.target.value.replace(/\./g, '');
                                if (!isNaN(Number(rawValue))) {
                                    setMaxPrice(rawValue);
                                }
                            }}
                        />
                    </Form.Group>

                    <Form.Group controlId="sortButtons" className="d-flex gap-2">
                        <Button className={"btn-primary"}
                            onClick={() => {
                                if (parseInt(maxPrice) < parseInt(minPrice)) {
                                    showNotification('Giá tối thiểu phải nhỏ hơn giá tối đa', "error")
                                    setMinPrice("");
                                    setMaxPrice("");
                                    return
                                }
                                searchParams.delete('page');
                                searchParams.delete('sort');
                                searchParams.delete('sortdir');
                                if (minPrice && maxPrice) {
                                    searchParams.set('minprice', minPrice);
                                    searchParams.set('maxprice', maxPrice);
                                } else {
                                    searchParams.delete('minprice');
                                    searchParams.delete('maxprice');
                                }
                                if (keyword) {
                                    searchParams.set("searchBy", selectSearchType);
                                    searchParams.set("search", keyword);
                                } else {
                                    searchParams.delete("searchBy");
                                    searchParams.delete("search");
                                }
                                setSearchParams(searchParams)
                                setMinPrice("");
                                setMaxPrice("");
                            }}
                        >
                            Áp dụng
                        </Button>
                    </Form.Group>

                    <Form.Group controlId="sortButtons" className="d-flex gap-2">
                        <Button
                            variant="outline-primary"
                            onClick={() => {
                                setSearchParams(prev => {
                                    prev.delete('page');
                                    prev.set("sort", "giaBan");
                                    prev.set("sortdir", "ASC");
                                    return prev;
                                });
                            }}
                        >
                            Giá tăng
                        </Button>
                        <Button
                            variant="outline-primary"
                            onClick={() => {
                                setSearchParams(prev => {
                                    prev.delete('page')
                                    prev.set("sort", "giaBan");
                                    prev.set("sortdir", "DESC");
                                    return prev;
                                });
                            }}
                        >
                            Giá giảm
                        </Button>
                    </Form.Group>
                    {hasPermission(HanhDong.THEM) && (
                        <Form.Group controlId="sortButtons" className="d-flex gap-2">
                            <Button
                                variant="success"
                                onClick={() => {
                                }}
                            >
                                + Thêm sản phẩm
                            </Button>
                        </Form.Group>
                    )}
                </Form>

            </Row>
            <Row className={"h-85"}>
                <Table striped bordered hover className={"text-center"}
                       style={{verticalAlign: 'middle'}}
                >
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Hình ảnh</th>
                            <th>Tên sản phẩm</th>
                            <th>Giá nhập</th>
                            <th>Giá bán</th>
                            <th>Thương hiệu</th>
                            <th>Phân loại</th>
                            <th>Bộ môn</th>
                            <th>Trạng thái</th>
                            {hasPermission(HanhDong.SUA) && (
                                <th></th>
                            )}
                            {hasPermission(HanhDong.XOA) && (
                                <th></th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {dsSanPham.map((item, index) => (
                            <tr key={index}>
                                <td>{item.id}</td>
                                <td>
                                    <img src={`${PRODUCT_IMAGE_BASE_PATH}${item.hinhAnh}`}
                                         alt={item.tenSanPham} className={"img-fluid"}
                                         style={{width: '45px', height: '45px'}}
                                    />
                                </td>
                                <td>{item.tenSanPham}</td>
                                <td>{formatPrice(item.giaNhap!)}</td>
                                <td>{formatPrice(item.giaBan!)}</td>
                                <td>{item.thuongHieu.tenThuongHieu}</td>
                                <td>{item.danhMuc.loai}</td>
                                <td>{item.boMon.tenBoMon}</td>
                                <td>{item.trangThai ? "Đang kinh doanh" : "Dừng kinh doanh"}</td>
                                {hasPermission(HanhDong.SUA) && (
                                    <td>
                                        <button className={"btn btn-warning"}
                                        >
                                            Sửa
                                        </button>
                                    </td>
                                )}
                                {hasPermission(HanhDong.XOA) && (
                                    <td>
                                        <button className={"btn btn-danger"}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </Table>
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
            </Row>
        </Container>
    );
}
export default QuanLySanPham;

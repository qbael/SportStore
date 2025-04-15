import {useState, useEffect} from "react";
import {ProductType} from "../../util/types/ProductTypes.tsx";
import '../../css/admin/QuanLySanPham.css'
import {Container, Row, Table} from "react-bootstrap";
import {useAdminContext} from "../../hook/useAdminContext.tsx";
import {PRODUCT_API_URL, PRODUCT_IMAGE_BASE_PATH} from "../../util/Constant.tsx";

const QuanLySanPham = () => {
    const {dsHanhDong} = useAdminContext();
    const [dsSanPham, setDsSanPham] = useState<ProductType[]>([]);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        const fecthData = async () => {
            try {
                const response = await fetch(`${PRODUCT_API_URL}?limit=7`, {signal: signal});
                if (!response.ok) {
                    throw new Error('Không thể tải sản phẩm');
                }
                const data = await response.json();
                setDsSanPham(data.content);
            } catch (error: any) {
                if (error.name === 'AbortError') {
                    console.log('Fetch aborted');
                } else {
                    console.error('Lỗi không xác định:', error);
                }
            }

        };
        fecthData()
        return () => {
            controller.abort();
        };
    }, []);

    return (
        <Container className={"w-100 h-100"}>
            <Row className={"h-25 bg-danger"}>

            </Row>
            <Row className={"h-75 bg-success"}>
                <Table striped bordered hover className={"h-100 text-center"}
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
                        </tr>
                    </thead>
                    <tbody>
                        {dsSanPham.map((item) => (
                            <tr>
                                <td>{item.id}</td>
                                <td>
                                    <img src={`${PRODUCT_IMAGE_BASE_PATH}${item.hinhAnh}`}
                                         alt={item.tenSanPham} className={"img-fluid"}
                                         style={{width: '50px', height: '50px'}}
                                    />
                                </td>
                                <td>{item.tenSanPham}</td>
                                <td>{item.giaNhap}</td>
                                <td>{item.giaBan}</td>
                                <td>{item.thuongHieu.tenThuongHieu}</td>
                                <td>{item.danhMuc.loai}</td>
                                <td>{item.boMon.tenBoMon}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Row>
        </Container>
    );
}
export default QuanLySanPham;

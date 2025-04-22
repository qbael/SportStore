import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {useAdminAuth} from "../../hook/useAdminAuth.tsx";
import ChartThongKe from "../../components/chart/ChartThongKe.tsx";
import {useEffect, useState} from "react";
import {BASE_URL} from "../../util/Constant.tsx";

enum LOAI_THONG_KE {
    DOANH_THU,
    SANPHAM,
    KHACHHANG,
    NHAPHANG
}

const QuanLyThongKe = () => {
    const {taiKhoanNV} = useAdminAuth();
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [dataChart, setDataChart] = useState<any>(null);
    const [loaiThongKe, setLoaiThongKe] = useState<LOAI_THONG_KE>(LOAI_THONG_KE.DOANH_THU);
    const [sanPhamThongKe, setSanPhamThongKe] = useState<any[]>([]);
    const [khachHangThongKe, setKhachHangThongKe] = useState<any[]>([]);
    const [nhapHangThongKe, setNhapHangThongKe] = useState<any[]>([]);
    const [sortBy, setSortBy] = useState("");
    const [sortOrder, setSortOrder] = useState("");

    const fetchData = async () => {
        let url = `${BASE_URL}/thongke/doanhthu`;

        url += `?from=${fromDate}&to=${toDate}`

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Fetch failed");
            }

            const data = await response.json();

            const labels = data.data.map((item: any) => item.ngay);
            const doanhThu = data.data.map((item: any) => item.doanhThu);
            const loiNhuan = data.data.map((item: any) => item.loiNhuan);

            setDataChart({
                tongDoanhThu: data.tongDoanhThu,
                tongLoiNhuan: data.tongLoiNhuan,
                data: {
                    labels,
                    datasets: [
                        {
                            label: "Doanh thu",
                            data: doanhThu,
                            borderColor: "green",
                            backgroundColor: "rgba(0,255,0,0.2)",
                            tension: 0.4
                        },
                        {
                            label: "Lợi nhuận",
                            data: loiNhuan,
                            borderColor: "orange",
                            backgroundColor: "rgba(255,165,0,0.2)",
                            tension: 0.4
                        }
                    ]
                }
            });
        } catch (error) {
            console.error("Lỗi khi fetch dữ liệu:", error);
            throw new Error("Không thể lấy dữ liệu thống kê.");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleSanPhamThongKe = async () => {
        let url = `${BASE_URL}/thongke/sanpham`;
        url += `?from=${fromDate}&to=${toDate}&sortBy=${sortBy}&sortDir=${sortOrder}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Lỗi khi fetch thống kê sản phẩm");
            }
            const data = await response.json();
            console.log(data);
            setSanPhamThongKe(data);
        } catch (error) {
            console.error(error);
            throw new Error("Không thể lấy dữ liệu thống kê sản phẩm.");
        }
    }

    const handleKhachHangThongKe = async () => {
        let url = `${BASE_URL}/thongke/khachhang`;
        url += `?from=${fromDate}&to=${toDate}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Lỗi khi fetch thống kê khách hàng");
            }
            const data = await response.json();
            setKhachHangThongKe(data);
        } catch (error) {
            console.error(error);
            throw new Error("Không thể lấy dữ liệu thống kê khách hàng.");
        }
    };

    const handleNhapHangThongKe = async () => {
        let url = `${BASE_URL}/thongke/nhaphang`;
        url += `?from=${fromDate}&to=${toDate}&sortBy=${sortBy}&sortDir=${sortOrder}`;

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Lỗi khi fetch thống kê khách hàng");
            }
            const data = await response.json();
            setNhapHangThongKe(data);
        } catch (error) {
            console.error(error);
            throw new Error("Không thể lấy dữ liệu thống kê khách hàng.");
        }
    }

    useEffect(() => {
        switch (loaiThongKe) {
            case LOAI_THONG_KE.SANPHAM:
                handleSanPhamThongKe();
                break;
            case LOAI_THONG_KE.KHACHHANG:
                handleKhachHangThongKe();
                break;
            case LOAI_THONG_KE.NHAPHANG:
                handleNhapHangThongKe();
                break;
            default:
                break;
        }
    }, [loaiThongKe, fromDate, toDate, sortBy, sortOrder]);

    const renderContent = () => {
        switch (loaiThongKe) {
            case LOAI_THONG_KE.DOANH_THU:
                return (
                    <Col>
                        <ChartThongKe
                            dataChart={dataChart}
                        />
                    </Col>
                )
            case LOAI_THONG_KE.SANPHAM:
                return (
                    <Col>
                        <h5 className="mt-3">Thống kê sản phẩm bán chạy</h5>
                        <div style={{ maxHeight: '630px', overflowY: "auto" }}>
                            <table className="table table-bordered table-hover mt-3">
                                <thead className="table-success text-center position-sticky z-1">
                                <tr>
                                    <th>Mã SP</th>
                                    <th>Mã BT</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Hình ảnh</th>
                                    <th>Giá nhập</th>
                                    <th>Giá bán</th>
                                    <th>Số lượng bán</th>
                                    <th>Tổng tiền nhập</th>
                                    <th>Tổng tiền bán</th>
                                    <th>% Lợi nhuận</th>
                                </tr>
                                </thead>
                                <tbody className="text-center align-middle">
                                {sanPhamThongKe.map((sp, index) => (
                                    <tr key={index}>
                                        <td>{sp.sanPhamId}</td>
                                        <td>{sp.bienTheId}</td>
                                        <td>{sp.tenBienThe}</td>
                                        <td>
                                            <img src={`/product/${sp.hinhAnh}`} alt={sp.tenSanPham}
                                                 style={{ width: "80px", height: "80px", objectFit: "cover" }}/>
                                        </td>
                                        <td>{sp.giaNhap.toLocaleString()}₫</td>
                                        <td>{sp.giaBan.toLocaleString()}₫</td>
                                        <td>{sp.tongSoLuongBan}</td>
                                        <td>{sp.tongSoTienNhap.toLocaleString()}₫</td>
                                        <td>{sp.tongSoTienBan.toLocaleString()}₫</td>
                                        <td>{sp.phanTramLoiNhuan.toFixed(2)}%</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </Col>
                )
            case LOAI_THONG_KE.KHACHHANG:
                return (
                    <Col>
                        <h5 className="mt-3">Thống kê khách hàng theo tổng tiền mua</h5>
                        <div style={{ maxHeight: "630px", overflowY: "auto" }}>
                            <table className="table table-bordered table-hover mt-3">
                                <thead className="table-danger text-center position-sticky z-1">
                                <tr>
                                    <th>STT</th>
                                    <th>Họ tên</th>
                                    <th>SĐT</th>
                                    <th>Email</th>
                                    <th>Số đơn hàng</th>
                                    <th>Tổng tiền mua</th>
                                </tr>
                                </thead>
                                <tbody className="text-center align-middle">
                                {khachHangThongKe.map((kh, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{kh.hoTen}</td>
                                        <td>{kh.sdt}</td>
                                        <td>{kh.email}</td>
                                        <td>{kh.soDonHang}</td>
                                        <td>{kh.tongTienMua.toLocaleString()}₫</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </Col>
                )
            case LOAI_THONG_KE.NHAPHANG:
                return (
                    <Col>
                        <h5 className="mt-3">Thống kê nhập hàng</h5>
                        <div style={{ maxHeight: '630px', overflowY: "auto" }}>
                            <table className="table table-bordered table-hover mt-3">
                                <thead className="table-primary text-center position-sticky z-1">
                                <tr>
                                    <th>Mã SP</th>
                                    <th>Mã Biến Thể</th>
                                    <th>Tên Biến Thể</th>
                                    <th>Hình ảnh</th>
                                    <th>Giá nhập</th>
                                    <th>Tổng số lượng nhập</th>
                                    <th>Tổng tiền nhập</th>
                                </tr>
                                </thead>
                                <tbody className="text-center align-middle">
                                {nhapHangThongKe.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.sanPhamId}</td>
                                        <td>{item.bienTheId}</td>
                                        <td>{item.tenBienThe}</td>
                                        <td>
                                            <img
                                                src={`/product/${item.hinhAnh}`}
                                                alt={item.tenBienThe}
                                                style={{ width: "80px", height: "80px", objectFit: "cover" }}
                                            />
                                        </td>
                                        <td>{item.giaNhap.toLocaleString()}₫</td>
                                        <td>{item.tongSoLuongNhap}</td>
                                        <td>{item.tongSoTienNhap.toLocaleString()}₫</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </Col>
                )
            default:
                return (
                    <Col>
                        <ChartThongKe
                            dataChart={dataChart}
                        />
                    </Col>
                )
        }
    }

    return (
        <Container fluid className={"w-100 h-100 rounded-3"}
                   style={{background: "linear-gradient(to right, rgb(246, 247, 244), rgb(237, 243, 230), rgb(234, 245, 234), rgb(227, 245, 227))"}}
        >
            <Row className={"h-15"}>
                <Row>
                    <Col>
                        {taiKhoanNV?.chucVu.tenChucVu === 'NHAN_VIEN_BAN_HANG' && (
                            <>
                                <Button className={"mx-2"} variant={'primary'} onClick={() => setLoaiThongKe(LOAI_THONG_KE.DOANH_THU)}>Thông kê doanh thu</Button>
                                <Button className={"mx-2"} variant={'success'} onClick={() => setLoaiThongKe(LOAI_THONG_KE.SANPHAM)}>Thông kê sản phẩm</Button>
                                <Button className={"mx-2"} variant={'danger'} onClick={() => setLoaiThongKe(LOAI_THONG_KE.KHACHHANG)}>Thống kê khách hàng</Button>
                            </>
                        )}
                        {taiKhoanNV?.chucVu.tenChucVu === 'NHAN_VIEN_KHO' && (
                            <>
                                <Button className={"mx-2"} variant={'warning'} onClick={() => setLoaiThongKe(LOAI_THONG_KE.NHAPHANG)}>Thống kê nhập hàng</Button>
                            </>
                        )}

                        {taiKhoanNV?.chucVu.tenChucVu === 'QUAN_LY_DOANH_NGHIEP' && (
                            <>
                                <Button className={"mx-2"} variant={'primary'} onClick={() => setLoaiThongKe(LOAI_THONG_KE.DOANH_THU)}>Thông kê doanh thu</Button>
                                <Button className={"mx-2"} variant={'success'} onClick={() => setLoaiThongKe(LOAI_THONG_KE.SANPHAM)}>Thông kê sản phẩm</Button>
                                <Button className={"mx-2"} variant={'danger'} onClick={() => setLoaiThongKe(LOAI_THONG_KE.KHACHHANG)}>Thống kê khách hàng</Button>
                                <Button className={"mx-2"} variant={'warning'} onClick={() => setLoaiThongKe(LOAI_THONG_KE.NHAPHANG)}>Thống kê nhập hàng</Button>
                            </>
                        )}
                    </Col>
                </Row>
                <Row>
                    <Col md={3}>
                        <Form.Label>Từ ngày</Form.Label>
                        <Form.Control type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                    </Col>
                    <Col md={3}>
                        <Form.Label>Đến ngày</Form.Label>
                        <Form.Control type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                    </Col>
                    <Col md={5} className={"d-flex"}>
                        {loaiThongKe === LOAI_THONG_KE.DOANH_THU && (
                            <Button className={"mt-4"} variant={'primary'} onClick={() => fetchData()}>Thống kê</Button>
                        )}
                        {loaiThongKe === LOAI_THONG_KE.SANPHAM && (
                            <>
                                <Col md={6} className={"mx-2"}>
                                    <Form.Label>Sắp xếp theo</Form.Label>
                                    <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                        <option value={""}>-Chọn-</option>
                                        <option value={"tongSoLuongBan"}>Số lượng bán</option>
                                        <option value={"tongSoTienNhap"}>Tổng tiền nhập</option>
                                        <option value={"tongSoTienBan"}>Tổng tiền bán</option>
                                        <option value={"phanTramLoiNhuan"}>Phần trăm lợi nhuận</option>
                                    </Form.Select>
                                </Col>
                                <Col md={6}>
                                    <Form.Label>Thứ tự</Form.Label>
                                    <Form.Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                                        <option value={""}>-Chọn-</option>
                                        <option value={"ASC"}>Tăng dần</option>
                                        <option value={"DESC"}>Giảm dần</option>
                                    </Form.Select>
                                </Col>
                            </>
                        )}
                        {loaiThongKe === LOAI_THONG_KE.NHAPHANG && (
                            <>
                                <Col md={6} className={"mx-2"}>
                                    <Form.Label>Sắp xếp theo</Form.Label>
                                    <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                                        <option value={""}>-Chọn-</option>
                                        <option value={"giaNhap"}>Giá nhập</option>
                                        <option value={"tongSoLuongNhap"}>Tổng tiền nhập</option>
                                        <option value={"tongSoTienNhap"}>Tổng số lượng nhập</option>
                                    </Form.Select>
                                </Col>
                                <Col md={6}>
                                    <Form.Label>Thứ tự</Form.Label>
                                    <Form.Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                                        <option value={""}>-Chọn-</option>
                                        <option value={"ASC"}>Tăng dần</option>
                                        <option value={"DESC"}>Giảm dần</option>
                                    </Form.Select>
                                </Col>
                            </>
                        )}
                    </Col>
                </Row>
            </Row>
            <Row>
                {renderContent()}
            </Row>
        </Container>
    )
}
export default QuanLyThongKe;
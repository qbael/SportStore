import { Table } from 'react-bootstrap';
import '../../css/admin/hoadon.css'
import { Badge } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Chitiethoadon from '../../components/ui/Chitethoadon';

import { HoaDon, ApiResponse } from '../../util/types/HoadonTypes'; // Đường dẫn đến file chứa định nghĩa kiểu HoaDon
// import { ApiResponse } from '../../types/HoaDon';

// gọi api 

export default function QuanlyHoaDon() {

    const getStatusColor = (status: string): string => {
        switch (status.toUpperCase()) {
            case "DAGIAO":
                return "success";     // xanh lá
            case "DANGGIAO":
                return "warning";     // vàng
            case "DANGXULY":
                return "info";        // xanh dương
            case "DAHUY":
                return "danger";      // đỏ
            default:
                return "secondary";   // xám
        }
    };

    const [hoaDons, setHoaDons] = useState<HoaDon[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    // const [selectedHoaDon, setSelectedHoaDon] = useState<HoaDon | null>(null);
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedHoaDon, setSelectedHoaDon] = useState<HoaDon | undefined>(undefined);

    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(10);


    const handleEdit = (id: number) => {
        console.log("Sửa hóa đơn với ID:", id);
    };

    const handleDelete = async (id: number) => {
        console.log("Xóa hóa đơn với ID:", id);
    };

    const handleViewDetail = (hoaDon: HoaDon) => {
        setSelectedHoaDon(hoaDon);
        setShowModal(true);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`http://localhost:8080/api/hoadon/page?page=${currentPage}&size=${pageSize}`); // 🔁 Thay bằng API thật của bạn
                const json: ApiResponse = await res.json();
                setHoaDons(json.data);
                if (totalPages !== json.totalPages) {
                    setTotalPages(json.totalPages);
                }
                console.log(json.data);
                console.log(hoaDons);
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [currentPage, pageSize]); // Chỉ gọi API khi currentPage hoặc pageSize thay đổi

    useEffect(() => {
        if (hoaDons.length > 0) {
            console.log("Dữ liệu hóa đơn đã được cập nhật:", hoaDons);
        }
    }, [hoaDons]);

    if (loading) {
        return <div>Loading...</div>; // Hoặc bạn có thể hiển thị một spinner hoặc thông báo khác
    }

    const header_arr = ["ID hóa đơn", "ngày", "khách hàng", "Tổng hóa đơn", "Trạng thái"]
    const header_table = ["ID hóa đơn", "ngày", "khách hàng", "Tổng hóa đơn", "Trạng thái", "Hành động"]


    return (
        <div style={{ height: "100%" }}>
            <h2>Quản lý hóa đơn</h2>
            <div className="header">
                <div className="header__search">
                    <div>
                        <select name="" id="">
                            {header_arr.map((item, index) => {
                                return (
                                    <option key={index} value="">{item}</option>
                                )
                            }
                            )}
                        </select>
                        <input type="text" placeholder="Tìm kiếm" />
                        <button className="btn btn--primary">Tìm kiếm</button>
                    </div>
                    <div className="boloc">
                        {/* lọc từ ngày đến ngày */}
                        <input type="date" />
                        <input type="date" />
                        <button className="btn btn--primary">Áp dụng</button>
                    </div>
                </div>
            </div>
            <div className="content">
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            {header_table.map((item, index) => (
                                <th key={index}>{item}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {hoaDons.map((item) => {
                            return (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.ngay}</td>
                                    <td>{item.ttKhachHang.hoTen}</td>
                                    <td>{item.tongGiaBan}đ</td>
                                    <td>
                                        <Badge bg={getStatusColor(item.trangThai)}>
                                            {item.trangThai}
                                        </Badge>
                                    </td>
                                    <td>
                                        <td>
                                            <button
                                                className="btn btn-info"
                                                style={{ marginRight: '5px' }}
                                                onClick={() => handleViewDetail(item)}
                                            >
                                                Xem chi tiết
                                            </button>
                                            <button
                                                className="btn btn-warning"
                                                style={{ marginRight: '5px' }}
                                                onClick={() => handleEdit(item.id)}
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleDelete(item.id)}
                                            >
                                                Xoá
                                            </button>
                                        </td>

                                    </td>
                                    {/* thêm các hành động như sửa, xóa ở đây */}
                                </tr>
                            )
                        })}
                        {/* <tr>
                            <td>1</td>
                            <td>2023-10-01</td>
                            <td>Nguyễn Văn A</td>
                            <td>500.000đ</td>
                            <td>Đã thanh toán</td>
                        </tr> */}
                        {/* thêm nhiều dòng hóa đơn ở đây */}
                    </tbody>
                </Table>
                {/* thêm phân trang */}
                <div className="pagination d-flex justify-content-center mt-4">

                    <button
                        className="btn btn-outline-primary me-2"
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                        disabled={currentPage === 0}
                    >
                        Trang trước
                    </button>

                    {Array.from({ length: totalPages }, (_, i) => i)
                        .filter((i) => {
                            const start = Math.max(0, currentPage - 3);
                            const end = Math.min(totalPages, start + 7);
                            return i >= start && i < end;
                        })
                        .map((i) => (
                            <button
                                key={i}
                                onClick={() => setCurrentPage(i)}
                                className={`btn ${i === currentPage ? 'btn-primary' : 'btn-outline-secondary'} mx-1`}
                            >
                                {i + 1}
                            </button>
                        ))
                    }

                    <button
                        className="btn btn-outline-primary ms-2"
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                        disabled={currentPage >= totalPages - 1}
                    >
                        Trang sau
                    </button>
                </div>
            </div>
            <Chitiethoadon
                show={showModal}
                onClose={() => setShowModal(false)}
                hoaDon={selectedHoaDon}
            />
        </div>

    );
}
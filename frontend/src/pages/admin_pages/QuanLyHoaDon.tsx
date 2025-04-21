import { Table } from 'react-bootstrap';
import '../../css/admin/hoadon.css'
import { Badge } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Chitiethoadon from '../../components/ui/Chitethoadon';
import { useNotification } from '../../hook/useNotification2.tsx'

import { HoaDon, ApiResponse } from '../../util/types/HoadonTypes'; // Đường dẫn đến file chứa định nghĩa kiểu HoaDon
import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
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

    const {showNotification} = useNotification()
    

    const [hoaDons, setHoaDons] = useState<HoaDon[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [selectedHoaDon, setSelectedHoaDon] = useState<HoaDon | undefined>(undefined);
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [searchText, setSearchText] = useState("");
    const [selectedColumn, setSelectedColumn] = useState("");
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [showUpdateModal, setShowUpdateModal] = useState(false);


    const fetchHoaDon = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: currentPage.toString(),
                size: pageSize.toString(),
            });

            if (selectedColumn && searchText) {
                switch (selectedColumn) {
                    case "ID hóa đơn":
                        params.append("id", searchText);
                        break;
                    case "khách hàng":
                        params.append("tenKhachHang", searchText);
                        break;
                    case "Trạng thái":
                        params.append("trangThai", searchText);
                        break;
                    case "Số điện thoại":
                        params.append("soDienThoai", searchText);
                        break;
                }
            }

            if (fromDate) params.append("ngayTu", fromDate);
            if (toDate) params.append("ngayDen", toDate);

            const url = `http://localhost:8080/api/hoadon/search?${params.toString()}`;
            console.log(url);
            const res = await fetch(url);
            const json: ApiResponse = await res.json();
            setHoaDons(json.data || []);
            setTotalPages(json.totalPages || 0);
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHoaDon();
    }, [currentPage, pageSize]);

    const capnhattrangthai = async (id :number, newStatus: String) => {
        let status: string = "";
        switch (newStatus) {
            case "DAGIAO":
                status = "Đã giao";     // xanh lá
                break;  
            case "DANGGIAO":
                status = "Đang giao";     // xanh lá
                break; 
            case "DANGXULY":
                status = "Đang xử lý";     // xanh lá
                break;         // xanh dương
            case "DAHUY":
                status = "Đã hủy";     // xanh lá
                break;      // đỏ
             // xám
        }

        try {
            const response = await fetch(`http://localhost:8080/api/hoadon/update/${id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(status),
            });
            if (response){
                showNotification("cập nhập trạng thái thành công", "info");
                fetchHoaDon();
            }
            if (!response.ok) {
              throw new Error("Lỗi từ server");
            }
        
            // return convertStatusToText(newStatus);
          } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
            throw new Error("Không thể cập nhật trạng thái");
          }
        
    }

    const handleSearch = () => {
        setCurrentPage(0);
        fetchHoaDon();
    };

    const handleFilterDate = () => {
        setCurrentPage(0);
        fetchHoaDon();
    };


    const handleDelete = (id: number) => {
        console.log("Xóa hóa đơn với ID:", id);
    };

    const handleViewDetail = (hoaDon: HoaDon) => {
        setSelectedHoaDon(hoaDon);
        setShowModal(true);
    };

    const handleEdit = (id: number) => {
        const hoaDon = hoaDons.find(h => h.id === id);
        if (hoaDon) {
            setSelectedHoaDon(hoaDon);
            setShowUpdateModal(true);
        }
    };

    const isDisabledOption = (currentStatus: string, optionValue: string): boolean => {
        const transitions: Record<string, string[]> = {
            DANGXULY: ["DANGGIAO", "DAHUY"],
            DANGGIAO: ["DAGIAO"],
            DAGIAO: [],
            DAHUY: [],
        };

        // Nếu optionValue không nằm trong danh sách cho phép thì disable
        return !transitions[currentStatus]?.includes(optionValue) && currentStatus !== optionValue;
    };


    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const res = await fetch(`http://localhost:8080/api/hoadon/page?page=${currentPage}&size=${pageSize}`); // 🔁 Thay bằng API thật của bạn
    //             const json: ApiResponse = await res.json();
    //             setHoaDons(json.data);
    //             if (totalPages !== json.totalPages) {
    //                 setTotalPages(json.totalPages);
    //             }
    //             console.log(json.data);
    //             console.log(hoaDons);
    //         } catch (error) {
    //             console.error("Lỗi khi gọi API:", error);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchData();

   

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
                        <select name="" id="column_select" value={selectedColumn} onChange={(e) => setSelectedColumn(e.target.value)}>
                            <option value="">reset</option>
                            {header_arr.map((item, index) => {
                                return (
                                    <option key={index} value={item}>{item}</option>
                                )
                            }
                            )}
                        </select>
                        <input type="text" placeholder="Tìm kiếm" value={searchText} onChange={(e) => setSearchText(e.target.value)} />
                        <button className="btn btn--primary" onClick={handleSearch}>Tìm kiếm</button>
                    </div>
                    <div className="boloc">
                        <input
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                        />
                        <input
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                        />
                        <button className="btn btn--primary" onClick={handleFilterDate}>
                            Áp dụng
                        </button>
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
                                            {/* <button
                                                className="btn btn-warning"
                                                style={{ marginRight: '5px' }}
                                                onClick={() => handleEdit(item.id)}
                                            >
                                                Sửa
                                            </button> */}
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleEdit(item.id)}
                                            >
                                                Cập nhật trạng thái
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
            {/* cập nhập trạng thái modal */}
            <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Cập nhật trạng thái</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedHoaDon && (
                        <div>
                            <p>ID hóa đơn: {selectedHoaDon.id}</p>
                            <p>Khách hàng: {selectedHoaDon.ttKhachHang.hoTen}</p>
                            <p>Trạng thái hiện tại: {selectedHoaDon.trangThai}</p>
                            <label htmlFor="trangThai">Cập nhật trạng thái:</label>
                            <select
                                id="trangThai"
                                onChange={(e) => {
                                    // thay value thành
                                }}
                                className="form-select mt-2"
                            >
                                <option
                                    value="DANGXULY"
                                    disabled={isDisabledOption(selectedHoaDon.trangThai, "DANGXULY")}
                                >
                                    Đang xử lý
                                </option>
                                <option
                                    value="DANGGIAO"
                                    disabled={isDisabledOption(selectedHoaDon.trangThai, "DANGGIAO")}
                                >
                                    Đang giao
                                </option>
                                <option
                                    value="DAHUY"
                                    disabled={isDisabledOption(selectedHoaDon.trangThai, "DAHUY")}
                                >
                                    Đã hủy
                                </option>
                                <option
                                    value="DAGIAO"
                                    disabled={isDisabledOption(selectedHoaDon.trangThai, "DAGIAO")}
                                >
                                    Đã giao
                                </option>
                            </select>
                        </div>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowUpdateModal(false)}>
                        Hủy
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            // 👉 TODO: Gọi API cập nhật trạng thái tại đây
                            // 
                            // console.log("Cập nhật trạng thái:", selectedHoaDon);
                            // lấy value thay đổi

                            const newStatus = (document.getElementById("trangThai") as HTMLSelectElement)?.value || "";
                            if (newStatus ==="" || newStatus === selectedHoaDon?.trangThai){
                                // xuát thống báo 

                                return;
                            }

                            if (selectedHoaDon?.id !== undefined) {
                                    capnhattrangthai(selectedHoaDon.id, newStatus);
                              } else {
                                console.error("ID hóa đơn không hợp lệ");
                              }
                            setShowUpdateModal(false);
                        }}
                    >
                        Xác nhận
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>

    );
}
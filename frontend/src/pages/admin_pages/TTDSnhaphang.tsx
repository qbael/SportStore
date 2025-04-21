import React, { useState, useEffect } from 'react';
import { NhapHang, NhapHangResponse } from '../../util/types/NhapHangType';
import { fetchNhapHang } from '../../hook/nhapHangApi';
import { Badge, Button, Modal } from 'react-bootstrap';
import Chitienhaphang from '../../components/ui/Chitienhaphang';
import { useNotification } from '../../hook/useNotification2.tsx'


type Props = {
    startDate?: string;
    endDate?: string;
    filterField?: string;
    filterValue?: string;
};



export default function TTDSNhapHang({ startDate, endDate, filterField, filterValue }: Props) {
    const { showNotification } = useNotification();
    const [data, setData] = useState<NhapHang[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [sortField, setSortField] = useState('id');
    const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC');
    const [showModal, setShowModal] = useState(false);
    const [selectedNhapHang, setSelectedNhapHang] = useState<NhapHang | null>(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedHoaDon, setSelectedHoaDon] = useState<NhapHang | null>(null);

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

    const loadData = async () => {
        try {
            setLoading(true);
            const res: NhapHangResponse = await fetchNhapHang({
                startDate,
                endDate,
                filterField,
                filterValue,
                sortField,
                sortDirection,
                page,
                size: pageSize,
            });
            setData(res.content);
            setTotalPages(res.totalPages);
            setPage(res.pageable.pageNumber);
        } catch (err) {
            console.error('Lỗi tải dữ liệu nhập hàng:', err);
        } finally {
            setLoading(false);
        }
    };

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
            const response = await fetch(`http://localhost:8080/api/nhaphang/update/${id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(status),
            });
            if (response){
                showNotification("cập nhập trạng thái thành công", "info");
                loadData();
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

    const handupdatestatus = (item: NhapHang) => {
        setSelectedHoaDon(item);
        setShowUpdateModal(true);
    }

    useEffect(() => {
        loadData();
    }, [page, pageSize, sortField, sortDirection, startDate, endDate, filterField, filterValue]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    const handxemchitiet = (item: NhapHang) => {
        setSelectedNhapHang(item);
        setShowModal(true);
    }

    return (
        <div className="table-responsive">
            {loading && <p>Đang tải...</p>}
            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>Mã đơn</th>
                        <th>Nhà cung cấp</th>
                        <th>Ngày tạo</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length === 0 && !loading && (
                        <tr>
                            <td colSpan={5} className="text-center">
                                Không có dữ liệu
                            </td>
                        </tr>
                    )}
                    {data.map((item, index) => (
                        <tr key={item.id}>
                            <td>{page * pageSize + index + 1}</td>
                            <td>HD{item.id}</td>
                            <td>{item.nhaCungCap.tenNhaCungCap}</td>
                            <td>{item.ngay}</td>
                            <td>
                                <Badge bg={getStatusColor(item.trangThai)}>
                                    {item.trangThai}
                                </Badge>
                            </td>
                            <td>
                                <button onClick={() => handxemchitiet(item)} className="btn btn-sm btn-info me-2">Xem</button>
                                <button onClick={() => handupdatestatus(item)} className="btn btn-sm btn-danger">Cập nhập trạng thái</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Phân trang */}
            <div className="d-flex justify-content-center mt-3">
                <button
                    className="btn btn-outline-primary me-2"
                    disabled={page === 0}
                    onClick={() => handlePageChange(page - 1)}
                >
                    Trang trước
                </button>
                <span className="align-self-center">
                    {page + 1} / {totalPages}
                </span>
                <button
                    className="btn btn-outline-primary ms-2"
                    disabled={page === totalPages - 1}
                    onClick={() => handlePageChange(page + 1)}
                >
                    Trang sau
                </button>
            </div>
            {/* Modal xem chi tiết */}
            {showModal && selectedNhapHang && (
                <Chitienhaphang
                    nhaphang={selectedNhapHang}
                    onClose={() => setShowModal(false)}
                    show={showModal}
                />
            )}
            <Modal show={showUpdateModal} onHide={() => setShowUpdateModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Cập nhật trạng thái</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedHoaDon && (
                        <div>
                            <p>ID hóa đơn: {selectedHoaDon.id}</p>
                            <p>Khách hàng: {selectedHoaDon.nhaCungCap.tenNhaCungCap}</p>
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
                            if (newStatus === "" || newStatus === selectedHoaDon?.trangThai) {
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
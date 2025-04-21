import React, { useState, useEffect } from 'react';
import { NhapHang, NhapHangResponse } from '../../util/types/NhapHangType';
import { fetchNhapHang } from '../../hook/nhapHangApi';
import { Badge } from 'react-bootstrap';
import Chitienhaphang from '../../components/ui/Chitienhaphang';



type Props = {
    startDate?: string;
    endDate?: string;
    filterField?: string;
    filterValue?: string;
};



export default function TTDSNhapHang({ startDate, endDate, filterField, filterValue }: Props) {
    const [data, setData] = useState<NhapHang[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [sortField, setSortField] = useState('id');
    const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC');
    const [showModal, setShowModal] = useState(false);
    const [selectedNhapHang, setSelectedNhapHang] = useState<NhapHang | null>(null);

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

    useEffect(() => {
        loadData();
    }, [page, pageSize, sortField, sortDirection, startDate, endDate, filterField, filterValue]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    const handxemchitiet = (item: NhapHang) =>{
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
                                <button className="btn btn-sm btn-danger">Xóa</button>
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
        </div>
    );
}
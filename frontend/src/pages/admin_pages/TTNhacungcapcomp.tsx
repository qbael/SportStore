import React, { useState, useEffect } from 'react';
import { NhaCungCap, NhaCungCapResponse } from '../../util/types/NhapHangType';
import { fetchNhaCungCap } from '../../hook/nhapHangApi';

type Props = {
    filterField?: string;
    filterValue?: string;
};

export default function TTNhaCungCapComp({ filterField, filterValue }: Props) {
    const [data, setData] = useState<NhaCungCap[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [sortField, setSortField] = useState('id');
    const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC');

    const dsNhacungcap = async () => {
        try {
            setLoading(true);
            const res = await fetchNhaCungCap({
                keyword: filterValue,  // Đưa giá trị tìm kiếm vào
                page: page,
                size: pageSize,
                sortField: sortField,
                sortDirection: sortDirection,
            });
            setData(res.content);
            setTotalPages(res.totalPages);
            setPage(res.pageable.pageNumber);
        } catch (err) {
            console.error("Lỗi tải danh sách nhà cung cấp:", err);
        } finally {
            setLoading(false);
        }
    };
    
    
    useEffect(() => {
        dsNhacungcap();
    }, [page, pageSize, sortField, sortDirection, filterField, filterValue]);

    const handlePageChange = (newPage: number) => {
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    return (
        <div className="table-responsive">
            {loading && <p className="text-center">Đang tải...</p>}
            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>ID nhà cung cấp</th>
                        <th>Tên nhà cung cấp</th>
                        <th>Email</th>
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
                            <td>NCC{item.id}</td>
                            <td>{item.tenNhaCungCap}</td>
                            <td>{item.email || 'N/A'}</td>
                            <td>
                                <button className="btn btn-sm btn-info me-2">Sửa</button>
                                <button className="btn btn-sm btn-danger">xóa</button>
                                
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Phân trang */}
            {totalPages >= 1 && (
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
            )}
        </div>
    );
}
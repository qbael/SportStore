import React, { useState, useEffect } from 'react';
import { NhaCungCap, NhaCungCapResponse } from '../../util/types/NhapHangType';
import { fetchNhaCungCap } from '../../hook/nhapHangApi';
import { Modal } from 'react-bootstrap';
import { ScaleLoader } from 'react-spinners';

type Props = {
    filterField?: string;
    filterValue?: string;
    modaladd?: boolean;
    onclose: () => void;
};

export default function TTNhaCungCapComp({ filterField, filterValue, modaladd, onclose }: Props) {
    const [data, setData] = useState<NhaCungCap[]>([]);
    const [loading, setLoading] = useState(false);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [sortField, setSortField] = useState('id');
    const [sortDirection, setSortDirection] = useState<'ASC' | 'DESC'>('DESC');
    const [modaleidt, setModalEdit] = useState(false);
    const [sp, setSp] = useState<NhaCungCap | null>(null);
    // const [modaladd , setModalAdd] = useState(false);

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

    const fetchCreateNCC = async (ncc: NhaCungCap) => {
        try {
            setLoading(true);
            const res = await fetch('http://localhost:8080/api/nhacungcap/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ncc),
            });
            if (!res.ok) {
                throw new Error('Failed to create NhaCungCap');
            }
            const newNCC = await res.json();
            setData((prevData) => [...prevData, newNCC]);
            setModalEdit(false);
        } catch (error) {
            console.error('Error creating NhaCungCap:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchUpdateNCC = async (ncc: NhaCungCap) => {
        try {
            setLoading(true);
            const res = await fetch(`http://localhost:8080/api/nhacungcap/update/${ncc.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(ncc),
            });
            if (!res.ok) {
                throw new Error('Failed to update NhaCungCap');
            }
            const updatedNCC = await res.json();
            setData((prevData) =>
                prevData.map((item) => (item.id === updatedNCC.id ? updatedNCC : item))
            );
            setModalEdit(false);
        } catch (error) {
            console.error('Error updating NhaCungCap:', error);
        } finally {
            setLoading(false);
        }
    };

    const handcreate = async () => {
        const newNCC: NhaCungCap = {
            id: 0,
            tenNhaCungCap: (document.getElementById('tenNhaCungCap') as HTMLInputElement).value,
            sdt: (document.getElementById('sdt') as HTMLInputElement).value,
            email: (document.getElementById('email') as HTMLInputElement).value,
            diaChi: (document.getElementById('diaChi') as HTMLInputElement).value,
        };

        if (!newNCC.tenNhaCungCap || !newNCC.sdt || !newNCC.email || !newNCC.diaChi) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }

        await fetchCreateNCC(newNCC);
        onclose();
        dsNhacungcap();
    };

    const handleUpdate = async () => {
        const updatedNCC: NhaCungCap = {
            id: sp?.id || 0,
            tenNhaCungCap: (document.getElementById('tenNhaCungCapedit') as HTMLInputElement).value,
            sdt: (document.getElementById('sdtedit') as HTMLInputElement).value,
            email: (document.getElementById('emailedit') as HTMLInputElement).value,
            diaChi: (document.getElementById('diaChiedit') as HTMLInputElement).value,
        };

        
        if (!updatedNCC.tenNhaCungCap || !updatedNCC.sdt || !updatedNCC.email || !updatedNCC.diaChi) {
            alert('Vui lòng điền đầy đủ thông tin');
            return;
        }

        await fetchUpdateNCC(updatedNCC);
        setModalEdit(false);
        dsNhacungcap();
    };


    return (
        <div className="table-responsive">
            {loading && (
                <div
                    className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
                    style={{ backgroundColor: 'rgba(0, 0, 0, 0.01)', zIndex: 1050 }}
                >
                    <ScaleLoader color="#36d7b7" height={35} />
                </div>
            )}
            <table className="table table-bordered table-hover">
                <thead className="table-dark">
                    <tr>
                        <th>#</th>
                        <th>ID nhà cung cấp</th>
                        <th>Tên nhà cung cấp</th>
                        <th>Số điện thoại</th>
                        <th>Email</th>
                        <th>Địa chỉ</th>
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
                            <td>{item.sdt || 'N/A'}</td>
                            <td>{item.email || 'N/A'}</td>
                            <td>{item.diaChi || 'N/A'}</td>
                            <td>
                                <button onClick={() => { setSp(item); setModalEdit(true) }} className="btn btn-sm btn-info me-2">Sửa</button>
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

            {/* Thêm nhà cung cấp */}
            <Modal show={modaladd} onHide={() => onclose()}>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm nhà cung cấp</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Form thêm nhà cung cấp */}
                    <form>
                        <div className="mb-3">
                            <label htmlFor="tenNhaCungCap" className="form-label">Tên nhà cung cấp</label>
                            <input type="text" className="form-control" id="tenNhaCungCap" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="sdt" className="form-label">Số điện thoại</label>
                            <input type="text" className="form-control" id="sdt" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" className="form-control" id="email" />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="diaChi" className="form-label">Địa chỉ</label>
                            <input type="text" className="form-control" id="diaChi" />
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={() => onclose()} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                    <button onClick={handcreate} type="button" className="btn btn-primary">Lưu thay đổi</button>
                </Modal.Footer>
            </Modal>
            {/* Modal sửa nhà cung cấp */}
            <Modal show={modaleidt} onHide={() => setModalEdit(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Sửa nhà cung cấp</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* Form sửa nhà cung cấp */}
                    <form>
                        <div className="mb-3">
                            <label htmlFor="tenNhaCungCap" className="form-label">Tên nhà cung cấp</label>
                            <input type="text" className="form-control" id="tenNhaCungCapedit" defaultValue={sp?.tenNhaCungCap} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="sdt" className="form-label">Số điện thoại</label>
                            <input type="text" className="form-control" id="sdtedit" defaultValue={sp?.sdt} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" className="form-control" id="emailedit" defaultValue={sp?.email} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="diaChi" className="form-label">Địa chỉ</label>
                            <input type="text" className="form-control" id="diaChiedit" defaultValue={sp?.diaChi} />
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <button onClick={() => setModalEdit(false)} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                    <button onClick={handleUpdate} type="button" className="btn btn-primary">Lưu thay đổi</button>
                </Modal.Footer>
            </Modal>

        </div>
    );
}
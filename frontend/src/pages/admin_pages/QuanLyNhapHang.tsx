import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { NhapHangResponse, NhapHang } from '../../util/types/NhapHangType';
import { fetchNhapHang } from '../../hook/nhapHangApi';
import { Button } from 'react-bootstrap';

type Params = {
    startDate?: string;       // yyyy-MM-dd
    endDate?: string;
    filterField?: string;
    filterValue?: string;
    sortField?: string;
    sortDirection?: "ASC" | "DESC";
    page?: number;
    size?: number;
};

export default function QuanLyNhapHang() {
    const [showModalNCC, setShowModalNCC] = useState(false);
    const [showModalYeuCau, setShowModalYeuCau] = useState(false);
    const [activeTab, setActiveTab] = useState<'ncc' | 'yeucau'>('ncc');

    // State cho modal Tạo yêu cầu nhập hàng
    const [productName, setProductName] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [supplier, setSupplier] = useState('');
    const [requestDate, setRequestDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState<NhapHang[]>([]);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [sortField, setSortField] = useState("id");
    const [sortDirection, setSortDirection] = useState<"DESC"|"ASC">("DESC");
    const [filterField, setFilterField] = useState("");
    const [filterValue, setFilterValue] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const loadDataNCC = async () => {
        try {
            setLoading(true);
            const res = await fetchNhapHang({
                startDate: startDate,
                endDate: endDate,
                filterField: filterField,
                filterValue: filterValue,
                sortField: sortField,
                sortDirection: sortDirection,
                page: page,
                size: pageSize,
            });
            setData(res.content);
            console.log(data);
            setTotalPages(res.totalPages);
            setPage(res.pageable.pageNumber);
        } catch (err) {
            console.error("Lỗi tải dữ liệu:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDataNCC();
      }, [page]);

    const handleCreateRequest = () => {
        // Kiểm tra dữ liệu hợp lệ
        if (!productName || quantity <= 0 || !supplier || !requestDate) {
            alert('Vui lòng điền đầy đủ thông tin.');
            return;
        }

        // Thực hiện hành động tạo yêu cầu (ví dụ: gọi API hoặc lưu dữ liệu)
        alert(`Tạo yêu cầu nhập hàng thành công: ${productName} - ${quantity} - ${supplier} - ${requestDate}`);

        // Đóng modal
        setShowModalYeuCau(false);

        // Reset các trường trong modal
        setProductName('');
        setQuantity(1);
        setSupplier('');
        setRequestDate('');
    };

    const handsearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFilterField("tenNhaCungCap");
        setFilterValue(value);
        console.log(value);
    };

    const handSeachbtn = () => {
        loadDataNCC();
    };

    return (
        <div className="container mt-4">
            {/* PHẦN 1: Header tìm kiếm & lọc ngày */}
            <div className="row mb-3">
                <div className="col-md-4">
                    <input onChange={handsearch} type="text" className="form-control" placeholder="Tìm kiếm theo tên, mã đơn..." />
                </div>
                <div className="col-md-1">
                    <Button onClick={handSeachbtn}>Tìm kiếm </Button>
                </div>
                <div className="col-md-3">
                    <input type="date" className="form-control" />
                </div>
                <div className="col-md-3">
                    <input type="date" className="form-control" />
                </div>
            </div>

            {/* PHẦN 2: Các nút control */}
            <div className="d-flex justify-content-start mb-3">
                <button className="btn btn-primary me-3" onClick={() => setActiveTab('ncc')}>
                    Thông tin nhà cung cấp
                </button>
                <button className="btn btn-success me-3" onClick={() => setActiveTab('yeucau')}>
                    Thông tin HD nhập hàng
                </button>
                <button className="btn btn-info me-3" onClick={() => setShowModalNCC(true)}>
                    Thêm nhà cung cấp
                </button>
                <button className="btn btn-warning" onClick={() => setShowModalYeuCau(true)}>
                    Tạo yêu cầu nhập hàng
                </button>
            </div>

            {/* Hiển thị bảng tương ứng với tab */}
            {activeTab === 'ncc' && (
                <div className="table-responsive">
                    <table className="table table-bordered table-hover">
                        <thead className="table-dark">
                            <tr>
                                <th>#</th>
                                <th>ID nhà cung cấp</th>
                                <th>Tên nhà cung cấp</th>
                                <th>Liên hệ</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* {data.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{index + 1}</td>
                                    <td>HD{item.id}</td>
                                    <td>{item.nhaCungCap.tenNhaCungCap}</td>
                                    <td>{item.ngay}</td>
                                    <td>
                                        <button className="btn btn-sm btn-info me-2">Xem</button>
                                        <button className="btn btn-sm btn-danger">Xóa</button>
                                    </td>
                                </tr>
                            ))} */}
                            <tr key={1}>
                                    <td>{1}</td>
                                    <td>HD{1}</td>
                                    <td>Tên nhà cung cấp</td>
                                    <td>huynhthan@hdkjsạ</td>
                                    <td>
                                        <button className="btn btn-sm btn-info me-2">Xem</button>
                                        <button className="btn btn-sm btn-danger">Xóa</button>
                                    </td>
                                </tr>
                        </tbody>
                    </table>
                </div>
            )}

            {activeTab === 'yeucau' && (
                <div className="table-responsive">
                <table className="table table-bordered table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Mã đơn</th>
                            <th>Nhà cung cấp</th>
                            <th>Ngày tạo</th>
                            <th>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item, index) => (
                            <tr key={item.id}>
                                <td>{index + 1}</td>
                                <td>HD{item.id}</td>
                                <td>{item.nhaCungCap.tenNhaCungCap}</td>
                                <td>{item.ngay}</td>
                                <td>
                                    <button className="btn btn-sm btn-info me-2">Xem</button>
                                    <button className="btn btn-sm btn-danger">Xóa</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            )}

            {/* Modal Tạo yêu cầu nhập hàng */}
            {showModalYeuCau && (
                <div className="modal show d-block" tabIndex={-1}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Tạo yêu cầu nhập hàng</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModalYeuCau(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="productName" className="form-label">Tên sản phẩm</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="productName"
                                        value={productName}
                                        onChange={(e) => setProductName(e.target.value)}
                                        placeholder="Nhập tên sản phẩm"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="quantity" className="form-label">Số lượng</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        id="quantity"
                                        value={quantity}
                                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                                        placeholder="Nhập số lượng"
                                        min="1"
                                    />
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="supplier" className="form-label">Nhà cung cấp</label>
                                    <select
                                        className="form-select"
                                        id="supplier"
                                        value={supplier}
                                        onChange={(e) => setSupplier(e.target.value)}
                                    >
                                        <option value="">Chọn nhà cung cấp</option>
                                        <option value="abc">Công ty ABC</option>
                                        <option value="xyz">Công ty XYZ</option>
                                    </select>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="requestDate" className="form-label">Ngày yêu cầu</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        id="requestDate"
                                        value={requestDate}
                                        onChange={(e) => setRequestDate(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowModalYeuCau(false)}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-success"
                                    onClick={handleCreateRequest}
                                >
                                    Tạo yêu cầu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

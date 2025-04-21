import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button } from 'react-bootstrap';
import TTDSNhapHang from '../../pages/admin_pages/TTDSnhaphang';
import TTNhaCungCapComp from '../../pages/admin_pages/TTNhacungcapcomp';
import Select from 'react-select';
import { NhaCungCap } from '../../util/types/NhapHangType';

type Params = {
    startDate?: string; // yyyy-MM-dd
    endDate?: string;
    filterField?: string;
    filterValue?: string;
    sortField?: string;
    sortDirection?: "ASC" | "DESC";
    page?: number;
    size?: number;
};

type OptionType = {
    value: string;
    label: string;
    quantity?: number;
};


export default function QuanLyNhapHang() {
    const [showModalNCC, setShowModalNCC] = useState(false);
    const [showModalYeuCau, setShowModalYeuCau] = useState(false);
    const [activeTab, setActiveTab] = useState<'ncc' | 'yeucau'>('ncc');
    const [productName, setProductName] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [supplier, setSupplier] = useState('');
    const [requestDate, setRequestDate] = useState('');
    const [filterField, setFilterField] = useState('');
    const [filterValue, setFilterValue] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleCreateRequest = () => {
        if (!productName || quantity <= 0 || !supplier || !requestDate) {
            alert('Vui lòng điền đầy đủ thông tin.');
            return;
        }
        alert(`Tạo yêu cầu nhập hàng thành công: ${productName} - ${quantity} - ${supplier} - ${requestDate}`);
        setShowModalYeuCau(false);
        setProductName('');
        setQuantity(1);
        setSupplier('');
        setRequestDate('');
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFilterField('tenNhaCungCap');
        setFilterValue(value);
    };


    //   const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //  data demo 
    // const [supplier, setSupplier] = useState('');
    const suppliers: OptionType[] = [
        { value: 'sản phẩm 1', label: '1. sản phẩm' },
        { value: 'sản phẩm 2', label: '2. sản phẩm' },
        { value: 'sản phẩm 3', label: '3. sản phẩm' },
        { value: 'sản phẩm 4', label: '4. sản phẩm' },
        { value: 'sản phẩm 5', label: '5. sản phẩm' },
        { value: 'sản phẩm 6', label: '6. sản phẩm' },
        { value: 'sản phẩm 7', label: '7. sản phẩm' },
        { value: 'sản phẩm 8', label: '8. sản phẩm' },
    ];


    const [availableSuppliers, setAvailableSuppliers] = useState<OptionType[]>(suppliers);
    const [selectedSuppliers, setSelectedSuppliers] = useState<OptionType[]>([]);

    // thêm sản phẩm demo vào availableSuppliers
    const handleRemoveSupplier = (supplierToRemove: OptionType) => {
        setSelectedSuppliers((prev) => prev.filter((s) => s.value !== supplierToRemove.value));
        setAvailableSuppliers((prev) => [...prev, supplierToRemove]);
    };

    const handleQuantityChange = (value: string, supplierValue: string) => {
        const quantity = parseInt(value) || 1;
        setSelectedSuppliers((prev) =>
            prev.map((sup) =>
                sup.value === supplierValue ? { ...sup, quantity } : sup
            )
        );
    };

    const handleChangeSupplier = (selectedOption: OptionType | null) => {
        if (selectedOption) {
            // Thêm vào danh sách đã chọn
            setSelectedSuppliers((prev) => [...prev, selectedOption]);

            // Xóa khỏi danh sách dropdown
            setAvailableSuppliers((prev) => prev.filter((s) => s.value !== selectedOption.value));
        }
    };

    // consolog 
    useEffect(() => {
        console.log('Selected Suppliers:', selectedSuppliers);
        console.log('Available Suppliers:', availableSuppliers);
    }
        , [selectedSuppliers, availableSuppliers]);

    return (
        <div className="container mt-4">
            {/* Thanh tìm kiếm và lọc ngày */}
            <div className="row mb-3">
                <div className="col-md-4">
                    <input
                        onChange={handleSearch}
                        type="text"
                        className="form-control"
                        placeholder="Tìm kiếm theo tên, mã đơn..."
                    />
                </div>
                <div className="col-md-1">
                    <Button onClick={() => { }}>Tìm kiếm</Button>
                </div>
                <div className="col-md-3">
                    <input
                        type="date"
                        className="form-control"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div className="col-md-3">
                    <input
                        type="date"
                        className="form-control"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
            </div>

            {/* Nút điều khiển */}
            <div className="d-flex justify-content-start mb-3">
                <button
                    className="btn btn-primary me-3"
                    onClick={() => setActiveTab('ncc')}
                >
                    Thông tin nhà cung cấp
                </button>
                <button
                    className="btn btn-success me-3"
                    onClick={() => setActiveTab('yeucau')}
                >
                    Thông tin HD nhập hàng
                </button>
                <button
                    className="btn btn-info me-3"
                    onClick={() => setShowModalNCC(true)}
                >
                    Thêm nhà cung cấp
                </button>
                <button
                    className="btn btn-warning"
                    onClick={() => setShowModalYeuCau(true)}
                >
                    Tạo yêu cầu nhập hàng
                </button>
            </div>

            {/* Hiển thị bảng theo tab */}
            {activeTab === 'ncc' && (
                <TTNhaCungCapComp
                    filterField={filterField}
                    filterValue={filterValue}
                />
            )}
            {activeTab === 'yeucau' && (
                <TTDSNhapHang
                    startDate={startDate}
                    endDate={endDate}
                    filterField={filterField}
                    filterValue={filterValue}
                />
            )}

            {/* Modal Tạo yêu cầu nhập hàng */}
            {showModalYeuCau && (
                <div className="modal show d-block" tabIndex={-1}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Tạo yêu cầu nhập hàng</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModalYeuCau(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="supplier" className="form-label">
                                        Nhà cung cấp
                                    </label>
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
                                    <label htmlFor="supplier" className="form-label">
                                        Thêm sản phẩm
                                    </label>
                                    {/* thêm tìm kiếm như nào  */}

                                    <Select
                                        id="supplier"
                                        options={availableSuppliers}
                                        onChange={handleChangeSupplier}
                                        value={suppliers.find((sup) => sup.value === supplier) || null}
                                        placeholder="Chọn nhà cung cấp"
                                        isSearchable={true} // Tính năng tìm kiếm
                                        className="form-select"
                                    />
                                </div>

                                {/* hiện sanh sách đã chọn bên phải là số lượng và dấu x */}
                                <ul className="list-group">
                                    {selectedSuppliers.map((sup) => (
                                        <li key={sup.value} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                {sup.label}
                                            </div>
                                            <div className="d-flex align-items-center gap-2">
                                                <input
                                                    type="number"
                                                    min="1"
                                                    value={sup.quantity}
                                                    onChange={(e) => handleQuantityChange(e.target.value, sup.value)}
                                                    style={{ width: '60px' }}
                                                    className="form-control form-control-sm"
                                                />
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleRemoveSupplier(sup)}
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>



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

            {/* Modal Thêm nhà cung cấp (chưa triển khai chi tiết) */}
            {showModalNCC && (
                <div className="modal show d-block" tabIndex={-1}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Thêm nhà cung cấp</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModalNCC(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <p>Form thêm nhà cung cấp (chưa triển khai).</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowModalNCC(false)}
                                >
                                    Hủy
                                </button>
                                <button type="button" className="btn btn-primary">
                                    Lưu
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
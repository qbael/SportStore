import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, Modal } from 'react-bootstrap';
import TTDSNhapHang from '../../pages/admin_pages/TTDSnhaphang';
import TTNhaCungCapComp from '../../pages/admin_pages/TTNhacungcapcomp';
import Select, { ActionMeta, InputActionMeta, MultiValue } from 'react-select';
import { NhaCungCap } from '../../util/types/NhapHangType';
import { BienTheType } from '../../util/types/ProductTypes';
import { useNotification } from '../../hook/useNotification2.tsx'
import { useAdminContext } from '../../hook/useAdminContext.tsx';
import { HanhDong } from '../../util/Enum.tsx';




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


interface BienThe extends BienTheType {
    gianhap?: number;
    idsanpham?: number;
}

export default function QuanLyNhapHang() {

    const { dsHanhDong } = useAdminContext();
    const { showNotification } = useNotification();

    const [showModalNCC, setShowModalNCC] = useState(false);
    const [showModalYeuCau, setShowModalYeuCau] = useState(false);
    const [activeTab, setActiveTab] = useState<'ncc' | 'yeucau'>('ncc');
    const [productName, setProductName] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [supplier, setSupplier] = useState('');
    const [dssanpham, setDssanpham] = useState<BienThe[]>([]);
    const [dsNhaCungCap, setDsNhaCungCap] = useState<NhaCungCap[]>([]);
    const [requestDate, setRequestDate] = useState('');
    const [filterField, setFilterField] = useState('');
    const [filterValue, setFilterValue] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loadingsp, setLoadingsp] = useState(false);
    const [selectedSuppliers, setSelectedSuppliers] = useState<{ val: BienThe, sl: number }[]>([]);
    const [modaladd, setModalAdd] = useState(false);

    const hasPermission = (action: HanhDong) => {
        return dsHanhDong?.includes(action);
    }



    const fetchCreateRequest = async () => {

        // xủa lý data
        const buildRequestData = () => {
            return {
                tongGiaNhap: 0,
                trangThai: "Đang xử lý",
                nhaCungCap: { id: supplier },
                nhanVien: { id: 1 },
                dsCTNhapHang: selectedSuppliers.map((sp) => ({
                    soLuong: sp.sl,
                    // sanPham: { id: sp.val.id },  
                    giaNhap: sp.val.gianhap,
                    bienThe: { id: sp.val.id }
                }))
            };
        };

        try {
            const response = await fetch('http://localhost:8080/api/nhaphang', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(buildRequestData()),
            });
            if (response.ok) {
                showNotification("Tạo đơn hàng thành công", "info");

            }
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log('Create request response:', data);
        } catch (error) {
            console.error('Error creating request:', error);
        }
    };

    const handleCreateRequest = () => {
        if (!supplier || selectedSuppliers.length === 0) {
            alert('Vui lòng chọn nhà cung cấp và sản phẩm.');
            return;
        }
        // alert(`Tạo yêu cầu nhập hàng thành công: ${productName} - ${quantity} - ${requestDate}`);
        fetchCreateRequest()
        setShowModalYeuCau(false);
        setSelectedSuppliers([]);
        // setdssanpham([]);
        setProductName('');
        setQuantity(1);
        // setSupplier('');
        // setRequestDate('');
    };


    const normalize = (str: string) => {
        return str.normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d").replace(/Đ/g, "D")
            .toLowerCase();
    };
    const [searchText, setSearchText] = useState("");
    const customFilterOption = (option: any, inputValue: string) => {
        const label = normalize(option.label);
        const input = normalize(inputValue);

        const quantityMatch = input.match(/\[(\d+)\]/);
        const sizeMatch = input.match(/s-([a-z0-9,]+)/i); // ✅ hỗ trợ nhiều size
        const colorMatch = input.match(/c-([^\s]+)/i);    // ✅ hỗ trợ nhiều màu

        const textSearch = input
            .replace(/\[(\d+)\]/, "")
            .replace(/s-([a-z0-9,]+)/i, "")
            .replace(/c-([^\s]+)/i, "")
            .trim();

        let pass = true;

        // ✅ Kiểm tra số lượng
        if (quantityMatch) {
            const quantity = parseInt(quantityMatch[1]);
            const labelQtyMatch = label.match(/\[(\d+)\]/);
            if (labelQtyMatch) {
                const labelQty = parseInt(labelQtyMatch[1]);
                pass = pass && labelQty <= quantity;
            } else {
                pass = false;
            }
        }

        // ✅ Kiểm tra size (nhiều size ngăn cách bởi dấu `,`)
        if (sizeMatch) {
            const sizeList = sizeMatch[1].split(',').map(s => s.trim());
            pass = pass && sizeList.some(size => {
                const sizeRegex = new RegExp(`size\\s*${size}`, 'i');
                return sizeRegex.test(label);
            });
        }

        // ✅ Kiểm tra màu (nhiều màu ngăn cách bởi dấu `,`)
        if (colorMatch) {
            const colorList = colorMatch[1].split(',').map(c => normalize(c.trim()));
            pass = pass && colorList.some(color => label.includes(color));
        }

        // ✅ Tìm theo từ khóa còn lại
        if (textSearch) {
            pass = pass && label.includes(textSearch);
        }

        return pass;
    };


    //   const handleChange = (selectedOption: OptionType | null) => {
    //     if (selectedOption) {
    //       setSelectedSuppliers(prev => [
    //         ...prev,
    //         selectedOption, // Thêm sản phẩm đã chọn vào danh sách đã chọn
    //       ]);
    //     }
    //   };

    const [menuIsOpen, setMenuIsOpen] = React.useState<boolean>();

    const onInputChange = (
        inputValue: string,
        { action, prevInputValue }: InputActionMeta
    ) => {
        if (action === 'input-change') return inputValue;
        if (action === 'menu-close') {
            if (prevInputValue) setMenuIsOpen(true);
            else setMenuIsOpen(undefined);
        }
        return prevInputValue;
    };


    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setFilterField('tenNhaCungCap');
        setFilterValue(value);
    };

    // const options = dssanpham.map((item) => ({
    //     value: item,
    //     label: `${item.id}. ${item.tenBienThe}`,
    // }));

    type OptionType = {
        value: BienTheType;
        label: string;
    };

    // Tạo options từ dssanpham
    const sanphamOptions: OptionType[] = dssanpham.map(sp => ({
        value: sp,
        label: `${sp.id}. [${sp.soLuongTon}] ${sp.tenBienThe}`,
    }));

    // const handleSanphamSelect = (selected: OptionType | null) => {
    //     if (!selected) return;

    //     // Thêm vào danh sách đã chọn
    //     setSelectedSuppliers(prev => [...prev, { val: selected.value, sl: 1 }]);

    //     // Xoá khỏi danh sách sản phẩm ban đầu
    //     setDssanpham(prev => prev.filter(sp => sp.id !== selected.value.id));
    //     // setMenuOpen(true);
    // };

    const handleSanphamSelect = (
        selected: MultiValue<OptionType>,
        actionMeta: ActionMeta<OptionType>
    ) => {
        if (!selected) return;

        // Lọc ra các sản phẩm chưa chọn để loại bỏ sản phẩm đã chọn khỏi danh sách
        const selectedIds = selected.map(item => item.value.id);

        // Lọc để loại bỏ sản phẩm đã có trong danh sách đã chọn
        const newSelectedItems = selected
            .filter(item => !selectedSuppliers.some(sp => sp.val.id === item.value.id))
            .map(item => ({
                val: item.value,
                sl: 1
            }));

        setSelectedSuppliers(prev => [...prev, ...newSelectedItems]);

        // Xoá khỏi danh sách sản phẩm ban đầu
        setDssanpham(prev => prev.filter(sp => !selectedIds.includes(sp.id)));

        // Sau khi xử lý, bạn có thể để react-select tự động quản lý selected nếu bạn đã cấu hình isMulti
    };

    const fetchNhaCungCap = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/nhacungcap/all');
            const data = await response.json();
            setDsNhaCungCap(data);
        }
        catch (error) {
            console.error('Error fetching data:', error);
        }
    }


    const handleRemoveSupplier = (supplier: BienTheType) => {
        // Xoá nhà cung cấp khỏi danh sách đã chọn
        setSelectedSuppliers(prev => prev.filter(sup => sup.val.id !== supplier.id));

        // Thêm lại vào danh sách sản phẩm ban đầu
        setDssanpham(prev => [...prev, supplier]);
    };


    const handleUpdateSupplierQuantity = (supplier: BienThe, quantity: number) => {
        setSelectedSuppliers(prev =>
            prev.map(sup =>
                sup.val.id === supplier.id ? { ...sup, sl: quantity } : sup
            )
        );
    };

    const handleUpdateSupplierGiapnhap = (supplier: number, gianhap: number) => {
        setSelectedSuppliers(prev =>
            prev.map(sup =>
                sup.val.id === supplier ? { ...sup, val: { ...sup.val, gianhap } } : sup
            )
        );
    };

    useEffect(() => {
        fetchNhaCungCap();
    }, []);



    const fetchSanpham = async () => {
        setDssanpham([]);
        try {
            const response = await fetch(`http://localhost:8080/api/sanpham/nhacungcap/${supplier}`);
            const data = await response.json();
            data.forEach((item: any) => {
                // item.bienThe;
                console.log('item:', item);
                item?.bienThe?.forEach((element: BienThe) => {
                    element.gianhap = item.sanPham.giaNhap;
                    element.idsanpham = item.sanPham.id;
                    setDssanpham(prev => [...prev, element]);
                });
                // setDssanpham(prev => [...prev, item.bienThe]);
            });
        }
        catch (error) {
            console.error('Error fetching data:', error);
        }
    }



    useEffect(() => {
        if (!supplier) {
            return;
        }
        console.log('Selected Suppliers:', supplier);
        setLoadingsp(true);
        fetchSanpham();
        setLoadingsp(false);
        // console.log('dssanpham:', dssanpham);
    }, [supplier]);

    useEffect(() => {
        console.log('dssanpham:', dssanpham);
    })

    // consolog 
    useEffect(() => {
        console.log('Selected Suppliers:', selectedSuppliers);
    }
        , [selectedSuppliers]);

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
                {(hasPermission(HanhDong.THEM)) && (activeTab === 'ncc') && (
                    <button
                        className="btn btn-info me-3"
                        onClick={() => setModalAdd(true)}
                    >
                        Thêm nhà cung cấp
                    </button>
                )}
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
                    modaladd={modaladd}
                    onclose={() => setModalAdd(false)}
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
                <Modal show={showModalYeuCau} onHide={() => setShowModalYeuCau(false)} size="lg" >
                    <Modal.Header closeButton>
                        <Modal.Title>Tạo yêu cầu nhập hàng</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* <div className="modal show d-block" tabIndex={-1}> */}
                        {/* <div className="modal-dialog"> */}
                        <div className="" >
                            {/* <div className="modal-header">
                                        <h5 className="modal-title">Tạo yêu cầu nhập hàng</h5>
                                        <button
                                            type="button"
                                            className="btn-close"
                                            onClick={() => setShowModalYeuCau(false)}
                                        ></button>
                                    </div> */}
                            <div className="">
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
                                        <option value={""} >Chọn nhà cung cấp</option>
                                        {dsNhaCungCap.map((item) => (
                                            <option key={item.id} value={item.id}>
                                                {item.id}. {item.tenNhaCungCap}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="supplier" className="form-label">
                                        Thêm sản phẩm
                                    </label>
                                    {/* thêm tìm kiếm như nào  */}

                                    <Select
                                        options={sanphamOptions}
                                        isMulti
                                        isClearable
                                        isSearchable
                                        menuIsOpen={menuIsOpen}
                                        onChange={handleSanphamSelect}
                                        onInputChange={onInputChange}
                                        closeMenuOnSelect={false}
                                        placeholder="Chọn sản phẩm cần thêm"
                                        // isSearchable={true}
                                        className="form-select"
                                        filterOption={customFilterOption}
                                        blurInputOnSelect={false}
                                        components={{
                                            MultiValue: () => null // Ẩn tag hiển thị
                                        }}
                                    />
                                </div>

                                {/* hiện sanh sách đã chọn bên phải là số lượng và dấu x */}
                                <ul className="list-group">
                                    {selectedSuppliers.map((sup) => (
                                        <li key={sup?.val?.id} className="list-group-item d-flex justify-content-between align-items-center">
                                            <div>
                                                {sup?.val?.tenBienThe}
                                                <div className='font-size-10 text-muted'>
                                                    Số lượng tồn: {sup?.val?.soLuongTon}
                                                </div>
                                            </div>
                                            <div className='d-flex align-items-center gap-1'>
                                                <div className="d-flex-col justify-center gap-2">
                                                    <div className='d-flex align-items-center m-1 gap-1'>
                                                        <div className='d-flex text-nowrap'>Số lượng nhập: </div>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={sup.sl}
                                                            onChange={(e) => handleUpdateSupplierQuantity(sup.val, parseInt(e.target.value))}
                                                            // style={{ width: '80px' }}
                                                            className="form-control form-control-sm flex-grow-1"
                                                        />
                                                    </div>
                                                    <div className='d-flex m-1 gap-1'>
                                                        <div className='d-flex text-nowrap'>Giá nhập:</div>
                                                        <input
                                                            type="number"
                                                            min="1"
                                                            value={sup.val.gianhap}
                                                            onChange={(e) => handleUpdateSupplierGiapnhap(sup.val.id, parseInt(e.target.value))}
                                                            // style={{ width: '60px' }}
                                                            className="form-control form-control-sm w-50 flex-grow-1"
                                                        />
                                                    </div>
                                                </div>
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    onClick={() => handleRemoveSupplier(sup.val)}
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
                        {/* </div> */}
                        {/* </div> */}
                    </Modal.Body>
                </Modal>
            )}

            {/* Modal Thêm nhà cung cấp (chưa triển khai chi tiết) */}
            {showModalNCC && (
                <div className="modal show d-block" tabIndex={-1}>
                    <div className="modal-dialog w-50">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Thêm nhà cung cấp</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setModalAdd(true)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                {/* <p>Form thêm nhà cung cấp (chưa triển khai).</p> */}
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
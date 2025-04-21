import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Modal, Spinner, Alert, Form } from 'react-bootstrap';
import { useAdminContext } from '../../hook/useAdminContext.tsx'; // Import useAdminContext
import { useNotification } from '../../hook/useNotification2';
import { HanhDong, mapToTenChucVu } from '../../util/Enum.tsx';
import {ChucVu} from "../../util/types/PhanQuyenTypes.tsx";

interface NhanVien {
    id: number;
    hoTen: string;
    ngaySinh: string;
    gioiTinh: boolean;
    diaChi: string;
    email: string;
    sdt: number;
    chucVuId: number;
    tenChucVu: string;
}


const QuanLyTaiKhoan: React.FC = () => {
    const { dsHanhDong } = useAdminContext(); // Lấy dsHanhDong từ context
    const { showNotification } = useNotification();
    const [nhanViens, setNhanViens] = useState<NhanVien[]>([]);
    const [chucVus, setChucVus] = useState<ChucVu[]>([]);
    const [selectedNhanVien, setSelectedNhanVien] = useState<NhanVien | null>(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [filterChucVuId, setFilterChucVuId] = useState<number>(0);
    const [formData, setFormData] = useState({
        hoTen: '',
        ngaySinh: '',
        gioiTinh: true,
        diaChi: '',
        email: '',
        sdt: '',
        password: '',
        chucVuId: 1,
    });
    const [errors, setErrors] = useState({
        hoTen: '',
        ngaySinh: '',
        diaChi: '',
        email: '',
        sdt: '',
        password: '',
    });

    // Hàm kiểm tra quyền
    const hasPermission = (action: HanhDong) => {
        return dsHanhDong?.includes(action);
    };

    useEffect(() => {
        fetchChucVus();
        fetchNhanViens(filterChucVuId);
    }, [filterChucVuId]);

    const fetchNhanViens = async (chucVuId: number) => {
        setLoading(true);
        setError(null);
        try {
            const url = chucVuId === 0
                ? 'http://localhost:8080/api/nhanvien'
                : `http://localhost:8080/api/nhanvien/chucvu/${chucVuId}`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Lỗi khi lấy danh sách nhân viên');
            }

            const result = await response.json();
            setNhanViens(result.data || []);
        } catch (err: any) {
            setError(err.message || 'Lỗi khi lấy danh sách nhân viên');
            showNotification(err.message || 'Lỗi khi lấy danh sách nhân viên!', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchChucVus = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/chucvu', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Lỗi khi lấy danh sách chức vụ');
            }

            const result = await response.json();
            setChucVus(result.data || []);
        } catch (err: any) {
            setError(err.message || 'Lỗi khi lấy danh sách chức vụ');
            showNotification(err.message || 'Lỗi khi lấy danh sách chức vụ!', 'error');
        }
    };

    const validateForm = () => {
        const newErrors = {
            hoTen: '',
            ngaySinh: '',
            diaChi: '',
            email: '',
            sdt: '',
            password: '',
        };
        let isValid = true;

        if (!formData.hoTen.trim()) {
            newErrors.hoTen = 'Họ tên không được để trống';
            isValid = false;
        }
        if (!formData.ngaySinh) {
            newErrors.ngaySinh = 'Ngày sinh không được để trống';
            isValid = false;
        }
        if (!formData.diaChi.trim()) {
            newErrors.diaChi = 'Địa chỉ không được để trống';
            isValid = false;
        }
        if (!formData.email.trim()) {
            newErrors.email = 'Email không được để trống';
            isValid = false;
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
            isValid = false;
        }
        if (!formData.sdt) {
            newErrors.sdt = 'Số điện thoại không được để trống';
            isValid = false;
        }
        if (!formData.password.trim()) {
            newErrors.password = 'Mật khẩu không được để trống';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const resetFormData = () => {
        setFormData({
            hoTen: '',
            ngaySinh: '',
            gioiTinh: true,
            diaChi: '',
            email: '',
            sdt: '',
            password: '',
            chucVuId: 1,
        });
        setErrors({
            hoTen: '',
            ngaySinh: '',
            diaChi: '',
            email: '',
            sdt: '',
            password: '',
        });
    };

    const handleAddNhanVien = async () => {
        if (!validateForm()) {
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8080/api/nhanvien', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Lỗi khi thêm nhân viên');
            }

            showNotification('Thêm nhân viên thành công!', 'success');
            setShowAddModal(false);
            resetFormData();
            fetchNhanViens(filterChucVuId);
        } catch (err: any) {
            setError(err.message || 'Lỗi khi thêm nhân viên');
            showNotification(err.message || 'Lỗi khi thêm nhân viên!', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEditNhanVien = async () => {
        if (!selectedNhanVien || !validateForm()) {
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:8080/api/nhanvien/${selectedNhanVien.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Lỗi khi sửa nhân viên');
            }

            showNotification('Sửa nhân viên thành công!', 'success');
            setShowEditModal(false);
            resetFormData();
            fetchNhanViens(filterChucVuId);
        } catch (err: any) {
            setError(err.message || 'Lỗi khi sửa nhân viên');
            showNotification(err.message || 'Lỗi khi sửa nhân viên!', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteNhanVien = async () => {
        if (!selectedNhanVien) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:8080/api/nhanvien/${selectedNhanVien.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Lỗi khi xóa nhân viên');
            }

            showNotification('Xóa nhân viên thành công!', 'success');
            setShowDeleteModal(false);
            fetchNhanViens(filterChucVuId);
        } catch (err: any) {
            setError(err.message || 'Lỗi khi xóa nhân viên');
            showNotification(err.message || 'Lỗi khi xóa nhân viên!', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'gioiTinh' ? value === 'true' : name === 'chucVuId' || name === 'sdt' ? parseInt(value) || '' : value,
        }));
        setErrors((prev) => ({
            ...prev,
            [name]: '',
        }));
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterChucVuId(parseInt(e.target.value));
    };

    const handleOpenAddModal = () => {
        resetFormData();
        setShowAddModal(true);
    };

    const handleOpenEditModal = (nhanVien: NhanVien) => {
        setSelectedNhanVien(nhanVien);
        setFormData({
            hoTen: nhanVien.hoTen,
            ngaySinh: nhanVien.ngaySinh,
            gioiTinh: nhanVien.gioiTinh,
            diaChi: nhanVien.diaChi,
            email: nhanVien.email,
            sdt: nhanVien.sdt.toString(),
            password: '',
            chucVuId: nhanVien.chucVuId,
        });
        setErrors({
            hoTen: '',
            ngaySinh: '',
            diaChi: '',
            email: '',
            sdt: '',
            password: '',
        });
        setShowEditModal(true);
    };

    return (
        <Container fluid className="p-3 bg-light min-vh-100">
            <Row>
                <Col>
                    <h3 className="mb-4 text-primary">Quản lý tài khoản</h3>
                    <div className="d-flex align-items-center mb-3">
                        <Form.Group className="me-3" style={{ width: '250px' }}>
                            <Form.Label>Lọc theo chức vụ</Form.Label>
                            <Form.Select
                                value={filterChucVuId}
                                onChange={handleFilterChange}
                            >
                                <option value={0}>Tất cả</option>
                                {chucVus.map((chucVu) => {
                                    const tenChucVu = mapToTenChucVu(chucVu.tenChucVu);
                                    return (
                                        <option key={chucVu.id} value={chucVu.id}>
                                            {tenChucVu || chucVu.tenChucVu}
                                        </option>
                                    );
                                })}
                            </Form.Select>
                        </Form.Group>
                        {hasPermission(HanhDong.THEM) && ( // Chỉ hiển thị nút Thêm nếu có quyền
                            <Button
                                variant="primary"
                                className="mt-4"
                                onClick={handleOpenAddModal}
                            >
                                Thêm nhân viên
                            </Button>
                        )}
                    </div>
                    {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
                    {loading && (
                        <div className="d-flex justify-content-center py-4">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    )}
                    {!loading && nhanViens.length > 0 && (
                        <Table
                            striped
                            bordered
                            hover
                            responsive
                            className="table-sm shadow-sm bg-white"
                        >
                            <thead className="table-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Họ tên</th>
                                    <th>Ngày sinh</th>
                                    <th>Giới tính</th>
                                    <th>Địa chỉ</th>
                                    <th>Email</th>
                                    <th>Số điện thoại</th>
                                    <th>Chức vụ</th>
                                    <th>Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {nhanViens.map((nhanVien, index) => {
                                    const tenChucVu = mapToTenChucVu(nhanVien.tenChucVu);
                                    return (
                                        <tr key={nhanVien.id}>
                                            <td>{index + 1}</td>
                                            <td>{nhanVien.hoTen}</td>
                                            <td>{nhanVien.ngaySinh}</td>
                                            <td>{nhanVien.gioiTinh ? 'Nam' : 'Nữ'}</td>
                                            <td>{nhanVien.diaChi}</td>
                                            <td>{nhanVien.email}</td>
                                            <td>{nhanVien.sdt}</td>
                                            <td>{tenChucVu || nhanVien.tenChucVu}</td>
                                            <td>
                                                {hasPermission(HanhDong.SUA) && ( // Chỉ hiển thị nút Sửa nếu có quyền
                                                    <Button
                                                        variant="warning"
                                                        size="sm"
                                                        className="me-2"
                                                        onClick={() => handleOpenEditModal(nhanVien)}
                                                    >
                                                        Sửa
                                                    </Button>
                                                )}
                                                {hasPermission(HanhDong.XOA) && ( // Chỉ hiển thị nút Xóa nếu có quyền
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        onClick={() => {
                                                            setSelectedNhanVien(nhanVien);
                                                            setShowDeleteModal(true);
                                                        }}
                                                    >
                                                        Xóa
                                                    </Button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    )}
                    {!loading && nhanViens.length === 0 && (
                        <Alert variant="info" className="mt-4">
                            Không có nhân viên nào.
                        </Alert>
                    )}
                </Col>
            </Row>

            {/* Modal Thêm Nhân Viên */}
            {hasPermission(HanhDong.THEM) && (
                <Modal show={showAddModal} onHide={() => setShowAddModal(false)} centered>
                    <Modal.Header closeButton className="bg-primary text-white">
                        <Modal.Title>Thêm nhân viên</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Họ tên</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="hoTen"
                                    value={formData.hoTen}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.hoTen}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.hoTen}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Ngày sinh</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="ngaySinh"
                                    value={formData.ngaySinh}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.ngaySinh}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.ngaySinh}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Giới tính</Form.Label>
                                <Form.Select
                                    name="gioiTinh"
                                    value={formData.gioiTinh ? 'true' : 'false'}
                                    onChange={handleInputChange}
                                >
                                    <option value="true">Nam</option>
                                    <option value="false">Nữ</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Địa chỉ</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="diaChi"
                                    value={formData.diaChi}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.diaChi}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.diaChi}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.email}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.email}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Số điện thoại</Form.Label>
                                <Form.Control
                                    type="tel"
                                    pattern="[0-9]*"
                                    name="sdt"
                                    value={formData.sdt}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.sdt}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.sdt}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Mật khẩu</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.password}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.password}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Chức vụ</Form.Label>
                                <Form.Select
                                    name="chucVuId"
                                    value={formData.chucVuId}
                                    onChange={handleInputChange}
                                    required
                                >
                                    {chucVus.length > 0 ? (
                                        chucVus.map((chucVu) => {
                                            const tenChucVu = mapToTenChucVu(chucVu.tenChucVu);
                                            return (
                                                <option key={chucVu.id} value={chucVu.id}>
                                                    {tenChucVu || chucVu.tenChucVu}
                                                </option>
                                            );
                                        })
                                    ) : (
                                        <option value="">Không có chức vụ</option>
                                    )}
                                </Form.Select>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowAddModal(false)}>
                            Hủy
                        </Button>
                        <Button variant="primary" onClick={handleAddNhanVien} disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Thêm'}
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

            {/* Modal Sửa Nhân Viên */}
            {hasPermission(HanhDong.SUA) && (
                <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
                    <Modal.Header closeButton className="bg-primary text-white">
                        <Modal.Title>Sửa nhân viên</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Họ tên</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="hoTen"
                                    value={formData.hoTen}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.hoTen}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.hoTen}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Ngày sinh</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="ngaySinh"
                                    value={formData.ngaySinh}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.ngaySinh}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.ngaySinh}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Giới tính</Form.Label>
                                <Form.Select
                                    name="gioiTinh"
                                    value={formData.gioiTinh ? 'true' : 'false'}
                                    onChange={handleInputChange}
                                >
                                    <option value="true">Nam</option>
                                    <option value="false">Nữ</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Địa chỉ</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="diaChi"
                                    value={formData.diaChi}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.diaChi}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.diaChi}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.email}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.email}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Số điện thoại</Form.Label>
                                <Form.Control
                                    type="tel"
                                    pattern="[0-9]*"
                                    name="sdt"
                                    value={formData.sdt}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.sdt}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.sdt}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Mật khẩu</Form.Label>
                                <Form.Control
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    isInvalid={!!errors.password}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    {errors.password}
                                </Form.Control.Feedback>
                            </Form.Group>
                            <Form.Group className="mb-3">
                                <Form.Label>Chức vụ</Form.Label>
                                <Form.Select
                                    name="chucVuId"
                                    value={formData.chucVuId}
                                    onChange={handleInputChange}
                                    required
                                >
                                    {chucVus.length > 0 ? (
                                        chucVus.map((chucVu) => {
                                            const tenChucVu = mapToTenChucVu(chucVu.tenChucVu);
                                            return (
                                                <option key={chucVu.id} value={chucVu.id}>
                                                    {tenChucVu || chucVu.tenChucVu}
                                                </option>
                                            );
                                        })
                                    ) : (
                                        <option value="">Không có chức vụ</option>
                                    )}
                                </Form.Select>
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                            Hủy
                        </Button>
                        <Button variant="primary" onClick={handleEditNhanVien} disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Sửa'}
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}

            {/* Modal Xóa Nhân Viên */}
            {hasPermission(HanhDong.XOA) && (
                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                    <Modal.Header closeButton className="bg-primary text-white">
                        <Modal.Title>Xác nhận xóa nhân viên</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="fs-5">
                        Bạn có chắc chắn muốn xóa nhân viên <strong>{selectedNhanVien?.hoTen}</strong> (Email:{' '}
                        {selectedNhanVien?.email}) không?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                            Hủy
                        </Button>
                        <Button variant="danger" onClick={handleDeleteNhanVien} disabled={loading}>
                            {loading ? <Spinner animation="border" size="sm" /> : 'Xóa'}
                        </Button>
                    </Modal.Footer>
                </Modal>
            )}
        </Container>
    );
};

export default QuanLyTaiKhoan;
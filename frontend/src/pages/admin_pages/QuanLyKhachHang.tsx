import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Modal, Spinner, Alert } from 'react-bootstrap';
import { useAdminAuth } from '../../hook/useAdminAuth';
import { useNotification } from '../../hook/useNotification2';

interface Customer {
    id: number;
    hoTen: string;
    sdt: number;
    diaChi: string;
    taiKhoanId: number;
    username?: string;
    isActive?: boolean;
}

const QuanLyKhachHang: React.FC = () => {
    const { taiKhoanNV } = useAdminAuth();
    const { showNotification } = useNotification();
    const [localCustomers, setLocalCustomers] = useState<Customer[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [showLockModal, setShowLockModal] = useState(false);
    const [lockAction, setLockAction] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:8080/api/khachhang', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${taiKhoanNV?.token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Lỗi khi lấy danh sách khách hàng');
            }

            const result = await response.json();
            // console.log('KhachHang Response:', result);

            const customersWithDetails = await Promise.all(
                result.data.map(async (customer: Customer) => {
                    try {
                        const taiKhoanRes = await fetch(`http://localhost:8080/api/taikhoan/${customer.taiKhoanId}`, {
                            headers: {
                                'Content-Type': 'application/json',
                                // 'Authorization': `Bearer ${taiKhoanNV?.token}`,
                            },
                        });
                        if (!taiKhoanRes.ok) {
                            const errorData = await taiKhoanRes.json();
                            throw new Error(errorData.message || 'Lỗi khi lấy thông tin tài khoản');
                        }
                        const taiKhoan = await taiKhoanRes.json();
                        // console.log(`TaiKhoan Response for ID ${customer.taiKhoanId}:`, taiKhoan);
                        return {
                            ...customer,
                            username: taiKhoan.data?.username || 'N/A',
                            isActive: taiKhoan.data?.isActive ?? false,
                        };
                    } catch (err: any) {
                        console.error(`Error fetching TaiKhoan for ID ${customer.taiKhoanId}:`, err.message);
                        return { ...customer, username: 'N/A', isActive: false };
                    }
                })
            );

            setLocalCustomers(customersWithDetails);
            console.log('Updated Customers:', customersWithDetails);
            // showNotification('Lấy danh sách khách hàng thành công!', 'success');
        } catch (err: any) {
            setError(err.message || 'Lỗi khi lấy danh sách khách hàng');
            showNotification(err.message || 'Lỗi khi lấy danh sách khách hàng!', 'error');
        } finally {
            setLoading(false);
        }
    };

    const toggleLockAccount = async () => {
        if (!selectedCustomer) return;
        console.log('Lock Action:', lockAction, 'Customer:', selectedCustomer);
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:8080/api/khachhang/${selectedCustomer.id}/lock`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    // 'Authorization': `Bearer ${taiKhoanNV?.token}`,
                },
                body: JSON.stringify({ isActive: lockAction }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Lỗi khi cập nhật trạng thái tài khoản');
            }

            showNotification(
                lockAction ? 'Mở khóa tài khoản thành công!' : 'Khóa tài khoản thành công!',
                'success'
            );
            setShowLockModal(false);
            fetchCustomers();
        } catch (err: any) {
            setError(err.message || 'Lỗi khi cập nhật trạng thái tài khoản');
            showNotification(err.message || 'Lỗi khi cập nhật trạng thái tài khoản!', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container fluid className="p-3 bg-light min-vh-100">
            <Row>
                <Col>
                    <h3 className="mb-4 text-primary">Quản lý khách hàng</h3>
                    {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
                    {loading && (
                        <div className="d-flex justify-content-center py-4">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    )}
                    {!loading && localCustomers.length > 0 && (
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
                                <th>Tên người dùng</th>
                                <th>Họ tên</th>
                                <th>Số điện thoại</th>
                                <th>Địa chỉ</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                            </thead>
                            <tbody>
                            {localCustomers.map((customer, index) => (
                                <tr key={customer.id}>
                                    <td>{index + 1}</td>
                                    <td>{customer.username || 'N/A'}</td>
                                    <td>{customer.hoTen}</td>
                                    <td>{customer.sdt}</td>
                                    <td>{customer.diaChi}</td>
                                    <td>
                      <span
                          className={`badge ${
                              customer.isActive ? 'bg-success' : 'bg-danger'
                          }`}
                      >
                        {customer.isActive ? 'Hoạt động' : 'Đã khóa'}
                      </span>
                                    </td>
                                    <td>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            className="me-2"
                                            disabled={!customer.isActive}
                                            onClick={() => {
                                                setSelectedCustomer(customer);
                                                setLockAction(false);
                                                setShowLockModal(true);
                                            }}
                                        >
                                            Khóa
                                        </Button>
                                        <Button
                                            variant="success"
                                            size="sm"
                                            disabled={customer.isActive}
                                            onClick={() => {
                                                setSelectedCustomer(customer);
                                                setLockAction(true);
                                                setShowLockModal(true);
                                            }}
                                        >
                                            Mở khóa
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    )}
                    {!loading && localCustomers.length === 0 && (
                        <Alert variant="info" className="mt-4">
                            Không có khách hàng nào.
                        </Alert>
                    )}
                </Col>
            </Row>

            <Modal show={showLockModal} onHide={() => setShowLockModal(false)} centered>
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>Xác nhận {lockAction ? 'mở khóa' : 'khóa'} tài khoản</Modal.Title>
                </Modal.Header>
                <Modal.Body className="fs-5">
                    Bạn có chắc chắn muốn {lockAction ? 'mở khóa' : 'khóa'} tài khoản của khách hàng{' '}
                    <strong>{selectedCustomer?.hoTen}</strong> (Tên người dùng:{' '}
                    {selectedCustomer?.username || 'N/A'}) không?
                    <br />
                    Trạng thái hiện tại:{' '}
                    <strong>
            <span
                className={`badge ${
                    selectedCustomer?.isActive ? 'bg-success' : 'bg-danger'
                }`}
            >
              {selectedCustomer?.isActive ? 'Hoạt động' : 'Đã khóa'}
            </span>
                    </strong>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowLockModal(false)}>
                        Hủy
                    </Button>
                    <Button variant="primary" onClick={toggleLockAccount} disabled={loading}>
                        {loading ? <Spinner animation="border" size="sm" /> : 'Xác nhận'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default QuanLyKhachHang;
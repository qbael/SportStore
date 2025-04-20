import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Tabs, Tab, ListGroup } from 'react-bootstrap';
import '../css/Login.css';
import { useNotification } from '../hook/useNotification2';
import { useAuth } from '../hook/useAuth';

interface PurchaseItem {
  id: number;
  soLuong: number;
  giaBan: number;
  bienThe: {
    tenBienThe: string;
    hinhAnh: string;
  };
}

interface Purchase {
  id: number;
  ngay: string;
  tongGiaBan: number;
  trangThai: string;
  dsCTHoaDon: PurchaseItem[];
}

const Login: React.FC = () => {
  const { showNotification } = useNotification();
  const { login, logout, user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('login');
  const [loginData, setLoginData] = useState<{ username: string; password: string }>({
    username: '',
    password: '',
  });
  const [registerData, setRegisterData] = useState<{
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
    hoTen: string;
    diaChi: string;
    sdt: string;
  }>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    hoTen: '',
    diaChi: '',
    sdt: '',
  });
  const [purchaseHistory, setPurchaseHistory] = useState<Purchase[]>([]);
  const [showHistory, setShowHistory] = useState<boolean>(false);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
      });
      const data = await response.json();
      if (response.ok && !data.error) {
        if (data.isActive === false) {
          showNotification('Tài khoản của bạn bị khóa', 'error');
          return;
        }
        login({ username: data.username, email: data.email, profiles: data.profile, is_active: data.isActive });
        setLoginData({ username: '', password: '' });
        showNotification('Đăng nhập thành công!', 'success');
      } else {
        showNotification(data.error || 'Đăng nhập thất bại', 'error');
      }
    } catch (err) {
      showNotification('Có lỗi xảy ra khi đăng nhập', 'error');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerData.password !== registerData.confirmPassword) {
      showNotification('Mật khẩu xác nhận không khớp!', 'error');
      return;
    }
    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: registerData.username,
          password: registerData.password,
          email: registerData.email,
          hoTen: registerData.hoTen,
          diaChi: registerData.diaChi,
          sdt: parseInt(registerData.sdt) || 0,
          is_active: true,
        }),
      });
      const data = await response.json();
      if (response.ok && !data.error) {
        login({ username: data.username, email: data.email, profiles: data.profile, is_active: data.isActive });
        setRegisterData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          hoTen: '',
          diaChi: '',
          sdt: '',
        });
        setActiveTab('login');
        showNotification('Đăng ký thành công!', 'success');
      } else {
        showNotification(data.error || 'Đăng ký thất bại', 'error');
      }
    } catch (err) {
      showNotification('Có lỗi xảy ra khi đăng ký', 'error');
    }
  };

  const handleLogout = () => {
    logout();
    setPurchaseHistory([]); // Xóa lịch sử mua hàng khi đăng xuất
    setShowHistory(false);
    showNotification('Đã đăng xuất', 'info');
  };

  const fetchPurchaseHistory = async () => {
    if (!user) {
      showNotification('Vui lòng đăng nhập để xem lịch sử mua hàng', 'error');
      return;
    }
    try {
      const response = await fetch('http://localhost:8080/api/hoadon', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Nếu API yêu cầu token, bỏ comment dòng sau và đảm bảo user.token tồn tại
          // 'Authorization': `Bearer ${user.token}`,
        },
      });
      const result = await response.json();
      if (response.ok && result.status === 200) {
        const filteredPurchases = result.data.filter(
          (purchase: any) => purchase.ttKhachHang.taiKhoan.username === user.username
        );
        setPurchaseHistory(filteredPurchases);
        setShowHistory(true);
        showNotification('Lấy lịch sử mua hàng thành công!', 'success');
      } else {
        showNotification(result.error || 'Không thể lấy lịch sử mua hàng', 'error');
      }
    } catch (err) {
      showNotification('Có lỗi xảy ra khi lấy lịch sử mua hàng', 'error');
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'DAGIAO':
        return 'Đã giao';
      case 'DANGGIAO':
        return 'Đang giao';
      case 'DANGXULY':
        return 'Đang xử lý';
      case 'DAHUY':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  if (isAuthenticated && user) {
    return (
      <Container className="mb-5"
                 style={{marginTop: '100px'}}
      >
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow-lg border-0">
              <Card.Body className="p-4">
                <Card.Title className="text-center mb-4 fs-4 fw-bold">Thông tin tài khoản</Card.Title>
                <div className="text-start mb-4">
                  <p className="mb-2"><strong>Tên người dùng:</strong> {user.username}</p>
                  <p className="mb-2"><strong>Email:</strong> {user.email}</p>
                  {user.profiles?.[0]?.hoTen && (
                    <p className="mb-2"><strong>Họ tên:</strong> {user.profiles[0].hoTen}</p>
                  )}
                </div>
                <div className="d-flex justify-content-center gap-3 mb-4">
                  <Button variant="primary" onClick={fetchPurchaseHistory}>
                    Lịch sử mua hàng
                  </Button>
                  <Button variant="outline-danger" onClick={handleLogout}>
                    Đăng xuất
                  </Button>
                </div>
                {showHistory && (
                  <div className="mt-4">
                    <h5 className="mb-3 fw-semibold">Lịch sử mua hàng</h5>
                    {purchaseHistory.length > 0 ? (
                      <ListGroup variant="flush">
                        {purchaseHistory.map((purchase) => (
                          <ListGroup.Item key={purchase.id} className="border rounded mb-2 p-3">
                            <p className="mb-1"><strong>Mã hóa đơn:</strong> {purchase.id}</p>
                            <p className="mb-1"><strong>Ngày:</strong> {new Date(purchase.ngay).toLocaleDateString('vi-VN')}</p>
                            <p className="mb-1"><strong>Tổng tiền:</strong> {purchase.tongGiaBan.toLocaleString('vi-VN')} VND</p>
                            <p className="mb-1"><strong>Trạng thái:</strong>
                              <span className={`badge ${purchase.trangThai === 'DAGIAO' ? 'bg-success' : purchase.trangThai === 'DAHUY' ? 'bg-danger' : 'bg-warning'}`}>
                                {getStatusText(purchase.trangThai)}
                              </span>
                            </p>
                            <p className="mb-2 mt-2"><strong>Chi tiết sản phẩm:</strong></p>
                            <ListGroup variant="flush">
                              {purchase.dsCTHoaDon.map((item) => (
                                <ListGroup.Item key={item.id} className="py-2">
                                  <p className="mb-1">{item.bienThe.tenBienThe}</p>
                                  <p className="mb-1">Số lượng: {item.soLuong}</p>
                                  <p className="mb-1">Giá: {item.giaBan.toLocaleString('vi-VN')} VND</p>
                                </ListGroup.Item>
                              ))}
                            </ListGroup>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    ) : (
                      <p className="text-muted">Chưa có lịch sử mua hàng.</p>
                    )}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="mb-5"
               style={{marginTop: '100px'}}
    >
      <Row className="justify-content-center">
        <Col md={8} lg={5}>
          <Card className="shadow-lg border-0">
            <Card.Body className="p-4">
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k || 'login')}
                className="mb-4"
                justify
                variant="pills"
              >
                <Tab eventKey="login" title="Đăng nhập">
                  <Form onSubmit={handleLoginSubmit}>
                    <Form.Group className="mb-3" controlId="loginUsername">
                      <Form.Label className="fw-medium">Tên người dùng</Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        value={loginData.username}
                        onChange={handleLoginChange}
                        placeholder="Nhập tên người dùng"
                        required
                        className="rounded-3"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="loginPassword">
                      <Form.Label className="fw-medium">Mật khẩu</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        placeholder="Nhập mật khẩu"
                        required
                        className="rounded-3"
                      />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100 rounded-3 py-2">
                      Đăng nhập
                    </Button>
                  </Form>
                </Tab>
                <Tab eventKey="register" title="Đăng ký">
                  <Form onSubmit={handleRegisterSubmit}>
                    <Form.Group className="mb-3" controlId="registerUsername">
                      <Form.Label className="fw-medium">Tên người dùng</Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        value={registerData.username}
                        onChange={handleRegisterChange}
                        placeholder="Nhập tên người dùng"
                        required
                        className="rounded-3"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="registerEmail">
                      <Form.Label className="fw-medium">Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        placeholder="Nhập email"
                        required
                        className="rounded-3"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="registerPassword">
                      <Form.Label className="fw-medium">Mật khẩu</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        placeholder="Nhập mật khẩu"
                        required
                        className="rounded-3"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="registerConfirmPassword">
                      <Form.Label className="fw-medium">Xác nhận mật khẩu</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={registerData.confirmPassword}
                        onChange={handleRegisterChange}
                        placeholder="Xác nhận mật khẩu"
                        required
                        className="rounded-3"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="registerHoTen">
                      <Form.Label className="fw-medium">Họ tên</Form.Label>
                      <Form.Control
                        type="text"
                        name="hoTen"
                        value={registerData.hoTen}
                        onChange={handleRegisterChange}
                        placeholder="Nhập họ tên"
                        required
                        className="rounded-3"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="registerDiaChi">
                      <Form.Label className="fw-medium">Địa chỉ</Form.Label>
                      <Form.Control
                        type="text"
                        name="diaChi"
                        value={registerData.diaChi}
                        onChange={handleRegisterChange}
                        placeholder="Nhập địa chỉ"
                        required
                        className="rounded-3"
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="registerSdt">
                      <Form.Label className="fw-medium">Số điện thoại</Form.Label>
                      <Form.Control
                        type="tel"
                        name="sdt"
                        value={registerData.sdt}
                        onChange={handleRegisterChange}
                        placeholder="Nhập số điện thoại"
                        required
                        className="rounded-3"
                      />
                    </Form.Group>
                    <Button variant="success" type="submit" className="w-100 rounded-3 py-2">
                      Đăng ký
                    </Button>
                  </Form>
                </Tab>
              </Tabs>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Tabs, Tab } from 'react-bootstrap';
import '../css/Login.css';
import { useNotification } from '../hook/useNotification2'; // Import hook
import { useAuth } from '../hook/useAuth'; // Thêm useAuth


const Login: React.FC = () => {
  const { showNotification } = useNotification(); // Sử dụng hook
  const { login, logout, user, isAuthenticated } = useAuth(); // Sử dụng AuthContext
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

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // Lấy name và value từ input
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target; // Lấy name và value từ input
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

      if (response.ok && !data.error) { // Kiểm tra nếu không có lỗi
        login({ username: data.username, email: data.email, profiles: data.profile }); // Gọi login từ AuthContext
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
        }),
      });

      const data = await response.json();

      if (response.ok && !data.error) {
        login({ username: data.username, email: data.email, profiles: data.profile }); // Gọi login từ AuthContext
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
    logout(); // Gọi logout từ AuthContext
    showNotification('Đã đăng xuất', 'info');
  };

  if (isAuthenticated && user) {
    return (
      <Container className="my-5">
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <Card className="shadow-sm">
              <Card.Body className="text-center">
                <Card.Title className="mb-4">Thông tin tài khoản</Card.Title>
                <p><strong>Tên người dùng:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.email}</p>
                {user.profiles?.[0]?.hoTen && <p><strong>Họ tên:</strong> {user.profiles[0].hoTen}</p>}
                <Button variant="danger" onClick={handleLogout}>
                  Đăng xuất
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <Row className="justify-content-center">
        <Col md={6} lg={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <Tabs
                activeKey={activeTab}
                onSelect={(k) => setActiveTab(k || 'login')}
                className="mb-3"
                justify
              >
                <Tab eventKey="login" title="Đăng nhập">
                  <Form onSubmit={handleLoginSubmit}>
                    <Form.Group className="mb-3" controlId="loginUsername">
                      <Form.Label>Tên người dùng</Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        value={loginData.username}
                        onChange={handleLoginChange}
                        placeholder="Nhập tên người dùng"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="loginPassword">
                      <Form.Label>Mật khẩu</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        placeholder="Nhập mật khẩu"
                        required
                      />
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100">
                      Đăng nhập
                    </Button>
                  </Form>
                </Tab>

                <Tab eventKey="register" title="Đăng ký">
                  <Form onSubmit={handleRegisterSubmit}>
                    <Form.Group className="mb-3" controlId="registerUsername">
                      <Form.Label>Tên người dùng</Form.Label>
                      <Form.Control
                        type="text"
                        name="username"
                        value={registerData.username}
                        onChange={handleRegisterChange}
                        placeholder="Nhập tên người dùng"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="registerEmail">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        placeholder="Nhập email"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="registerPassword">
                      <Form.Label>Mật khẩu</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        placeholder="Nhập mật khẩu"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="registerConfirmPassword">
                      <Form.Label>Xác nhận mật khẩu</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={registerData.confirmPassword}
                        onChange={handleRegisterChange}
                        placeholder="Xác nhận mật khẩu"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="registerHoTen">
                      <Form.Label>Họ tên</Form.Label>
                      <Form.Control
                        type="text"
                        name="hoTen"
                        value={registerData.hoTen}
                        onChange={handleRegisterChange}
                        placeholder="Nhập họ tên"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="registerDiaChi">
                      <Form.Label>Địa chỉ</Form.Label>
                      <Form.Control
                        type="text"
                        name="diaChi"
                        value={registerData.diaChi}
                        onChange={handleRegisterChange}
                        placeholder="Nhập địa chỉ"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="registerSdt">
                      <Form.Label>Số điện thoại</Form.Label>
                      <Form.Control
                        type="number"
                        name="sdt"
                        value={registerData.sdt}
                        onChange={handleRegisterChange}
                        placeholder="Nhập số điện thoại"
                        required
                      />
                    </Form.Group>

                    <Button variant="success" type="submit" className="w-100">
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
import AdminLogin from "./AdminLogin.tsx";
import {useAdminAuth} from "../../hook/useAdminAuth.tsx";
import {useEffect, useState} from "react";
import {Container, Row, Col} from "react-bootstrap";
import QuanLySanPham from "./QuanLySanPham.tsx";
import QuanLyHoaDon from "./QuanLyHoaDon.tsx";
import QuanLyNhapHang from "./QuanLyNhapHang.tsx";
import {getIconFromChucNang, HanhDong, mapToTenChucVu} from "../../util/Enum.tsx";
import logo from '../../assets/img/logo.jpg';

const Admin = () => {
    const {taiKhoanNV, logout} = useAdminAuth();
    const [listChucNang, setListChucNang] = useState<{id: number; tenChucNang: string}[]>([]);
    const [showSideNav, setShowSideNav] = useState(true)
    const [selectedChucNang, setSelectedChucNang] = useState<number>();
    const [dsHanhDong, setDsHanhDong] = useState<HanhDong[]>([]);

    useEffect(() => {
        if (taiKhoanNV) {
            const listChucNangMap = Array.from(
                new Map(taiKhoanNV.chucVu.quyenList.map((item) => [item.chucNang.id, item.chucNang])).values()
            );
            setListChucNang(listChucNangMap);
            setSelectedChucNang(listChucNangMap[0]?.id);
        }
    }, [taiKhoanNV]);

    useEffect(() => {
        if (selectedChucNang){
            const dsHanhDongTemp = taiKhoanNV?.chucVu.quyenList.filter((item) => item.chucNang.id === selectedChucNang);
            console.log(dsHanhDongTemp);
        }
    }, [selectedChucNang]);

    const renderContent = () => {
        switch (selectedChucNang) {
            default:
                return null;
        }
    };

    return (
        <>
            {taiKhoanNV ? (
                <Container fluid>
                    <Row>
                        <Col className='admin-header'>
                            <div>
                                <img src={logo} alt='Logo'/>
                            </div>
                            <div className='toggleBar' onClick={() => {
                                setShowSideNav(!showSideNav)
                            }}>
                                <i className="fa-solid fa-bars"></i>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col style={{ width: '15%' }} className={`sidenav p-0 ${showSideNav ? 'show' : 'hide'}`}>
                            <div className={"w-100 account-info p-2 badge bg-primary text-wrap"}>
                                <div className="text-center">
                                    <h5 className={"m-0 mb-2"}>{taiKhoanNV.hoTen}</h5>
                                    <h5 className={"text-info m-0 mb-2"}>{mapToTenChucVu(taiKhoanNV.chucVu.tenChucVu)}</h5>
                                    <p className={"m-0 mb-2"}>Email: {taiKhoanNV.email}</p>
                                </div>
                            </div>
                            {listChucNang.length > 0 && (
                                <ul className="nav flex-column">
                                    {listChucNang.map((item) => (
                                        <li key={item.id}
                                            className={`nav-item ${selectedChucNang === item.id ? 'active' : ''}`}
                                            onClick={() => setSelectedChucNang(item.id)}
                                        >
                                            <div>
                                                <i className={getIconFromChucNang(item.tenChucNang)}></i> {item.tenChucNang}
                                            </div>
                                        </li>
                                    ))}
                                    <li key={'logout'}>
                                        <div onClick={logout}>
                                            <i className="fa-solid fa-right-from-bracket"></i> Đăng xuất
                                        </div>
                                    </li>
                                </ul>
                            )}
                        </Col>
                        <Col style={{ width: '85%' }} className="content bg-primary">

                        </Col>
                    </Row>
                </Container>
            ) : (
                <AdminLogin/>
            )}
        </>
    );
};

export default Admin;
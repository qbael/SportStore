import AdminLogin from "./AdminLogin.tsx";
import {useEffect, useState} from "react";
import {Container, Row, Col} from "react-bootstrap";
import {getIconFromChucNang, mapToHanhDong, mapToTenChucVu, TenChucNang} from "../../util/Enum.tsx";
import logo from '../../assets/img/logo.jpg';
import QuanLySanPham from "./QuanLySanPham.tsx";
import {useAdminContext} from "../../hook/useAdminContext.tsx";
import {useAdminAuth} from "../../hook/useAdminAuth.tsx";
import QuanLyHoaDon from "./QuanLyHoaDon.tsx";
import QuanLyKhachHang from "./QuanLyKhachHang.tsx";
import QuanLyTaiKhoan from "./QuanLyTaiKhoan.tsx";
import QuanLyQuyenHan from "./QuanLyQuyenHan.tsx";
import QuanLyThongKe from "./QuanLyThongKe.tsx";

const Admin = () => {
    const {taiKhoanNV, logout} = useAdminAuth();
    const {selectedChucNang, setSelectedChucNang, dsHanhDong, setDsHanhDong} = useAdminContext()
    const [listChucNang, setListChucNang] = useState<{id: number; tenChucNang: string}[]>([]);
    const [showSideNav, setShowSideNav] = useState(true)

    useEffect(() => {
        if (taiKhoanNV) {
            const listChucNangMap = Array.from(
                new Map(taiKhoanNV.chucVu.quyenList.map((item) => [item.chucNang.id, item.chucNang])).values()
            );
            setSelectedChucNang(listChucNangMap[0].tenChucNang)
            setListChucNang(listChucNangMap);
            const dsHanhDongTemp = taiKhoanNV?.chucVu.quyenList
                .filter((item) => item.chucNang.tenChucNang === selectedChucNang)
                .map((item) => mapToHanhDong(item.hanhDong));
            setDsHanhDong(dsHanhDongTemp)
        }
    }, [taiKhoanNV]);

    useEffect(() => {
        if (selectedChucNang){
            const dsHanhDongTemp = taiKhoanNV?.chucVu.quyenList
                .filter((item) => item.chucNang.tenChucNang === selectedChucNang)
                .map((item) => mapToHanhDong(item.hanhDong));
            setDsHanhDong(dsHanhDongTemp)
        }
    }, [selectedChucNang]);

    const content = () => {
        if (!selectedChucNang || !dsHanhDong || dsHanhDong.length === 0) return null;
        switch (selectedChucNang) {
            case TenChucNang.QUAN_LY_SAN_PHAM:
                return <QuanLySanPham />;
            case TenChucNang.QUAN_LY_HOA_DON:
                return <QuanLyHoaDon />;
            case TenChucNang.QUAN_LY_KHACH_HANG:
                return <QuanLyKhachHang/>;
            case TenChucNang.QUAN_LY_TAI_KHOAN:
                return <QuanLyTaiKhoan/>;
            case TenChucNang.QUAN_LY_QUYEN_HAN:
                return <QuanLyQuyenHan/>
            case TenChucNang.QUAN_LY_THONG_KE:
                return <QuanLyThongKe/>;
            default:
                return null;
        }
    }

    return (
        <>
            {taiKhoanNV ? (
                <Container fluid
                           style={{background: 'dark'}}>
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
                    <Row className={'p-1'}>
                        <Col style={{ width: '15%' }} className={`sidenav p-0 rounded-3 ${showSideNav ? 'show' : 'hide'}`}>
                            <div className={"w-100 account-info rounded-3 p-2 badge bg-success text-wrap"}>
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
                                            className={`nav-item ${selectedChucNang === item.tenChucNang ? 'active' : ''}`}
                                            onClick={() => setSelectedChucNang(item.tenChucNang)}
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
                        <Col style={{ width: '85%' }} className="content p-1">
                            {content()}
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
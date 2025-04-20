import {Container, Row, Table} from "react-bootstrap";
import {useEffect, useState} from "react";
import {useAdminContext} from "../../hook/useAdminContext.tsx";
import {HanhDong} from "../../util/Enum.tsx";
import {BASE_URL} from "../../util/Constant.tsx";
import {NhanVienTheoChucVu} from "../../util/types/PhanQuyenTypes.tsx";
import ModalPhanQuyen from "../../components/modal_box/ModalPhanQuyen.tsx";

const QuanLyQuyenHan = () => {
    const [dsChucVu, setDsChucVu] = useState<NhanVienTheoChucVu>();
    const { dsHanhDong } = useAdminContext();
    const [showModal, setShowModal] = useState(false);
    const [selectedRole, setSelectedRole] = useState<{id: number; tenChucVu: string}>({
        id: 0,
        tenChucVu: "",
    });


    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        const fectDsNhanVien = async () => {
            try {
                const response = await fetch(`${BASE_URL}/nhanvien/chucvu`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    signal: signal,
                });
                const data: NhanVienTheoChucVu = await response.json();
                setDsChucVu(data);
            } catch (error: any) {
                if (error.name === "AbortError") {
                    console.log("Request aborted");
                } else {
                    console.error("Error fetching data:", error);
                }
            }
        };
        fectDsNhanVien();
        return () => controller.abort();
    }, []);

    const hasPermission = (action: HanhDong) => {
        return dsHanhDong?.includes(action);
    }

    const handleChucVuClick = async (chucVuTen: string, chucVuId: number) => {
        setSelectedRole({ id: chucVuId, tenChucVu: chucVuTen });
        setShowModal(true);
    };

    return (
        <Container fluid className={"w-100 h-100 rounded-3"}
                   style={{background: "linear-gradient(to right, rgb(246, 247, 244), rgb(237, 243, 230), rgb(234, 245, 234), rgb(227, 245, 227))"}}
        >
            <Row>
                <Table striped bordered hover className={"text-center"}
                       style={{verticalAlign: 'middle'}}
                >
                    <thead>
                        <tr>
                            <th>Chức vụ</th>
                            <th>Số tài khoản</th>
                        </tr>
                    </thead>
                    <tbody>
                    {Object.entries(dsChucVu ?? {}).map(([chucVu, dsNhanVien]) => (
                            <tr key={chucVu}
                                style={{ cursor: "pointer" }}
                                onClick={() => handleChucVuClick(chucVu, dsNhanVien[0].chucVu.id)}
                            >
                                <td>
                                    {chucVu}
                                </td>
                                <td>
                                    {dsNhanVien.length}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Row>
            {hasPermission(HanhDong.XEM) && (<ModalPhanQuyen
                show={showModal}
                onClose={() => setShowModal(false)}
                chucVuId={selectedRole.id ?? 0}
                chucVuTen={selectedRole.tenChucVu}
                hasPermission={hasPermission}
            />)}
        </Container>
    )
}
export default QuanLyQuyenHan;
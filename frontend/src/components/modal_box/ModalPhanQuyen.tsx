import {useEffect, useState} from "react";
import {BASE_URL} from "../../util/Constant.tsx";
import {HanhDong} from "../../util/Enum.tsx";
import {Form, Modal, Table} from "react-bootstrap";
import {ChucNang, Quyen} from "../../util/types/PhanQuyenTypes.tsx";
import {useNotification} from "../../hook/useNotification2.tsx";

const ModalPhanQuyen = ({
                            show,
                            onClose,
                            chucVuId,
                            chucVuTen,
                            hasPermission,
                        }: {
    show: boolean;
    onClose: () => void;
    chucVuId: number;
    chucVuTen: string;
    hasPermission: (action: HanhDong) => boolean | undefined;
}) => {
    const [dsChucNang, setDsChucNang] = useState<ChucNang[]>([]);
    const [quyenList, setQuyenList] = useState<Quyen>({});
    const {showNotification} = useNotification();
    const [trigger, setTrigger] = useState<boolean>(false);

    useEffect(() => {
        if (!chucVuId) return;
        const controller = new AbortController();
        const signal = controller.signal;

        const fetchData = async () => {
            try {
                const [res1, res2] = await Promise.all([
                    fetch(`${BASE_URL}/quyen/chucvu/${chucVuId}`, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                        signal
                    }),
                    fetch(`${BASE_URL}/quyen/chucnang`, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                        signal
                    })
                ]);

                if (!res1.ok || !res2.ok) throw new Error("Error fetching data");

                const [data1, data2] = await Promise.all([res1.json(), res2.json()]);
                setQuyenList(data1);
                setDsChucNang(data2);
            } catch (error: any) {
                if (error.name !== "AbortError") {
                    console.error("Error fetching data:", error);
                }
            }
        };

        fetchData();
        return () => controller.abort();
    }, [chucVuId, trigger]);

    const isChecked = (tenChucNang: string, hanhDong: string): boolean => {
        return quyenList[tenChucNang]?.includes(hanhDong as HanhDong) ?? false;
    };

    const handleToggle = async (checked: boolean, chucNangId: number, hanhDong: string) => {
        if (checked) {
            try {
                const response = await fetch(`${BASE_URL}/quyen`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chucVuId: chucVuId,
                        chucNangId: chucNangId,
                        hanhDong: hanhDong,
                    })
                })
                const message = await response.text();
                if (!response.ok){
                    throw new Error(message);
                }
                showNotification(message, "success");
            } catch (error: any) {
                throw new Error(error.message);
            } finally {
                setTrigger(!trigger);
            }
        } else {
            try {
                const response = await fetch(`${BASE_URL}/quyen`, {
                    method: "DELETE",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        chucVuId: chucVuId,
                        chucNangId: chucNangId,
                        hanhDong: hanhDong,
                    })
                })
                const message = await response.text();
                if (!response.ok){
                    throw new Error(message);
                }
                showNotification(message, "success");
            } catch (error: any) {
                throw new Error(error.message);
            } finally {
                setTrigger(!trigger);
            }
        }
    };

    return (
        <Modal show={show} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Phân quyền - {chucVuTen}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table bordered striped className="text-center">
                    <thead>
                    <tr>
                        <th>Chức năng</th>
                        {Object.values(HanhDong).map(hd => (
                            <th key={hd}>{hd}</th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {dsChucNang.map(cn => (
                        <tr key={cn.id}>
                            <td>{cn.tenChucNang}</td>
                            {Object.values(HanhDong).map(hd => (
                                <td key={hd}>
                                    <Form.Check
                                        type="checkbox"
                                        checked={isChecked(cn.tenChucNang, hd)}
                                        disabled={!hasPermission(HanhDong.SUA)}
                                        onChange={(e) => handleToggle(e.target.checked, cn.id, hd)}
                                    />
                                </td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Modal.Body>
        </Modal>
    );
};

export default ModalPhanQuyen;

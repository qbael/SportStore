import {Button, Image, Modal, Table} from 'react-bootstrap';
import {BienTheType, MauType, ProductType, SizeType} from '../../util/types/ProductTypes';
import {PRODUCT_API_URL, PRODUCT_IMAGE_BASE_PATH} from '../../util/Constant';
import {formatPrice} from "../../util/Helper.ts";
import {HanhDong} from "../../util/Enum.tsx";
import {useEffect, useState} from "react";
import ModalThemBienThe from "./ModalThemBienThe.tsx";
import {useNotification} from '../../hook/useNotification2.tsx';
import ModalSuaBienThe from "./ModalSuaBienThe.tsx";

type Props = {
    show: boolean;
    handleClose: () => void;
    sanPham: ProductType | null;
    dsBienThe: BienTheType[];
    hasPermission: (action: HanhDong) => boolean | undefined;
};

const ModalChiTietSanPham = ({
                                 show,
                                 handleClose,
                                 sanPham,
                                 dsBienThe,
                                 hasPermission,
                             }: Props) => {

    const [showModalSua, setShowModalSua] = useState(false);
    const [showModalThem, setShowModalThem] = useState(false);
    const [dsSize, setDsSize] = useState<SizeType[]>([]);
    const [dsMau, setDsMau] = useState<MauType[]>([]);
    const [bienTheDangSua, setBienTheDangSua] = useState<BienTheType | null>(null);
    const {showNotification} = useNotification();

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        const fetchSizeAndMau = async () => {
            try {
                const respone = await fetch(`${PRODUCT_API_URL}/mausize`, { signal });
                if (!respone.ok) {
                    const data = await respone.text();
                    throw new Error(`Error fetching size and mau data: ${data}`);
                }
                const data = await respone.json();
                setDsSize(data.dsSize);
                setDsMau(data.dsMau);
            } catch (error: any) {
                if (error.name === "AbortError") {
                    console.log("Fetch aborted");
                } else {
                    console.error("Error fetching size and mau data:", error);
                }
            }
        };
        fetchSizeAndMau();
        return () => {
            controller.abort(); // Cleanup function to abort the fetch request
        };
    }, [showModalThem]);

    if (!sanPham) return null;

    const handleAddBienThe = async (formData: FormData) => {
        if (!sanPham) return;

        for (const [key, value] of formData.entries()) {
            console.log(key, value);
        }

        try {
            const response = await fetch(`${PRODUCT_API_URL}/${sanPham.id}`, {
                method: "POST",
                body: formData,
            });
            if (!response.ok) {
                const data = await response.text();
                showNotification(data, "error");
                throw new Error(`${data}`);
            }
            const data = await response.json();
            showNotification(data.message + " " + data.id, "success");
            setShowModalThem(false);
            handleClose();
        } catch (error: any) {
            console.error("Error adding bien the:", error);
        }
    };

    const handleUpdateBienThe = async (formData: FormData) => {
        try {
            const response = await fetch(`${PRODUCT_API_URL}/bienthe/${formData.get("id")}`, {
                method: "PUT",
                body: formData,
            });

            if (!response.ok) {
                const data = await response.text();
                showNotification(data, "error");
                throw new Error(`${data}`);
            }
            const data = await response.json();
            showNotification(data.message, "success");
            setShowModalSua(false);
            handleClose();
        } catch (error: any) {
            console.error("Lỗi cập nhật biến thể:", error);
            showNotification(error.message, "error");
        }
    };

    const handleDeleteBienThe = async (id: number) => {
        try {
            const response = await fetch(`${PRODUCT_API_URL}/bienthe/${id}`, {
                method: "DELETE",
            });
            if (!response.ok) {
                const data = await response.text();
                showNotification(data, "error");
                throw new Error(`${data}`);
            }
            const data = await response.json();
            showNotification(data.message, "success");
            handleClose();
        } catch (error: any) {
            console.error("Error deleting bien the:", error);
        }
    };


    return (
        <>
            <Modal show={show} onHide={handleClose} size="lg" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Chi tiết sản phẩm: {sanPham.tenSanPham}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p><strong>Mô tả:</strong> {sanPham.moTa}</p>
                    <p><strong>Giá bán:</strong> {formatPrice(sanPham.giaBan || 0)}</p>
                    <p><strong>Giá nhập:</strong> {formatPrice(sanPham.giaNhap || 0)}</p>
                    <p><strong>Trạng thái:</strong> {sanPham.trangThai ? "Đang kinh doanh" : "Ngừng kinh doanh"}</p>

                    <h5 className="mt-3">Danh sách biến thể</h5>
                    <Table bordered hover responsive className="text-center mt-2">
                        <thead>
                        <tr>
                            <th>Mã</th>
                            <th>Hình ảnh</th>
                            <th>Tên biến thể</th>
                            <th>Màu</th>
                            <th>Size</th>
                            <th>Số lượng tồn</th>
                            {(hasPermission(HanhDong.SUA) || hasPermission(HanhDong.XOA)) && <th colSpan={2}>Thao tác</th>}
                        </tr>
                        </thead>
                        <tbody>
                        {dsBienThe.map((bienThe, index) => (
                            <tr key={index}>
                                <td>{bienThe.id}</td>
                                <td>
                                    <Image
                                        src={`${PRODUCT_IMAGE_BASE_PATH}${bienThe.hinhAnh}`}
                                        alt="ảnh biến thể"
                                        width={50}
                                        height={50}
                                        rounded
                                    />
                                </td>
                                <td>{bienThe.tenBienThe}</td>
                                <td>{bienThe.mau?.tenMau}</td>
                                <td>{bienThe.size?.size}</td>
                                <td>{bienThe.soLuongTon}</td>
                                {hasPermission(HanhDong.SUA) && (
                                    <td>
                                        <Button
                                            variant="warning"
                                            size="sm"
                                            onClick={() => {
                                                setBienTheDangSua(bienThe);
                                                setShowModalSua(true);
                                            }}
                                        >
                                            Sửa
                                        </Button>
                                    </td>
                                )}
                                {hasPermission(HanhDong.XOA) && (
                                    <td>
                                        <Button variant="danger" size="sm"
                                                onClick={() => {
                                                    if (window.confirm("Bạn có chắc chắn muốn xóa biến thể này?")) {
                                                        handleDeleteBienThe(bienThe.id);
                                                    }
                                                }}
                                        >
                                            Xóa
                                        </Button>
                                    </td>
                                )}
                            </tr>
                        ))}
                        </tbody>
                    </Table>

                    {hasPermission(HanhDong.THEM) && (
                        <div className="text-end">
                            <Button variant="success" onClick={() => setShowModalThem(true)}>
                                + Thêm biến thể
                            </Button>
                        </div>
                    )}
                </Modal.Body>
            </Modal>

            <ModalThemBienThe
                show={showModalThem}
                handleClose={() => setShowModalThem(false)}
                handleAdd={handleAddBienThe}
                dsSize={dsSize}
                dsMau={dsMau}
                sanPham={sanPham}
            />

            {bienTheDangSua && (
                <ModalSuaBienThe
                    show={showModalSua}
                    handleClose={() => {
                        setBienTheDangSua(null)
                        setShowModalSua(false)
                    }}
                    bienThe={bienTheDangSua}
                    dsSize={dsSize}
                    dsMau={dsMau}
                    sanPham={sanPham}
                    handleUpdate={handleUpdateBienThe}
                />
            )}

        </>
    );
};

export default ModalChiTietSanPham;

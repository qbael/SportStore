import {Button, Image, Modal, Table} from 'react-bootstrap';
import {BienTheType, ProductType} from '../../util/types/ProductTypes';
import {PRODUCT_IMAGE_BASE_PATH} from '../../util/Constant';
import {formatPrice} from "../../util/Helper.ts";
import {HanhDong} from "../../util/Enum.tsx";

type Props = {
    show: boolean;
    handleClose: () => void;
    sanPham: ProductType | null;
    dsBienThe: BienTheType[];
    hasPermission: (action: HanhDong) => boolean | undefined;
    onAddBienThe: () => void;
    onEditBienThe: (bienThe: BienTheType) => void;
    onDeleteBienThe: (bienThe: BienTheType) => void;
};

const ModalChiTietSanPham = ({
                                 show,
                                 handleClose,
                                 sanPham,
                                 dsBienThe,
                                 hasPermission,
                                 onAddBienThe,
                                 onEditBienThe,
                                 onDeleteBienThe,
                             }: Props) => {
    if (!sanPham) return null;

    return (
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
                                        onClick={() => onEditBienThe(bienThe)}
                                    >
                                        Sửa
                                    </Button>
                                </td>
                            )}
                            {hasPermission(HanhDong.XOA) && (
                                <td>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => onDeleteBienThe(bienThe)}
                                    >
                                        Xóa
                                    </Button>
                                </td>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </Table>
                {hasPermission(HanhDong.THEM) && (<div className="text-end">
                    <Button variant="success" onClick={onAddBienThe}>+ Thêm biến thể</Button>
                </div>)}
            </Modal.Body>
        </Modal>
    );
};

export default ModalChiTietSanPham;

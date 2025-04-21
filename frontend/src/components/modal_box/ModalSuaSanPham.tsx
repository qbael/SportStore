import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import {ProductType, DanhMucType, thuongHieuType, BoMonType} from "../../util/types/ProductTypes";
import {useNotification} from "../../hook/useNotification2";
import {PRODUCT_IMAGE_BASE_PATH} from "../../util/Constant.tsx";

type Props = {
    show: boolean;
    handleClose: () => void;
    handleUpdate: (formData: FormData) => void;
    sanPham: ProductType | null;
    dsDanhMuc: DanhMucType[] | undefined;
    dsThuongHieu: thuongHieuType[] | undefined;
    dsBoMon: BoMonType[] | undefined;
};

const ModalSuaSanPham = ({
                             show,
                             handleClose,
                             handleUpdate,
                             sanPham,
                             dsDanhMuc,
                             dsThuongHieu,
                             dsBoMon,
                         }: Props) => {
    const [form, setForm] = useState({
        id: 0,
        tenSanPham: "",
        giaNhap: 0,
        giaBan: 0,
        moTa: "",
        trangThai: true,
        danhMucId: "",
        thuongHieuId: "",
        boMonId: "",
        hinhAnh: null as File | null,
        nhaCungCap: ""
    });
    const {showNotification} = useNotification();
    const [previewImage, setPreviewImage] = useState<string>("");

    useEffect(() => {
        if (sanPham) {
            setForm({
                id: sanPham.id,
                tenSanPham: sanPham.tenSanPham,
                giaNhap: sanPham.giaNhap || 0,
                giaBan: sanPham.giaBan || 0,
                moTa: sanPham.moTa || "",
                trangThai: sanPham.trangThai,
                danhMucId: sanPham.danhMuc.id.toString(),
                thuongHieuId: sanPham.thuongHieu.id.toString(),
                boMonId: sanPham.boMon.id.toString(),
                hinhAnh: null,
                nhaCungCap: sanPham.nhaCungCap.tenNCC
            });
            const imageUrl = `${PRODUCT_IMAGE_BASE_PATH}${sanPham.hinhAnh}`;
            setPreviewImage(imageUrl);

            fetch(imageUrl)
                .then(response => response.blob())
                .then(blob => {
                    const file = new File([blob], sanPham.hinhAnh, { type: blob.type });
                    setForm(prev => ({ ...prev, hinhAnh: file }));
                })
                .catch(error => {
                    console.error("Không thể tạo file từ hình ảnh:", error);
                });
        }
    }, [sanPham]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
        setForm(prev => ({ ...prev, [name]: val }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreviewImage(objectUrl);
            setForm(prev => ({ ...prev, hinhAnh: file }));
        }
    };

    const handleSubmit = () => {
        if (!sanPham) return;
        if(!form.tenSanPham || !form.giaNhap || !form.giaBan || !form.moTa || !form.thuongHieuId || !form.danhMucId || !form.boMonId) {
            showNotification("Vui lòng điền đầy đủ thông tin sản phẩm.", "error");
            return;
        }

        if (form.giaNhap < 0 || form.giaBan < 0) {
            showNotification("Giá nhập và giá bán phải lớn hơn hoặc bằng 0.", "error");
            return;
        }

        const formData = new FormData();
        formData.append("id", sanPham.id.toString());
        formData.append("tenSanPham", form.tenSanPham);
        formData.append("giaNhap", form.giaNhap.toString());
        formData.append("giaBan", form.giaBan.toString());
        formData.append("moTa", form.moTa);
        formData.append("trangThai", form.trangThai.toString());
        formData.append("danhMucId", form.danhMucId);
        formData.append("thuongHieuId", form.thuongHieuId);
        formData.append("boMonId", form.boMonId);
        if (form.hinhAnh) {
            formData.append("hinhAnh", form.hinhAnh);
        } else {
            formData.append("hinhAnh", sanPham.hinhAnh);
        }

        handleUpdate(formData);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Sửa Sản Phẩm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-2">
                        <Form.Label>ID</Form.Label>
                        <Form.Control
                            type="text"
                            name="id"
                            disabled={true}
                            value={form.id}
                            readOnly
                        />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Tên sản phẩm</Form.Label>
                        <Form.Control
                            type="text"
                            name="tenSanPham"
                            value={form.tenSanPham}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Giá nhập</Form.Label>
                        <Form.Control
                            onFocus={(e) => e.target.select()}
                            type="number"
                            name="giaNhap"
                            value={form.giaNhap}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Giá bán</Form.Label>
                        <Form.Control
                            onFocus={(e) => e.target.select()}
                            type="number"
                            name="giaBan"
                            value={form.giaBan}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Mô tả</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="moTa"
                            value={form.moTa}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Trạng thái</Form.Label>
                        <Form.Check
                            type="switch"
                            name="trangThai"
                            label={form.trangThai ? "Đang kinh doanh" : "Dừng kinh doanh"}
                            checked={form.trangThai}
                            onChange={handleChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Danh mục</Form.Label>
                        <Form.Select
                            name="danhMucId"
                            value={form.danhMucId}
                            onChange={handleChange}
                        >
                            {dsDanhMuc?.map(d => (
                                <option key={d.id} value={d.id}>{d.loai}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Thương hiệu</Form.Label>
                        <Form.Select
                            name="thuongHieuId"
                            value={form.thuongHieuId}
                            onChange={handleChange}
                        >
                            {dsThuongHieu?.map(t => (
                                <option key={t.id} value={t.id}>{t.tenThuongHieu}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Bộ môn</Form.Label>
                        <Form.Select
                            name="boMonId"
                            value={form.boMonId}
                            onChange={handleChange}
                        >
                            {dsBoMon?.map(b => (
                                <option key={b.id} value={b.id}>{b.tenBoMon}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Nhà cung cấp</Form.Label>
                        <Form.Control
                            type="text"
                            name="id"
                            disabled={true}
                            value={form.nhaCungCap}
                            readOnly
                        />
                    </Form.Group>
                    <Form.Group className="mb-2">
                        <Form.Label>Hình ảnh</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {previewImage && (
                            <div className="mt-2 text-center">
                                <img
                                    src={previewImage}
                                    alt="Preview"
                                    style={{ maxWidth: "100%", maxHeight: "200px", borderRadius: "8px" }}
                                />
                            </div>
                        )}
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Hủy</Button>
                <Button variant="primary" onClick={handleSubmit}>Lưu thay đổi</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalSuaSanPham;

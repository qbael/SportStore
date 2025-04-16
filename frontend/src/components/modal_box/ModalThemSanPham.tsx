import { useState } from "react";
import {
    Modal, Button, Form, Row, Col
} from "react-bootstrap";

import {boMonType, danhMucType, thuongHieuType} from "../../util/types/ProductTypes.tsx";
import {useNotification} from "../../hook/useNotification2.tsx";

type Props = {
    show: boolean;
    handleClose: () => void;
    handleSave: (product: FormData) => void;
    dsThuongHieu: thuongHieuType[] | undefined;
    dsDanhMuc: danhMucType[] | undefined;
    dsBoMon: boMonType[] | undefined;
};

const ModalThemSanPham = ({
                              show,
                              handleClose,
                              handleSave,
                              dsThuongHieu,
                              dsDanhMuc,
                              dsBoMon
                          }: Props) => {
    const [tenSanPham, setTenSanPham] = useState("");
    const [giaNhap, setGiaNhap] = useState<number>(0);
    const [giaBan, setGiaBan] = useState<number>(0);
    const [moTa, setMoTa] = useState("");
    const [hinhAnh, setHinhAnh] = useState<File | null>(null);
    const [thuongHieuId, setThuongHieuId] = useState("");
    const [danhMucId, setDanhMucId] = useState("");
    const [boMonId, setBoMonId] = useState("");
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const {showNotification} = useNotification()

    const handleSubmit = () => {
        if(!tenSanPham || !giaNhap || !giaBan || !moTa || !thuongHieuId || !danhMucId || !boMonId || !hinhAnh) {
            showNotification("Vui lòng điền đầy đủ thông tin sản phẩm.", "error");
            return;
        }

        if (giaNhap < 0 || giaBan < 0) {
            showNotification("Giá nhập và giá bán phải lớn hơn hoặc bằng 0.", "error");
            return;
        }

        const formData = new FormData();
        formData.append("tenSanPham", tenSanPham);
        formData.append("giaNhap", giaNhap.toString());
        formData.append("giaBan", giaBan.toString());
        formData.append("moTa", moTa);
        if (hinhAnh) {
            formData.append("hinhAnh", hinhAnh);
        }
        formData.append("thuongHieuId", thuongHieuId);
        formData.append("danhMucId", danhMucId);
        formData.append("boMonId", boMonId);

        handleSave(formData);
        handleClose();
        resetForm();
    };

    const resetForm = () => {
        setTenSanPham("");
        setGiaNhap(0);
        setGiaBan(0);
        setMoTa("");
        setHinhAnh(null);
        setThuongHieuId("");
        setDanhMucId("");
        setBoMonId("");
        setPreviewImage(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreviewImage(imageUrl);
            setHinhAnh(file);
        } else {
            setPreviewImage(null);
            setHinhAnh(null);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Thêm sản phẩm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="tenSanPham" className="mb-3">
                        <Form.Label>Tên sản phẩm</Form.Label>
                        <Form.Control
                            type="text"
                            value={tenSanPham}
                            onChange={(e) => setTenSanPham(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="hinhAnh" className="mb-3">
                        <Form.Label>Hình ảnh</Form.Label>
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
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

                    <Row>
                        <Col>
                            <Form.Group controlId="giaNhap" className="mb-3">
                                <Form.Label>Giá nhập</Form.Label>
                                <Form.Control
                                    onFocus={(e) => e.target.select()}
                                    type="number"
                                    value={giaNhap}
                                    onChange={(e) => setGiaNhap(parseInt(e.target.value))}
                                />
                            </Form.Group>
                        </Col>
                        <Col>
                            <Form.Group controlId="giaBan" className="mb-3">
                                <Form.Label>Giá bán</Form.Label>
                                <Form.Control
                                    onFocus={(e) => e.target.select()}
                                    type="number"
                                    value={giaBan}
                                    onChange={(e) => setGiaBan(parseInt(e.target.value))}
                                />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Form.Group controlId="moTa" className="mb-3">
                        <Form.Label>Mô tả</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={moTa}
                            onChange={(e) => setMoTa(e.target.value)}
                        />
                    </Form.Group>

                    <Form.Group controlId="thuongHieu" className="mb-3">
                        <Form.Label>Thương hiệu</Form.Label>
                        <Form.Select
                            value={thuongHieuId}
                            onChange={(e) => setThuongHieuId(e.target.value)}
                        >
                            <option value="">Chọn thương hiệu</option>
                            {dsThuongHieu?.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.tenThuongHieu}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group controlId="danhMuc" className="mb-3">
                        <Form.Label>Danh mục</Form.Label>
                        <Form.Select
                            value={danhMucId}
                            onChange={(e) => setDanhMucId(e.target.value)}
                        >
                            <option value="">Chọn danh mục</option>
                            {dsDanhMuc?.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.loai}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group controlId="boMon" className="mb-3">
                        <Form.Label>Bộ môn</Form.Label>
                        <Form.Select
                            value={boMonId}
                            onChange={(e) => setBoMonId(e.target.value)}
                        >
                            <option value="">Chọn bộ môn</option>
                            {dsBoMon?.map((item) => (
                                <option key={item.id} value={item.id}>
                                    {item.tenBoMon}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Hủy
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Lưu sản phẩm
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalThemSanPham;

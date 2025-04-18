import React, {useEffect, useState} from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { BienTheType, MauType, ProductType, SizeType } from "../../util/types/ProductTypes";
import {PRODUCT_IMAGE_BASE_PATH} from "../../util/Constant.tsx";
import { useNotification } from '../../hook/useNotification2.tsx';

type Props = {
    show: boolean;
    handleClose: () => void;
    bienThe: BienTheType;
    dsSize: SizeType[];
    dsMau: MauType[];
    sanPham: ProductType;
    handleUpdate: (formData: FormData) => void;
};

const ModalSuaBienThe = ({ show, handleClose, bienThe, dsSize, dsMau, sanPham, handleUpdate }: Props) => {
    if (!bienThe) return;
    const [id, setId] = useState(bienThe.id);
    const [tenBienThe, setTenBienThe] = useState(bienThe.tenBienThe);
    const [soLuongTon, setSoLuongTon] = useState(bienThe.soLuongTon);
    const [mauId, setMauId] = useState(bienThe.mau?.id || 0);
    const [sizeId, setSizeId] = useState(bienThe.size?.id || 0);
    const [hinhAnh, setHinhAnh] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string>("");
    const {showNotification} = useNotification();

    useEffect(() => {
        const imageUrl = `${PRODUCT_IMAGE_BASE_PATH}${bienThe.hinhAnh}`;
        setPreviewImage(imageUrl);

        fetch(imageUrl)
            .then(response => response.blob())
            .then(blob => {
                const file = new File([blob], bienThe.hinhAnh, { type: blob.type });
                setHinhAnh(file);
            })
            .catch(error => {
                console.error("Không thể tạo file từ hình ảnh:", error);
            });
    }, [bienThe]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (sanPham.danhMuc.loai !== "Vợt") {
            if (!sizeId) {
                showNotification("Vui lòng chọn size!", "error");
                return;
            }
        } else {
            setSizeId(0);
        }

        if (soLuongTon < 0) {
            showNotification("Số lượng tồn không được âm!", "error");
            return;
        }

        const formData = new FormData();
        formData.append("id", id.toString());
        formData.append("tenBienThe", tenBienThe);
        formData.append("soLuongTon", soLuongTon.toString());
        formData.append("mauId", mauId.toString());
        formData.append("sizeId", sizeId.toString());
        formData.append("sanPhamId", sanPham.id.toString());
        if (hinhAnh) {
            formData.append("hinhAnh", hinhAnh);
        } else {
            formData.append("hinhAnh", bienThe.hinhAnh);
        }

        handleUpdate(formData);
        handleClose();
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setPreviewImage(objectUrl);
            setHinhAnh(file);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Sửa biến thể</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit} encType="multipart/form-data">
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Id</Form.Label>
                        <Form.Control
                            type="text"
                            value={id}
                            disabled
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Tên biến thể</Form.Label>
                        <Form.Control
                            type="text"
                            value={tenBienThe}
                            disabled
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Số lượng tồn</Form.Label>
                        <Form.Control
                            type="number"
                            value={soLuongTon}
                            onChange={(e) => setSoLuongTon(Number(e.target.value))}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Màu</Form.Label>
                        <Form.Select value={mauId} onChange={(e) => setMauId(Number(e.target.value))} required>
                            {dsMau.map((mau) => (
                                <option key={mau.id} value={mau.id}>
                                    {mau.tenMau}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    {sanPham.danhMuc.loai !== "Vợt" && (<Form.Group className="mb-3">
                        <Form.Label>Size</Form.Label>
                        <Form.Select value={sizeId} onChange={(e) => setSizeId(Number(e.target.value))} required>
                            {dsSize.map((size) => (
                                <option key={size.id} value={size.id}>
                                    {size.size}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>)}
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
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Hủy</Button>
                    <Button variant="primary" onClick={handleSubmit}>Lưu thay đổi</Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default ModalSuaBienThe;

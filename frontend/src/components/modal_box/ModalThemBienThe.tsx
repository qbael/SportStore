import { useEffect, useState } from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {SizeType, MauType, ProductType} from "../../util/types/ProductTypes";
import {useNotification} from '../../hook/useNotification2.tsx';

type Props = {
    show: boolean;
    handleClose: () => void;
    handleAdd: (formData: FormData) => void;
    dsSize: SizeType[];
    dsMau: MauType[];
    sanPham: ProductType | null;
};

const ModalThemBienThe = ({ show, handleClose, handleAdd, dsSize, dsMau, sanPham }: Props) => {
    const [form, setForm] = useState({
        hinhAnh: null as File | null,
        soLuongTon: 0,
        sizeId: "",
        mauId: "",
    });
    const [previewImage, setPreviewImage] = useState<string>("");
    const {showNotification} = useNotification();

    useEffect(() => {
        if (show) {
            setForm({
                hinhAnh: null,
                soLuongTon: 0,
                sizeId: "",
                mauId: "",
            });
            setPreviewImage("");
        }
    }, [show]);

    const handleChange = (e: any ) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
            setForm(prev => ({ ...prev, hinhAnh: file }));
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = () => {
        if (!sanPham) return;

        if (sanPham.danhMuc.loai !== "Vợt") {
            if (!form.sizeId) {
                showNotification("Vui lòng chọn size!", "error");
                return;
            }
        } else {
            form.sizeId = "0";
        }

        if (!form.hinhAnh || !form.mauId) {
            showNotification("Vui lòng điền đầy đủ thông tin hợp lệ!", "error");
            return;
        }

        if (form.soLuongTon < 0) {
            showNotification("Số lượng tồn không được âm!", "error");
            return;
        }

        const formData = new FormData();
        formData.append("hinhAnh", form.hinhAnh);
        formData.append("soLuongTon", form.soLuongTon.toString());
        formData.append("sizeId", form.sizeId);
        formData.append("mauId", form.mauId);
        formData.append("sanPhamId", sanPham.id.toString());

        handleAdd(formData);
        handleClose();
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>Thêm Biến Thể Sản Phẩm</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-2">
                        <Form.Label>Số lượng tồn</Form.Label>
                        <Form.Control
                            type="number"
                            name="soLuongTon"
                            value={form.soLuongTon}
                            onChange={handleChange}
                            onFocus={(e) => e.target.select()}
                        />
                    </Form.Group>

                    {sanPham?.danhMuc.loai !== "Vợt" && (<Form.Group className="mb-2">
                        <Form.Label>Size</Form.Label>
                        <Form.Select name="sizeId" value={form.sizeId} onChange={handleChange}>
                            <option value="">-- Chọn size --</option>
                            {dsSize.map(size => (
                                <option key={size.id} value={size.id}>{size.size}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>)}

                    <Form.Group className="mb-2">
                        <Form.Label>Màu</Form.Label>
                        <Form.Select name="mauId" value={form.mauId} onChange={handleChange}>
                            <option value="">-- Chọn màu --</option>
                            {dsMau.map(mau => (
                                <option key={mau.id} value={mau.id}>{mau.tenMau}</option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-2">
                        <Form.Label>Hình ảnh</Form.Label>
                        <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
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
                <Button variant="primary" onClick={handleSubmit}>Thêm biến thể</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalThemBienThe;
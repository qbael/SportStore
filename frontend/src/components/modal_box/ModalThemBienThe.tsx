import { useState } from 'react';
import { Button, Form, Modal } from 'react-bootstrap';
import { SizeType, MauType, BienTheType } from '../../util/types/ProductTypes';
import { useNotification } from '../../hook/useNotification2';

type Props = {
    show: boolean;
    handleClose: () => void;
    onSave: (bienThe: FormData) => void;
    dsSize: SizeType[];
    dsMau: MauType[];
};

const ModalThemBienThe = ({ show, handleClose, onSave, dsSize, dsMau }: Props) => {
    const [tenBienThe, setTenBienThe] = useState('');
    const [hinhAnh, setHinhAnh] = useState<File | null>(null);
    const [soLuongTon, setSoLuongTon] = useState(0);
    const [selectedSize, setSelectedSize] = useState<number | ''>('');
    const [selectedMau, setSelectedMau] = useState<number | ''>('');
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const { showNotification } = useNotification();

    const handleSubmit = () => {
        if (!tenBienThe || !hinhAnh || !selectedSize || !selectedMau) {
            showNotification('Vui lòng nhập đầy đủ thông tin', 'error');
            return;
        }

        const formData = new FormData();
        formData.append('tenBienThe', tenBienThe);
        formData.append('soLuongTon', soLuongTon.toString());
        formData.append('sizeId', selectedSize.toString());
        formData.append('mauId', selectedMau.toString());
        formData.append('hinhAnh', hinhAnh);

        onSave(formData);
        handleClose();
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
                <Modal.Title>Thêm biến thể</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group>
                        <Form.Label>Tên biến thể</Form.Label>
                        <Form.Control
                            type="text"
                            value={tenBienThe}
                            onChange={(e) => setTenBienThe(e.target.value)}
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
                    <Form.Group className="mt-2">
                        <Form.Label>Số lượng tồn</Form.Label>
                        <Form.Control
                            type="number"
                            value={soLuongTon}
                            onChange={(e) => setSoLuongTon(Number(e.target.value))}
                        />
                    </Form.Group>
                    <Form.Group className="mt-2">
                        <Form.Label>Size</Form.Label>
                        <Form.Select
                            value={selectedSize}
                            onChange={(e) => setSelectedSize(Number(e.target.value))}
                        >
                            <option value="">Chọn size</option>
                            {dsSize.map((size) => (
                                <option key={size.id} value={size.id}>
                                    {size.size}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mt-2">
                        <Form.Label>Màu</Form.Label>
                        <Form.Select
                            value={selectedMau}
                            onChange={(e) => setSelectedMau(Number(e.target.value))}
                        >
                            <option value="">Chọn màu</option>
                            {dsMau.map((mau) => (
                                <option key={mau.id} value={mau.id}>
                                    {mau.tenMau}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Hủy</Button>
                <Button variant="primary" onClick={handleSubmit}>Lưu</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalThemBienThe;

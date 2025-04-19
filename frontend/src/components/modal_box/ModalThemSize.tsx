import { Modal, Button, Form } from "react-bootstrap";
import { useState } from "react";

type Props = {
    show: boolean;
    onHide: () => void;
    onSave: (loai: string) => void;
};

const ModalThemSize = ({ show, onHide, onSave }: Props) => {
    const [loai, setLoai] = useState("");

    const handleSave = () => {
        if (loai.trim() !== "") {
            onSave(loai);
            setLoai("");
            onHide();
        }
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Thêm size</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group>
                    <Form.Label>Tên size</Form.Label>
                    <Form.Control
                        type="text"
                        value={loai}
                        onChange={(e) => setLoai(e.target.value)}
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>Hủy</Button>
                <Button variant="primary" onClick={handleSave}>Lưu</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalThemSize;

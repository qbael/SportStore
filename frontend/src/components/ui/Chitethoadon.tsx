import React, { useState } from 'react';
import '../../css/admin/hoadon.css';
import { HoaDon } from '../../util/types/HoadonTypes';
import { Modal, Button } from 'react-bootstrap';
import { Table } from 'react-bootstrap';
import { Badge } from 'react-bootstrap';



interface Props {
    show: boolean;
    onClose: () => void;
    hoaDon?: HoaDon;
}

export default function Chitiethoadon({ show, onClose, hoaDon }: Props) {
    // console.log("Show", show, "Hóa đơn", hoaDon);
    
    const getStatusColor = (status: string): string => {
        switch (status.toUpperCase()) {
            case "DAGIAO":
                return "success";     // xanh lá
            case "DANGGIAO":
                return "warning";     // vàng
            case "DANGXULY":
                return "info";        // xanh dương
            case "DAHUY":
                return "danger";      // đỏ
            default:
                return "secondary";   // xám
        }
    };
    if (!hoaDon) return null;

    return (
        <Modal show={show} onHide={onClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Chi tiết hóa đơn #{hoaDon.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="hoadon-detail">
                    <div className="info-hoadon">
                        <div className="info-khachhang">
                            <p><strong>Khách hàng:</strong> {hoaDon.ttKhachHang.hoTen}</p>
                            <p><strong>Số điện thoại:</strong> {hoaDon.ttKhachHang.sdt}</p>
                            <p><strong>Địa chỉ:</strong> {hoaDon.ttKhachHang.diaChi}</p>
                        </div>
                        <div className="info-chung">
                            <p><strong>ID hóa đơn:</strong>{hoaDon.id}</p>
                            <p><strong>Ngày:</strong> {hoaDon.ngay}</p>
                            <p><strong>Trạng thái:</strong>
                                <Badge bg={getStatusColor(hoaDon.trangThai)}>
                                    {hoaDon.trangThai}
                                </Badge>
                            </p>

                        </div>
                    </div>

                    <div className='table-hoadon'>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Stt</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Số lượng</th>
                                    <th>Đơn giá</th>
                                    <th>Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {hoaDon.dsCTHoaDon.map((item, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>
                                            {/* <img src={item.bienThe.hinhAnh} alt="" /> */}
                                            <p>{item.bienThe.tenBienThe}</p>
                                        </td>
                                        <td>{item.soLuong}</td>
                                        <td>{item.giaBan.toLocaleString()}đ</td>
                                        <td>{(item.soLuong * item.giaBan).toLocaleString()}đ</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>

                    <p><strong>Tổng giá bán:</strong> {hoaDon.tongGiaBan.toLocaleString()}đ</p>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onClose}>
                    Đóng
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

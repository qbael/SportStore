import React, { useState } from 'react';
// import '../../css/admin/nhaphang.css';

import '../../css/admin/hoadon.css';
import { NhapHang } from '../../util/types/NhapHangType';
import { Modal, Button } from 'react-bootstrap';
import { Table } from 'react-bootstrap';
import { Badge } from 'react-bootstrap';



interface Props {
    show: boolean;
    onClose: () => void;
    nhaphang?: NhapHang;
}

export default function Chitietnhaphang({ show, onClose, nhaphang }: Props) {
    // console.log("Show", show, "Hóa đơn", nhaphang);
    
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
    if (!nhaphang) return null;

    return (
        <Modal show={show} onHide={onClose} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Chi tiết hóa đơn #{nhaphang.id}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="hoadon-detail">
                    <div className="info-hoadon">
                        <div className="info-khachhang">
                            <p><strong>Tên nhà cung cấp:</strong> {nhaphang.nhaCungCap.tenNhaCungCap}</p>
                            <p><strong>Số điện thoại:</strong> {nhaphang.nhaCungCap.sdt}</p>
                            <p><strong>Địa chỉ:</strong> {nhaphang.nhaCungCap.diaChi}</p>
                        </div>
                        <div className="info-chung">
                            <p><strong>ID Nhập hàng:</strong>{nhaphang.id}</p>
                            <p><strong>Ngày nhập hàng:</strong> {nhaphang.ngay}</p>
                            <p><strong>Trạng thái:</strong>
                                <Badge bg={getStatusColor(nhaphang.trangThai)}>
                                    {nhaphang.trangThai}
                                </Badge>
                            </p>

                        </div>
                    </div>

                    <div className='table-hoadon'>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Tên sản phẩm</th>
                                    <th>Số lượng</th>
                                    <th>Giá nhập</th>
                                    <th>Thành tiền</th>
                                </tr>
                            </thead>
                            <tbody>
                                {nhaphang.dsCTNhapHang.map((item, index) => (
                                    <tr key={index}>
                                        <td>{item.id}</td>
                                        <td>
                                            {/* <img src={item.bienThe.hinhAnh} alt="" /> */}
                                            <p>{item.tenBienthe}</p>
                                        </td>
                                        <td>{item.soLuong}</td>
                                        <td>{item.giaNhap.toLocaleString()}đ</td>
                                        <td>{(item.giaNhap * item.soLuong).toLocaleString()}đ</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>

                    <p><strong>Tổng giá bán:</strong> {nhaphang.tongGiaNhap.toLocaleString()}đ</p>
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

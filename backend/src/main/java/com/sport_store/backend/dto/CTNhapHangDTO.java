package com.sport_store.backend.dto;

import java.util.List;


import com.sport_store.backend.entity.TTKhachHang;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CTNhapHangDTO {
    private int id;
    private int soLuong;
    private int giaNhap;
    private int idbienthe;
    private String tenBienthe;
    private String hinhanh;
    // private int idsanpham;
}

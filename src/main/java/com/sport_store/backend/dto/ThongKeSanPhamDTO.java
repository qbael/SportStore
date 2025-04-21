package com.sport_store.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ThongKeSanPhamDTO {
    private int id;
    private String tenSanPham;
    private int giaBan;
    private long soLuongBan;
    private double tongGiaNhap;
    private double tongDoanhThu;
    private double phanTramLoiNhuan;
}
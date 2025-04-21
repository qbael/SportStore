package com.sport_store.backend.dto;

import java.time.LocalDate;
import java.util.List;

import com.sport_store.backend.entity.NhaCungCap;
import com.sport_store.backend.entity.NhanVien;
import com.sport_store.backend.entity.Enum.TrangThaiHoaDon;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NhapHangRequestDTO {
    private int id;
    private LocalDate ngay;
    private int tongGiaNhap;
    private NhanVien nhanVien;
    private NhaCungCap nhaCungCap;
    private TrangThaiHoaDon trangThai;
    private List<CTNhapHangRequestDTO> dsCTNhapHang;
}

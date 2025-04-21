package com.sport_store.backend.dto;

import java.time.LocalDate;
import java.util.List;

import com.sport_store.backend.entity.NhaCungCap;
import com.sport_store.backend.entity.Enum.TrangThaiHoaDon;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NhapHangDTO {  // dang nhap phan hoi
    private int id;
    private LocalDate ngay;
    private int tongGiaNhap;
    private NhanVienDTO nhanVien;
    private NhaCungCapDTO nhaCungCap;
    private TrangThaiHoaDon trangThai;
    private List<CTNhapHangDTO> dsCTNhapHang;
}

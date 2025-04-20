package com.sport_store.backend.dto;

import lombok.*;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class NhanVienTheoChucVuDTO {
    private int id;
    private String hoTen;
    private LocalDate ngaySinh;
    private boolean gioiTinh;
    private String diaChi;
    private String email;
    private int sdt;
    private ChucVuDTO chucVu;
}

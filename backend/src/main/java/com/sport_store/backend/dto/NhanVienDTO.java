package com.sport_store.backend.dto;

import lombok.*;

import java.time.LocalDate;
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NhanVienDTO {
    private int id;
    private String hoTen;
    private LocalDate ngaySinh;
    private boolean gioiTinh;
    private String diaChi;
    private String email;
    private int sdt;
    private Integer chucVuId;
    private String tenChucVu;
    private String password;
}

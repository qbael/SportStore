package com.sport_store.backend.dto;

import com.sport_store.backend.entity.ChucVu;
import lombok.*;

import java.time.LocalDate;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Data
public class AdminLoginResponseDTO {
    private int id;
    private String hoTen;
    private LocalDate ngaySinh;
    private boolean gioiTinh;
    private String diaChi;
    private String email;
    private int sdt;
    private ChucVu chucVu;
    private String error;
}

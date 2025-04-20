package com.sport_store.backend.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NhanVienDTO {  
    private int id;
    private String hoTen;
    private LocalDate ngaySinh;
    private String diaChi;
    private String email;
    private int sdt;
}

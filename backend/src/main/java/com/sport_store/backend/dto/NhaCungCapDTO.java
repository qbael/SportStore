package com.sport_store.backend.dto;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class NhaCungCapDTO {
    private int id;
    private String tenNhaCungCap;
    private String diaChi;
    private String sdt;
    private String email;
}

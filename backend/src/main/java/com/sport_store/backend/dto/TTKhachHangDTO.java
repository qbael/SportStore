package com.sport_store.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TTKhachHangDTO {
    private int id;
    private String hoTen;
    private String sdt;
    private String diaChi;
    private int taiKhoanId;

}

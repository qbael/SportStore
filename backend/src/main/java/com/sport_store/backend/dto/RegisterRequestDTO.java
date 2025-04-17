package com.sport_store.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequestDTO {// dien cai form dang ky
    private String username;
    private String password;
    private String email;
    private String hoTen;
    private String diaChi;
    private Integer sdt;
    private Boolean is_active;
}
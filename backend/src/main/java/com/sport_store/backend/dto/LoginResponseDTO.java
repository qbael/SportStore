package com.sport_store.backend.dto;

import java.util.List;


import com.sport_store.backend.entity.TTKhachHang;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponseDTO {  // dang nhap phan hoi
    private String username;
    private String email;
    // private String hoTen;
    private List<TTKhachHangDTO> profile;
    private String error;
}

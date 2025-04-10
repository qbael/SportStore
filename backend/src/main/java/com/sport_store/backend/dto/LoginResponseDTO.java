package com.sport_store.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponseDTO {  // dang nhap phan hoi
    private String username;
    private String email;
    private String hoTen;
    private String error;
}

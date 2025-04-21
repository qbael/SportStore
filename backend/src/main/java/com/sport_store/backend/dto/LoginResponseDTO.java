package com.sport_store.backend.dto;

import java.util.List;


import com.fasterxml.jackson.annotation.JsonProperty;
import com.sport_store.backend.entity.TTKhachHang;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class LoginResponseDTO {
    private String username;
    private String email;
    @JsonProperty("isActive") // Ánh xạ thành isActive trong JSON
    private boolean is_active;
    private List<TTKhachHangDTO> profile;
    private String error;

    // Constructor cho trường hợp lỗi
    public LoginResponseDTO(String error) {
        this.username = null;
        this.email = null;
        this.is_active = false;
        this.profile = null;
        this.error = error;
    }

    // Constructor cho trường hợp thành công
    public LoginResponseDTO(String username, String email, boolean is_active, List<TTKhachHangDTO> profile) {
        this.username = username;
        this.email = email;
        this.is_active = is_active;
        this.profile = profile;
        this.error = null;
    }
}
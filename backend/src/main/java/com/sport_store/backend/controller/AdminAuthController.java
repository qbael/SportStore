package com.sport_store.backend.controller;

import com.sport_store.backend.dto.AdminLoginRequestDTO;
import com.sport_store.backend.dto.AdminLoginResponseDTO;
import com.sport_store.backend.entity.NhanVien;
import com.sport_store.backend.service.NhanVienService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/admin")
public class AdminAuthController {
    private NhanVienService nhanVienService;

    public AdminAuthController(NhanVienService nhanVienService) {
        this.nhanVienService = nhanVienService;
    }

    @PostMapping("/login")
    public ResponseEntity<AdminLoginResponseDTO> login(@RequestBody AdminLoginRequestDTO adminLoginRequest) {
        Optional<NhanVien> response = nhanVienService.checkLogin(adminLoginRequest.getEmail(), adminLoginRequest.getPassword());
        if (response.isPresent()) {
            NhanVien nhanVien = response.get();
            AdminLoginResponseDTO adminLoginResponseDTO = mapToAdminLoginResponseDTO(nhanVien);
            return ResponseEntity.ok(adminLoginResponseDTO);
        } else {
            AdminLoginResponseDTO errorResponse = new AdminLoginResponseDTO();
            errorResponse.setError("Email hoặc mật khẩu không đúng");
            return ResponseEntity.status(401).body(errorResponse);
        }
    }

    public AdminLoginResponseDTO mapToAdminLoginResponseDTO(NhanVien nhanVien) {
        String error = "";
        AdminLoginResponseDTO dto = new AdminLoginResponseDTO(nhanVien.getId(),
                nhanVien.getHoTen(),
                nhanVien.getNgaySinh(),
                nhanVien.isGioiTinh(),
                nhanVien.getDiaChi(),
                nhanVien.getEmail(),
                nhanVien.getSdt(),
                nhanVien.getChucVu(),
                error);
        return dto;
    }
}

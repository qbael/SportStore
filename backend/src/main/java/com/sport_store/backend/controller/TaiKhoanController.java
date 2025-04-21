package com.sport_store.backend.controller;

import com.sport_store.backend.entity.TaiKhoan;
import com.sport_store.backend.repository.TaiKhoanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/taikhoan")
@RequiredArgsConstructor
public class TaiKhoanController {
    private final TaiKhoanRepository taiKhoanRepository;

    @GetMapping("/{id}")
    public ResponseEntity<Map<String, Object>> getTaiKhoan(@PathVariable Integer id) {
        try {
            Optional<TaiKhoan> taiKhoanOpt = taiKhoanRepository.findById(id);
            if (taiKhoanOpt.isPresent()) {
                TaiKhoan taiKhoan = taiKhoanOpt.get();
                Map<String, Object> data = new HashMap<>();
                data.put("username", taiKhoan.getUsername() != null ? taiKhoan.getUsername() : "N/A");
                data.put("isActive", taiKhoan.getIsActive() != null ? taiKhoan.getIsActive() : false);
                return buildResponse(HttpStatus.OK, "Lấy thông tin tài khoản thành công", data);
            }
            return buildResponse(HttpStatus.NOT_FOUND, "Không tìm thấy tài khoản", null);
        } catch (Exception e) {
            return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi lấy thông tin tài khoản: " + e.getMessage(), null);
        }
    }

    private ResponseEntity<Map<String, Object>> buildResponse(HttpStatus status, String message, Object data) {
        Map<String, Object> response = new HashMap<>();
        response.put("status", status.value());
        response.put("message", message);
        if (data != null) {
            response.put("data", data);
        }
        return new ResponseEntity<>(response, status);
    }
}
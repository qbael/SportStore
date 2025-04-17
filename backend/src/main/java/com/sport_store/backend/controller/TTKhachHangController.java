package com.sport_store.backend.controller;

import com.sport_store.backend.dto.TTKhachHangDTO;
import com.sport_store.backend.service.TTKhachHangService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/khachhang")
@RequiredArgsConstructor
public class TTKhachHangController {
    private final TTKhachHangService ttKhachHangService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllKhachHang() {
        try {
            List<TTKhachHangDTO> customers = ttKhachHangService.getAllKhachHang();
            return buildResponse(HttpStatus.OK, "Lấy danh sách khách hàng thành công", customers);
        } catch (Exception e) {
            return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi lấy danh sách khách hàng", null);
        }
    }

    @PutMapping("/{id}/lock")
    public ResponseEntity<Map<String, Object>> lockKhachHang(@PathVariable Integer id, @RequestBody Map<String, Boolean> body) {
        if (id == null || body == null || !body.containsKey("isActive")) {
            return buildResponse(HttpStatus.BAD_REQUEST, "Dữ liệu đầu vào không hợp lệ", null);
        }

        try {
            boolean isActive = body.get("isActive");
            boolean updated = ttKhachHangService.updateAccountStatus(id, isActive);
            if (updated) {
                String message = isActive ? "Mở khóa tài khoản thành công" : "Khóa tài khoản thành công";
                return buildResponse(HttpStatus.OK, message, null);
            } else {
                return buildResponse(HttpStatus.NOT_FOUND, "Không tìm thấy khách hàng", null);
            }
        } catch (Exception e) {
            return buildResponse(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi cập nhật trạng thái tài khoản", null);
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
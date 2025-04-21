package com.sport_store.backend.controller;

import com.sport_store.backend.dto.NhaCungCapDTO;
import com.sport_store.backend.dto.NhapHangDTO;
import com.sport_store.backend.entity.HoaDon;
import com.sport_store.backend.entity.NhapHang;
import com.sport_store.backend.projection.HoaDonFullProjection;
import com.sport_store.backend.service.HoaDonService;
import com.sport_store.backend.service.NhaCungCapService;
import com.sport_store.backend.service.NhaphangService;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.sport_store.backend.entity.Enum.TrangThaiHoaDon;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.data.web.PageableDefault;
import org.springframework.data.domain.Sort;

import java.time.LocalDate;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/nhacungcap")
@RequiredArgsConstructor

public class NhaCungCapController {

    private final NhaCungCapService nhaCungCapService;


    @GetMapping
    public Page<NhaCungCapDTO> getNhaCungCaps(
        @RequestParam(required = false) String keyword,
        Pageable pageable
    ) {
        return nhaCungCapService.getNhaCungCaps(keyword, pageable);
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllNhaCungCap() {
        return ResponseEntity.ok(nhaCungCapService.getAllNhaCungCap());
    }

    @PostMapping("/create")
    public ResponseEntity<?> createNhaCungCap(@RequestBody NhaCungCapDTO nhaCungCapDTO) {
        try {
            NhaCungCapDTO createdNhaCungCap = nhaCungCapService.createNhaCungCap(nhaCungCapDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body("Nha cung cap created with ID: " + createdNhaCungCap.getId());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateNhaCungCap(@PathVariable long id, @RequestBody NhaCungCapDTO nhaCungCapDTO) {
        try {
            NhaCungCapDTO updatedNhaCungCap = nhaCungCapService.updateNhaCungCap(id, nhaCungCapDTO);
            return ResponseEntity.ok("Nha cung cap updated with ID: " + updatedNhaCungCap.getId());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }
}
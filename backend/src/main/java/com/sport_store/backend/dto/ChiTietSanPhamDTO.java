package com.sport_store.backend.dto;

import com.sport_store.backend.entity.BienThe;
import com.sport_store.backend.entity.SanPham;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class ChiTietSanPhamDTO {
    private SanPham sanPham;
    private List<BienThe> bienThe;
}

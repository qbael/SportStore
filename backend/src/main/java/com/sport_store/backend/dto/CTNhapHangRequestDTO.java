package com.sport_store.backend.dto;

import com.sport_store.backend.entity.BienThe;
import com.sport_store.backend.entity.CTNhapHang;
import com.sport_store.backend.entity.SanPham;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CTNhapHangRequestDTO extends CTNhapHang {
    private int idSanpham;
}

package com.sport_store.backend.dto;
import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ThongKeSanPhamDTO {
    private Integer sanPhamId;
    private Integer bienTheId;
    private String tenBienThe;
    private String hinhAnh;
    private Integer giaNhap;
    private Integer giaBan;
    private Integer tongSoLuongBan;
    private Integer tongSoTienNhap;
    private Integer tongSoTienBan;
    private Double phanTramLoiNhuan;
}


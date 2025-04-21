package com.sport_store.backend.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
public class ThongKeNhapHangDTO {
    private Integer sanPhamId;
    private Integer bienTheId;
    private String tenBienThe;
    private String hinhAnh;
    private Integer giaNhap;
    private Integer tongSoLuongNhap;
    private Integer tongSoTienNhap;
}

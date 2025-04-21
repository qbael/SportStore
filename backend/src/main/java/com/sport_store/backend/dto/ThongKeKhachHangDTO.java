package com.sport_store.backend.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
public class ThongKeKhachHangDTO {
    private Integer id;
    private String hoTen;
    private Integer sdt;
    private String email;
    private Integer soDonHang;
    private Integer tongTienMua;
}

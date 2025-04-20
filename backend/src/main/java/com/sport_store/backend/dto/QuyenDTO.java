package com.sport_store.backend.dto;

import com.sport_store.backend.entity.Enum.HanhDong;
import lombok.*;

@Data
@AllArgsConstructor
@Getter
@Setter
@NoArgsConstructor
public class QuyenDTO {
    private Integer chucVuId;
    private Integer chucNangId;
    private String hanhDong;
}

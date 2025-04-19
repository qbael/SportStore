package com.sport_store.backend.dto;

import com.sport_store.backend.entity.BoMon;
import com.sport_store.backend.entity.DanhMuc;
import com.sport_store.backend.entity.NhaCungCap;
import com.sport_store.backend.entity.ThuongHieu;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class DsThongTinSPDTO {
    List<DanhMuc> dsDanhMuc;
    List<ThuongHieu> dsThuongHieu;
    List<BoMon> dsBoMon;
    List<NhaCungCap> dsNhaCungCap;
}

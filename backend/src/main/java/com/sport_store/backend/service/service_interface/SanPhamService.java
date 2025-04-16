package com.sport_store.backend.service.service_interface;

import com.sport_store.backend.dto.ChiTietSanPhamDTO;
import com.sport_store.backend.entity.BoMon;
import com.sport_store.backend.entity.DanhMuc;
import com.sport_store.backend.entity.SanPham;
import com.sport_store.backend.entity.ThuongHieu;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;


public interface SanPhamService {
    Page<SanPham> getFilteredProducts(String bomon, String danhmuc, String thuonghieu,
                                      Integer minprice, Integer maxprice, String search, String searchBy, Boolean status, Pageable pageable);
    ChiTietSanPhamDTO getAllBienTheOfSanPham(int id);

    List<ThuongHieu> getAllThuongHieu();
    List<DanhMuc> getAllDanhMuc();
    List<BoMon> getAllBoMon();
}

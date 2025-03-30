package com.sport_store.backend.service;

import com.sport_store.backend.entity.SanPham;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;


public interface SanPhamService {
    Page<SanPham> getFilteredProducts(String bomon, String danhmuc, String thuonghieu,
                                      Integer minprice, Integer maxprice, String search, Pageable pageable);
}

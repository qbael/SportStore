package com.sport_store.backend.service;

import com.sport_store.backend.dto.ThongKeSanPhamDTO;

import java.time.LocalDate;
import java.util.List;

public interface ThongKeService {
    List<ThongKeSanPhamDTO> thongKeSanPhamTheoGiaBan();
    
    List<ThongKeSanPhamDTO> thongKeSanPhamTheoGiaBanVaNgay(LocalDate tuNgay, LocalDate denNgay);
    
    List<ThongKeSanPhamDTO> thongKeSanPhamTheoGiaBanVaDanhMuc(int danhMucId);
}
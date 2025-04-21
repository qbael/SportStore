package com.sport_store.backend.service.impl;

import com.sport_store.backend.dto.ThongKeSanPhamDTO;
import com.sport_store.backend.repository.ThongKeRepository;
import com.sport_store.backend.service.ThongKeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class ThongKeServiceImpl implements ThongKeService {

    private final ThongKeRepository thongKeRepository;

    @Autowired
    public ThongKeServiceImpl(ThongKeRepository thongKeRepository) {
        this.thongKeRepository = thongKeRepository;
    }

    @Override
    public List<ThongKeSanPhamDTO> thongKeSanPhamTheoGiaBan() {
        return thongKeRepository.thongKeSanPhamTheoGiaBan();
    }
    
    @Override
    public List<ThongKeSanPhamDTO> thongKeSanPhamTheoGiaBanVaNgay(LocalDate tuNgay, LocalDate denNgay) {
        return thongKeRepository.thongKeSanPhamTheoGiaBanVaNgay(tuNgay, denNgay);
    }
    
    @Override
    public List<ThongKeSanPhamDTO> thongKeSanPhamTheoGiaBanVaDanhMuc(int danhMucId) {
        return thongKeRepository.thongKeSanPhamTheoGiaBanVaDanhMuc(danhMucId);
    }
}
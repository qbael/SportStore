package com.sport_store.backend.service.impl;

import com.sport_store.backend.dto.ThongKeSanPhamDTO;
import com.sport_store.backend.repository.ThongKeRepository;
import com.sport_store.backend.service.ThongKeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
}
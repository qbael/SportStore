package com.sport_store.backend.service;

import com.sport_store.backend.entity.NhanVien;
import com.sport_store.backend.repository.NhanVienRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class NhanVienService {
    private final NhanVienRepository nhanRepository;

    public NhanVienService(NhanVienRepository nhanRepository) {
        this.nhanRepository = nhanRepository;
    }

    public Optional<NhanVien> checkLogin(String email, String password) {
        return nhanRepository.login(email, password);
    }
}

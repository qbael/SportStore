package com.sport_store.backend.repository;

import com.sport_store.backend.dto.AdminLoginResponseDTO;
import com.sport_store.backend.entity.NhanVien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface NhanVienRepository extends JpaRepository<NhanVien, Integer> {
    @Query("SELECT nv FROM NhanVien nv JOIN nv.chucVu cv LEFT JOIN cv.quyenList WHERE nv.email = :email AND nv.password = :password")
    Optional<NhanVien> login(String email, String password);
}
package com.sport_store.backend.repository;

import com.sport_store.backend.dto.ThongKeSanPhamDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThongKeRepository extends JpaRepository<Object, Integer> {

    @Query(value = "SELECT new com.sport_store.backend.dto.ThongKeSanPhamDTO(" +
            "sp.id, " +
            "sp.tenSanPham, " +
            "sp.giaBan, " +
            "SUM(cthd.soLuong), " +
            "SUM(cthd.soLuong * cthd.giaNhap), " +
            "SUM(cthd.soLuong * cthd.giaBan), " +
            "(SUM(cthd.soLuong * cthd.giaBan) - SUM(cthd.soLuong * cthd.giaNhap)) * 100.0 / SUM(cthd.soLuong * cthd.giaNhap)) " +
            "FROM CTHoaDon cthd " +
            "JOIN cthd.bienThe bt " +
            "JOIN bt.sanPham sp " +
            "JOIN cthd.hoaDon hd " +
            "WHERE hd.trangThai = 'HOAN_THANH' " +
            "GROUP BY sp.id, sp.tenSanPham, sp.giaBan " +
            "ORDER BY sp.giaBan")
    List<ThongKeSanPhamDTO> thongKeSanPhamTheoGiaBan();
}
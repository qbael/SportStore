package com.sport_store.backend.repository;

import com.sport_store.backend.entity.HoaDon;
import com.sport_store.backend.projection.HoaDonFullProjection;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.sport_store.backend.entity.Enum.TrangThaiHoaDon;
import java.time.LocalDate;

import java.util.List;
import java.util.Optional;

@Repository
public interface HoaDonRepository extends JpaRepository<HoaDon, Integer> {

        // Sử dụng findAll với Pageable để phân trang
        Page<HoaDonFullProjection> findAllProjectedBy(Pageable pageable);

        List<HoaDonFullProjection> findAllBy();

        Optional<HoaDonFullProjection> findById(int id);

        // all in one
        @Query("SELECT h FROM HoaDon h " +
                        "JOIN h.ttKhachHang kh " +
                        "WHERE (:id IS NULL OR h.id = :id) " +
                        "AND (:ngay IS NULL OR h.ngay = :ngay) " +
                        "AND (:tenKhachHang IS NULL OR LOWER(kh.hoTen) LIKE LOWER(CONCAT('%', :tenKhachHang, '%'))) " +
                        "AND (:trangThai IS NULL OR h.trangThai = :trangThai) " +
                        "AND (:soDienThoai IS NULL OR kh.sdt LIKE CONCAT('%', :soDienThoai, '%')) " +
                        "AND (:minTongGiaBan IS NULL OR h.tongGiaBan >= :minTongGiaBan) " +
                        "AND (:maxTongGiaBan IS NULL OR h.tongGiaBan <= :maxTongGiaBan)")
        Page<HoaDonFullProjection> searchHoaDon(
                        @Param("id") Integer id,
                        @Param("ngay") LocalDate ngay,
                        @Param("tenKhachHang") String tenKhachHang,
                        @Param("trangThai") TrangThaiHoaDon trangThai,
                        @Param("soDienThoai") String soDienThoai,
                        @Param("minTongGiaBan") Integer minTongGiaBan,
                        @Param("maxTongGiaBan") Integer maxTongGiaBan,
                        Pageable pageable);
}
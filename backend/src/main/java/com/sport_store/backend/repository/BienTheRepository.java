package com.sport_store.backend.repository;

import com.sport_store.backend.entity.BienThe;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;

public interface BienTheRepository extends JpaRepository<BienThe, Integer> {
    @Query(value = "SELECT b.* FROM bienthe b " +
            "WHERE b.sanpham = :sanPhamId", nativeQuery = true)
    List<BienThe> findAllBySanPhamId(@Param("sanPhamId") int sanPhamId);
    // update so luong
    @Modifying
    @Transactional 
    @Query(value = "UPDATE bienthe b SET b.soluongton = :soLuong WHERE b.id = :id", nativeQuery = true)
    void updateSoLuong(@Param("id") int id, @Param("soLuong") int soLuong);
    // get so luong 
    @Query(value = "SELECT b.soluongton FROM bienthe b WHERE b.id = :id", nativeQuery = true)
    int getSoLuong(@Param("id") int id);

    boolean existsBySanPham_IdAndMau_IdAndSize_Id(int sanPhamId, int mauId, int sizeId);

    boolean existsBySanPham_IdAndMau_Id(int sanPhamId, int mauId);

    void deleteAllBySanPham_Id(int sanPhamId);
}
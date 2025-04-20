package com.sport_store.backend.repository;

import com.sport_store.backend.entity.NhapHang;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;

public interface NhapHangRepository extends JpaRepository<NhapHang, Integer>, JpaSpecificationExecutor<NhapHang> {

    
}
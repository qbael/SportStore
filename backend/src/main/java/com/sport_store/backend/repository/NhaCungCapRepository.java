package com.sport_store.backend.repository;

import com.sport_store.backend.entity.NhaCungCap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

public interface NhaCungCapRepository extends JpaRepository<NhaCungCap, Long>, JpaSpecificationExecutor<NhaCungCap> {

}
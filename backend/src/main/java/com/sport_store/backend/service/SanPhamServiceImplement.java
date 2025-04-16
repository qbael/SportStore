package com.sport_store.backend.service;

import com.sport_store.backend.dto.ChiTietSanPhamDTO;
import com.sport_store.backend.entity.*;
import com.sport_store.backend.repository.*;
import com.sport_store.backend.service.service_interface.SanPhamService;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SanPhamServiceImplement implements SanPhamService {

    private final SanPhamRepository sanPhamRepository;
    private final BienTheRepository bienTheRepository;
    private final ThuongHieuRepository thuongHieuRepository;
    private final DanhMucRepository danhMucRepository;
    private final BoMonRepository boMonRepository;

    public SanPhamServiceImplement(SanPhamRepository sanPhamRepository,
                                   BienTheRepository bienTheRepository,
                                   ThuongHieuRepository thuongHieuRepository,
                                   DanhMucRepository danhMucRepository,
                                   BoMonRepository boMonRepository) {
        this.sanPhamRepository = sanPhamRepository;
        this.bienTheRepository = bienTheRepository;
        this.thuongHieuRepository = thuongHieuRepository;
        this.danhMucRepository = danhMucRepository;
        this.boMonRepository = boMonRepository;
    }

    public List<SanPham> getAllSanPham() {
        return sanPhamRepository.findAll();
    }


    @Override
    public Page<SanPham> getFilteredProducts(String bomon, String danhmuc, String thuonghieu,
                                             Integer minprice, Integer maxprice, String search,
                                             String searchBy, Boolean status, Pageable pageable) {
        Specification<SanPham> spec = new Specification<SanPham>() {
            @Override
            public Predicate toPredicate(Root<SanPham> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
                Predicate predicate = builder.conjunction();

                if (bomon != null && !bomon.isEmpty()) {
                    Predicate bomonPredicate = builder.equal(
                            builder.function("REPLACE", String.class,
                                    builder.lower(root.get("boMon").get("tenBoMon")),
                                    builder.literal(" "),
                                    builder.literal("-")
                            ),
                            bomon
                    );

                    predicate = builder.and(predicate, bomonPredicate);
                }

                if (danhmuc != null && !danhmuc.isEmpty()) {
                    Predicate danhmucPredicate = builder.equal(
                            builder.function("REPLACE", String.class,
                                    builder.lower(root.get("danhMuc").get("loai")),
                                    builder.literal(" "),
                                    builder.literal("-")
                            ),
                            danhmuc
                    );

                    predicate = builder.and(predicate, danhmucPredicate);
                }

                if (thuonghieu != null && !thuonghieu.isEmpty()) {
                    Predicate thuonghieuPredicate = builder.equal(
                            builder.function("REPLACE", String.class,
                                    builder.lower(root.get("thuongHieu").get("tenThuongHieu")),
                                    builder.literal(" "),
                                    builder.literal("-")
                            ),
                            thuonghieu
                    );

                    predicate = builder.and(predicate, thuonghieuPredicate);
                }

                if (minprice != null) {
                    predicate = builder.and(predicate, builder.greaterThanOrEqualTo(root.get("giaBan"), minprice));
                }

                if (maxprice != null) {
                    predicate = builder.and(predicate, builder.lessThanOrEqualTo(root.get("giaBan"), maxprice));
                }

                if (search != null && !search.isEmpty()) {
                    predicate = builder.and(predicate, builder.like(root.get(searchBy), "%" + search + "%"));
                }

                if (status != null) {
                    predicate = builder.and(predicate, builder.equal(root.get("trangThai"), status));
                }

                return predicate;
            }
        };
        return sanPhamRepository.findAll(spec, pageable);
    }

    public ChiTietSanPhamDTO getAllBienTheOfSanPham(int id) {
        SanPham sanPham = sanPhamRepository.findById(id).orElse(null);
        List<BienThe> bienThe;
        if (sanPham != null) {
            bienThe = bienTheRepository.findAllBySanPhamId(id);
        } else {
            throw new IllegalArgumentException("Product not found with id: " + id);
        }
        return new ChiTietSanPhamDTO(
                sanPham,
                bienThe
        );
    }

    @Override
    public List<BoMon> getAllBoMon() {
        return boMonRepository.findAll();
    }

    @Override
    public List<ThuongHieu> getAllThuongHieu() {
        return thuongHieuRepository.findAll();
    }

    @Override
    public List<DanhMuc> getAllDanhMuc() {
        return danhMucRepository.findAll();
    }
}

package com.sport_store.backend.service.implement;

import com.sport_store.backend.entity.BienThe;
import com.sport_store.backend.entity.SanPham;
import com.sport_store.backend.repository.BienTheRepository;
import com.sport_store.backend.repository.SanPhamRepository;
import com.sport_store.backend.service.SanPhamService;
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

    public SanPhamServiceImplement(SanPhamRepository sanPhamRepository, BienTheRepository bienTheRepository) {
        this.sanPhamRepository = sanPhamRepository;
        this.bienTheRepository = bienTheRepository;
    }

    public List<SanPham> getAllSanPham() {
        return sanPhamRepository.findAll();
    }


    @Override
    public Page<SanPham> getFilteredProducts(String bomon, String danhmuc, String thuonghieu,
                                             Integer minprice, Integer maxprice, String search,
                                             Pageable pageable) {
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
                    predicate = builder.and(predicate, builder.like(root.get("tenSanPham"), "%" + search + "%"));
                }

                return predicate;
            }
        };
        return sanPhamRepository.findAll(spec, pageable);
    }

    public List<BienThe> getAllBienTheOfSanPham(int id) {
        return bienTheRepository.findAllBySanPhamId(id);
    }
}

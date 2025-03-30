package com.sport_store.backend.service.implement;

import com.sport_store.backend.entity.SanPham;
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
import java.util.Map;

@Service
public class SanPhamServiceImplement implements SanPhamService {

    private final SanPhamRepository sanPhamRepository;

    private static final Map<String, String> DANHMUC_MAPPING = Map.of(
            "vot", "Vợt",
            "quan-ao", "Quần áo",
            "giay", "Giày"
    );

    private static final Map<String, String> BOMON_MAPPING = Map.of(
            "cau-long", "Cầu lông",
            "tennis", "Tennis",
            "bong-ban", "Bóng bàn"
    );

    public SanPhamServiceImplement(SanPhamRepository sanPhamRepository) {
        this.sanPhamRepository = sanPhamRepository;
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
                    String mappedBomon = BOMON_MAPPING.get(bomon);
                    predicate = builder.and(predicate, builder.equal(root.get("boMon").get("tenBoMon"), mappedBomon));
                }

                if (danhmuc != null && !danhmuc.isEmpty()) {
                    String mappedDanhmuc = DANHMUC_MAPPING.get(danhmuc);
                    predicate = builder.and(predicate, builder.equal(root.get("danhMuc").get("loai"), mappedDanhmuc));
                }

                if (thuonghieu != null && !thuonghieu.isEmpty()) {
                    predicate = builder.and(predicate, builder.equal(root.get("thuongHieu").get("tenThuongHieu"), thuonghieu));
                }

                if (minprice != null) {
                    predicate = builder.and(predicate, builder.greaterThanOrEqualTo(root.get("giaBan"), minprice));
                }

                if (maxprice != null) {
                    predicate = builder.and(predicate, builder.lessThanOrEqualTo(root.get("giaBan"), maxprice));
                }

                if (search != null && !search.isEmpty()) {
                    predicate = builder.and(predicate, builder.like(root.get("ten"), "%" + search + "%"));
                }

                return predicate;
            }
        };
        return sanPhamRepository.findAll(spec, pageable);
    }
}

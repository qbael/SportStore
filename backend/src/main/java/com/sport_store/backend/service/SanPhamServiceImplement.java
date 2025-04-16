package com.sport_store.backend.service;

import com.sport_store.backend.controller.SanPhamController;
import com.sport_store.backend.dto.ChiTietSanPhamDTO;
import com.sport_store.backend.entity.*;
import com.sport_store.backend.repository.*;
import com.sport_store.backend.service.service_interface.SanPhamService;
import com.sport_store.backend.utils.HashingName;
import com.sport_store.backend.utils.Helper;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;

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

    @Override
    public int createSanPham(String tenSanPham, Integer giaNhap, Integer giaBan, String moTa, Integer thuongHieuId, Integer danhMucId, Integer boMonId, MultipartFile hinhAnh) {
        try {
            String fileName = HashingName.generateImageName(tenSanPham, hinhAnh.getOriginalFilename());
            Path imagePath = Helper.getPath(fileName);

            SanPham sp = new SanPham();
            sp.setTenSanPham(tenSanPham);
            sp.setGiaNhap(giaNhap);
            sp.setGiaBan(giaBan);
            sp.setMoTa(moTa);
            sp.setTrangThai(true);
            sp.setHinhAnh(fileName);
            Optional<DanhMuc> dm = danhMucRepository.findById(danhMucId);
            Optional<BoMon> bm = boMonRepository.findById(boMonId);
            Optional<ThuongHieu> th = thuongHieuRepository.findById(thuongHieuId);
            if (dm.isEmpty() || bm.isEmpty() || th.isEmpty()) {
                throw new IllegalArgumentException("Invalid category, brand, or subject ID");
            }
            sp.setDanhMuc(dm.get());
            sp.setBoMon(bm.get());
            sp.setThuongHieu(th.get());

            int id = sanPhamRepository.save(sp).getId();

            if (id > 0) {
                Files.createDirectories(imagePath.getParent());
                Files.copy(hinhAnh.getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);
                return id;
            } else {
                return -1;
            }
        } catch (Exception e) {
            e.printStackTrace();
            return -1;
        }
    }

    @Override
    public int updateSanPham(Integer id, String tenSanPham, Integer giaNhap, Integer giaBan, String moTa, Integer thuongHieuId, Integer danhMucId, Integer boMonId, Boolean trangThai, MultipartFile hinhAnh) {
        try {
            Optional<SanPham> sp = sanPhamRepository.findById(id);
            if (sp.isEmpty()) {
                return -1;
            }

            SanPham sanPham = sp.get();
            sanPham.setTenSanPham(tenSanPham);
            sanPham.setGiaNhap(giaNhap);
            sanPham.setGiaBan(giaBan);
            sanPham.setMoTa(moTa);
            sanPham.setTrangThai(trangThai);
            Optional<DanhMuc> dm = danhMucRepository.findById(danhMucId);
            Optional<BoMon> bm = boMonRepository.findById(boMonId);
            Optional<ThuongHieu> th = thuongHieuRepository.findById(thuongHieuId);
            if (dm.isEmpty() || bm.isEmpty() || th.isEmpty()) {
                throw new IllegalArgumentException("Invalid category, brand, or subject ID");
            }
            sanPham.setDanhMuc(dm.get());
            sanPham.setBoMon(bm.get());
            sanPham.setThuongHieu(th.get());

            String oldFileName = HashingName.generateImageName(tenSanPham, sanPham.getHinhAnh());
            String fileName = HashingName.generateImageName(tenSanPham, hinhAnh.getOriginalFilename());
            Path oldImagePath = Helper.getPath(oldFileName);
            Path imagePath = Helper.getPath(fileName);
            sanPham.setHinhAnh(fileName);

            int signal = sanPhamRepository.save(sanPham).getId();

            if(signal > 0) {
                Files.deleteIfExists(oldImagePath);
                Files.createDirectories(imagePath.getParent());
                Files.copy(hinhAnh.getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);
            } else {
                return -1;
            }

            return signal;
        } catch (Exception e) {
            e.printStackTrace();
            return -1;
        }
    }

    @Override
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

    @Override
    public SanPham getSanPhamById(int id) {
        return sanPhamRepository.findById(id).orElse(null);
    }

    @Override
    public DanhMuc getDanhMucById(int id) {
        return danhMucRepository.findById(id).orElse(null);
    }

    @Override
    public ThuongHieu getThuongHieuById(int id) {
        return thuongHieuRepository.findById(id).orElse(null);
    }

    @Override
    public BoMon getBoMonById(int id) {
        return boMonRepository.findById(id).orElse(null);
    }
}

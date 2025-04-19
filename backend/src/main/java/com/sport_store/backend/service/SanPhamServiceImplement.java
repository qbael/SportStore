package com.sport_store.backend.service;

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
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

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
    private final CTHoaDonRepository ctHoaDonRepository;
    private final CTNhapHangRepository ctNhapHangRepository;
    private final MauRepository mauRepository;
    private final SizeRepository sizeRepository;
    private final NhaCungCapRepository nhaCungCapRepository;

    public SanPhamServiceImplement(SanPhamRepository sanPhamRepository,
                                   BienTheRepository bienTheRepository,
                                   ThuongHieuRepository thuongHieuRepository,
                                   DanhMucRepository danhMucRepository,
                                   BoMonRepository boMonRepository,
                                   CTHoaDonRepository ctHoaDonRepository,
                                   CTNhapHangRepository ctNhapHangRepository,
                                   MauRepository mauRepository,
                                   SizeRepository sizeRepository,
                                   NhaCungCapRepository nhaCungCapRepository) {
        this.sanPhamRepository = sanPhamRepository;
        this.bienTheRepository = bienTheRepository;
        this.thuongHieuRepository = thuongHieuRepository;
        this.danhMucRepository = danhMucRepository;
        this.boMonRepository = boMonRepository;
        this.ctHoaDonRepository = ctHoaDonRepository;
        this.ctNhapHangRepository = ctNhapHangRepository;
        this.mauRepository = mauRepository;
        this.sizeRepository = sizeRepository;
        this.nhaCungCapRepository = nhaCungCapRepository;
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
                    switch (searchBy) {
                        case "boMon", "danhMuc", "thuongHieu", "nhaCungCap" ->
                                predicate = builder.and(predicate, builder.equal(root.get(searchBy).get("id"), search));
                        case "tenSanPham" ->
                                predicate = builder.and(predicate, builder.like(root.get(searchBy), "%" + search + "%"));
                        case "trangThai" ->
                                predicate = builder.and(predicate, builder.equal(root.get(searchBy), Boolean.parseBoolean(search)));
                    }
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

            String fileName = HashingName.generateImageName(tenSanPham, hinhAnh.getOriginalFilename());
            Path oldImagePath = Helper.getPath(sanPham.getHinhAnh());
            Path imagePath = Helper.getPath(fileName);
            sanPham.setHinhAnh(fileName);
            sanPham.setTenSanPham(tenSanPham);

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
    public int deleteSanPham(int id) {
        try {
            Optional<SanPham> sp = sanPhamRepository.findById(id);
            if (sp.isEmpty()) {
                return -1;
            }
            if (ctHoaDonRepository.existsByBienThe_SanPham_Id(id) || ctNhapHangRepository.existsByBienThe_SanPham_Id(id)) {
                return -2;
            }
            String oldFileName = HashingName.generateImageName(sp.get().getTenSanPham(), sp.get().getHinhAnh());
            Path oldImagePath = Helper.getPath(oldFileName);
            Files.deleteIfExists(oldImagePath);
            sanPhamRepository.delete(sp.get());
            return id;
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
    public List<NhaCungCap> getAllNhaCungCap() { return nhaCungCapRepository.findAll(); }

    @Override
    public int createThuongHieu(String tenThuongHieu) {
        if (thuongHieuRepository.existsByTenThuongHieu(tenThuongHieu)) {
            return -1;
        }
        ThuongHieu thuongHieu = new ThuongHieu();
        thuongHieu.setTenThuongHieu(tenThuongHieu);
        return thuongHieuRepository.save(thuongHieu).getId();
    }

    @Override
    public int createDanhMuc(String tenDanhMuc) {
        if (danhMucRepository.existsByLoai(tenDanhMuc)) {
            return -1;
        }
        DanhMuc danhMuc = new DanhMuc();
        danhMuc.setLoai(tenDanhMuc);
        return danhMucRepository.save(danhMuc).getId();
    }

    @Override
    public int createBoMon(String tenBoMon) {
        if (boMonRepository.existsByTenBoMon(tenBoMon)) {
            return -1;
        }
        BoMon boMon = new BoMon();
        boMon.setTenBoMon(tenBoMon);
        return boMonRepository.save(boMon).getId();
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

    @Override
    public List<Mau> getAllMau() {
        return mauRepository.findAll();
    }

    @Override
    public List<Size> getAllSize() {
        return sizeRepository.findAll();
    }

    @Override
    public int createMau(String tenMau) {
        if (mauRepository.existsByTenMau(tenMau)) {
            return -1;
        }
        Mau mau = new Mau();
        mau.setTenMau(tenMau);
        return mauRepository.save(mau).getId();
    }

    @Override
    public int createSize(String tenSize) {
        if (sizeRepository.existsBySize(tenSize)) {
            return -1;
        }
        Size size = new Size();
        size.setSize(tenSize);
        return sizeRepository.save(size).getId();
    }

    @Override
    public int createBienTheSanPham(int sanPhamId, int mauId, int sizeId, int soLuong, MultipartFile hinhAnh) {
        try {
            Optional<SanPham> sp = sanPhamRepository.findById(sanPhamId);
            Optional<Mau> mau = mauRepository.findById(mauId);

            if (sp.isEmpty() || mau.isEmpty()) {
                return -1;
            }

            SanPham sanPham = sp.get();
            Mau selectedMau = mau.get();
            String tenBienThe = sanPham.getTenSanPham() + " - " + selectedMau.getTenMau();
            String fileName = HashingName.generateImageName(tenBienThe, hinhAnh.getOriginalFilename());
            Path imagePath = Helper.getPath(fileName);
            BienThe bienThe = new BienThe();

            if (!sanPham.getDanhMuc().getLoai().equals("Vợt")) {
                Optional<Size> size = sizeRepository.findById(sizeId);
                if (size.isEmpty() || bienTheRepository.existsBySanPham_IdAndMau_IdAndSize_Id(sanPhamId, mauId, sizeId)) {
                    return size.isEmpty() ? -1 : -3;
                }
                bienThe.setSize(size.get());
                tenBienThe += ", size " + size.get().getSize();
            } else if (bienTheRepository.existsBySanPham_IdAndMau_Id(sanPhamId, mauId)) {
                return -3;
            }

            bienThe.setMau(selectedMau);
            bienThe.setSoLuongTon(soLuong);
            bienThe.setHinhAnh(fileName);
            bienThe.setSanPham(sanPham);
            bienThe.setTenBienThe(tenBienThe);

            int id = bienTheRepository.save(bienThe).getId();

            if (id > 0) {
                Files.createDirectories(imagePath.getParent());
                Files.copy(hinhAnh.getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);
                return id;
            }
            return -2;
        } catch (Exception e) {
            e.printStackTrace();
            return -1;
        }
    }

    @Override
    public int updateBienTheSanPham(int id, String tenBienThe, int sanPhamId, int mauId, int sizeId, int soLuong, MultipartFile hinhAnh) {
        try {
            // Fetch all required entities in one go
            Optional<BienThe> bienTheOpt = bienTheRepository.findById(id);
            Optional<Mau> mauOpt = mauRepository.findById(mauId);
            Optional<SanPham> sanPhamOpt = sanPhamRepository.findById(sanPhamId);

            if (bienTheOpt.isEmpty() || mauOpt.isEmpty() || sanPhamOpt.isEmpty()) {
                return -1; // Return -1 if any entity is missing
            }

            BienThe bienThe = bienTheOpt.get();
            Mau mau = mauOpt.get();
            SanPham sanPham = sanPhamOpt.get();

            String tenBienTheMoi = sanPham.getTenSanPham() + " - " + mau.getTenMau();
            String fileName = HashingName.generateImageName(tenBienTheMoi, hinhAnh.getOriginalFilename());
            Path oldImagePath = Helper.getPath(bienThe.getHinhAnh());
            Path imagePath = Helper.getPath(fileName);

            if (sizeId != 0) {
                Optional<Size> sizeOpt = sizeRepository.findById(sizeId);
                if (sizeOpt.isEmpty() || bienTheRepository.existsBySanPham_IdAndMau_IdAndSize_Id(sanPhamId, mauId, sizeId)) {
                    return sizeOpt.isEmpty() ? -1 : -3; // Return -3 if duplicate size exists
                }
                bienThe.setSize(sizeOpt.get());
                tenBienTheMoi += ", size " + sizeOpt.get().getSize();
            } else if (bienTheRepository.existsBySanPham_IdAndMau_Id(sanPhamId, mauId)) {
                return -3; // Return -3 if duplicate mau exists
            } else {
                bienThe.setSize(null);
            }


            // Update BienThe properties
            bienThe.setTenBienThe(tenBienTheMoi);
            bienThe.setMau(mau);
            bienThe.setSoLuongTon(soLuong);
            bienThe.setHinhAnh(fileName);
            bienThe.setSanPham(sanPham);

            int bienTheId = bienTheRepository.save(bienThe).getId();

            if (bienTheId > 0) {
                Files.createDirectories(imagePath.getParent());
                Files.copy(hinhAnh.getInputStream(), imagePath, StandardCopyOption.REPLACE_EXISTING);
                return bienTheId;
            }
            return -2; // Return -2 if save fails
        } catch (Exception e) {
            e.printStackTrace();
            return -1; // Return -1 for any exception
        }
    }


    @Override
    public int deleteBienTheSanPham(int id) {
        try {
            Optional<BienThe> bienThe = bienTheRepository.findById(id);
            if (bienThe.isEmpty()) {
                return -1;
            }
            if (ctHoaDonRepository.existsByBienThe_Id(id) || ctNhapHangRepository.existsByBienThe_Id(id)) {
                return -2;
            }
            Path oldImagePath = Helper.getPath(bienThe.get().getHinhAnh());
            bienTheRepository.delete(bienThe.get());
            return id;
        } catch (Exception e) {
            e.printStackTrace();
            return -1;
        }
    }
}

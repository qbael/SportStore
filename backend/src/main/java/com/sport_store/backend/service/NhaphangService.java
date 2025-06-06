package com.sport_store.backend.service;

import com.sport_store.backend.dto.CTNhapHangDTO;
import com.sport_store.backend.dto.CTNhapHangRequestDTO;
import com.sport_store.backend.dto.ChiTietSanPhamDTO;
import com.sport_store.backend.dto.NhaCungCapDTO;
import com.sport_store.backend.dto.NhanVienDTO;
import com.sport_store.backend.dto.NhapHangDTO;
import com.sport_store.backend.dto.NhapHangRequestDTO;
import com.sport_store.backend.entity.BienThe;
import com.sport_store.backend.entity.CTNhapHang;
import com.sport_store.backend.entity.NhapHang;
import com.sport_store.backend.entity.SanPham;
import com.sport_store.backend.entity.Enum.TrangThaiHoaDon;
import com.sport_store.backend.repository.BienTheRepository;
import com.sport_store.backend.repository.NhapHangRepository;
import com.sport_store.backend.repository.SanPhamRepository;
import com.sport_store.backend.service.service_interface.SanPhamService;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
@Service
public class NhaphangService {

    @Autowired
    private NhapHangRepository nhapHangRepository;

    @Autowired
    private SanPhamRepository sanPhamRepository;

    @Autowired
    private BienTheRepository bienTheRepository;

    @Transactional
    public NhapHang createNhapHang(NhapHangRequestDTO nhapHang) {
        
        NhapHang nhapHangEntity = new NhapHang();
        nhapHangEntity.setTongGiaNhap(nhapHang.getTongGiaNhap());
        nhapHangEntity.setTrangThai(nhapHang.getTrangThai());
        nhapHangEntity.setNhaCungCap(nhapHang.getNhaCungCap());
        nhapHangEntity.setNhanVien(nhapHang.getNhanVien());
        
        if (nhapHang.getNgay() == null) {
            nhapHang.setNgay(LocalDate.now());
        }
        nhapHangEntity.setNgay(nhapHang.getNgay());
        int tongGiaNhap = 0;
        List<CTNhapHang> dsCTNhapHang = new ArrayList<>();
        if (nhapHang.getDsCTNhapHang() != null) {
            for (CTNhapHangRequestDTO ct : nhapHang.getDsCTNhapHang()) {
                CTNhapHang ctNhapHang = new CTNhapHang();
                ctNhapHang.setSoLuong(ct.getSoLuong());
                ctNhapHang.setGiaNhap(ct.getGiaNhap());
                tongGiaNhap += ct.getSoLuong() * ct.getGiaNhap();
        
                // Fetch biến thể từ DB
                BienThe bienThe = bienTheRepository.findById(ct.getBienThe().getId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy biến thể"));
        
                // Gán lại biến thể đã đầy đủ vào chi tiết nhập hàng
                ctNhapHang.setBienThe(bienThe);
                ctNhapHang.setNhapHang(nhapHangEntity);
                dsCTNhapHang.add(ctNhapHang);
        
                // Cập nhật giá nhập cho sản phẩm tương ứng
                SanPham sanPham = bienThe.getSanPham();
                sanPham.setGiaNhap(ct.getGiaNhap());
                sanPhamRepository.save(sanPham);
            }
        }
        // tính tổng giá nhập
        nhapHangEntity.setTongGiaNhap(tongGiaNhap);
        nhapHangEntity.setDsCTNhapHang(dsCTNhapHang);
        return nhapHangRepository.save(nhapHangEntity);
    }

    public List<NhapHang> getAllNhapHang() {
        return nhapHangRepository.findAll();
    }

    @Transactional
    public Page<NhapHangDTO> getFilteredNhapHang(
            LocalDate startDate,
            LocalDate endDate,
            String filterField,
            String filterValue,
            Pageable pageable) {

        Specification<NhapHang> spec = new Specification<NhapHang>() {
            @Override
            public Predicate toPredicate(Root<NhapHang> root, CriteriaQuery<?> query, CriteriaBuilder builder) {
                List<Predicate> predicates = new ArrayList<>();

                // Lọc theo khoảng thời gian
                if (startDate != null) {
                    predicates.add(builder.greaterThanOrEqualTo(root.get("ngay"), startDate));
                }
                if (endDate != null) {
                    predicates.add(builder.lessThanOrEqualTo(root.get("ngay"), endDate));
                }

                // Lọc theo trường bất kỳ
                if (filterField != null && !filterField.isEmpty() && filterValue != null && !filterValue.isEmpty()) {
                    if (filterField.startsWith("nhaCungCap.")) {
                        // Lọc theo thuộc tính của NhaCungCap (ví dụ: nhaCungCap.tenNCC)
                        String field = filterField.split("\\.")[1];
                        predicates.add(builder.like(
                                builder.lower(root.get("nhaCungCap").get(field)),
                                "%" + filterValue.toLowerCase() + "%"
                        ));
                    } else if (filterField.startsWith("nhanVien.")) {
                        // Lọc theo thuộc tính của NhanVien (ví dụ: nhanVien.hoTen)
                        String field = filterField.split("\\.")[1];
                        predicates.add(builder.like(
                                builder.lower(root.get("nhanVien").get(field)),
                                "%" + filterValue.toLowerCase() + "%"
                        ));
                    } else {
                        // Lọc theo thuộc tính của NhapHang
                        predicates.add(builder.like(
                                builder.lower(root.get(filterField)),
                                "%" + filterValue.toLowerCase() + "%"
                        ));
                    }
                }

                return builder.and(predicates.toArray(new Predicate[0]));
            }
        };

        // Thực hiện truy vấn với Specification và Pageable
        Page<NhapHang> nhapHangPage = nhapHangRepository.findAll(spec, pageable);

        // Ánh xạ sang NhapHangDTO
        return nhapHangPage.map(nhapHang -> {
            NhapHangDTO nhapHangDTO = new NhapHangDTO();
            nhapHangDTO.setId(nhapHang.getId());
            nhapHangDTO.setNgay(nhapHang.getNgay());
            nhapHangDTO.setTongGiaNhap(nhapHang.getTongGiaNhap());
            nhapHangDTO.setTrangThai(nhapHang.getTrangThai());

            // Ánh xạ NhanVienDTO
            if (nhapHang.getNhanVien() != null) {
                NhanVienDTO nhanVienDTO = new NhanVienDTO(
                        nhapHang.getNhanVien().getId(),
                        nhapHang.getNhanVien().getHoTen(),
                        nhapHang.getNhanVien().getNgaySinh(),
                        nhapHang.getNhanVien().isGioiTinh(),
                        nhapHang.getNhanVien().getDiaChi(),
                        nhapHang.getNhanVien().getEmail(),
                        nhapHang.getNhanVien().getSdt(),
                        nhapHang.getNhanVien().getChucVu().getId(),
                        nhapHang.getNhanVien().getChucVu().getTenChucVu().toString(),
                        nhapHang.getNhanVien().getPassword()
                );
                nhapHangDTO.setNhanVien(nhanVienDTO);
            }

            // Ánh xạ NhaCungCap
            if (nhapHang.getNhaCungCap() != null) {
                NhaCungCapDTO nhaCungCapDTO = new NhaCungCapDTO();
                nhaCungCapDTO.setId(nhapHang.getNhaCungCap().getId());
                nhaCungCapDTO.setTenNhaCungCap(nhapHang.getNhaCungCap().getTenNCC());
                nhaCungCapDTO.setDiaChi(nhapHang.getNhaCungCap().getDiaChi());
                nhaCungCapDTO.setSdt(nhapHang.getNhaCungCap().getSdt());
                nhapHangDTO.setNhaCungCap(nhaCungCapDTO);
            }

            // Ánh xạ dsCTNhapHang (có thể cần truy vấn bổ sung nếu không fetch sẵn)
            List<CTNhapHangDTO> ctNhapHangDTOs = new ArrayList<>();
            for (CTNhapHang ctNhapHang : nhapHang.getDsCTNhapHang()) {
                CTNhapHangDTO ctNhapHangDTO = new CTNhapHangDTO();
                ctNhapHangDTO.setId(ctNhapHang.getId());
                ctNhapHangDTO.setSoLuong(ctNhapHang.getSoLuong());
                ctNhapHangDTO.setGiaNhap(ctNhapHang.getGiaNhap());
                ctNhapHangDTO.setIdbienthe(ctNhapHang.getBienThe().getId());
                ctNhapHangDTO.setTenBienthe(ctNhapHang.getBienThe().getTenBienThe());
                ctNhapHangDTO.setHinhanh(ctNhapHang.getBienThe().getHinhAnh());
                ctNhapHangDTOs.add(ctNhapHangDTO);
            }
            nhapHangDTO.setDsCTNhapHang(ctNhapHangDTOs);
            return nhapHangDTO;
        });
    }

    @Transactional 
    public boolean updatestatus(int id, TrangThaiHoaDon status) {
        NhapHang nhapHang = nhapHangRepository.findById(id).orElse(null);
        if (nhapHang != null) {
            nhapHang.setTrangThai(status);
            nhapHangRepository.save(nhapHang);
            if (nhapHang.getTrangThai() == TrangThaiHoaDon.DAGIAO) {
                for (CTNhapHang ct : nhapHang.getDsCTNhapHang()) {
                    BienThe bienThe = ct.getBienThe();
                    // SanPham sanPham = bienThe.getSanPham();
                    bienThe.setSoLuongTon(bienThe.getSoLuongTon() + ct.getSoLuong());
                }
            }
            return true;
        }
        return false;
    }

    
}

package com.sport_store.backend.controller;

import com.sport_store.backend.dto.ChiTietSanPhamDTO;
import com.sport_store.backend.dto.DsThongTinSPDTO;
import com.sport_store.backend.entity.BoMon;
import com.sport_store.backend.entity.DanhMuc;
import com.sport_store.backend.entity.SanPham;
import com.sport_store.backend.entity.ThuongHieu;
import com.sport_store.backend.service.service_interface.SanPhamService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@CrossOrigin("*")
@RestController
@RequestMapping("api/sanpham")
public class SanPhamController {
    public SanPhamService sanPhamService;

    public SanPhamController(SanPhamService sanPhamService) {
        this.sanPhamService = sanPhamService;
    }

    @GetMapping
    public Page<SanPham> getProducts(
            @RequestParam(name = "page", required = false, defaultValue = "0") Integer page,
            @RequestParam(name = "limit", required = false, defaultValue = "12") Integer limit,
            @RequestParam(name = "bomon", required = false) String bomon,
            @RequestParam(name = "danhmuc", required = false) String danhmuc,
            @RequestParam(name = "thuonghieu", required = false) String thuonghieu,
            @RequestParam(name = "minprice", required = false, defaultValue = "0") Integer minprice,
            @RequestParam(name = "maxprice", required = false) Integer maxprice,
            @RequestParam(name = "sort", required = false, defaultValue = "id") String sort,
            @RequestParam(name = "sortdir", required = false, defaultValue = "ASC") String sortDir,
            @RequestParam(name = "search", required = false) String search,
            @RequestParam(name = "searchBy", required = false) String searchBy,
            @RequestParam(name = "status", required = false) Boolean status
    ) {
        Pageable pageable = PageRequest.of(page, limit, Sort.by(
                sortDir.equalsIgnoreCase("ASC") ? Sort.Direction.ASC : Sort.Direction.DESC, sort
        ));

        return sanPhamService.getFilteredProducts(bomon, danhmuc, thuonghieu, minprice, maxprice, search, searchBy, status, pageable);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ChiTietSanPhamDTO> getAllBienTheOfSanPham(@PathVariable int id) {
        return ResponseEntity.ok(sanPhamService.getAllBienTheOfSanPham(id));
    }

    @GetMapping("/ds")
    public ResponseEntity<DsThongTinSPDTO> getAllBomon() {
        List<DanhMuc> dsDanhMuc = sanPhamService.getAllDanhMuc();
        List<ThuongHieu> dsThuongHieu = sanPhamService.getAllThuongHieu();
        List<BoMon> dsBoMon = sanPhamService.getAllBoMon();
        DsThongTinSPDTO dsThongTinSPDTO = new DsThongTinSPDTO();
        dsThongTinSPDTO.setDsDanhMuc(dsDanhMuc);
        dsThongTinSPDTO.setDsThuongHieu(dsThuongHieu);
        dsThongTinSPDTO.setDsBoMon(dsBoMon);
        return ResponseEntity.ok(dsThongTinSPDTO);
    }

    public record savedSanPhamResponseDTO(String message, int id) {
    }

    @PostMapping
    public ResponseEntity<?> createSanPham(@RequestParam("tenSanPham") String tenSanPham,
                                           @RequestParam("giaNhap") Integer giaNhap,
                                           @RequestParam("giaBan") Integer giaBan,
                                           @RequestParam("moTa") String moTa,
                                           @RequestParam("thuongHieuId") Integer thuongHieuId,
                                           @RequestParam("danhMucId") Integer danhMucId,
                                           @RequestParam("boMonId") Integer boMonId,
                                           @RequestParam("hinhAnh") MultipartFile hinhAnh) {
        int id = sanPhamService.createSanPham(tenSanPham, giaNhap, giaBan, moTa, thuongHieuId, danhMucId, boMonId, hinhAnh);
        if (id > 0) {
            return ResponseEntity.ok(new savedSanPhamResponseDTO("Thêm sản phẩm thành công", id));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi thêm sản phẩm");
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSanPham(@PathVariable int id,
                                           @RequestParam("tenSanPham") String tenSanPham,
                                           @RequestParam("giaNhap") Integer giaNhap,
                                           @RequestParam("giaBan") Integer giaBan,
                                           @RequestParam("moTa") String moTa,
                                           @RequestParam("thuongHieuId") Integer thuongHieuId,
                                           @RequestParam("danhMucId") Integer danhMucId,
                                           @RequestParam("boMonId") Integer boMonId,
                                           @RequestParam("trangThai") Boolean trangThai,
                                           @RequestParam("hinhAnh") MultipartFile hinhAnh) {
        int signal = sanPhamService.updateSanPham(id, tenSanPham, giaNhap, giaBan, moTa, thuongHieuId, danhMucId, boMonId, trangThai, hinhAnh);
        if (signal > 0) {
            return ResponseEntity.ok(new savedSanPhamResponseDTO("Cập nhật sản phẩm thành công", signal));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi cập nhật sản phẩm");
        }
    }
}

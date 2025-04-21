package com.sport_store.backend.controller;

import com.sport_store.backend.dto.ChiTietSanPhamDTO;
import com.sport_store.backend.dto.DsThongTinSPDTO;
import com.sport_store.backend.entity.*;
import com.sport_store.backend.service.service_interface.SanPhamService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.query.Param;
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
            @RequestParam(name = "searchBy", required = false, defaultValue = "tenSanPham") String searchBy,
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
        List<NhaCungCap> dsNhaCungCap = sanPhamService.getAllNhaCungCap();
        DsThongTinSPDTO dsThongTinSPDTO = new DsThongTinSPDTO();
        dsThongTinSPDTO.setDsDanhMuc(dsDanhMuc);
        dsThongTinSPDTO.setDsThuongHieu(dsThuongHieu);
        dsThongTinSPDTO.setDsBoMon(dsBoMon);
        dsThongTinSPDTO.setDsNhaCungCap(dsNhaCungCap);
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
                                           @RequestParam("hinhAnh") MultipartFile hinhAnh,
                                           @RequestParam("nhaCungCapId") Integer nhaCungCapId) {
        int id = sanPhamService.createSanPham(tenSanPham, giaNhap, giaBan, moTa, thuongHieuId, danhMucId, boMonId, hinhAnh, nhaCungCapId);
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
                                           @RequestParam("hinhAnh") MultipartFile hinhAnh,
                                           @RequestParam("nhaCungCapId") Integer nhaCungCapId) {
        int signal = sanPhamService.updateSanPham(id, tenSanPham, giaNhap, giaBan, moTa, thuongHieuId, danhMucId, boMonId, trangThai, hinhAnh, nhaCungCapId);
        if (signal > 0) {
            return ResponseEntity.ok(new savedSanPhamResponseDTO("Cập nhật sản phẩm thành công", signal));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi cập nhật sản phẩm");
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSanPham(@PathVariable int id) {
        int signal = sanPhamService.deleteSanPham(id);
        if(signal == -2) {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("Sản phẩm có tồn tại trong đơn hàng nên không thể xóa");
        }
        if(signal == -1) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Sản phẩm không tồn tại");
        }
        if(signal > 0) {
            return ResponseEntity.ok(new savedSanPhamResponseDTO("Xóa sản phẩm thành công", signal));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi xóa sản phẩm");
        }
    }

    public record dsMauSizeResponseDTO(List<Mau> dsMau, List<Size> dsSize) {
    }

    @GetMapping("/mausize")
    public ResponseEntity<?> getAllMau() {
        List<Mau> dsMau = sanPhamService.getAllMau();
        List<Size> dsSize = sanPhamService.getAllSize();
        if (dsMau == null || dsSize == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi lấy danh sách màu và size");
        }
        dsMauSizeResponseDTO dsMauSize = new dsMauSizeResponseDTO(dsMau, dsSize);
        return ResponseEntity.ok(dsMauSize);
    }

    @PostMapping("/{id}")
    public ResponseEntity<?> createBienTheSanPham(@PathVariable int id,
                                                  @RequestParam("mauId") int mauId,
                                                  @RequestParam("sizeId") int sizeId,
                                                  @RequestParam("soLuongTon") int soLuongTon,
                                                  @RequestParam("hinhAnh") MultipartFile hinhAnh) {
        int signal = sanPhamService.createBienTheSanPham(id, mauId, sizeId, soLuongTon, hinhAnh);

        if (signal == -1) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tồn tại sản phẩm hoặc màu hoặc size không tồn tại");
        }
        if (signal == -3) {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("Biến thể sản phẩm đã tồn tại");
        }

        if (signal > 0) {
            return ResponseEntity.ok(new savedSanPhamResponseDTO("Thêm biến thể sản phẩm thành công", signal));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi thêm biến thể sản phẩm");
        }
    }

    @PutMapping("/bienthe/{id}")
    public ResponseEntity<?> updateBienTheSanPham(@PathVariable int id,
                                                  @RequestParam("tenBienThe") String tenBienThe,
                                                  @RequestParam("sanPhamId") int sanPhamId,
                                                  @RequestParam("mauId") int mauId,
                                                  @RequestParam("sizeId") int sizeId,
                                                  @RequestParam("soLuongTon") int soLuongTon,
                                                  @RequestParam("hinhAnh") MultipartFile hinhAnh) {
        int signal = sanPhamService.updateBienTheSanPham(id, tenBienThe, sanPhamId, mauId, sizeId, soLuongTon, hinhAnh);
        if (signal == -1) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tồn tại biến thể sản phẩm hoặc sản phẩm không tồn tại");
        }
        if (signal == -3) {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("Biến thể sản phẩm đã tồn tại");
        }
        if (signal > 0) {
            return ResponseEntity.ok(new savedSanPhamResponseDTO("Cập nhật biến thể sản phẩm thành công", signal));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi cập nhật biến thể sản phẩm");
        }
    }

    @DeleteMapping("/bienthe/{id}")
    public ResponseEntity<?> deleteBienTheSanPham(@PathVariable int id) {
        int signal = sanPhamService.deleteBienTheSanPham(id);
        if (signal == -1) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Không tồn tại biến thể sản phẩm");
        }
        if (signal == -2) {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("Biến thể sản phẩm có tồn tại trong đơn hàng nên không thể xóa");
        }
        if (signal > 0) {
            return ResponseEntity.ok(new savedSanPhamResponseDTO("Xóa biến thể sản phẩm thành công", signal));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi xóa biến thể sản phẩm");
        }
    }

    public record thuongHieuDTO(String tenThuongHieu) {}
    public record danhMucDTO(String loai) {}
    public record boMonDTO(String tenBoMon) {}
    public record mauDTO(String tenMau) {}
    public record sizeDTO(String tenSize) {}

    @PostMapping("/thuonghieu")
    public ResponseEntity<?> createThuongHieu(@RequestBody thuongHieuDTO thuongHieuDTO) {
        int signal = sanPhamService.createThuongHieu(thuongHieuDTO.tenThuongHieu);
        if (signal == -1) {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("Tên thương hiệu đã tồn tại");
        }
        if (signal > 0) {
            return ResponseEntity.ok(new savedSanPhamResponseDTO("Thêm thương hiệu thành công", signal));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi thêm thương hiệu");
        }
    }

    @PostMapping("/bomon")
    public ResponseEntity<?> createBoMon(@RequestBody boMonDTO boMonDTO) {
        int signal = sanPhamService.createBoMon(boMonDTO.tenBoMon);
        if (signal == -1) {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("Tên bộ môn đã tồn tại");
        }
        if (signal > 0) {
            return ResponseEntity.ok(new savedSanPhamResponseDTO("Thêm bộ môn thành công", signal));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi thêm bộ môn");
        }
    }

    @PostMapping("/danhmuc")
    public ResponseEntity<?> createLoaiSanPham(@RequestBody danhMucDTO danhMucDTO) {
        int signal = sanPhamService.createDanhMuc(danhMucDTO.loai);
        if (signal == -1) {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("Tên loại sản phẩm đã tồn tại");
        }
        if (signal > 0) {
            return ResponseEntity.ok(new savedSanPhamResponseDTO("Thêm loại sản phẩm thành công", signal));
        }
        else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi thêm loại sản phẩm");
        }
    }

    @PostMapping("/size")
    public ResponseEntity<?> createSize(@RequestBody sizeDTO size) {
        int signal = sanPhamService.createSize(size.tenSize);
        if (signal == -1) {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("Size đã tồn tại");
        }
        if (signal > 0) {
            return ResponseEntity.ok(new savedSanPhamResponseDTO("Thêm size thành công", signal));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi thêm size");
        }
    }

    @PostMapping("/mau")
    public ResponseEntity<?> createMau(@RequestBody mauDTO mau) {
        int signal = sanPhamService.createMau(mau.tenMau);
        if (signal == -1) {
            return ResponseEntity.status(HttpStatus.NOT_ACCEPTABLE).body("Màu đã tồn tại");
        }
        if (signal > 0) {
            return ResponseEntity.ok(new savedSanPhamResponseDTO("Thêm màu thành công", signal));
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi thêm màu");
        }
    }

    // get nha cung c
    @GetMapping("/nhacungcap/{idncc}")
    public ResponseEntity<List<ChiTietSanPhamDTO>> getSanPhamTheoNhaCungCap(@PathVariable int idncc) {
        List<ChiTietSanPhamDTO> result = sanPhamService.getallNhacungcap(idncc);
        return ResponseEntity.ok(result);
    }

}

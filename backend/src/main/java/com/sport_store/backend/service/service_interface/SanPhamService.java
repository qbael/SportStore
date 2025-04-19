package com.sport_store.backend.service.service_interface;

import com.sport_store.backend.dto.ChiTietSanPhamDTO;
import com.sport_store.backend.entity.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


public interface SanPhamService {
    Page<SanPham> getFilteredProducts(String bomon, String danhmuc, String thuonghieu,
                                      Integer minprice, Integer maxprice, String search, String searchBy,
                                      Boolean status, Pageable pageable);

    int createSanPham(String tenSanPham, Integer giaNhap, Integer giaBan,
                      String moTa, Integer thuongHieuId, Integer danhMucId,
                      Integer boMonId, MultipartFile hinhAnh);

    int updateSanPham(Integer id, String tenSanPham, Integer giaNhap, Integer giaBan,
                      String moTa, Integer thuongHieuId, Integer danhMucId,
                      Integer boMonId, Boolean trangThai, MultipartFile hinhAnh);

    int deleteSanPham(int id);

    SanPham getSanPhamById(int id);

    ChiTietSanPhamDTO getAllBienTheOfSanPham(int id);

    DanhMuc getDanhMucById(int id);
    BoMon getBoMonById(int id);
    ThuongHieu getThuongHieuById(int id);

    List<ThuongHieu> getAllThuongHieu();
    List<DanhMuc> getAllDanhMuc();
    List<BoMon> getAllBoMon();

    List<Mau> getAllMau();
    List<Size> getAllSize();

    int createBienTheSanPham(int sanPhamId, int mauId, int sizeId, int soLuong, MultipartFile hinhAnh);
    int updateBienTheSanPham(int id, String tenBienThe, int sanPhamId, int mauId, int sizeId, int soLuong, MultipartFile hinhAnh);
    int deleteBienTheSanPham(int id);
}

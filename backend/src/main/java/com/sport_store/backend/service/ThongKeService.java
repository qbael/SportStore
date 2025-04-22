package com.sport_store.backend.service;

import com.sport_store.backend.dto.ThongKeKhachHangDTO;
import com.sport_store.backend.dto.ThongKeNhapHangDTO;
import com.sport_store.backend.dto.ThongKeSanPhamDTO;
import com.sport_store.backend.repository.HoaDonRepository;
import com.sport_store.backend.repository.NhapHangRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class ThongKeService {

    private final HoaDonRepository hoaDonRepository;
    private final NhapHangRepository nhapHangRepository;

    public ThongKeService(HoaDonRepository hoaDonRepository,
                          NhapHangRepository nhapHangRepository) {
        this.hoaDonRepository = hoaDonRepository;
        this.nhapHangRepository = nhapHangRepository;
    }

    public List<ThongKeSanPhamDTO> thongKeSanPham(LocalDate from,
                                                  LocalDate to,
                                                  String sortBy,
                                                  String sortDir) {


        if (from == null) {
            from = hoaDonRepository.findMinNgay();
        }
        if (to == null) {
            to = LocalDate.now();
        }

        List<Object[]> results = hoaDonRepository.thongKeTheoGiaBanSanPham(from, to, sortBy, sortDir);

        List<ThongKeSanPhamDTO> statisticsList = new ArrayList<>();

        for (Object[] row : results) {
            ThongKeSanPhamDTO stats = new ThongKeSanPhamDTO(
                    (Integer) row[0],
                    (Integer) row[1],
                    (String) row[2],
                    (String) row[3],
                    (Integer) row[4],
                    (Integer) row[5],
                    ((BigDecimal) row[6]).intValue(),
                    ((BigDecimal) row[7]).intValue(),
                    ((BigDecimal) row[8]).intValue(),
                    ((BigDecimal) row[9]).doubleValue()
            );
            statisticsList.add(stats);
        }

        return statisticsList;
    }

    public List<ThongKeKhachHangDTO> thongKeKhachHang(LocalDate from,
                                                      LocalDate to){

        if (from == null) {
            from = hoaDonRepository.findMinNgay();
        }
        if (to == null) {
            to = LocalDate.now();
        }

        List<Object[]> rawData = hoaDonRepository.thongKeKhachHangTheoTienMua(from, to);

        return rawData.stream().map(obj -> {;
            ThongKeKhachHangDTO dto = new ThongKeKhachHangDTO();
            dto.setId((Integer) obj[0]);
            dto.setHoTen((String) obj[1]);
            dto.setSdt((String) obj[2]);
            dto.setEmail((String) obj[3]);
            dto.setSoDonHang(((Number) obj[4]).intValue());
            dto.setTongTienMua(((Number) obj[5]).intValue());
            return dto;
        }).toList();
    }

    public List<ThongKeNhapHangDTO> thongKeNhapHang(LocalDate from,
                                                    LocalDate to,
                                                    String sortBy,
                                                    String sortDir) {
        if (from == null) {
            from = nhapHangRepository.findMinNgay();
        }
        if (to == null) {
            to = LocalDate.now();
        }

        List<Object[]> rawData = nhapHangRepository.thongKeNhapHangTheoGiaNhap(from, to, sortBy, sortDir);

        return rawData.stream().map(obj -> {
            ThongKeNhapHangDTO dto = new ThongKeNhapHangDTO();
            dto.setSanPhamId((Integer) obj[0]);
            dto.setBienTheId((Integer) obj[1]);
            dto.setTenBienThe((String) obj[2]);
            dto.setHinhAnh((String) obj[3]);
            dto.setGiaNhap(((Number) obj[4]).intValue());
            dto.setTongSoLuongNhap(((Number) obj[5]).intValue());
            dto.setTongSoTienNhap(((Number) obj[6]).intValue());
            return dto;
        }).toList();
    }
}

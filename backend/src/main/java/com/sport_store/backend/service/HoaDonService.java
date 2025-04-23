package com.sport_store.backend.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sport_store.backend.entity.CTHoaDon;
import com.sport_store.backend.entity.HoaDon;
import com.sport_store.backend.projection.HoaDonFullProjection;
import com.sport_store.backend.repository.BienTheRepository;
import com.sport_store.backend.repository.CTHoaDonRepository;
import com.sport_store.backend.repository.HoaDonRepository;
import com.sport_store.backend.repository.TTKhachHangRepository;
import com.sport_store.backend.entity.Enum.TrangThaiHoaDon;


@Service
public class HoaDonService {

    @Autowired
    private HoaDonRepository hoaDonRepository;

    @Autowired
    private CTHoaDonRepository ctHoaDonRepository;

    @Autowired
    private TTKhachHangRepository ttKhachHangRepository;

    @Autowired
    private BienTheRepository bienTheRepository;

    @Transactional
    public Page<HoaDonFullProjection> getHoaDons(Pageable pageable) {
        return hoaDonRepository.findAllProjectedBy(pageable); // Cập nhật lời gọi phương thức
    }

    @Transactional
    public HoaDon createHoaDon(HoaDon hoaDon) {
        if (hoaDon.getNgay() == null) {
            hoaDon.setNgay(LocalDate.now());
        }

        // Xử lý các chi tiết hóa đơn
        if (hoaDon.getDsCTHoaDon() != null) {
            for (CTHoaDon ct : hoaDon.getDsCTHoaDon()) {
                ct.setHoaDon(hoaDon);
            }
        }

        // Lấy thông tin khách hàng nếu có và gán vào hóa đơn
        if (hoaDon.getTtKhachHang() != null) {
            hoaDon.setTtKhachHang(ttKhachHangRepository.findById(hoaDon.getTtKhachHang().getId()).orElse(null));
        }

        // check số lượng hàng hóa
        if (hoaDon.getDsCTHoaDon() != null) {
            boolean isValid = true;
            for (CTHoaDon ct : hoaDon.getDsCTHoaDon()) {
                // Kiểm tra số lượng hàng hóa
                if (ct.getSoLuong() > bienTheRepository.getSoLuong(ct.getBienThe().getId())) {
                    isValid = false;
                    throw new IllegalArgumentException("Số lượng hàng hóa không đủ");
                }
                // Cập nhật số lượng hàng hóa
                // bienTheRepository.updateSoLuong(ct.getBienThe().getId(), ct.getSoLuong());
            }
            if (isValid) {
                for (CTHoaDon ct : hoaDon.getDsCTHoaDon()) {
                    // Cập nhật số lượng hàng hóa
                    int sl = bienTheRepository.getSoLuong(ct.getBienThe().getId()) - ct.getSoLuong();
                    System.out.println("Số lượng tồn kho sau khi bán: " + sl);
                    bienTheRepository.updateSoLuong(ct.getBienThe().getId(), sl);
                }
            }
        }

        // Lưu hóa đơn vào database và trả về đối tượng đã lưu
        return hoaDonRepository.save(hoaDon);
    }

    @Transactional
    public Optional<HoaDonFullProjection> getHoaDonById(int id) {
        return hoaDonRepository.findById(id); // Tìm hóa đơn bằng id từ repository
    }

    @Transactional
    public Page<HoaDonFullProjection> searchHoaDons(
            Integer id,
            LocalDate ngay,
            LocalDate ngayTu,
            LocalDate ngayDen,
            String tenKhachHang,
            TrangThaiHoaDon trangThai,
            String soDienThoai,
            Integer minTongGiaBan,
            Integer maxTongGiaBan,
            Pageable pageable) {
    
        return hoaDonRepository.searchHoaDon(
                id, ngay, ngayTu, ngayDen, tenKhachHang,
                trangThai, soDienThoai, minTongGiaBan, maxTongGiaBan, pageable
        );
    }
    

    @Transactional
    public void deleteHoaDon(Integer id) {
        Optional<HoaDon> hoaDonOptional = hoaDonRepository.findById(id);
        if (hoaDonOptional.isPresent()) {
            HoaDon hoaDon = hoaDonOptional.get();
            // Xóa các chi tiết hóa đơn liên quan
            ctHoaDonRepository.deleteAll(hoaDon.getDsCTHoaDon());
            // Xóa hóa đơn
            hoaDonRepository.delete(hoaDon);
        }
    }
//  update trạng thái hóa đơn
    @Transactional
    public boolean updateHoaDonStatus(Integer id, TrangThaiHoaDon trangThai) {
        Optional<HoaDon> hoaDonOptional = hoaDonRepository.findById(id);
        if (hoaDonOptional.isPresent()) {
            HoaDon hoaDon = hoaDonOptional.get();
            hoaDon.setTrangThai(trangThai);
            hoaDonRepository.save(hoaDon);
            if (trangThai == TrangThaiHoaDon.DAHUY) {
                // Trả lại số lượng hàng hóa nếu hóa đơn bị hủy
                for (CTHoaDon ct : hoaDon.getDsCTHoaDon()) {
                    int sl = bienTheRepository.getSoLuong(ct.getBienThe().getId()) + ct.getSoLuong();
                    bienTheRepository.updateSoLuong(ct.getBienThe().getId(), sl);
                }
            }
            return true;
        }
        return false;
    }

    @Transactional
    public List<HoaDonFullProjection> getbyUserID(String username){
        return hoaDonRepository.findByIdKhachHang(username);
    }
}
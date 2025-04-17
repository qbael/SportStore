package com.sport_store.backend.service;

import java.time.LocalDate;
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
            if (isValid){
                for (CTHoaDon ct : hoaDon.getDsCTHoaDon()) {
                    // Cập nhật số lượng hàng hóa
                    int sl =  bienTheRepository.getSoLuong(ct.getBienThe().getId()) - ct.getSoLuong();
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
}
package com.sport_store.backend.service;

import com.sport_store.backend.dto.LoginResponseDTO;
import com.sport_store.backend.dto.TTKhachHangDTO;
import com.sport_store.backend.entity.TTKhachHang;
import com.sport_store.backend.entity.TaiKhoan;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthService {
    @PersistenceContext
    private EntityManager entityManager;

    public LoginResponseDTO login(String username, String password) {
        try {
            // Kiểm tra đầu vào
            if (username == null || username.trim().isEmpty() || password == null || password.trim().isEmpty()) {
                return new LoginResponseDTO("Tên người dùng và mật khẩu không được để trống");
            }

            TaiKhoan taiKhoan = entityManager.createQuery(
                            "SELECT t FROM TaiKhoan t WHERE t.username = :username", TaiKhoan.class)
                    .setParameter("username", username)
                    .getSingleResult();

            // Kiểm tra mật khẩu
            if (taiKhoan != null && taiKhoan.getPassword().equals(password)) {
                // Kiểm tra is_active
                if (!taiKhoan.getIsActive()) {
                    return new LoginResponseDTO("Tài khoản của bạn bị khóa");
                }

                // Chuyển đổi danh sách TTKhachHang thành danh sách TTKhachHangDTO
                List<TTKhachHangDTO> profile = taiKhoan.getDsTTKhachHang().stream()
                        .map(kh -> new TTKhachHangDTO(
                                kh.getId(),
                                kh.getHoTen(),
                                kh.getSdt(),
                                kh.getDiaChi(),
                                kh.getTaiKhoan().getId()))
                        .collect(Collectors.toList());

                return new LoginResponseDTO(taiKhoan.getUsername(), taiKhoan.getEmail(), taiKhoan.getIsActive(), profile);
            }
            return new LoginResponseDTO("Tên người dùng hoặc mật khẩu không đúng");
        } catch (NoResultException e) {
            return new LoginResponseDTO("Tên người dùng hoặc mật khẩu không đúng");
        } catch (Exception e) {
            throw new RuntimeException("Lỗi trong quá trình đăng nhập: " + e.getMessage());
        }
    }

    @Transactional
    public LoginResponseDTO register(String username, String password, String email,
                                     String hoTen, String diaChi, Integer sdt, Boolean isActive) {
        try {
            // Kiểm tra đầu vào
            if (username == null || username.trim().isEmpty() ||
                    password == null || password.trim().isEmpty() ||
                    email == null || email.trim().isEmpty() ||
                    hoTen == null || hoTen.trim().isEmpty() ||
                    diaChi == null || diaChi.trim().isEmpty()) {
                return new LoginResponseDTO("Thông tin bắt buộc không được để trống");
            }

            // Kiểm tra username đã tồn tại
            Long count = entityManager.createQuery(
                            "SELECT COUNT(t) FROM TaiKhoan t WHERE t.username = :username", Long.class)
                    .setParameter("username", username)
                    .getSingleResult();

            if (count > 0) {
                return new LoginResponseDTO("Tên người dùng đã tồn tại");
            }

            // Tạo tài khoản mới
            TaiKhoan taiKhoan = new TaiKhoan();
            taiKhoan.setUsername(username);
            taiKhoan.setPassword(password); // Nên mã hóa mật khẩu trong thực tế
            taiKhoan.setEmail(email);
            taiKhoan.setIsActive(isActive != null ? isActive : true); // Mặc định là true nếu isActive null
            taiKhoan.setDsTTKhachHang(new ArrayList<>());

            // Tạo thông tin khách hàng
            TTKhachHang ttKhachHang = new TTKhachHang();
            ttKhachHang.setHoTen(hoTen);
            ttKhachHang.setDiaChi(diaChi);
            ttKhachHang.setSdt(sdt);
            ttKhachHang.setTaiKhoan(taiKhoan);

            taiKhoan.getDsTTKhachHang().add(ttKhachHang);

            // Lưu vào cơ sở dữ liệu
            entityManager.persist(taiKhoan);

            // Chuyển đổi danh sách TTKhachHang thành danh sách TTKhachHangDTO
            List<TTKhachHangDTO> profile = taiKhoan.getDsTTKhachHang().stream()
                    .map(kh -> new TTKhachHangDTO(
                            kh.getId(),
                            kh.getHoTen(),
                            kh.getSdt(),
                            kh.getDiaChi(),
                            kh.getTaiKhoan().getId()))
                    .collect(Collectors.toList());

            return new LoginResponseDTO(taiKhoan.getUsername(), taiKhoan.getEmail(), taiKhoan.getIsActive(), profile);
        } catch (Exception e) {
            return new LoginResponseDTO("Đăng ký thất bại: " + e.getMessage());
        }
    }
}

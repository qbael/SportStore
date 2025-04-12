package com.sport_store.backend.service;

import com.sport_store.backend.dto.LoginResponseDTO;
import com.sport_store.backend.entity.TTKhachHang;
import com.sport_store.backend.entity.TaiKhoan;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
public class AuthService {
    @PersistenceContext
    private EntityManager entityManager;

    public LoginResponseDTO login(String username, String password) {
        try {
            TaiKhoan taiKhoan = entityManager.createQuery(
                            "SELECT t FROM TaiKhoan t WHERE t.username = :username", TaiKhoan.class)
                    .setParameter("username", username)
                    .getSingleResult();

            // Kiểm tra mật khẩu
            if (taiKhoan != null && taiKhoan.getPassword().equals(password)) {
                String hoTen = taiKhoan.getDsTTKhachHang() != null && !taiKhoan.getDsTTKhachHang().isEmpty()
                        ? taiKhoan.getDsTTKhachHang().get(0).getHoTen() : null;
                return new LoginResponseDTO(taiKhoan.getUsername(), taiKhoan.getEmail(), hoTen, null);
            }
            return new LoginResponseDTO(null, null, null, "Tên người dùng hoặc mật khẩu không đúng");
        } catch (NoResultException e) {
            return new LoginResponseDTO(null, null, null, "Tên người dùng hoặc mật khẩu không đúng");   // user sai ne
        } catch (Exception e) {
            throw new RuntimeException("Lỗi trong quá trình đăng nhập: " + e.getMessage());
        }
    }

    @Transactional
    public LoginResponseDTO register(String username, String password, String email,
                                     String hoTen, String diaChi, Integer sdt) {
        try {
            Long count = entityManager.createQuery(
                            "SELECT COUNT(t) FROM TaiKhoan t WHERE t.username = :username", Long.class)
                    .setParameter("username", username)
                    .getSingleResult();

            if (count > 0) {
                return new LoginResponseDTO(null, null, null, "Username already exists");
            }

            TaiKhoan taiKhoan = new TaiKhoan();
            taiKhoan.setUsername(username);
            taiKhoan.setPassword(password);
            taiKhoan.setEmail(email);
            taiKhoan.setDsTTKhachHang(new ArrayList<>());

            TTKhachHang ttKhachHang = new TTKhachHang();
            ttKhachHang.setHoTen(hoTen);
            ttKhachHang.setDiaChi(diaChi);
            ttKhachHang.setSdt(sdt);
            ttKhachHang.setTaiKhoan(taiKhoan);

            taiKhoan.getDsTTKhachHang().add(ttKhachHang);

            entityManager.persist(taiKhoan);

            return new LoginResponseDTO(taiKhoan.getUsername(), taiKhoan.getEmail(), hoTen, null);
        } catch (Exception e) {
            return new LoginResponseDTO(null, null, null, "Registration failed: " + e.getMessage());
        }
    }
}

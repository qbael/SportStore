package com.sport_store.backend.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@Entity
@Table(name = "nhanvien")
@NoArgsConstructor
@AllArgsConstructor
public class NhanVien {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "hoten")
    private String hoTen;

    @Column(name = "ngaysinh")
    private LocalDate ngaySinh;

    @Column(name = "gioitinh")
    private boolean gioiTinh;

    @Column(name = "diachi")
    private String diaChi;

    @Column(name = "email")
    private String email;

    @Column(name = "sdt")
    private int sdt;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "chucvu", nullable = false)
    private ChucVu chucVu;

    @Column(name = "password")
    private String password;
}
package com.sport_store.backend.entity;

import com.sport_store.backend.entity.Enum.TenChucVu;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "nhanvien")
public class NhanVien {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "hoten")
    private String hoTen;

    @Column(name = "sdt")
    private int sdt;

    @Column(name = "diachi")
    private String diaChi;

    @Column(name = "email")
    private String email;

    @Column(name = "ngaysinh")
    private LocalDate ngaySinh;

    @Column(name = "gioitinh")
    private boolean gioiTinh;

    @OneToMany(mappedBy = "nhanVien", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<NhapHang> dsNhapHang;

    @ManyToOne
    @JoinColumn(name = "chucvu")
    private ChucVu chucVu;
}
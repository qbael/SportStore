package com.sport_store.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ttkhachhang")
public class TTKhachHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "hoten")
    private String hoTen;

    @Column(name = "sdt")
    private int sdt;

    @Column(name = "diachi")
    private String diaChi;

    @ManyToOne
    @JoinColumn(name = "taikhoan")
    private TaiKhoan taiKhoan;

    @OneToMany(mappedBy = "ttKhachHang", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<HoaDon> dsHoaDon;
}
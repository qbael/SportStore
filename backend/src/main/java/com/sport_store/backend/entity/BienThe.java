package com.sport_store.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "bienthe")
public class BienThe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "tenbienthe")
    private String tenBienThe;

    @Column(name = "hinhanh")
    private String hinhAnh;

    @Column(name = "soluongton")
    private int soLuongTon;

    @ManyToOne
    @JoinColumn(name = "sanpham")
    @JsonBackReference
    private SanPham sanPham;

    @ManyToOne
    @JoinColumn(name = "size")
    private Size size;

    @ManyToOne
    @JoinColumn(name = "mau")
    private Mau mau;

    @OneToMany(mappedBy = "bienThe", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CTHoaDon> dsCTHoaDon;

    @OneToMany(mappedBy = "bienThe", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CTNhapHang> dsCTNhapHang;
}
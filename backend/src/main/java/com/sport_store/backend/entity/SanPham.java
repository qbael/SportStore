package com.sport_store.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.boot.context.properties.bind.DefaultValue;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "sanpham")
public class SanPham {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "ten")
    private String tenSanPham;

    @Column(name = "hinhanh")
    private String hinhAnh;

    @Column(name = "giaban")
    private int giaBan;

    @Column(name = "gianhap")
    private int giaNhap;

    @Column(name = "mota")
    private String moTa;

    @ColumnDefault("true")
    @Column(name = "trangthai")
    private boolean trangThai;

    @ManyToOne
    @JoinColumn(name = "danhmuc")
    private DanhMuc danhMuc;

    @ManyToOne
    @JoinColumn(name = "thuonghieu")
    private ThuongHieu thuongHieu;

    @ManyToOne
    @JoinColumn(name = "bomon")
    private BoMon boMon;

    @ColumnDefault("NULL")
    @ManyToOne
    @JoinColumn(name = "ncc")
    private NhaCungCap nhaCungCap;
}
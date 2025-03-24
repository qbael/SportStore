package com.sport_store.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "nhaphang")
public class NhapHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ColumnDefault("CURRENT_DATE")
    @Column(name = "ngay")
    private LocalDate ngay;

    @Column(name = "tonggianhap")
    private int tongGiaNhap;

    @ManyToOne
    @JoinColumn(name = "nhacungcap")
    private NhaCungCap nhaCungCap;

    @ManyToOne
    @JoinColumn(name = "nhanvien")
    private NhanVien nhanVien;

    @OneToMany(mappedBy = "nhapHang", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CTNhapHang> dsCTNhapHang;
}
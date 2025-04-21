package com.sport_store.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.sport_store.backend.entity.Enum.TrangThaiHoaDon;

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
@Table(name = "nhacungcap")
public class NhaCungCap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "ten")
    private String tenNCC;

    @Column(name = "diachi")
    private String diaChi;

    @Column(name = "email")
    private String email;

    @Column(name = "sdt")
    private String sdt;

    @Enumerated(EnumType.STRING)
    @Column(name = "trangthai")
    private TrangThaiHoaDon trangThai;

    @OneToMany(mappedBy = "nhaCungCap", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonBackReference
    private List<NhapHang> dsNhapHang;
}
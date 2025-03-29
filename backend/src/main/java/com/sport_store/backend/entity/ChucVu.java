package com.sport_store.backend.entity;

import com.sport_store.backend.entity.Enum.TenChucVu;
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
@Table(name = "chucvu")
public class ChucVu {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Enumerated(EnumType.STRING)
    @Column(name = "tenchucvu", unique = true, nullable = false)
    private TenChucVu tenChucVu;

    @OneToMany(mappedBy = "chucVu", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<NhanVien> dsNhanVien;

    @OneToMany(mappedBy = "chucVu")
    private List<Quyen> dsQuyen;
}
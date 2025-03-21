package com.sport_store.backend.entity;

import com.sport_store.backend.entity.Enum.TrangThaiHoaDon;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;
import org.springframework.boot.context.properties.bind.DefaultValue;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "hoadon")
public class HoaDon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ColumnDefault("CURRENT_DATE")
    @Column(name = "ngay")
    private LocalDate ngay;

    @Column(name = "tonggianhap")
    private int tongGiaNhap;

    @Column(name = "tonggiaban")
    private int tongGiaBan;

    @Enumerated(EnumType.STRING)
    @Column(name = "trangthai")
    private TrangThaiHoaDon trangThai;

    @ManyToOne
    @JoinColumn(name = "ttkhachhang")
    private TTKhachHang ttKhachHang;

    @OneToMany(mappedBy = "hoaDon", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<CTHoaDon> dsCTHoaDon;
}
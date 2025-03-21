package com.sport_store.backend.entity;

import com.sport_store.backend.entity.Enum.HanhDong;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(
        name = "quyen",
        uniqueConstraints = {@UniqueConstraint(columnNames = {"chucvu", "chucnang", "hanhdong"})}
)
public class Quyen {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "chucvu", nullable = false)
    private ChucVu chucVu;

    @ManyToOne
    @JoinColumn(name = "chucnang", nullable = false)
    private ChucNang chucNang;

    @Enumerated(EnumType.STRING)
    @Column(name = "hanhdong", nullable = false)
    private HanhDong hanhDong;
}
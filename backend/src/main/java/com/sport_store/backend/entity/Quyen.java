package com.sport_store.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.sport_store.backend.entity.Enum.HanhDong;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@Table(name = "quyen", uniqueConstraints = @UniqueConstraint(columnNames = {"chucvu", "chucnang", "hanhdong"}))
@NoArgsConstructor
@AllArgsConstructor
public class Quyen {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chucvu", nullable = false)
    @JsonBackReference
    private ChucVu chucVu;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "chucnang", nullable = false)
    private ChucNang chucNang;

    @Enumerated(EnumType.STRING)
    @Column(name = "hanhdong", nullable = false)
    private HanhDong hanhDong;
}

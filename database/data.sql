use sport_store;
-- Insert data into bomon (sports categories)
INSERT INTO bomon (tenbomon)
VALUES ('Tennis'),
       ('Cầu lông'),
       ('Bóng bàn');

-- Insert data into danhmuc (product categories)
INSERT INTO danhmuc (loai)
VALUES ('Vợt'),
       ('Giày'),
       ('Quần áo');

-- Insert data into thuonghieu (brands)
INSERT INTO thuonghieu (tenthuonghieu)
VALUES ('Nike'),
       ('Adidas'),
       ('Puma'),
       ('Under Armour'),
       ('New Balance'),
       ('Asics'),
       ('Reebok'),
       ('Wilson'),
       ('Yonex'),
       ('Speedo');

-- Insert data into mau (colors)
INSERT INTO mau (ten)
VALUES ('Đen'),
       ('Trắng'),
       ('Đỏ'),
       ('Xanh dương'),
       ('Xanh lá'),
       ('Vàng'),
       ('Cam'),
       ('Tím'),
       ('Hồng'),
       ('Xám');

-- Insert data into size
INSERT INTO size (size)
VALUES ('S'),
       ('M'),
       ('L'),
       ('XL'),
       ('XXL'),
       ('38'),
       ('39'),
       ('40'),
       ('41'),
       ('42');

-- Insert data into chucvu (positions)
INSERT INTO chucvu (tenchucvu)
VALUES ('Admin'),
       ('Nhân viên bán hàng'),
       ('Nhân viên kho'),
       ('Quản lý doanh nghiệp');

-- Insert data into nhanvien (employees)
INSERT INTO nhanvien (hoten, ngaysinh, gioitinh, diachi, email, sdt, chucvu)
VALUES ('Nguyễn Văn An', '1990-05-15', 1, 'Hà Nội', 'an.nguyen@example.com', 0901234567, 1),
       ('Trần Thị Bình', '1992-08-20', 0, 'Hồ Chí Minh', 'binh.tran@example.com', 0912345678, 2),
       ('Lê Văn Cường', '1988-03-10', 1, 'Đà Nẵng', 'cuong.le@example.com', 0923456789, 3),
       ('Phạm Thị Dung', '1995-11-25', 0, 'Hải Phòng', 'dung.pham@example.com', 0934567890, 2),
       ('Hoàng Văn Em', '1993-07-05', 1, 'Cần Thơ', 'em.hoang@example.com', 0945678901, 4);

-- Insert data into nhacungcap (suppliers)
INSERT INTO nhacungcap (email, ten, diachi, sdt)
VALUES ('sportimport@example.com', 'Sport Import', 'Hà Nội', 0987654321),
       ('vnsports@example.com', 'VN Sports', 'Hồ Chí Minh', 0976543210),
       ('globalsport@example.com', 'Global Sport', 'Đà Nẵng', 0965432109),
       ('sportmaster@example.com', 'Sport Master', 'Hải Phòng', 0954321098),
       ('elitesports@example.com', 'Elite Sports', 'Cần Thơ', 0943210987);

-- Insert data into sanpham (products)

# KHÔNG ĐƯỢC XÓA

# INSERT INTO sanpham (ten, hinhanh, gianhap, giaban, mota, trangthai, thuonghieu, danhmuc, bomon)
# VALUES ('Vợt Tennis Wilson Pro Staff', 'vot_tennis_wilson_pro_staff.jpg', 1500000, 2500000, 'Vợt Tennis Wilson Pro Staff chính hãng', TRUE, 8, 1, 1),
#        ('Vợt Cầu Lông Yonex Astrox 88D', 'vot_cau_long_yonex_astrox_88d.jpg', 2000000, 3200000, 'Vợt cầu lông Yonex Astrox 88D chính hãng', TRUE, 9, 1, 2),
#        ('Vợt Bóng Bàn Butterfly Timo Boll', 'vot_bong_ban_butterfly_timo_boll.jpg', 1200000, 1800000, 'Vợt bóng bàn Butterfly Timo Boll chính hãng', TRUE, 9, 1, 3),
#        ('Giày Tennis Nike Vapor', 'giay_tennis_nike_vapor.jpg', 1800000, 2800000, 'Giày tennis Nike Vapor chính hãng', TRUE, 1, 2, 1),
#        ('Giày Cầu Lông Yonex Power Cushion', 'giay_cau_long_yonex_power_cushion.jpg', 1600000, 2400000, 'Giày cầu lông Yonex Power Cushion chính hãng', TRUE, 9, 2, 2),
#        ('Giày Bóng Bàn Butterfly Lezoline', 'giay_bong_ban_butterfly_lezoline.jpg', 1400000, 2200000, 'Giày bóng bàn Butterfly Lezoline chính hãng', TRUE, 5, 2, 3),
#        ('Áo Tennis Adidas Club', 'ao_tennis_adidas_club.jpg', 600000, 900000, 'Áo tennis Adidas Club chính hãng', TRUE, 2, 3, 1),
#        ('Áo Cầu Lông Yonex Tournament', 'ao_cau_long_yonex_tournament.jpg', 550000, 850000, 'Áo cầu lông Yonex Tournament chính hãng', TRUE, 9, 3, 2),
#        ('Quần Bóng Bàn Butterfly Swift', 'quan_bong_ban_butterfly_swift.jpg', 500000, 800000, 'Quần bóng bàn Butterfly Swift chính hãng', TRUE, 3, 3, 3),
#        ('Vợt Tennis Head Speed', 'vot_tennis_head_speed.jpg', 1700000, 2700000, 'Vợt tennis Head Speed chính hãng', TRUE, 8, 1, 1),
#        ('Vợt Tennis Babolat Pure Drive', 'vot_tennis_babolat_pure_drive.jpg', 1800000, 2900000, 'Vợt Tennis Babolat Pure Drive chính hãng, công nghệ mới nhất', TRUE, 8, 1, 1),
#        ('Vợt Tennis Head Graphene 360+', 'vot_tennis_head_graphene_360+.jpg', 2200000, 3500000, 'Vợt Tennis Head Graphene 360+ với khung carbon cao cấp', TRUE, 8, 1, 1),
#        ('Giày Tennis Asics Gel Resolution', 'giay_tennis_asics_gel_resolution.jpg', 1900000, 2800000, 'Giày Tennis Asics Gel Resolution với đệm gel chống sốc', TRUE, 6, 2, 1),
#        ('Giày Tennis Adidas Barricade', 'giay_tennis_adidas_barricade.jpg', 2100000, 3200000, 'Giày Tennis Adidas Barricade với độ bền cao', TRUE, 2, 2, 1),
#        ('Áo Tennis Nike Court Dri-FIT', 'ao_tennis_nike_court_dri-fit.jpg', 650000, 950000, 'Áo Tennis Nike Court Dri-FIT thoáng khí, thấm hút mồ hôi', TRUE, 1, 3, 1),
#        ('Quần Tennis Under Armour', 'quan_tennis_under_armour.jpg', 550000, 850000, 'Quần Tennis Under Armour co giãn 4 chiều', TRUE, 4, 3, 1),
#        ('Vợt Cầu Lông Li-Ning Windstorm', 'vot_cau_long_li-ning_windstorm.jpg', 1700000, 2600000, 'Vợt Cầu Lông Li-Ning Windstorm siêu nhẹ', TRUE, 9, 1, 2),
#        ('Vợt Cầu Lông Victor Thruster', 'vot_cau_long_victor_thruster.jpg', 1900000, 2900000, 'Vợt Cầu Lông Victor Thruster với khung carbon cứng', TRUE, 9, 1, 2),
#        ('Giày Cầu Lông Li-Ning Ranger', 'giay_cau_long_li-ning_ranger.jpg', 1500000, 2300000, 'Giày Cầu Lông Li-Ning Ranger với đế cao su bám sân', TRUE, 9, 2, 2),
#        ('Giày Cầu Lông Victor SH-A830', 'giay_cau_long_victor_sh-a830.jpg', 1700000, 2500000, 'Giày Cầu Lông Victor SH-A830 chống trượt tốt', TRUE, 9, 2, 2),
#        ('Áo Cầu Lông Victor Unisex', 'ao_cau_long_victor_unisex.jpg', 500000, 800000, 'Áo Cầu Lông Victor Unisex thoáng mát', TRUE, 9, 3, 2),
#        ('Quần Cầu Lông Yonex Premium', 'quan_cau_long_yonex_premium.jpg', 600000, 900000, 'Quần Cầu Lông Yonex Premium co giãn tốt', TRUE, 9, 3, 2),
#        ('Vợt Bóng Bàn DHS Hurricane', 'vot_bong_ban_dhs_hurricane.jpg', 1300000, 2000000, 'Vợt Bóng Bàn DHS Hurricane chuyên nghiệp', TRUE, 9, 1, 3),
#        ('Vợt Bóng Bàn Stiga Offensive', 'vot_bong_ban_stiga_offensive.jpg', 1400000, 2100000, 'Vợt Bóng Bàn Stiga Offensive tấn công mạnh mẽ', TRUE, 9, 1, 3),
#        ('Giày Bóng Bàn Mizuno Wave Drive', 'giay_bong_ban_mizuno_wave_drive.jpg', 1600000, 2400000, 'Giày Bóng Bàn Mizuno Wave Drive nhẹ và linh hoạt', TRUE, 6, 2, 3),
#        ('Giày Bóng Bàn Stiga Perform', 'giay_bong_ban_stiga_perform.jpg', 1500000, 2300000, 'Giày Bóng Bàn Stiga Perform với đế cao su đặc biệt', TRUE, 5, 2, 3),
#        ('Áo Bóng Bàn Butterfly Pro', 'ao_bong_ban_butterfly_pro.jpg', 550000, 850000, 'Áo Bóng Bàn Butterfly Pro chất liệu cao cấp', TRUE, 3, 3, 3),
#        ('Quần Bóng Bàn Stiga Elite', 'quan_bong_ban_stiga_elite.jpg', 500000, 800000, 'Quần Bóng Bàn Stiga Elite thoải mái khi di chuyển', TRUE, 3, 3, 3);
#
# -- Insert data into bienthe (product variants)
# INSERT INTO bienthe (sanpham, tenbienthe, hinhanh, mau, size, soluongton)
# VALUES (1, 'Vợt Tennis Wilson Pro Staff - Đen', 'vot_tennis_wilson_pro_staff_-_den.jpg', 1, 3, 20),
#        (1, 'Vợt Tennis Wilson Pro Staff - Đỏ', 'vot_tennis_wilson_pro_staff_-_do.jpg', 3, 3, 15),
#        (2, 'Vợt Cầu Lông Yonex Astrox 88D - Xanh dương', 'vot_cau_long_yonex_astrox_88d_-_xanh_duong.jpg', 4, 3, 25),
#        (2, 'Vợt Cầu Lông Yonex Astrox 88D - Đỏ', 'vot_cau_long_yonex_astrox_88d_-_do.jpg', 3, 3, 20),
#        (3, 'Vợt Bóng Bàn Butterfly Timo Boll - Đen/Đỏ', 'vot_bong_ban_butterfly_timo_boll_-_den_do.jpg', 1, 3, 30),
#        (4, 'Giày Tennis Nike Vapor - Trắng, size 40', 'giay_tennis_nike_vapor_-_trang_size_40.jpg', 2, 8, 10),
#        (4, 'Giày Tennis Nike Vapor - Trắng, size 41', 'giay_tennis_nike_vapor_-_trang_size_41.jpg', 2, 9, 12),
#        (4, 'Giày Tennis Nike Vapor - Đen, size 40', 'giay_tennis_nike_vapor_-_den_size_40.jpg', 1, 8, 8),
#        (4, 'Giày Tennis Nike Vapor - Đen, size 41', 'giay_tennis_nike_vapor_-_den_size_41.jpg', 1, 9, 10),
#        (5, 'Giày Cầu Lông Yonex Power Cushion - Xanh, size 40', 'giay_cau_long_yonex_power_cushion_-_xanh_size_40.jpg', 4, 8, 15),
#        (5, 'Giày Cầu Lông Yonex Power Cushion - Xanh, size 41', 'giay_cau_long_yonex_power_cushion_-_xanh_size_41.jpg', 4, 9, 12),
#        (6, 'Giày Bóng Bàn Butterfly Lezoline - Đỏ, size 40', 'giay_bong_ban_butterfly_lezoline_-_do_size_40.jpg', 3, 8, 8),
#        (6, 'Giày Bóng Bàn Butterfly Lezoline - Đỏ, size 41', 'giay_bong_ban_butterfly_lezoline_-_do_size_41.jpg', 3, 9, 10),
#        (7, 'Áo Tennis Adidas Club - Trắng, size M', 'ao_tennis_adidas_club_-_trang_size_m.jpg', 2, 2, 25),
#        (7, 'Áo Tennis Adidas Club - Trắng, size L', 'ao_tennis_adidas_club_-_trang_size_l.jpg', 2, 3, 20),
#        (7, 'Áo Tennis Adidas Club - Xanh, size M', 'ao_tennis_adidas_club_-_xanh_size_m.jpg', 4, 2, 22),
#        (7, 'Áo Tennis Adidas Club - Xanh, size L', 'ao_tennis_adidas_club_-_xanh_size_l.jpg', 4, 3, 18),
#        (8, 'Áo Cầu Lông Yonex Tournament - Đỏ, size M', 'ao_cau_long_yonex_tournament_-_do_size_m.jpg', 3, 2, 20),
#        (8, 'Áo Cầu Lông Yonex Tournament - Đỏ, size L', 'ao_cau_long_yonex_tournament_-_do_size_l.jpg', 3, 3, 18),
#        (9, 'Quần Bóng Bàn Butterfly Swift - Đen, size M', 'quan_bong_ban_butterfly_swift_-_den_size_m.jpg', 1, 2, 15),
#        (9, 'Quần Bóng Bàn Butterfly Swift - Đen, size L', 'quan_bong_ban_butterfly_swift_-_den_size_l.jpg', 1, 3, 12),
#        (11, 'Vợt Tennis Babolat Pure Drive - Xanh dương', 'vot_tennis_babolat_pure_drive_-_xanh_duong.jpg', 4, 3, 18),
#        (11, 'Vợt Tennis Babolat Pure Drive - Đen', 'vot_tennis_babolat_pure_drive_-_den.jpg', 1, 3, 15),
#        (12, 'Vợt Tennis Head Graphene 360+ - Đen/Vàng', 'vot_tennis_head_graphene_360+_-_den_vang.jpg', 1, 3, 12),
#        (12, 'Vợt Tennis Head Graphene 360+ - Trắng/Xanh', 'vot_tennis_head_graphene_360+_-_trang_xanh.jpg', 2, 3, 10),
#        (13, 'Giày Tennis Asics Gel Resolution - Xanh, size 40', 'giay_tennis_asics_gel_resolution_-_xanh_size_40.jpg', 4, 8, 8),
#        (13, 'Giày Tennis Asics Gel Resolution - Xanh, size 41', 'giay_tennis_asics_gel_resolution_-_xanh_size_41.jpg', 4, 9, 10),
#        (13, 'Giày Tennis Asics Gel Resolution - Xanh, size 42', 'giay_tennis_asics_gel_resolution_-_xanh_size_42.jpg', 4, 10, 7),
#        (14, 'Giày Tennis Adidas Barricade - Đen, size 40', 'giay_tennis_adidas_barricade_-_den_size_40.jpg', 1, 8, 9),
#        (14, 'Giày Tennis Adidas Barricade - Đen, size 41', 'giay_tennis_adidas_barricade_-_den_size_41.jpg', 1, 9, 8),
#        (14, 'Giày Tennis Adidas Barricade - Trắng, size 40', 'giay_tennis_adidas_barricade_-_trang_size_40.jpg', 2, 8, 7),
#        (14, 'Giày Tennis Adidas Barricade - Trắng, size 41', 'giay_tennis_adidas_barricade_-_trang_size_41.jpg', 2, 9, 6),
#        (15, 'Áo Tennis Nike Court Dri-FIT - Trắng, size M', 'ao_tennis_nike_court_dri-fit_-_trang_size_m.jpg', 2, 2, 20),
#        (15, 'Áo Tennis Nike Court Dri-FIT - Trắng, size L', 'ao_tennis_nike_court_dri-fit_-_trang_size_l.jpg', 2, 3, 18),
#        (15, 'Áo Tennis Nike Court Dri-FIT - Xanh, size M', 'ao_tennis_nike_court_dri-fit_-_xanh_size_m.jpg', 4, 2, 15),
#        (15, 'Áo Tennis Nike Court Dri-FIT - Xanh, size L', 'ao_tennis_nike_court_dri-fit_-_xanh_size_l.jpg', 4, 3, 12),
#        (16, 'Quần Tennis Under Armour - Đen, size M', 'quan_tennis_under_armour_-_den_size_m.jpg', 1, 2, 14),
#        (16, 'Quần Tennis Under Armour - Đen, size L', 'quan_tennis_under_armour_-_den_size_l.jpg', 1, 3, 12),
#        (16, 'Quần Tennis Under Armour - Xám, size M', 'quan_tennis_under_armour_-_xam_size_m.jpg', 10, 2, 10),
#        (16, 'Quần Tennis Under Armour - Xám, size L', 'quan_tennis_under_armour_-_xam_size_l.jpg', 10, 3, 8),
#        (17, 'Vợt Cầu Lông Li-Ning Windstorm - Đỏ', 'vot_cau_long_li-ning_windstorm_-_do.jpg', 3, 3, 15),
#        (17, 'Vợt Cầu Lông Li-Ning Windstorm - Đen', 'vot_cau_long_li-ning_windstorm_-_den.jpg', 1, 3, 12),
#        (18, 'Vợt Cầu Lông Victor Thruster - Xanh', 'vot_cau_long_victor_thruster_-_xanh.jpg', 4, 3, 14),
#        (18, 'Vợt Cầu Lông Victor Thruster - Cam', 'vot_cau_long_victor_thruster_-_cam.jpg', 7, 3, 10),
#        (19, 'Giày Cầu Lông Li-Ning Ranger - Đỏ, size 40', 'giay_cau_long_li-ning_ranger_-_do_size_40.jpg', 3, 8, 8),
#        (19, 'Giày Cầu Lông Li-Ning Ranger - Đỏ, size 41', 'giay_cau_long_li-ning_ranger_-_do_size_41.jpg', 3, 9, 7),
#        (19, 'Giày Cầu Lông Li-Ning Ranger - Đen, size 40', 'giay_cau_long_li-ning_ranger_-_den_size_40.jpg', 1, 8, 9),
#        (19, 'Giày Cầu Lông Li-Ning Ranger - Đen, size 41', 'giay_cau_long_li-ning_ranger_-_den_size_41.jpg', 1, 9, 8),
#        (20, 'Giày Cầu Lông Victor SH-A830 - Xanh, size 40', 'giay_cau_long_victor_sh-a830_-_xanh_size_40.jpg', 4, 8, 10)
#        (20, 'Giày Cầu Lông Victor SH-A830 - Xanh, size 41', 'giay_cau_long_victor_sh-a830_xanh_size_41.jpg', 4, 9, 8),
#        (20, 'Giày Cầu Lông Victor SH-A830 - Trắng, size 40', 'giay_cau_long_victor_sh-a830_trang_size_40.jpg', 2, 8, 7),
#        (20, 'Giày Cầu Lông Victor SH-A830 - Trắng, size 41', 'giay_cau_long_victor_sh-a830_trang_size_41.jpg', 2, 9, 6),
#        (21, 'Áo Cầu Lông Victor Unisex - Đỏ, size M', 'ao_cau_long_victor_unisex_do_size_m.jpg', 3, 2, 15),
#        (21, 'Áo Cầu Lông Victor Unisex - Đỏ, size L', 'ao_cau_long_victor_unisex_do_size_l.jpg', 3, 3, 12),
#        (21, 'Áo Cầu Lông Victor Unisex - Xanh, size M', 'ao_cau_long_victor_unisex_xanh_size_m.jpg', 4, 2, 14),
#        (21, 'Áo Cầu Lông Victor Unisex - Xanh, size L', 'ao_cau_long_victor_unisex_xanh_size_l.jpg', 4, 3, 10),
#        (22, 'Quần Cầu Lông Yonex Premium - Đen, size M', 'quan_cau_long_yonex_premium_den_size_m.jpg', 1, 2, 18),
#        (22, 'Quần Cầu Lông Yonex Premium - Đen, size L', 'quan_cau_long_yonex_premium_den_size_l.jpg', 1, 3, 15),
#        (22, 'Quần Cầu Lông Yonex Premium - Trắng, size M', 'quan_cau_long_yonex_premium_trang_size_m.jpg', 2, 2, 12),
#        (22, 'Quần Cầu Lông Yonex Premium - Trắng, size L', 'quan_cau_long_yonex_premium_trang_size_l.jpg', 2, 3, 10),
#        (23, 'Vợt Bóng Bàn DHS Hurricane - Đỏ/Đen', 'vot_bong_ban_dhs_hurricane_do_den.jpg', 3, 3, 20),
#        (23, 'Vợt Bóng Bàn DHS Hurricane - Xanh/Đen', 'vot_bong_ban_dhs_hurricane_xanh_den.jpg', 4, 3, 15),
#        (24, 'Vợt Bóng Bàn Stiga Offensive - Đỏ/Đen', 'vot_bong_ban_stiga_offensive_do_den.jpg', 3, 3, 18),
#        (24, 'Vợt Bóng Bàn Stiga Offensive - Xanh/Đen', 'vot_bong_ban_stiga_offensive_xanh_den.jpg', 4, 3, 14),
#        (25, 'Giày Bóng Bàn Mizuno Wave Drive - Xanh, size 40', 'giay_bong_ban_mizuno_wave_drive_xanh_size_40.jpg', 4, 8, 9),
#        (25, 'Giày Bóng Bàn Mizuno Wave Drive - Xanh, size 41', 'giay_bong_ban_mizuno_wave_drive_xanh_size_41.jpg', 4, 9, 8),
#        (25, 'Giày Bóng Bàn Mizuno Wave Drive - Đỏ, size 40', 'giay_bong_ban_mizuno_wave_drive_do_size_40.jpg', 3, 8, 7),
#        (25, 'Giày Bóng Bàn Mizuno Wave Drive - Đỏ, size 41', 'giay_bong_ban_mizuno_wave_drive_do_size_41.jpg', 3, 9, 6);

#KHÔNG ĐƯỢC XÓA

INSERT INTO sanpham (ten, hinhanh, gianhap, giaban, mota, trangthai, thuonghieu, danhmuc, bomon)
VALUES ('Vợt Tennis Wilson Pro Staff', 'vot_tennis_wilson_pro_staff.jpg', 1500000, 2500000, 'Vợt Tennis Wilson Pro Staff chính hãng', TRUE, 8, 1, 1),
       ('Vợt Cầu Lông Yonex Astrox 88D', 'vot_tennis_wilson_pro_staff.jpg', 2000000, 3200000, 'Vợt cầu lông Yonex Astrox 88D chính hãng', TRUE, 9, 1, 2),
       ('Vợt Bóng Bàn Butterfly Timo Boll', 'vot_tennis_wilson_pro_staff.jpg', 1200000, 1800000, 'Vợt bóng bàn Butterfly Timo Boll chính hãng', TRUE, 9, 1, 3),
       ('Giày Tennis Nike Vapor', 'vot_tennis_wilson_pro_staff.jpg', 1800000, 2800000, 'Giày tennis Nike Vapor chính hãng', TRUE, 1, 2, 1),
       ('Giày Cầu Lông Yonex Power Cushion', 'vot_tennis_wilson_pro_staff.jpg', 1600000, 2400000, 'Giày cầu lông Yonex Power Cushion chính hãng', TRUE, 9, 2, 2),
       ('Giày Bóng Bàn Butterfly Lezoline', 'vot_tennis_wilson_pro_staff.jpg', 1400000, 2200000, 'Giày bóng bàn Butterfly Lezoline chính hãng', TRUE, 5, 2, 3),
       ('Áo Tennis Adidas Club', 'vot_tennis_wilson_pro_staff.jpg', 600000, 900000, 'Áo tennis Adidas Club chính hãng', TRUE, 2, 3, 1),
       ('Áo Cầu Lông Yonex Tournament', 'vot_tennis_wilson_pro_staff.jpg', 550000, 850000, 'Áo cầu lông Yonex Tournament chính hãng', TRUE, 9, 3, 2),
       ('Quần Bóng Bàn Butterfly Swift', 'vot_tennis_wilson_pro_staff.jpg', 500000, 800000, 'Quần bóng bàn Butterfly Swift chính hãng', TRUE, 3, 3, 3),
       ('Vợt Tennis Head Speed', 'vot_tennis_wilson_pro_staff.jpg', 1700000, 2700000, 'Vợt tennis Head Speed chính hãng', TRUE, 8, 1, 1),
       ('Vợt Tennis Babolat Pure Drive', 'vot_tennis_wilson_pro_staff.jpg', 1800000, 2900000, 'Vợt Tennis Babolat Pure Drive chính hãng, công nghệ mới nhất', TRUE, 8, 1, 1),
       ('Vợt Tennis Head Graphene 360+', 'vot_tennis_wilson_pro_staff.jpg', 2200000, 3500000, 'Vợt Tennis Head Graphene 360+ với khung carbon cao cấp', TRUE, 8, 1, 1),
       ('Giày Tennis Asics Gel Resolution', 'vot_tennis_wilson_pro_staff.jpg', 1900000, 2800000, 'Giày Tennis Asics Gel Resolution với đệm gel chống sốc', TRUE, 6, 2, 1),
       ('Giày Tennis Adidas Barricade', 'vot_tennis_wilson_pro_staff.jpg', 2100000, 3200000, 'Giày Tennis Adidas Barricade với độ bền cao', TRUE, 2, 2, 1),
       ('Áo Tennis Nike Court Dri-FIT', 'vot_tennis_wilson_pro_staff.jpg', 650000, 950000, 'Áo Tennis Nike Court Dri-FIT thoáng khí, thấm hút mồ hôi', TRUE, 1, 3, 1),
       ('Quần Tennis Under Armour', 'vot_tennis_wilson_pro_staff.jpg', 550000, 850000, 'Quần Tennis Under Armour co giãn 4 chiều', TRUE, 4, 3, 1),
       ('Vợt Cầu Lông Li-Ning Windstorm', 'vot_tennis_wilson_pro_staff.jpg', 1700000, 2600000, 'Vợt Cầu Lông Li-Ning Windstorm siêu nhẹ', TRUE, 9, 1, 2),
       ('Vợt Cầu Lông Victor Thruster', 'vot_tennis_wilson_pro_staff.jpg', 1900000, 2900000, 'Vợt Cầu Lông Victor Thruster với khung carbon cứng', TRUE, 9, 1, 2),
       ('Giày Cầu Lông Li-Ning Ranger', 'vot_tennis_wilson_pro_staff.jpg', 1500000, 2300000, 'Giày Cầu Lông Li-Ning Ranger với đế cao su bám sân', TRUE, 9, 2, 2),
       ('Giày Cầu Lông Victor SH-A830', 'vot_tennis_wilson_pro_staff.jpg', 1700000, 2500000, 'Giày Cầu Lông Victor SH-A830 chống trượt tốt', TRUE, 9, 2, 2),
       ('Áo Cầu Lông Victor Unisex', 'vot_tennis_wilson_pro_staff.jpg', 500000, 800000, 'Áo Cầu Lông Victor Unisex thoáng mát', TRUE, 9, 3, 2),
       ('Quần Cầu Lông Yonex Premium', 'vot_tennis_wilson_pro_staff.jpg', 600000, 900000, 'Quần Cầu Lông Yonex Premium co giãn tốt', TRUE, 9, 3, 2),
       ('Vợt Bóng Bàn DHS Hurricane', 'vot_tennis_wilson_pro_staff.jpg', 1300000, 2000000, 'Vợt Bóng Bàn DHS Hurricane chuyên nghiệp', TRUE, 9, 1, 3),
       ('Vợt Bóng Bàn Stiga Offensive', 'vot_tennis_wilson_pro_staff.jpg', 1400000, 2100000, 'Vợt Bóng Bàn Stiga Offensive tấn công mạnh mẽ', TRUE, 9, 1, 3),
       ('Giày Bóng Bàn Mizuno Wave Drive', 'vot_tennis_wilson_pro_staff.jpg', 1600000, 2400000, 'Giày Bóng Bàn Mizuno Wave Drive nhẹ và linh hoạt', TRUE, 6, 2, 3),
       ('Giày Bóng Bàn Stiga Perform', 'vot_tennis_wilson_pro_staff.jpg', 1500000, 2300000, 'Giày Bóng Bàn Stiga Perform với đế cao su đặc biệt', TRUE, 5, 2, 3),
       ('Áo Bóng Bàn Butterfly Pro', 'vot_tennis_wilson_pro_staff.jpg', 550000, 850000, 'Áo Bóng Bàn Butterfly Pro chất liệu cao cấp', TRUE, 3, 3, 3),
       ('Quần Bóng Bàn Stiga Elite', 'vot_tennis_wilson_pro_staff.jpg', 500000, 800000, 'Quần Bóng Bàn Stiga Elite thoải mái khi di chuyển', TRUE, 3, 3, 3);


INSERT INTO bienthe (sanpham, tenbienthe, hinhanh, mau, size, soluongton)
VALUES (1, 'Vợt Tennis Wilson Pro Staff - Đen', 'vot_tennis_wilson_pro_staff.jpg', 1, null, 20),
       (1, 'Vợt Tennis Wilson Pro Staff - Đỏ', 'vot_tennis_wilson_pro_staff.jpg', 3, null, 15),
       (2, 'Vợt Cầu Lông Yonex Astrox 88D - Xanh dương', 'vot_tennis_wilson_pro_staff.jpg', 4, null, 25),
       (2, 'Vợt Cầu Lông Yonex Astrox 88D - Đỏ', 'vot_tennis_wilson_pro_staff.jpg', 3, null, 20),
       (3, 'Vợt Bóng Bàn Butterfly Timo Boll - Đen/Đỏ', 'vot_tennis_wilson_pro_staff.jpg', 1, null, 30),
       (4, 'Giày Tennis Nike Vapor - Trắng, size 40', 'vot_tennis_wilson_pro_staff.jpg', 2, 8, 10),
       (4, 'Giày Tennis Nike Vapor - Trắng, size 41', 'vot_tennis_wilson_pro_staff.jpg', 2, 9, 12),
       (4, 'Giày Tennis Nike Vapor - Đen, size 40', 'vot_tennis_wilson_pro_staff.jpg', 1, 8, 8),
       (4, 'Giày Tennis Nike Vapor - Đen, size 41', 'vot_tennis_wilson_pro_staff.jpg', 1, 9, 10),
       (5, 'Giày Cầu Lông Yonex Power Cushion - Xanh, size 40', 'vot_tennis_wilson_pro_staff.jpg', 4, 8, 15),
       (5, 'Giày Cầu Lông Yonex Power Cushion - Xanh, size 41', 'vot_tennis_wilson_pro_staff.jpg', 4, 9, 12),
       (6, 'Giày Bóng Bàn Butterfly Lezoline - Đỏ, size 40', 'vot_tennis_wilson_pro_staff.jpg', 3, 8, 8),
       (6, 'Giày Bóng Bàn Butterfly Lezoline - Đỏ, size 41', 'vot_tennis_wilson_pro_staff.jpg', 3, 9, 10),
       (7, 'Áo Tennis Adidas Club - Trắng, size M', 'vot_tennis_wilson_pro_staff.jpg', 2, 2, 25),
       (7, 'Áo Tennis Adidas Club - Trắng, size L', 'vot_tennis_wilson_pro_staff.jpg', 2, 3, 20),
       (7, 'Áo Tennis Adidas Club - Xanh, size M', 'vot_tennis_wilson_pro_staff.jpg', 4, 2, 22),
       (7, 'Áo Tennis Adidas Club - Xanh, size L', 'vot_tennis_wilson_pro_staff.jpg', 4, 3, 18),
       (8, 'Áo Cầu Lông Yonex Tournament - Đỏ, size M', 'vot_tennis_wilson_pro_staff.jpg', 3, 2, 20),
       (8, 'Áo Cầu Lông Yonex Tournament - Đỏ, size L', 'vot_tennis_wilson_pro_staff.jpg', 3, 3, 18),
       (9, 'Quần Bóng Bàn Butterfly Swift - Đen, size M', 'vot_tennis_wilson_pro_staff.jpg', 1, 2, 15),
       (9, 'Quần Bóng Bàn Butterfly Swift - Đen, size L', 'vot_tennis_wilson_pro_staff.jpg', 1, 3, 12),
       (11, 'Vợt Tennis Babolat Pure Drive - Xanh dương', 'vot_tennis_wilson_pro_staff.jpg', 4, null, 18),
       (11, 'Vợt Tennis Babolat Pure Drive - Đen', 'vot_tennis_wilson_pro_staff.jpg', 1, null, 15),
       (12, 'Vợt Tennis Head Graphene 360+ - Đen/Vàng', 'vot_tennis_wilson_pro_staff.jpg', 1, null, 12),
       (12, 'Vợt Tennis Head Graphene 360+ - Trắng/Xanh', 'vot_tennis_wilson_pro_staff.jpg', 2, null, 10),
       (13, 'Giày Tennis Asics Gel Resolution - Xanh, size 40', 'vot_tennis_wilson_pro_staff.jpg', 4, 8, 8),
       (13, 'Giày Tennis Asics Gel Resolution - Xanh, size 41', 'vot_tennis_wilson_pro_staff.jpg', 4, 9, 10),
       (13, 'Giày Tennis Asics Gel Resolution - Xanh, size 42', 'vot_tennis_wilson_pro_staff.jpg', 4, 10, 7),
       (14, 'Giày Tennis Adidas Barricade - Đen, size 40', 'vot_tennis_wilson_pro_staff.jpg', 1, 8, 9),
       (14, 'Giày Tennis Adidas Barricade - Đen, size 41', 'vot_tennis_wilson_pro_staff.jpg', 1, 9, 8),
       (14, 'Giày Tennis Adidas Barricade - Trắng, size 40', 'vot_tennis_wilson_pro_staff.jpg', 2, 8, 7),
       (14, 'Giày Tennis Adidas Barricade - Trắng, size 41', 'vot_tennis_wilson_pro_staff.jpg', 2, 9, 6),
       (15, 'Áo Tennis Nike Court Dri-FIT - Trắng, size M', 'vot_tennis_wilson_pro_staff.jpg', 2, 2, 20),
       (15, 'Áo Tennis Nike Court Dri-FIT - Trắng, size L', 'vot_tennis_wilson_pro_staff.jpg', 2, 3, 18),
       (15, 'Áo Tennis Nike Court Dri-FIT - Xanh, size M', 'vot_tennis_wilson_pro_staff.jpg', 4, 2, 15),
       (15, 'Áo Tennis Nike Court Dri-FIT - Xanh, size L', 'vot_tennis_wilson_pro_staff.jpg', 4, 3, 12),
       (16, 'Quần Tennis Under Armour - Đen, size M', 'vot_tennis_wilson_pro_staff.jpg', 1, 2, 14),
       (16, 'Quần Tennis Under Armour - Đen, size L', 'vot_tennis_wilson_pro_staff.jpg', 1, 3, 12),
       (16, 'Quần Tennis Under Armour - Xám, size M', 'vot_tennis_wilson_pro_staff.jpg', 10, 2, 10),
       (16, 'Quần Tennis Under Armour - Xám, size L', 'vot_tennis_wilson_pro_staff.jpg', 10, 3, 8),
       (17, 'Vợt Cầu Lông Li-Ning Windstorm - Đỏ', 'vot_tennis_wilson_pro_staff.jpg', 3, null, 15),
       (17, 'Vợt Cầu Lông Li-Ning Windstorm - Đen', 'vot_tennis_wilson_pro_staff.jpg', 1, null, 12),
       (18, 'Vợt Cầu Lông Victor Thruster - Xanh', 'vot_tennis_wilson_pro_staff.jpg', 4, null, 14),
       (18, 'Vợt Cầu Lông Victor Thruster - Cam', 'vot_tennis_wilson_pro_staff.jpg', 7, null, 10),
       (19, 'Giày Cầu Lông Li-Ning Ranger - Đỏ, size 40', 'vot_tennis_wilson_pro_staff.jpg', 3, 8, 8),
       (19, 'Giày Cầu Lông Li-Ning Ranger - Đỏ, size 41', 'vot_tennis_wilson_pro_staff.jpg', 3, 9, 7),
       (19, 'Giày Cầu Lông Li-Ning Ranger - Đen, size 40', 'vot_tennis_wilson_pro_staff.jpg', 1, 8, 9),
       (19, 'Giày Cầu Lông Li-Ning Ranger - Đen, size 41', 'vot_tennis_wilson_pro_staff.jpg', 1, 9, 8),
       (20, 'Giày Cầu Lông Victor SH-A830 - Xanh, size 40', 'vot_tennis_wilson_pro_staff.jpg', 4, 8, 10),
       (20, 'Giày Cầu Lông Victor SH-A830 - Xanh, size 41', 'vot_tennis_wilson_pro_staff.jpg', 4, 9, 8),
       (20, 'Giày Cầu Lông Victor SH-A830 - Trắng, size 40', 'vot_tennis_wilson_pro_staff.jpg', 2, 8, 7),
       (20, 'Giày Cầu Lông Victor SH-A830 - Trắng, size 41', 'vot_tennis_wilson_pro_staff.jpg', 2, 9, 6),
       (21, 'Áo Cầu Lông Victor Unisex - Đỏ, size M', 'vot_tennis_wilson_pro_staff.jpg', 3, 2, 15),
       (21, 'Áo Cầu Lông Victor Unisex - Đỏ, size L', 'vot_tennis_wilson_pro_staff.jpg', 3, 3, 12),
       (21, 'Áo Cầu Lông Victor Unisex - Xanh, size M', 'vot_tennis_wilson_pro_staff.jpg', 4, 2, 14),
       (21, 'Áo Cầu Lông Victor Unisex - Xanh, size L', 'vot_tennis_wilson_pro_staff.jpg', 4, 3, 10),
       (22, 'Quần Cầu Lông Yonex Premium - Đen, size M', 'vot_tennis_wilson_pro_staff.jpg', 1, 2, 18),
       (22, 'Quần Cầu Lông Yonex Premium - Đen, size L', 'vot_tennis_wilson_pro_staff.jpg', 1, 3, 15),
       (22, 'Quần Cầu Lông Yonex Premium - Trắng, size M', 'vot_tennis_wilson_pro_staff.jpg', 2, 2, 12),
       (22, 'Quần Cầu Lông Yonex Premium - Trắng, size L', 'vot_tennis_wilson_pro_staff.jpg', 2, 3, 10),
       (23, 'Vợt Bóng Bàn DHS Hurricane - Đỏ/Đen', 'vot_tennis_wilson_pro_staff.jpg', 3, null, 20),
       (23, 'Vợt Bóng Bàn DHS Hurricane - Xanh/Đen', 'vot_tennis_wilson_pro_staff.jpg', 4, null, 15),
       (24, 'Vợt Bóng Bàn Stiga Offensive - Đỏ/Đen', 'vot_tennis_wilson_pro_staff.jpg', 3, null, 18),
       (24, 'Vợt Bóng Bàn Stiga Offensive - Xanh/Đen', 'vot_tennis_wilson_pro_staff.jpg', 4, null, 14),
       (25, 'Giày Bóng Bàn Mizuno Wave Drive - Xanh, size 40', 'vot_tennis_wilson_pro_staff.jpg', 4, 8, 9),
       (25, 'Giày Bóng Bàn Mizuno Wave Drive - Xanh, size 41', 'vot_tennis_wilson_pro_staff.jpg', 4, 9, 8),
       (25, 'Giày Bóng Bàn Mizuno Wave Drive - Đỏ, size 40', 'vot_tennis_wilson_pro_staff.jpg', 3, 8, 7),
       (25, 'Giày Bóng Bàn Mizuno Wave Drive - Đỏ, size 41', 'vot_tennis_wilson_pro_staff.jpg', 3, 9, 6);

-- Insert data into nhaphang (import orders)
INSERT INTO nhaphang (nhanvien, ngay, tonggianhap, nhacungcap)
VALUES (3, '2023-01-15', 15000000, 1),
       (3, '2023-02-20', 18000000, 2),
       (3, '2023-03-10', 12000000, 3),
       (3, '2023-04-05', 20000000, 1),
       (3, '2023-05-12', 16000000, 4);



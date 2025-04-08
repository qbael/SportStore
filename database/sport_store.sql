DROP DATABASE IF EXISTS sport_store;
CREATE DATABASE IF NOT EXISTS sport_store;
USE sport_store;

CREATE TABLE taikhoan
(
    id       INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    email    VARCHAR(255) NOT NULL
);

CREATE TABLE ttkhachhang
(
    id       INT PRIMARY KEY AUTO_INCREMENT,
    taikhoan INT,
    hoten    NVARCHAR(255),
    diachi   NVARCHAR(255),
    sdt      INT,
    FOREIGN KEY (taikhoan) REFERENCES taikhoan (id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE hoadon
(
    id          INT PRIMARY KEY AUTO_INCREMENT,
    ngay        DATE                                                  DEFAULT (CURRENT_DATE),
    ttkhachhang INT,
    tonggianhap INT,
    tonggiaban  INT,
    trangthai   ENUM ('Đang xử lý', 'Đã hủy', 'Đang giao', 'Đã giao') DEFAULT 'Đang xử lý',
    FOREIGN KEY (ttkhachhang) REFERENCES ttkhachhang (id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE thuonghieu
(
    id            INT PRIMARY KEY AUTO_INCREMENT,
    tenthuonghieu NVARCHAR(255)
);

CREATE TABLE danhmuc
(
    id   INT PRIMARY KEY AUTO_INCREMENT,
    loai NVARCHAR(255)
);

CREATE TABLE bomon
(
    id       INT PRIMARY KEY AUTO_INCREMENT,
    tenbomon NVARCHAR(255)
);

CREATE TABLE sanpham
(
    id         INT PRIMARY KEY AUTO_INCREMENT,
    ten        NVARCHAR(255),
    hinhanh    VARCHAR(255),
    gianhap    INT,
    giaban     INT,
    mota       TEXT,
    trangthai  BOOLEAN DEFAULT TRUE,
    thuonghieu INT,
    danhmuc    INT,
    bomon      INT,
    FOREIGN KEY (thuonghieu) REFERENCES thuonghieu (id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (danhmuc) REFERENCES danhmuc (id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (bomon) REFERENCES bomon (id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE mau
(
    id  INT PRIMARY KEY AUTO_INCREMENT,
    ten NVARCHAR(255)
);

CREATE TABLE size
(
    id   INT PRIMARY KEY AUTO_INCREMENT,
    size VARCHAR(5)
);

CREATE TABLE bienthe
(
    id         INT PRIMARY KEY AUTO_INCREMENT,
    sanpham    INT,
    tenbienthe NVARCHAR(255),
    hinhanh    VARCHAR(255),
    mau        INT,
    size       INT,
    soluongton INT,
    FOREIGN KEY (sanpham) REFERENCES sanpham (id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (mau) REFERENCES mau (id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (size) REFERENCES size (id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE cthoadon
(
    id      INT PRIMARY KEY AUTO_INCREMENT,
    hoadon  INT,
    bienthe INT,
    soluong INT,
    giaban  INT,
    gianhap INT,
    FOREIGN KEY (hoadon) REFERENCES hoadon (id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (bienthe) REFERENCES bienthe (id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE nhacungcap
(
    id     INT PRIMARY KEY AUTO_INCREMENT,
    email  NVARCHAR(255),
    ten    NVARCHAR(255),
    diachi NVARCHAR(255),
    sdt    INT
);

CREATE TABLE chucnang
(
    id          INT PRIMARY KEY AUTO_INCREMENT,
    tenchucnang NVARCHAR(255)
);

CREATE TABLE chucvu
(
    id        INT PRIMARY KEY AUTO_INCREMENT,
    tenchucvu ENUM ('Admin', 'Nhân viên bán hàng', 'Nhân viên kho', 'Quản lý doanh nghiệp') UNIQUE NOT NULL
);

CREATE TABLE quyen
(
    id       INT PRIMARY KEY AUTO_INCREMENT,
    chucvu   INT,
    chucnang INT,
    hanhdong ENUM ('Xem', 'Thêm', 'Sửa', 'Xóa') UNIQUE NOT NULL,
    UNIQUE (chucvu, chucnang, hanhdong),
    FOREIGN KEY (chucvu) REFERENCES chucvu (id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (chucnang) REFERENCES chucnang (id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE nhanvien
(
    id       INT PRIMARY KEY AUTO_INCREMENT,
    hoten    NVARCHAR(255),
    ngaysinh DATE,
    gioitinh BOOLEAN,
    diachi   NVARCHAR(255),
    email    VARCHAR(255),
    sdt      INT,
    chucvu   INT not null,
    FOREIGN KEY (chucvu) REFERENCES chucvu (id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE nhaphang
(
    id          INT PRIMARY KEY AUTO_INCREMENT,
    nhanvien    INT,
    ngay        DATE DEFAULT (CURRENT_DATE),
    tonggianhap INT,
    nhacungcap  INT,
    FOREIGN KEY (nhacungcap) REFERENCES nhacungcap (id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (nhanvien) REFERENCES nhanvien (id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE ctnhaphang
(
    id       INT PRIMARY KEY AUTO_INCREMENT,
    nhaphang INT,
    bienthe  INT,
    soluong  INT,
    gianhap  INT,
    FOREIGN KEY (nhaphang) REFERENCES nhaphang (id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (bienthe) REFERENCES bienthe (id) ON UPDATE CASCADE ON DELETE CASCADE
);

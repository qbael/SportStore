DROP DATABASE IF EXISTS sport_store;
CREATE DATABASE IF NOT EXISTS sport_store;
USE sport_store;

CREATE TABLE taikhoan
(
    id       INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(30) NOT NULL,
    password VARCHAR(30) NOT NULL,
    email    VARCHAR(30) NOT NULL
);

CREATE TABLE ttkhachhang
(
    id       INT PRIMARY KEY AUTO_INCREMENT,
    taikhoan INT,
    hoten    NVARCHAR(30),
    diachi   NVARCHAR(100),
    sdt      INT,
    FOREIGN KEY (taikhoan) REFERENCES taikhoan (id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE hoadon
(
    id          INT PRIMARY KEY AUTO_INCREMENT,
    ngay        DATE DEFAULT(CURRENT_DATE),
    ttkhachhang INT,
    tong        INT,
    trangthai   ENUM ('Đang xử lý', 'Đã hủy', 'Đang giao', 'Đã giao'),
    FOREIGN KEY (ttkhachhang) REFERENCES ttkhachhang (id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE thuonghieu
(
    id  INT PRIMARY KEY AUTO_INCREMENT,
    ten NVARCHAR(30)
);

CREATE TABLE danhmuc
(
    id   INT PRIMARY KEY AUTO_INCREMENT,
    loai NVARCHAR(30)
);

CREATE TABLE bomon
(
    id  INT PRIMARY KEY AUTO_INCREMENT,
    ten NVARCHAR(30)
);

CREATE TABLE sanpham
(
    id         INT PRIMARY KEY AUTO_INCREMENT,
    ten        NVARCHAR(30),
    hinhanh    VARCHAR(255),
    gia        INT,
    mota       TEXT,
    mo_ta_loi  INT,
    loai       INT,
    thuonghieu INT,
    danhmuc    INT,
    bomon      INT,
    FOREIGN KEY (loai) REFERENCES danhmuc (id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (thuonghieu) REFERENCES thuonghieu (id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (danhmuc) REFERENCES danhmuc (id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (bomon) REFERENCES bomon (id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE mau
(
    id  INT PRIMARY KEY AUTO_INCREMENT,
    ten NVARCHAR(10)
);

CREATE TABLE size
(
    id   INT PRIMARY KEY AUTO_INCREMENT,
    size VARCHAR(5)
);

CREATE TABLE bienthe
(
    id      INT PRIMARY KEY AUTO_INCREMENT,
    sanpham INT,
    hinhanh VARCHAR(255),
    mau     INT,
    size    INT,
    soluong INT,
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
    gia     INT,
    FOREIGN KEY (hoadon) REFERENCES hoadon (id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (bienthe) REFERENCES bienthe (id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE nhacungcap
(
    id     INT PRIMARY KEY AUTO_INCREMENT,
    email  NVARCHAR(30),
    ten    NVARCHAR(30),
    diachi NVARCHAR(100)
);

CREATE TABLE chucnang
(
    id          INT PRIMARY KEY AUTO_INCREMENT,
    tenchucnang NVARCHAR(30)
);

CREATE TABLE chucvu
(
    id        INT PRIMARY KEY AUTO_INCREMENT,
    tenchucvu NVARCHAR(30)
);

CREATE TABLE quyen
(
    chucvu   INT,
    chucnang INT,
    hanhdong NVARCHAR(10),
    PRIMARY KEY (chucvu, chucnang),
    FOREIGN KEY (chucvu) REFERENCES chucvu (id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (chucnang) REFERENCES chucnang (id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE nhanvien
(
    id       INT PRIMARY KEY AUTO_INCREMENT,
    hoan     NVARCHAR(30),
    ngaysinh DATE,
    gioitinh BOOLEAN,
    diachi   NVARCHAR(100),
    sdt      INT,
    chucvu   INT,
    FOREIGN KEY (chucvu) REFERENCES chucvu (id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE nhaphang
(
    id         INT PRIMARY KEY AUTO_INCREMENT,
    nhanvien   INT,
    ngay       DATE DEFAULT(CURRENT_DATE),
    bienthe    INT,
    soluong    INT,
    nhacungcap INT,
    FOREIGN KEY (nhacungcap) REFERENCES nhacungcap (id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY (nhanvien) REFERENCES nhanvien (id) ON UPDATE CASCADE ON DELETE CASCADE
);

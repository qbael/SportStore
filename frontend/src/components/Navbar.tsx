import * as React from 'react';
import { useState } from 'react';
import logo from '../assets/img/logo.jpg';

// Định nghĩa interface cho submenu item
interface SubMenuItem {
  label: string;
  link: string;
}

// Định nghĩa interface cho nav item
interface NavItem {
  label: string;
  submenu: SubMenuItem[];
}

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openDropdown, setOpenDropdown] = useState<number | null>(null); // State để theo dõi dropdown đang mở

  const navItems: NavItem[] = [
    { label: 'SẢN PHẨM', submenu: [] },
    {
      label: 'CẦU LÔNG',
      submenu: [
        { label: 'Vợt cầu lông', link: '#vot-cau-long' },
        { label: 'Quả cầu lông', link: '#qua-cau-long' },
        { label: 'Giày cầu lông', link: '#giay-cau-long' },
      ],
    },
    {
      label: 'BÓNG BÀN',
      submenu: [
        { label: 'Vợt bóng bàn', link: '#vot-bong-ban' },
        { label: 'Bàn bóng bàn', link: '#ban-bong-ban' },
        { label: 'Bóng bàn', link: '#bong-ban' },
      ],
    },
    { label: 'TENNIS', submenu: [] },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  // Hàm xử lý click để mở/đóng dropdown
  const handleDropdownToggle = (index: number) => {
    if (openDropdown === index) {
      setOpenDropdown(null); // Đóng dropdown nếu đã mở
    } else {
      setOpenDropdown(index); // Mở dropdown
    }
  };

  return (
    <div className="navbar-container">
      {/* Top Bar */}
      <div className="top-bar bg-dark text-white py-2 px-3 d-flex justify-content-between align-items-center">
        <span className="return-link"></span>
        <div className="top-right-links d-flex align-items-center">
          <a href="#help" className="text-white text-decoration-none me-3">
            help
          </a>
          <a href="#order-tracker" className="text-white text-decoration-none me-3">
            order tracker
          </a>
          <a href="#become-member" className="text-white text-decoration-none me-3">
            become a member
          </a>
          <span className="flag">🇻🇳</span>
        </div>
      </div>

      {/* Main Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
        <div className="container-fluid">
          {/* Logo */}
          <a className="navbar-brand" href="/">
            <img src={logo} alt="adidas logo" className="logo-img" />
          </a>

          {/* Toggle button for mobile */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Navbar links */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              {navItems.map((item, index) => (
                <li
                  key={index}
                  className={`nav-item ${item.submenu.length > 0 ? 'dropdown' : ''}`}
                >
                  {item.submenu.length > 0 ? (
                    <>
                      <a
                        className="nav-link text-uppercase fw-bold dropdown-toggle"
                        href="#"
                        id={`dropdown${index}`}
                        role="button"
                        onClick={() => handleDropdownToggle(index)} // Xử lý click để mở/đóng
                        aria-expanded={openDropdown === index}
                      >
                        {item.label}
                      </a>
                      <ul
                        className={`dropdown-menu ${openDropdown === index ? 'show' : ''}`}
                        aria-labelledby={`dropdown${index}`}
                      >
                        {item.submenu.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <a className="dropdown-item" href={subItem.link}>
                              {subItem.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <a
                      className="nav-link text-uppercase fw-bold"
                      href={`#${item.label.toLowerCase()}`}
                    >
                      {item.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>

            {/* Search and Icons */}
            <div className="d-flex align-items-center">
              <form onSubmit={handleSearchSubmit} className="d-flex me-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="Search"
                  className="form-control search-input"
                />
                <button type="submit" className="btn btn-dark search-button">
                  🔍
                </button>
              </form>
              <div className="icons d-flex gap-3">
                <span className="nav-icon" role="img" aria-label="user">
                  👤
                </span>
                <span className="nav-icon" role="img" aria-label="heart">
                  ❤️
                </span>
                <span className="nav-icon" role="img" aria-label="cart">
                  🛒
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
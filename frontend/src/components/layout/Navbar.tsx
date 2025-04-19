import { useState } from 'react';
import {Link, useSearchParams, useNavigate } from 'react-router-dom';
import logo from '../../assets/img/logo.jpg';
import '../../css/Navbar.css';

// Định nghĩa interface cho submenu item
interface SubMenuItem {
  label: string;
  link: string;
}

// Định nghĩa interface cho nav item
interface NavItem {
  label: string;
  link: string;
  submenu: SubMenuItem[];
}

export default function Navbar() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navItems: NavItem[] = [
    { label: 'SẢN PHẨM',
      link: '/product',
      submenu: []
    },
    {
      label: 'CẦU LÔNG',
      link: '/product?bomon=cau-long',
      submenu: [
        { label: 'Vợt cầu lông', link: '/product?bomon=cau-long&danhmuc=vot' },
        { label: 'Quần áo cầu lông', link: '/product?bomon=cau-long&danhmuc=quan-ao' },
        { label: 'Giày cầu lông', link: '/product?bomon=cau-long&danhmuc=giay' },
      ],
    },
    {
      label: 'BÓNG BÀN',
      link: '/product?bomon=bong-ban',
      submenu: [
        { label: 'Vợt bóng bàn', link: '/product?bomon=bong-ban&danhmuc=vot' },
        { label: 'Quần áo bóng bàn', link: '/product?bomon=bong-ban&danhmuc=quan-ao' },
        { label: 'Giày bóng bàn', link: '/product?bomon=bong-ban&danhmuc=giay' },
      ],
    },
    { label: 'TENNIS',
      link: '/product?bomon=tennis',
      submenu: [
        { label: 'Vợt tennis', link: '/product?bomon=tennis&danhmuc=vot' },
        { label: 'Quần áo tennis', link: '/product?bomon=tennis&danhmuc=quan-ao' },
        { label: 'Giày tennis', link: '/product?bomon=tennis&danhmuc=giay' },
      ]
    },
    { label: 'THƯƠNG HIỆU',
      link: '/product',
      submenu: [
        { label: 'Nike', link: '/product?thuonghieu=nike' },
        { label: 'Adidas', link: '/product?thuonghieu=adidas' },
        { label: 'Puma', link: '/product?thuonghieu=puma' },
        { label: 'Under Armour', link: '/product?thuonghieu=under-armour' },
        { label: 'New Balance', link: '/product?thuonghieu=new-balance' },
        { label: 'Asics', link: '/product?thuonghieu=asics' },
        { label: 'Reebok', link: '/product?thuonghieu=reebok' },
        { label: 'Wilson', link: '/product?thuonghieu=wilson' },
        { label: 'Yonex', link: '/product?thuonghieu=yonex' },
        { label: 'Speedo', link: '/product?thuonghieu=speedo' },
      ]
    },
  ];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      searchParams.set('search', searchQuery.trim());
      navigate(`/product?${searchParams.toString()}`);
      setSearchQuery('');
    }
  };

  const handleDropdownToggle = (index: number) => {
    setOpenDropdown(openDropdown === index ? null : index);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setOpenDropdown(null);
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
      />
      <nav className={`navbar navbar-expand-lg fixed-top bg-white shadow-sm ${isMobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="container">
          <Link className="navbar-brand" to="/">
            <img src={logo} alt="Logo" height="45" className="navbar-logo" />
          </Link>

          <button
            className="navbar-toggler hamburger-menu"
            type="button"
            onClick={toggleMobileMenu}
            aria-label="Toggle navigation"
            aria-expanded={isMobileMenuOpen}
          >
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
          </button>

          {isMobileMenuOpen && <div className="mobile-backdrop" onClick={toggleMobileMenu}></div>}

          <div className={`navbar-collapse collapse ${isMobileMenuOpen ? 'show' : ''}`} id="navbarNav">
            {isMobileMenuOpen && (
              <button
                className="mobile-close-btn d-lg-none"
                onClick={toggleMobileMenu}
                aria-label="Close menu"
              >
                <i className="fas fa-times"></i>
              </button>
            )}

            <ul className="navbar-nav mx-auto">
              {navItems.map((item, index) => (
                <li key={index} className={`nav-item ${item.submenu.length > 0 ? 'dropdown' : ''}`}
                    onMouseEnter={() => handleDropdownToggle(index)}
                    onMouseLeave={() => handleDropdownToggle(index)}
                >
                  {item.submenu.length > 0 ? (
                    <>
                      <button
                        className={`nav-link ${openDropdown === index ? 'active' : ''}`}
                        aria-expanded={openDropdown === index}
                        onClick={() => navigate(item.link)}
                      >
                        {item.label}
                        <i className={`fas fa-chevron-down ms-2 ${openDropdown === index ? 'rotate' : ''}`}></i>
                      </button>
                      <ul className={`dropdown-menu ${openDropdown === index ? 'show' : ''}`}>
                        {item.submenu.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <Link
                              className="dropdown-item"
                              to={subItem.link}
                              onClick={() => {
                                setIsMobileMenuOpen(false);
                                setOpenDropdown(null);
                              }}
                            >
                              {subItem.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </>
                  ) : (
                    <Link
                      className="nav-link"
                      to={item.link}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>

            <div className="nav-actions d-flex align-items-center">
              <form onSubmit={handleSearchSubmit} className="search-form me-3">
                <div className="input-group">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearchSubmit(e as any);
                      }
                    }}
                    placeholder="Tìm kiếm sản phẩm"
                    className="form-control"
                  />
                  <button type="submit" className="btn search-btn">
                    <i className="fas fa-search"></i>
                  </button>
                </div>
              </form>
              <div className="action-buttons d-flex gap-2">
                <Link to="/account" className="btn btn-icon" title="Tài khoản">
                  <i className="fas fa-user"></i>
                </Link>
                {/* <Link to="/wishlist" className="btn btn-icon" title="Yêu thích">
                  <i className="fas fa-heart"></i>
                </Link> */}
                <Link to="/cart" className="btn btn-icon" title="Giỏ hàng">
                  <i className="fas fa-shopping-cart"></i>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
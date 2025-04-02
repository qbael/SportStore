import { useState, useEffect, useRef } from 'react';
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
  const navigator = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const navbarRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

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
      link: '',
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
      searchParams.set('search', searchQuery);
      navigator(`/product?${searchParams.toString().trim()}`);
      setSearchQuery('');
  };

  const handleDropdownClick = (index: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDropdown(activeDropdown === index ? null : index);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        activeDropdown !== null &&
        !(event.target as Element).closest('.nav-dropdown')
      ) {
        setActiveDropdown(null);
      }
      if (
        isMobileMenuOpen &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !(event.target as Element).closest('.menu-toggle')
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [activeDropdown, isMobileMenuOpen]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setActiveDropdown(null);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  return (
    <nav className={`navbar navbar-expand-lg fixed-top ${isScrolled ? 'navbar-scrolled' : ''}`} ref={navbarRef}>
      <div className="container py-2">
        <Link className="navbar-brand" to="/">
          <img src={logo} alt="Logo" height="45" className="navbar-logo" />
        </Link>

        {/* Mobile Buttons */}
        <div className="d-flex align-items-center gap-3 d-lg-none">
          <button
            className={`hamburger-menu ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              setIsMobileMenuOpen(!isMobileMenuOpen);
            }}
            aria-label="Menu"
            aria-expanded={isMobileMenuOpen}
          >
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
            <div className="hamburger-line"></div>
          </button>
        </div>

        {/* Mobile menu backdrop */}
        {isMobileMenuOpen && <div className="mobile-backdrop" onClick={() => setIsMobileMenuOpen(false)}></div>}

        {/* Main Navigation */}
        <div className={`navbar-collapse ${isMobileMenuOpen ? 'show' : ''}`} ref={menuRef}>
          <div className="mobile-header d-flex justify-content-between d-lg-none">
            <h5 className="mb-0">Menu</h5>
            <button
              className="btn-close"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            ></button>
          </div>

          <ul className="navbar-nav mx-auto">
            {navItems.map((item, index) => (
              <li key={index}
                  className="nav-item"
                  onMouseEnter={(e) => handleDropdownClick(index, e)}
                  onMouseLeave={(e) => handleDropdownClick(index, e)}
              >
                {item.submenu.length > 0 ? (
                  <div className="nav-dropdown">
                    <button
                      className={`nav-link d-flex align-items-center justify-content-between ${activeDropdown === index ? 'active' : ''}`}
                      style={{ marginRight: '10px' }}
                      onClick={() => {
                        navigator(item.link === ''? '': item.link);
                      }}
                      aria-expanded={activeDropdown === index}
                    >
                      <span>{item.label}</span>
                      <i className={`fas fa-chevron-down ${activeDropdown === index ? 'rotate' : ''}`}></i>
                    </button>
                    <div
                      className={`dropdown-menu ${activeDropdown === index ? 'show' : ''}`}
                      aria-hidden={activeDropdown !== index}
                    >
                      {item.submenu.map((subItem, subIndex) => (
                        <Link
                          key={subIndex}
                          to={subItem.link}
                          className="dropdown-item"
                          onClick={() => {
                            setIsMobileMenuOpen(false);
                            setActiveDropdown(null);
                          }}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    className="nav-link"
                    to={item.label === 'TRANG CHỦ' ? '/' : '/product'}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Unified Search and Actions */}
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
                  placeholder="Search"
                  className="form-control search-input"
                />
                <button type="submit" className="btn btn-icon">
                  <i className="fas fa-search"></i>
                </button>
              </div>
            </form>

            <div className="action-buttons d-flex">
              <Link to="/account" className="btn btn-icon" title="Tài khoản">
                <i className="fas fa-user"></i>
              </Link>
              <Link to="/wishlist" className="btn btn-icon" title="Yêu thích">
                <i className="fas fa-heart"></i>
              </Link>
              <Link to="/cart" className="btn btn-icon" title="Giỏ hàng">
                <i className="fas fa-shopping-cart"></i>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
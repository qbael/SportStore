// Navbar.tsx
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import debounce from 'lodash/debounce';
import logo from '../../assets/img/logo.jpg';
import '../../css/Navbar.css';

interface SubMenuItem {
  label: string;
  link: string;
}

interface NavItem {
  label: string;
  submenu: SubMenuItem[];
}

interface NavbarProps {
  onSearch: (searchTerm: string) => void;
}

export default function Navbar({ onSearch }: NavbarProps) {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<number | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const navbarRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const navItems: NavItem[] = [
    { label: 'TRANG CHỦ', submenu: [] },
    {
      label: 'CẦU LÔNG',
      submenu: [
        { label: 'Vợt cầu lông', link: '/products#vot-cau-long' },
        { label: 'Quả cầu lông', link: '/products#qua-cau-long' },
        { label: 'Giày cầu lông', link: '/products#giay-cau-long' },
      ],
    },
    {
      label: 'BÓNG BÀN',
      submenu: [
        { label: 'Vợt bóng bàn', link: '/products#vot-bong-ban' },
        { label: 'Bàn bóng bàn', link: '/products#ban-bong-ban' },
        { label: 'Bóng bàn', link: '/products#bong-ban' },
      ],
    },
    {
      label: 'TENNIS',
      submenu: [
        { label: 'Vợt tennis', link: '/products#vot-tennis' },
        { label: 'Bóng tennis', link: '/products#bong-tennis' },
        { label: 'Giày tennis', link: '/products#giay-tennis' },
      ],
    },
    { label: 'SẢN PHẨM', submenu: [] },
  ];

  const debouncedSearch = useCallback(
    debounce((value: string) => onSearch(value), 300),
    [onSearch]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch(searchQuery);
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
              <li key={index} className="nav-item">
                {item.submenu.length > 0 ? (
                  <div className="nav-dropdown">
                    <button
                      className={`nav-link d-flex align-items-center justify-content-between ${activeDropdown === index ? 'active' : ''}`}
                      onClick={(e) => handleDropdownClick(index, e)}
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
                    to={item.label === 'TRANG CHỦ' ? '/' : '/products'}
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
                  placeholder="Tìm kiếm sản phẩm"
                  className="form-control"
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
import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../../css/Footer.css';

const Footer: React.FC = () => {
  return (
    <footer className="footer bg-dark text-white py-5">
      <div className="container">
        <div className="row gy-4">
          {[
            { title: 'HỖ TRỢ', items: ['Liên hệ', 'FAQ', 'Vận chuyển', 'Đổi trả', 'Điều khoản', 'Bảo mật'] },
            { title: 'VỀ CHÚNG TÔI', items: ['Cửa hàng', 'Tìm cửa hàng', 'Thẻ quà tặng', 'Khuyến mãi', 'Giới thiệu bạn bè'] },
            { title: 'KHÁM PHÁ', items: ['Tin tức', 'Sự nghiệp', 'Bền vững', 'Nhà đầu tư'] },
            { title: 'THEO DÕI', items: [] },
          ].map((section, idx) => (
            <div key={idx} className="col-12 col-md-6 col-lg-3">
              <h5 className="footer-title">{section.title}</h5>
              {section.items.length > 0 ? (
                <ul className="list-unstyled">
                  {section.items.map((item, index) => (
                    <li key={index} className="mb-2">
                      <a href="#" className="footer-link">{item}</a>
                    </li>
                  ))}
                </ul>
              ) : (
                <>
                  <p className="mb-3">Đăng ký nhận email</p>
                  <form className="d-flex subscribe-form ">
                    <input 
                      type="email" 
                      className="form-control rounded-pill me-2" 
                      placeholder="Email của bạn"
                    />
                    <button 
                      className="btn btn-outline-light rounded-pill px-4 subscribe-btn"
                      type="submit"
                    >
                      Đăng ký
                    </button>
                  </form>
                </>
              )}
            </div>
          ))}
        </div>
        <div className="row mt-5 align-items-center">
          <div className="col-12 col-md-6 mb-3 mb-md-0">
            <div className="d-flex gap-3">
              {['facebook', 'instagram', 'twitter', 'youtube', 'pinterest'].map((social, index) => (
                <a key={index} href="#" className="footer-social-icon">
                  <i className={`fab fa-${social}`}></i>
                </a>
              ))}
            </div>
          </div>
          <div className="col-12 col-md-6 text-md-end">
            <div className="d-inline-flex align-items-center">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Flag_of_Vietnam.svg/1200px-Flag_of_Vietnam.svg.png"
                alt="Vietnam Flag"
                className="footer-flag me-2"
              />
              <span>Việt Nam</span>
            </div>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col text-center">
            <small className="footer-copyright">© 2025 Adidas Việt Nam. Mọi quyền được bảo lưu.</small>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
import "../css/Cart.css"
import useCart from '../hook/useCart.tsx';
import { useEffect, useState } from 'react';
import { formatPrice } from '../util/Helper.ts';
import {PRODUCT_API_URL, PRODUCT_IMAGE_BASE_PATH, BASE_URL} from "../util/Constant.tsx";
import { useAuth } from '../hook/useAuth.tsx'; // Thêm useAuth
import { useNavigate } from 'react-router-dom'; // Thêm useNavigate
import { useNotification } from '../hook/useNotification2.tsx'; // Thêm useNotification

function Cart() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    getTotalPrice,
    getTotalGiaNhap,
    getTotalQuantity,
    resetCart,
  } = useCart();

  const [showModal, setShowModal] = useState(false); // Trạng thái để hiển thị modal
  const { isAuthenticated, user } = useAuth(); // Lấy thông tin xác thực từ AuthContext
  const navigate = useNavigate(); // Để điều hướng đến trang đăng nhập
  const { showNotification } = useNotification(); // Để hiển thị thông báo
  
  useEffect(() => {
    // Nếu chưa đăng nhập, hiển thị thông báo và chuyển hướng
    if (!isAuthenticated) {
      showNotification('Vui lòng đăng nhập để xem giỏ hàng', 'error');
      // navigate('/chua_dang_nhap'); // Chuyển hướng đến trang đăng nhập  , có thể xây dựng trang nay để thông báo cho người dùng
      navigate('/'); // Chuyển hướng đến trang chủ
    }
  }, [isAuthenticated]);


  useEffect(() => {
    console.log("Giỏ hàng hiện tại:", cart);
  }, [cart]);


  // Thêm key cho mỗi cart-item để tránh cảnh báo React về danh sách không có key.
  const handleOrder = () => {
    const ctHoaDonList: {
      soLuong: number;
      giaBan: number | null;
      giaNhap: number | null;
      bienThe: { id: number };
    }[] = [];

    cart.map((item, index) => {
      ctHoaDonList.push({
        soLuong: item.quantity,
        giaBan: item.product?.giaBan ?? null,
        giaNhap: item.product?.giaNhap ?? null,
        bienThe: { id: item.bienthesp?.id ?? 0 },
      });
    });

    const newHoaDon = {
      tongGiaNhap: getTotalGiaNhap(),
      tongGiaBan: getTotalPrice(),
      trangThai: 'Đang xử lý',
      ttKhachHang: { id: user?.profiles?.[0]?.id }, // Nên thay bằng id khách hàng thực tế từ user
      dsCTHoaDon: ctHoaDonList,
    };

    console.log("Hóa đơn mới:", newHoaDon);

    fetch(`${BASE_URL}/hoadon`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newHoaDon),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Lỗi khi tạo hóa đơn");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Hóa đơn đã lưu:", data);
        resetCart();
        showNotification('Đặt hàng thành công!', 'success'); // Thêm thông báo
      })
      .catch((err) => {
        console.error("Lỗi:", err);
        showNotification('Có lỗi xảy ra khi đặt hàng', 'error'); // Thêm thông báo lỗi
      })
      .finally(() => {
        setShowModal(false); // Đóng modal trong mọi trường hợp (thành công hoặc thất bại)
      });
       // alert("Bạn đã đặt hàng thành công!");
    // hoặc gọi API, xử lý logic đặt hàng tại đây      
             
  };

  const handleShowModal = () => {
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

 return (
  isAuthenticated ? (
    <div className="container mb-5" style={{ marginTop: "100px" }}>
      <div className="header_name">
        <div>Giỏ hàng của bạn</div>
      </div>

      {cart.length === 0 ? (
        <div className="cart_null">
          <p>Không có sản phẩm nào trong giỏ hàng của bạn</p>
        </div>
      ) : (
        <div>
          <div className="cart-items">
            {cart.map((item) =>
              item.bienthesp ? (
                <div className="cart-item" key={item.bienthesp.id}>
                  <div className="cart-item-img">
                    <img
                      src={`${PRODUCT_IMAGE_BASE_PATH}${item.product?.hinhAnh}`}
                      alt=""
                    />
                  </div>
                  <div className="cart-item-name">
                    <div>
                      <a href={`/product/${item.product?.id}`}>
                        <span className="name-1">{item.bienthesp.tenBienThe}</span>
                      </a>
                    </div>
                    <div>
                      {item.bienthesp?.mau && (
                        <span className="cart-item-bienthe">
                          Màu: {item.bienthesp.mau.tenMau}
                        </span>
                      )}
                      {item.bienthesp?.size && (
                        <span className="cart-item-bienthe">
                          Size: {item.bienthesp.size.size}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="cart-item-control">
                    <button
                      onClick={() => decreaseQuantity(item.bienthesp?.id)}
                      className="control left"
                    >
                      -
                    </button>
                    <span className="control">{item.quantity}</span>
                    <button
                      onClick={() => increaseQuantity(item.bienthesp?.id)}
                      className="control right"
                    >
                      +
                    </button>
                  </div>
                  <div className="cart-item-price">
                    <p>{formatPrice(item.product?.giaBan ?? 0)}</p>
                  </div>
                </div>
              ) : null
            )}
          </div>
          <div className="cart-summary">
            <div className="header_name">
              <span>Tóm tắt đơn hàng</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                margin: "10px",
                padding: "10px",
              }}
            >
              <div>
                <span>Tổng ({getTotalQuantity()} sản phẩm)</span>
              </div>
              <div style={{ color: "#e95221" }}>
                <span>{formatPrice(getTotalPrice())}</span>
              </div>
            </div>
            <div className="f-center">
              <button onClick={handleShowModal} className="btn-dathang">
                Đặt hàng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal xác nhận hóa đơn sử dụng Bootstrap */}
      <div
        className={`modal fade ${showModal ? 'show' : ''}`}
        style={{ display: showModal ? 'block' : 'none' }}
        tabIndex={-1}
        role="dialog"
      >
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Xác nhận hóa đơn</h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseModal}
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <h4>Thông tin đơn hàng</h4>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th scope="col">Sản phẩm</th>
                    <th scope="col">Số lượng</th>
                    <th scope="col">Giá</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) =>
                    item.bienthesp ? (
                      <tr key={item.bienthesp.id}>
                        <td>
                          {item.bienthesp.tenBienThe}
                          {item.bienthesp?.mau && ` (Màu: ${item.bienthesp.mau.tenMau})`}
                          {item.bienthesp?.size && ` (Size: ${item.bienthesp.size.size})`}
                        </td>
                        <td>{item.quantity}</td>
                        <td>{formatPrice(item.product?.giaBan ?? 0)}</td>
                      </tr>
                    ) : null
                  )}
                </tbody>
              </table>
              <div className="text-end">
                <strong>Tổng cộng: {formatPrice(getTotalPrice())}</strong>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleCloseModal}
              >
                Hủy
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleOrder} // Đặt hàng và đóng modal
              >
                Xác nhận đặt hàng
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Overlay cho modal */}
      {showModal && <div className="modal-backdrop fade show"></div>}
    </div>
  ) : null
);
}

export default Cart;

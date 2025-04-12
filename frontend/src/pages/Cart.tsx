import "../css/Cart.css"
import useCart from '../hook/useCart';
import { useEffect } from 'react';
import { formatPrice } from '../util/utils';
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
    getTotalQuantity,
    resetCart,
  } = useCart();

  const { isAuthenticated } = useAuth(); // Lấy thông tin xác thực từ AuthContext
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
      tongGiaNhap: 200000,
      tongGiaBan: getTotalPrice(),
      trangThai: "Đang xử lý",
      ttKhachHang: { id: 1 }, // Nên thay bằng id khách hàng thực tế từ user
      dsCTHoaDon: ctHoaDonList,
    };

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
        });
    // alert("Bạn đã đặt hàng thành công!");
    // hoặc gọi API, xử lý logic đặt hàng tại đây
  };

  // Render giao diện
  return (
      // Nếu đã đăng nhập thì hiển thị giỏ hàng, nếu chưa thì không render gì (do đã điều hướng trong useEffect)
      isAuthenticated ? (
          <div className="container">
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
                                <img src={`${PRODUCT_IMAGE_BASE_PATH}${item.product?.hinhAnh}`} alt="" />
                              </div>
                              <div className="cart-item-name">
                                <div>
                                  <a href={`/product/${item.product?.id}`}>
                                    <span className="name-1">{item.bienthesp.tenBienThe}</span>
                                  </a>
                                </div>
                                <div>
                                  {item.bienthesp?.mau && (
                                      <span className="cart-item-bienthe">Màu: {item.bienthesp.mau.tenMau}</span>
                                  )}
                                  {item.bienthesp?.size && (
                                      <span className="cart-item-bienthe">Size: {item.bienthesp.size.size}</span>
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
                    <div style={{ display: "flex", justifyContent: "space-between", margin: "10px", padding: "10px" }}>
                      <div>
                        <span>Tổng ({getTotalQuantity()} sản phẩm)</span>
                      </div>
                      <div style={{ color: "#e95221" }}>
                        <span>{formatPrice(getTotalPrice())}</span>
                      </div>
                    </div>
                    <div className="f-center">
                      <button onClick={handleOrder} className="btn-dathang">Đặt hàng</button>
                    </div>
                  </div>
                </div>
            )}
          </div>
      ) : null // Nếu chưa đăng nhập, không render gì (điều hướng đã xử lý trong useEffect)
  );
}

export default Cart;
import "../css/Cart.css"
import useCart from '../hook/useCart';
import { useEffect } from 'react';
import { formatPrice } from '../util/utils';

function Cart() {
  const {
    cart,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
    getTotalPrice,
    getTotalQuantity
  } = useCart();

  useEffect(() => {
    console.log("Giỏ hàng hiện tại:", cart);
  }, [cart]);

  const handleOrder = () => {
    alert("Bạn đã đặt hàng thành công!");
    // hoặc gọi API, xử lý logic đặt hàng tại đây
  };

  return (
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
            {cart.map(item => (
              item.bienthesp ? (

                <div className="cart-item">
                  <div className="cart-item-img">
                    <img src={"./product/" + item.product?.hinhAnh} alt="" />
                  </div>
                  <div className="cart-item-name">
                    <div>
                      <a href={"/product/" + item.product?.id}>
                        <span className="name-1">{item.bienthesp.tenBienThe}</span>
                      </a>
                    </div>
                    <div >
                      {item.bienthesp?.mau && <span className="cart-item-bienthe">Màu: {item.bienthesp.mau.tenMau}</span>}
                      {item.bienthesp?.size && <span className="cart-item-bienthe">Size: {item.bienthesp.size.size}</span>}
                    </div>
                  </div>
                  <div className="cart-item-control">
                    <button onClick={() => decreaseQuantity(item.bienthesp?.id)} className="control left">-</button>
                    <span className="control">{item.quantity}</span>
                    <button onClick={() => increaseQuantity(item.bienthesp?.id)} className="control right">+</button>
                  </div>

                  <div className="cart-item-price">
                    <p>{formatPrice(item.product?.giaBan ?? 0)}</p>
                  </div>
                </div>
              ) : null
            ))}
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
  );
}

export default Cart;

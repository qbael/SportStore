import "../css/Cart.css"
import useCart from '../hook/useCart';
import { useEffect } from 'react';
import {formatPrice} from '../util/utils';

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

  return (
    <div className="container">
      <div className="header_name">
        <div>🛒 Giỏ hàng của bạn</div>
      </div>

      {cart.length === 0 ? (
        <div className="cart_null">
          <p>Không có sản phẩm nào trong giỏ hàng của bạn</p>
        </div>
      ) : (
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
                        <button className="control left">+</button>
                        <span className="control">{item.quantity}</span>
                        <button className="control right">-</button>
                    </div>

                    <div className="cart-item-price">
                        <p>{formatPrice(item.product?.giaBan ?? 0)}</p>
                    </div>
                </div>

            //   <div key={item.bienthesp.id} className="cart-item">
            //     <div className="cart-item-name">
            //       {item.product?.tenSanPham}
            //     </div>

            //     <div className="cart-item-quantity">
            //       <button onClick={() => decreaseQuantity(item.bienthesp!.id)}>-</button>
            //       <span> {item.quantity} </span>
            //       <button onClick={() => increaseQuantity(item.bienthesp!.id)}>+</button>
            //     </div>

            //     <div className="cart-item-price">
            //       Giá: {item.product?.giaBan ? item.product.giaBan * item.quantity : 0} VND
            //     </div>

            //     <button
            //       className="btn-remove"
            //       onClick={() => removeFromCart(item.bienthesp.id)}
            //     >
            //       Xóa
            //     </button>
            //   </div>
            ) : null
          ))}

          <div className="cart-summary">
            <p>Tổng số lượng: {getTotalQuantity()}</p>
            <p>Tổng tiền: {getTotalPrice()} VND</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;

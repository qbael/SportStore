import { useState, useEffect } from 'react';
import { BienTheType, ProductType } from '../util/types/ProductTypes';
import { useAuth } from './useAuth.tsx'; // Thêm useAuth để lấy user
import { useNotification } from './useNotification2.tsx'; // Thêm thông báo

export type CartItem = {
  bienthesp: BienTheType | null;
  product: ProductType | null;
  quantity: number;
};

const useCart = () => {
  const { user } = useAuth(); // Lấy thông tin user từ AuthContext
  const { showNotification } = useNotification(); // Thêm thông báo

  // Tạo key động dựa trên username, nếu không có user thì dùng key mặc định (cart_guest) luon = []
  // const getCartKey = () => (user ? `cart_${user.username}` : 'cart_guest');
  const getCartKey = () => (user ? `cart_${user.username}` : 'cart_guest');


  // Load giỏ hàng từ localStorage khi khởi tạo
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const storedCart = localStorage.getItem(getCartKey());
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error('Lỗi khi đọc giỏ hàng từ localStorage:', error);
      return [];
    }
  });

  // Cập nhật giỏ hàng trong localStorage khi cart hoặc user thay đổi
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(getCartKey(), JSON.stringify(cart));
      } else {
        // Nếu không có user, không lưu giỏ hàng (hoặc có thể lưu tạm cho guest)
        localStorage.setItem('cart_guest', JSON.stringify(cart));
      }
    } catch (error) {
      console.error('Lỗi khi lưu giỏ hàng vào localStorage:', error);
    }
  }, [cart, user]);

  // Tải lại giỏ hàng khi user thay đổi (đăng nhập/đăng xuất)
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(getCartKey());
      setCart(storedCart ? JSON.parse(storedCart) : []);
    } catch (error) {
      console.error('Lỗi khi đọc giỏ hàng từ localStorage:', error);
      setCart([]);
    }
  }, [user]);

  const addToCart = (item: CartItem) => {
    if (!user) {
      console.log('Vui lòng đăng nhập để thêm vào giỏ hàng');
      // showNotification('Vui lòng đăng nhập để thêm vào giỏ hàng', 'error');
      return; // Không thêm vào giỏ hàng nếu chưa đăng nhập
    }

    if (!item.product || !item.bienthesp) {
      console.log('Sản phẩm hoặc biến thể không hợp lệ.');
      showNotification('Sản phẩm không hợp lệ', 'error');
      return;
    }

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (cartItem) => cartItem.bienthesp?.id === item.bienthesp?.id
      );

      if (existingIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingIndex].quantity += item.quantity;
        return updatedCart;
      }
      console.log('Thêm sản phẩm vào giỏ hàng:', item);
      return [...prevCart, item];
    });
    showNotification('Thêm vào giỏ hàng thành công', 'success');
    
  };

  const removeFromCart = (Idbienthe: number) => {
    if (!user) return; // Không cho phép xóa nếu chưa đăng nhập

    setCart((prevCart) => prevCart.filter((item) => item.bienthesp?.id !== Idbienthe));
  };

  const increaseQuantity = (Idbienthe: number) => {
    if (!user) return; // Không cho phép tăng nếu chưa đăng nhập

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.bienthesp?.id === Idbienthe
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (Idbienthe: number) => {
    if (!user) return; // Không cho phép giảm nếu chưa đăng nhập

    setCart((prevCart) =>
      prevCart
        .map((item) =>
          item.bienthesp?.id === Idbienthe
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const getTotalQuantity = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => {
      if (item.product) {
        return total + (item.product.giaBan || 0) * item.quantity;
      }
      return total;
    }, 0);
  };

  const resetCart = () => {
    if (!user) return; // Không cho phép reset nếu chưa đăng nhập
    setCart([]);
  };

  return {
    cart,
    addToCart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    getTotalQuantity,
    getTotalPrice,
    resetCart,
  };
};

export default useCart;
import { useState, useEffect } from 'react';
import { BienTheType, ProductType } from '../util/types/ProductTypes';
import { useAuth } from '../hook/useAuth';
import { useNotification } from '../hook/useNotification2';

export type CartItem = {
  bienthesp: BienTheType | null;
  product: ProductType | null;
  quantity: number;
};

const useCart = () => {
  const { user, isLoading } = useAuth();
  const { showNotification } = useNotification();

  const getCartKey = () => (user ? `cart_${user.username}` : 'cart_guest');

  const [cart, setCart] = useState<CartItem[] | null>(null); // <-- null khi chưa load

  // Chờ user load xong mới khởi tạo giỏ hàng
  useEffect(() => {
    if (isLoading) return;

    try {
      const storedCart = localStorage.getItem(getCartKey());
      setCart(storedCart ? JSON.parse(storedCart) : []);
    } catch (error) {
      console.error('Lỗi khi đọc giỏ hàng từ localStorage:', error);
      setCart([]);
    }
  }, [user, isLoading]);

  // Lưu vào localStorage khi cart thay đổi
  useEffect(() => {
    if (cart === null || isLoading) return;

    try {
      localStorage.setItem(getCartKey(), JSON.stringify(cart));
    } catch (error) {
      console.error('Lỗi khi lưu giỏ hàng vào localStorage:', error);
    }
  }, [cart, user, isLoading]);

  const isReady = cart !== null && !isLoading;

  const addToCart = (item: CartItem) => {
    if (!user || !isReady) {
      showNotification('Vui lòng đăng nhập để thêm vào giỏ hàng', 'error');
      return;
    }

    if (!item.product || !item.bienthesp) {
      showNotification('Sản phẩm không hợp lệ', 'error');
      return;
    }

    setCart((prev) => {
      if (!prev) return [item]; // phòng hờ
      const existingIndex = prev.findIndex(
        (cartItem) => cartItem.bienthesp?.id === item.bienthesp?.id
      );

      if (existingIndex !== -1) {
        const updatedCart = [...prev];
        updatedCart[existingIndex].quantity += item.quantity;
        return updatedCart;
      }

      return [...prev, item];
    });

    showNotification('Thêm vào giỏ hàng thành công', 'success');
  };

  const removeFromCart = (id: number) => {
    if (!isReady) return;
    setCart((prev) => prev?.filter((item) => item.bienthesp?.id !== id) || []);
  };

  const increaseQuantity = (id: number) => {
    if (!isReady) return;
    setCart((prev) =>
      prev?.map((item) =>
        item.bienthesp?.id === id ? { ...item, quantity: item.quantity + 1 } : item
      ) || []
    );
  };

  const decreaseQuantity = (id: number) => {
    if (!isReady) return;
    setCart((prev) =>
      (prev || [])
        .map((item) =>
          item.bienthesp?.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const getTotalQuantity = () => {
    if (!isReady) return 0;
    return cart!.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    if (!isReady) return 0;
    return cart!.reduce((total, item) => {
      if (item.product) {
        return total + (item.product.giaBan || 0) * item.quantity;
      }
      return total;
    }, 0);
  };

  const resetCart = () => {
    if (!isReady) return;
    setCart([]);
  };

  return {
    cart: cart || [],
    isReady,
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

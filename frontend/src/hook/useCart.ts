import { useState, useEffect } from 'react';
import { BienTheType, ProductType } from '../util/types/ProductTypes';

export type CartItem = {
  bienthesp: BienTheType | null;
  product: ProductType | null;
  quantity: number;
};

const LOCAL_STORAGE_KEY = 'cart';

const useCart = () => {
  // Load giỏ hàng từ localStorage khi khởi tạo
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const storedCart = localStorage.getItem(LOCAL_STORAGE_KEY);
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error('Lỗi khi đọc giỏ hàng từ localStorage:', error);
      return [];
    }
  });

  // Lưu giỏ hàng vào localStorage mỗi khi có thay đổi
  useEffect(() => {
    console.log("Giỏ hàng hiện tại:", cart);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Lỗi khi lưu giỏ hàng vào localStorage:', error);
    }
  }, [cart]);

  const addToCart = (item: CartItem) => {
    if (!item.product || !item.bienthesp) {
      console.log("Sản phẩm hoặc biến thể không hợp lệ.");
      return;
    }

    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(
        cartItem => cartItem.bienthesp?.id === item.bienthesp?.id
      );

      if (existingIndex !== -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingIndex].quantity += item.quantity;
        return updatedCart;
      }
    
      return [...prevCart, item];
    });
  };

  const removeFromCart = (Idbienthe: number) => {
    setCart(prevCart => prevCart.filter(item => item.bienthesp?.id !== Idbienthe));
  };

  const increaseQuantity = (Idbienthe: number) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.bienthesp?.id === Idbienthe
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (Idbienthe: number) => {
    setCart(prevCart =>
      prevCart
        .map(item =>
          item.bienthesp?.id === Idbienthe
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter(item => item.quantity > 0)
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

import React, { createContext, useState, ReactNode } from 'react';

// Định nghĩa kiểu dữ liệu cho notification
interface Notification {
  message: string;
  type: 'success' | 'error' | 'info'; // Loại thông báo
}

// Định nghĩa kiểu dữ liệu cho context
interface NotificationContextType {
  notification: Notification | null;
  showNotification: (message: string, type: 'success' | 'error' | 'info') => void;
  hideNotification: () => void;
}

// Tạo context
export const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Provider component
export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    // Tự động ẩn sau 3 giây
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const hideNotification = () => {
    setNotification(null);
  };

  return (
    <NotificationContext.Provider value={{ notification, showNotification, hideNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};
import React from 'react';
import { useNotification } from '../../hook/useNotification2';
import '../../css/ui/Notification2.css'; // File CSS cho animation

const Notification: React.FC = () => {
  const { notification } = useNotification();

  if (!notification) return null;

  return (
    <div className={`notification ${notification.type}`}>
      {notification.message}
    </div>
  );
};

export default Notification;
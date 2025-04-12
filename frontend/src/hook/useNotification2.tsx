import React from "react";
import { NotificationContext } from "../context/NotificationContext2";

export const useNotification = () => {
    const context = React.useContext(NotificationContext);
  
    if (!context) {
      throw new Error('useNotification must be used inside a NotificationProvider');
    }
  
    return context;
  };
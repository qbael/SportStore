import React, {createContext, useState} from "react";

interface NotificationContextType {
    message: string,
    showNotification: (msg: string) => void
}

export const NotificationContext = createContext<NotificationContextType | null>(null)

export const NotificationContextProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [message, setMessage] = useState('')

    const showNotification = (msg: string) => {
        setMessage(msg)

        setTimeout(() => {
            setMessage('')
        }, 2500)
    }

    return (
        <NotificationContext.Provider value={{ message, showNotification: (msg: string) => showNotification(msg) }}>
            { children }
        </NotificationContext.Provider>
    )
}
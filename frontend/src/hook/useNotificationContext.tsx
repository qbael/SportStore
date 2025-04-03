import { useContext } from 'react'
import { NotificationContext } from '../context/NotificationContext'

export const useNotificationContext = () => {
    const context = useContext(NotificationContext)

    if (!context)
        throw new Error('useNotificationContext must be used inside an NotificationContextProvider')

    return context
}
import { useState, useEffect } from 'react'
import { useNotificationContext } from '../../hook/useNotificationContext'
import '../../css/component/Notification.css'

const Notification = () => {
    const { message } = useNotificationContext();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
        else
            setIsVisible(false);

    }, [message]);

    return (
        <div id={'notification'} className={`${isVisible ? 'show' : ''}`}>
            {message}
        </div>
    )
}

export default Notification
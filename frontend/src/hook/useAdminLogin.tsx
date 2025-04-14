import {useState} from "react";
import {useNotification} from "./useNotification2.tsx";
import {ADMIN_LOGIN_URL} from "../util/Constant.tsx";
import {useNotificationContext} from "./useNotificationContext.tsx";
import {useAdminAuth} from "./useAdminAuth.tsx";

export const useAdminLogin = () => {
    const [error, setError] = useState<string>('')
    const { setTaiKhoanNV } = useAdminAuth();
    const { showNotification: showErrorNotification } = useNotification();
    const { showNotification: showGlobalNotification } = useNotificationContext();
    const login = async (email: string, password: string) => {
        try {
            const response = await fetch(`${ADMIN_LOGIN_URL}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email: email, password: password }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401) {
                    setError(data.error)
                }
                return
            }

            setTaiKhoanNV(data);
            localStorage.setItem('taiKhoanNV', JSON.stringify(data));
            showGlobalNotification(`Xin chào ${data.hoTen}`);

        } catch (error: any) {
            if (error.name === 'AbortError') {
                console.log('Fetch aborted');
                return;
            }
            showErrorNotification("Đã có lỗi khi đăng nhập", "error");
        }
    }

    return { login, error, setError }
};

import {TaiKhoanNhanVien} from "../util/types/PhanQuyenTypes.tsx";
import {createContext, useState, useEffect} from "react";

interface AuthContextType {
    taiKhoanNV: TaiKhoanNhanVien | null;
    setTaiKhoanNV: (taiKhoanNV: TaiKhoanNhanVien | null) => void;
    logout: () => void;
}

export const AdminAuthContext = createContext<AuthContextType | undefined>(undefined);

export const AdminAuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [taiKhoanNV, setTaiKhoanNV] = useState<TaiKhoanNhanVien | null>(null);

    useEffect(() => {
        const storedTaiKhoanNV = localStorage.getItem('taiKhoanNV');
        if (storedTaiKhoanNV) {
            const parsedTaiKhoanNV = JSON.parse(storedTaiKhoanNV);
            setTaiKhoanNV(parsedTaiKhoanNV);
        }
    }, []);

    const logout = () => {
        setTaiKhoanNV(null);
        localStorage.removeItem('taiKhoanNV');
    };

    return (
        <AdminAuthContext.Provider value={{ taiKhoanNV, setTaiKhoanNV, logout }}>
            {children}
        </AdminAuthContext.Provider>
    );
};


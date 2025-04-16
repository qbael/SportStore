import {createContext, useState} from "react";
import {HanhDong} from "../util/Enum.tsx";

interface AdminContextType {
    selectedChucNang: string;
    setSelectedChucNang: (chucNang: string) => void;
    dsHanhDong: (HanhDong | undefined)[] | undefined;
    setDsHanhDong: (hanhDong: (HanhDong | undefined)[] | undefined) => void;
}

export const AdminContext = createContext<AdminContextType>({
    selectedChucNang: '',
    setSelectedChucNang: () => {},
    dsHanhDong: [],
    setDsHanhDong: () => {},
});

export const AdminContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedChucNang, setSelectedChucNang] = useState<string>('');
    const [dsHanhDong, setDsHanhDong] = useState<(HanhDong | undefined)[] | undefined>([]);
    return (
        <AdminContext.Provider value={{selectedChucNang, setSelectedChucNang, dsHanhDong, setDsHanhDong }}>
            {children}
        </AdminContext.Provider>
    );
};

import {useState} from "react";
import {useSearchParams} from "react-router-dom";
import "../../css/ui/SortFilter.css"
import ascSortLogo from "../../assets/icon/ascending-sort.svg";
import descSortLogo from "../../assets/icon/descending-sort.svg";
import {useNotificationContext} from "../../hook/useNotificationContext.tsx";

export const SortFilter = () => {
    const [queryParams, setQueryParams] = useSearchParams();
    const [minPrice, setMinPrice] = useState<string>("");
    const [maxPrice, setMaxPrice] = useState<string>("");
    const {showNotification} = useNotificationContext();
    return (
        <div className={'filter-container d-flex justify-content-start'}>
            <div className={'filter-component'}>
                <h4>Sắp xếp theo giá</h4>
                <div className={'d-flex justify-content-start'}>
                    <div className={'filter-item'}
                         onClick={() => {
                             queryParams.delete('page');
                             queryParams.set('sort', 'giaBan');
                             queryParams.set('sortdir', 'ASC');
                             setQueryParams(queryParams, {replace: true})
                         }}
                    >
                        <img className={'icon-link'} src={ascSortLogo}/>
                        <span>Tăng dần</span>
                    </div>
                    <div className={'filter-item'}
                         onClick={() => {
                             queryParams.delete('page');
                             queryParams.set('sort', 'giaBan');
                             queryParams.set('sortdir', 'DESC');
                             setQueryParams(queryParams, {replace: true})
                         }}
                    >
                        <img className={'icon-link'} src={descSortLogo}/>
                        <span>Giảm dần</span>
                    </div>
                </div>
            </div>
            <div className={'filter-component'}>
                <h4>Khoảng giá</h4>
                <div className={'d-flex justify-content-start'}>
                    <input className={'price-input'}
                           placeholder={`Từ`}
                           value={minPrice ? minPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""}
                           onChange={(e) => {
                               const rawValue = e.target.value.replace(/\./g, '');
                               if (!isNaN(Number(rawValue))) {
                                   setMinPrice(rawValue);
                               }
                           }}
                    />
                    <input className={'price-input'}
                           placeholder={`Đến`}
                           value={maxPrice ? maxPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""}
                           onChange={(e) => {
                               const rawValue = e.target.value.replace(/\./g, '');
                               if (!isNaN(Number(rawValue))) {
                                   setMaxPrice(rawValue);
                               }
                           }}
                    />
                    <button className={'btn btn-primary'}
                            onClick={() => {
                                if (parseInt(maxPrice) < parseInt(minPrice)) {
                                    showNotification('Giá tối thiểu phải nhỏ hơn giá tối đa')
                                    setMinPrice("");
                                    setMaxPrice("");
                                    return
                                }
                                queryParams.delete('page');
                                queryParams.delete('sort');
                                queryParams.delete('sortdir');
                                queryParams.set('minprice', minPrice);
                                queryParams.set('maxprice', maxPrice);
                                setQueryParams(queryParams)
                                setMinPrice("");
                                setMaxPrice("");
                            }}
                    >Lọc
                    </button>
                </div>
            </div>
        </div>
    );
};
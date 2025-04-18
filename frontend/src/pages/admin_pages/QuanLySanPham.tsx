import {useEffect, useReducer} from "react";
import {BienTheType, dsFull, ProductType} from "../../util/types/ProductTypes.tsx";
import '../../css/admin/QuanLySanPham.css'
import {Button, Container, Form, Row, Table} from "react-bootstrap";
import {useAdminContext} from "../../hook/useAdminContext.tsx";
import {ADMIN_PRODUCT_PER_PAGE, PRODUCT_API_URL, PRODUCT_IMAGE_BASE_PATH,} from "../../util/Constant.tsx";
import {useSearchParams} from "react-router-dom";
import CustomPagination from "../../components/ui/CustomPagination.tsx";
import {HanhDong} from "../../util/Enum.tsx";
import {formatPrice} from "../../util/Helper.ts";
import {useNotification} from '../../hook/useNotification2.tsx';
import ModalThemSanPham from "../../components/modal_box/ModalThemSanPham.tsx";
import ModalSuaSanPham from "../../components/modal_box/ModalSuaSanPham.tsx";
import ModalChiTietSanPham from "../../components/modal_box/ModalChiTietSanPham.tsx";

const initialState = {
    dsSanPham: [] as ProductType[],
    currentPage: 1,
    totalPage: 0,
    isLastPage: false,
    isFirstPage: false,
    minPrice: "",
    maxPrice: "",
    keyword: "",
    searchType: "tenSanPham",
    dsFull: null as dsFull | null,
    selectedSanPham: null as ProductType | null,
    showAddModal: false,
    showUpdateModal: false,
    showDetailModal: false,
    dsBienThe: [] as BienTheType[],
};

type State = typeof initialState;

type Action =
    | { type: 'SET_DS_SANPHAM', payload: ProductType[] }
    | { type: 'SET_CURRENT_PAGE', payload: number }
    | { type: 'SET_TOTAL_PAGE', payload: number }
    | { type: 'SET_IS_LAST_PAGE', payload: boolean }
    | { type: 'SET_IS_FIRST_PAGE', payload: boolean }
    | { type: 'SET_MIN_PRICE', payload: string }
    | { type: 'SET_MAX_PRICE', payload: string }
    | { type: 'SET_KEYWORD', payload: string }
    | { type: 'SET_SEARCH_TYPE', payload: string }
    | { type: 'SET_DSFULL', payload: dsFull | null }
    | { type: 'SET_SELECTED_SANPHAM', payload: ProductType | null }
    | { type: 'SET_SHOW_ADD_MODAL', payload?: boolean }
    | { type: 'SET_SHOW_UPDATE_MODAL', payload?: boolean }
    | { type: 'SET_SHOW_DETAIL_MODAL', payload?: boolean }
    | { type: 'SET_DS_BIENTHE', payload: BienTheType[] };

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case 'SET_DS_SANPHAM': return { ...state, dsSanPham: action.payload };
        case 'SET_CURRENT_PAGE': return { ...state, currentPage: action.payload };
        case 'SET_TOTAL_PAGE': return { ...state, totalPage: action.payload };
        case 'SET_IS_LAST_PAGE': return { ...state, isLastPage: action.payload };
        case 'SET_IS_FIRST_PAGE': return { ...state, isFirstPage: action.payload };
        case 'SET_MIN_PRICE': return { ...state, minPrice: action.payload };
        case 'SET_MAX_PRICE': return { ...state, maxPrice: action.payload };
        case 'SET_KEYWORD': return { ...state, keyword: action.payload };
        case 'SET_SEARCH_TYPE': return { ...state, searchType: action.payload };
        case 'SET_SHOW_ADD_MODAL': return { ...state, showAddModal: action.payload ?? !state.showAddModal };
        case 'SET_SHOW_UPDATE_MODAL': return { ...state, showUpdateModal: action.payload ?? !state.showUpdateModal };
        case 'SET_SELECTED_SANPHAM': return { ...state, selectedSanPham: action.payload };
        case 'SET_DSFULL': return { ...state, dsFull: action.payload };
        case 'SET_SHOW_DETAIL_MODAL': return { ...state, showDetailModal: action.payload ?? !state.showDetailModal };
        case 'SET_DS_BIENTHE': return { ...state, dsBienThe: action.payload };
        default: return state;
    }
};

const QuanLySanPham = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const [searchParams, setSearchParams] = useSearchParams();
    const { showNotification } = useNotification();
    const { dsHanhDong } = useAdminContext();

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;
        searchParams.set("limit", ADMIN_PRODUCT_PER_PAGE.toString());

        const fetchData = async () => {
            try {
                const [resSanPham, resDs] = await Promise.all([
                    fetch(`${PRODUCT_API_URL}?${searchParams.toString()}`, { signal }),
                    fetch(`${PRODUCT_API_URL}/ds`, { signal }),
                ]);

                if (!resSanPham.ok || !resDs.ok) throw new Error("Lỗi khi gọi API");

                const sanPhamData = await resSanPham.json();
                const dsData = await resDs.json();

                dispatch({ type: 'SET_DS_SANPHAM', payload: sanPhamData.content || [] });
                dispatch({ type: 'SET_TOTAL_PAGE', payload: sanPhamData.totalPages || 0 });
                dispatch({ type: 'SET_CURRENT_PAGE', payload: sanPhamData.number || 0 });
                dispatch({ type: 'SET_IS_LAST_PAGE', payload: sanPhamData.last || false });
                dispatch({ type: 'SET_IS_FIRST_PAGE', payload: sanPhamData.first || false });
                dispatch({ type: 'SET_DSFULL', payload: dsData });
            } catch (error: any) {
                if (error.name !== "AbortError") {
                    console.error("Lỗi fetch:", error);
                    dispatch({ type: 'SET_DS_SANPHAM', payload: [] });
                }
            }
        };

        fetchData();
        return () => controller.abort();
    }, [searchParams.toString()]);

    const fetchBienTheBySanPham = async (sanPhamId: number) => {
        try {
            const res = await fetch(`${PRODUCT_API_URL}/${sanPhamId}`);
            if (!res.ok) throw new Error("Không lấy được biến thể");
            const data = await res.json();
            dispatch({ type: 'SET_DS_BIENTHE', payload: data.bienThe });
        } catch (e) {
            console.error(e);
        }
    };

    const hasPermission = (action: HanhDong) => {
        return dsHanhDong?.includes(action);
    }

    const handleSaveSanPham = async (formData: FormData) => {
        try {
            const res = await fetch(`${PRODUCT_API_URL}`, {
                method: "POST",
                body: formData,
            });
            if (!res.ok) throw new Error("Lỗi khi thêm sản phẩm");
            showNotification("Thêm sản phẩm thành công!", "success");
            setSearchParams({sort: "id", sortdir: "DESC"});
        } catch (e) {
            console.error(e);
            showNotification("Thêm sản phẩm thất bại", "error");
        }
    };

    const handleUpdateSanPham = async (formData: FormData) => {
        try {
            const res = await fetch(`${PRODUCT_API_URL}/${state.selectedSanPham?.id}`, {
                method: "PUT",
                body: formData,
            });
            if (!res.ok) throw new Error("Lỗi khi cập nhật sản phẩm");
            showNotification("Cập nhật sản phẩm thành công!", "success");
            location.reload();
        } catch (e) {
            console.error(e);
            showNotification("Cập nhật sản phẩm thất bại", "error");
        }
    };

    const handleDeleteSanPham = async (id: number) => {
        try {
            const res = await fetch(`${PRODUCT_API_URL}/${id}`, {
                method: "DELETE",
            });
            if (res.status === 406) {
                const data = await res.text();
                showNotification(data, "error");
                return;
            }
            if (res.status === 404) throw new Error("Khong tìm thấy sản phẩm");
            if (!res.ok) throw new Error("Lỗi khi cập nhật sản phẩm");
            showNotification("Xóa sản phẩm thành công!", "success");
            setSearchParams({});
        } catch (e) {
            console.error(e);
            showNotification("Xóa sản phẩm thất bại", "error");
        }
    };

    const handleXemChiTietSanPham = async (e: React.MouseEvent<HTMLTableRowElement>, item: ProductType) => {
        e.stopPropagation();
        if (hasPermission(HanhDong.XEM)){
            dispatch({ type: 'SET_SELECTED_SANPHAM', payload: item });
            await fetchBienTheBySanPham(item.id);
            dispatch({ type: 'SET_SHOW_DETAIL_MODAL', payload: true });
        }
    };

    return (
        <Container fluid className={"w-100 h-100 rounded-3"}
                   style={{background: "linear-gradient(to right, rgb(246, 247, 244), rgb(237, 243, 230), rgb(234, 245, 234), rgb(227, 245, 227))"}}
        >
            <Row className={"h-15 align-content-center"}>
                <Form className="d-flex flex-wrap gap-2">
                    <Form.Group controlId="selectSearchType">
                        <Form.Select
                            onChange={(e) => dispatch({ type: 'SET_SEARCH_TYPE', payload: e.target.value })}
                            defaultValue={state.searchType}
                        >
                            <option value="tenSanPham">Tên sản phẩm</option>
                            <option value="thuongHieu">Thương hiệu</option>
                            <option value="boMon">Bộ môn</option>
                            <option value="danhMuc">Phân loại</option>
                            <option value="trangThai">Trạng thái</option>
                        </Form.Select>
                    </Form.Group>
                    {state.searchType === "tenSanPham" && (
                        <Form.Group controlId="searchKeyword">
                            <Form.Control
                                type="text"
                                placeholder="Nhập từ khóa..."
                                onChange={(e) => dispatch({ type: 'SET_KEYWORD', payload: e.target.value })}
                                value={state.keyword}
                            />
                        </Form.Group>
                    )}

                    {state.searchType === "thuongHieu" && (
                        <Form.Group controlId="searchKeyword">
                            <Form.Select
                                onChange={(e) => dispatch({ type: 'SET_KEYWORD', payload: e.target.value })}
                                defaultValue={state.keyword}
                            >
                                {state.dsFull?.dsThuongHieu.map((item, index) => (
                                    <option key={index} value={item.id}>{item.tenThuongHieu}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    )}

                    {state.searchType === "boMon" && (
                        <Form.Group controlId="searchKeyword">
                            <Form.Select
                                onChange={(e) => dispatch({ type: 'SET_KEYWORD', payload: e.target.value })}
                                defaultValue={state.keyword}
                            >
                                {state.dsFull?.dsBoMon.map((item, index) => (
                                    <option key={index} value={item.id}>{item.tenBoMon}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    )}

                    {state.searchType === "danhMuc" && (
                        <Form.Group controlId="searchKeyword">
                            <Form.Select
                                onChange={(e) => dispatch({ type: 'SET_KEYWORD', payload: e.target.value })}
                                defaultValue={state.keyword}
                            >
                                {state.dsFull?.dsDanhMuc.map((item, index) => (
                                    <option key={index} value={item.id}>{item.loai}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    )}

                    {state.searchType === "trangThai" && (
                        <Form.Group controlId="searchKeyword">
                            <Form.Select
                                onChange={(e) => dispatch({ type: 'SET_KEYWORD', payload: e.target.value })}
                                defaultValue={state.keyword}
                            >
                                <option value={"true"}>Đang kinh doanh</option>
                                <option value={"false"}>Ngừng kinh doanh</option>
                            </Form.Select>
                        </Form.Group>
                    )}

                    <Form.Group controlId="minPrice" style={{width:'150px'}}>
                        <Form.Control
                            type="text"
                            placeholder="Giá từ"
                            value={state.minPrice ? state.minPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""}
                            onChange={(e) => {
                                const rawValue = e.target.value.replace(/\./g, '');
                                if (!isNaN(Number(rawValue))) {
                                    dispatch({ type: 'SET_MIN_PRICE', payload: rawValue });
                                }
                            }}
                        />
                    </Form.Group>

                    <Form.Group controlId="maxPrice" style={{width:'150px'}}>
                        <Form.Control
                            type="text"
                            placeholder="Đến"
                            value={state.maxPrice ? state.maxPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : ""}
                            onChange={(e) => {
                                const rawValue = e.target.value.replace(/\./g, '');
                                if (!isNaN(Number(rawValue))) {
                                    dispatch({ type: 'SET_MAX_PRICE', payload: rawValue });
                                }
                            }}
                        />
                    </Form.Group>

                    <Form.Group controlId="sortButtons" className="d-flex gap-2">
                        <Button className={"btn-primary"}
                                onClick={() => {
                                    const newParams = new URLSearchParams(searchParams.toString());
                                    newParams.delete('page');
                                    newParams.delete('sort');
                                    newParams.delete('sortdir');

                                    const min = parseInt(state.minPrice || "0");
                                    const max = parseInt(state.maxPrice || "0");

                                    if (state.minPrice && state.maxPrice && max < min) {
                                        showNotification('Giá tối thiểu phải nhỏ hơn giá tối đa', "error");
                                        return;
                                    }

                                    if (state.minPrice && state.maxPrice) {
                                        newParams.set('minprice', state.minPrice);
                                        newParams.set('maxprice', state.maxPrice);
                                    } else {
                                        newParams.delete('minprice');
                                        newParams.delete('maxprice');
                                    }

                                    if (state.keyword) {
                                        newParams.set("searchBy", state.searchType);
                                        newParams.set("search", state.keyword);
                                    } else {
                                        newParams.delete("searchBy");
                                        newParams.delete("search");
                                    }

                                    setSearchParams(newParams);
                                }}
                        >
                            Áp dụng
                        </Button>
                    </Form.Group>

                    <Form.Group controlId="sortButtons" className="d-flex gap-2">
                        <Button
                            variant="outline-primary"
                            onClick={() => {
                                setSearchParams(prev => {
                                    prev.delete('page');
                                    prev.set("sort", "giaBan");
                                    prev.set("sortdir", "ASC");
                                    return prev;
                                });
                            }}
                        >
                            Giá tăng
                        </Button>
                        <Button
                            variant="outline-primary"
                            onClick={() => {
                                setSearchParams(prev => {
                                    prev.delete('page')
                                    prev.set("sort", "giaBan");
                                    prev.set("sortdir", "DESC");
                                    return prev;
                                });
                            }}
                        >
                            Giá giảm
                        </Button>
                    </Form.Group>
                    {hasPermission(HanhDong.THEM) && (
                        <Form.Group controlId="sortButtons" className="d-flex gap-2">
                            <Button
                                variant="success"
                                onClick={() => dispatch({ type: 'SET_SHOW_ADD_MODAL', payload: true })}
                            >
                                + Thêm sản phẩm
                            </Button>
                        </Form.Group>
                    )}
                </Form>

            </Row>
            <Row className={"h-85"}>
                <Table striped bordered hover className={"text-center"}
                       style={{verticalAlign: 'middle'}}
                >
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Hình ảnh</th>
                        <th>Tên sản phẩm</th>
                        <th>Giá nhập</th>
                        <th>Giá bán</th>
                        <th>Thương hiệu</th>
                        <th>Phân loại</th>
                        <th>Bộ môn</th>
                        <th>Trạng thái</th>
                        {/*{hasPermission(HanhDong.XEM) && (*/}
                        {/*    <th></th>*/}
                        {/*)}*/}
                        {hasPermission(HanhDong.SUA) && (
                            <th></th>
                        )}
                        {hasPermission(HanhDong.XOA) && (
                            <th></th>
                        )}
                    </tr>
                    </thead>
                    <tbody>
                    {state.dsSanPham.map((item, index) => (
                        <tr key={index} onClick={(e) => handleXemChiTietSanPham(e, item)}>
                            <td>{item.id}</td>
                            <td>
                                <img src={`${PRODUCT_IMAGE_BASE_PATH}${item.hinhAnh}`}
                                     alt={item.tenSanPham} className={"img-fluid"}
                                     style={{width: '45px', height: '45px'}}
                                />
                            </td>
                            <td>{item.tenSanPham}</td>
                            <td>{formatPrice(item.giaNhap!)}</td>
                            <td>{formatPrice(item.giaBan!)}</td>
                            <td>{item.thuongHieu.tenThuongHieu}</td>
                            <td>{item.danhMuc.loai}</td>
                            <td>{item.boMon.tenBoMon}</td>
                            <td className={`fs-6 ${item.trangThai ? '': 'text-danger'}`} >{item.trangThai ? "Đang kinh doanh" : "Dừng kinh doanh"}</td>
                            {hasPermission(HanhDong.SUA) && (
                                <td>
                                    <Button className={"btn btn-warning"}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                dispatch({ type: 'SET_SELECTED_SANPHAM', payload: item });
                                                dispatch({ type: 'SET_SHOW_UPDATE_MODAL', payload: true });
                                            }}
                                    >
                                        Sửa
                                    </Button>
                                </td>
                            )}
                            {hasPermission(HanhDong.XOA) && (
                                <td>
                                    <Button className={"btn btn-danger"}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (confirm(`Bạn có chắc chắn muốn xóa sản phẩm ${item.tenSanPham}?`)) {
                                                    handleDeleteSanPham(item.id);
                                                }
                                            }}
                                    >
                                        Xóa
                                    </Button>
                                </td>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </Table>
                {state.totalPage > 1 && (
                    <CustomPagination
                        currentPage={state.currentPage}
                        totalPage={state.totalPage}
                        searchParams={searchParams}
                        setSearchParams={setSearchParams}
                        isFirstPage={state.isFirstPage}
                        isLastPage={state.isLastPage}
                    />
                )}
            </Row>
            <ModalThemSanPham
                show={state.showAddModal}
                handleClose={() => dispatch({ type: 'SET_SHOW_ADD_MODAL', payload: false })}
                handleSave={handleSaveSanPham}
                dsThuongHieu={state.dsFull?.dsThuongHieu}
                dsDanhMuc={state.dsFull?.dsDanhMuc}
                dsBoMon={state.dsFull?.dsBoMon}
            />
            <ModalSuaSanPham
                show={state.showUpdateModal && state.selectedSanPham !== null}
                handleClose={() => {
                    dispatch({ type: 'SET_SHOW_UPDATE_MODAL', payload: false });
                    dispatch({ type: 'SET_SELECTED_SANPHAM', payload: null });
                }}
                handleUpdate={handleUpdateSanPham}
                sanPham={state.selectedSanPham}
                dsDanhMuc={state.dsFull?.dsDanhMuc}
                dsThuongHieu={state.dsFull?.dsThuongHieu}
                dsBoMon={state.dsFull?.dsBoMon}
            />
            <ModalChiTietSanPham
                show={state.showDetailModal}
                handleClose={() => dispatch({ type: 'SET_SHOW_DETAIL_MODAL', payload: false })}
                sanPham={state.selectedSanPham}
                dsBienThe={state.dsBienThe}
                hasPermission={hasPermission}
            />
        </Container>
    );
}
export default QuanLySanPham;

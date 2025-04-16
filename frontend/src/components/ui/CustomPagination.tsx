import { Pagination } from "react-bootstrap";
import { URLSearchParamsInit } from "react-router-dom";

type CustomPaginationProps = {
    currentPage: number;
    totalPage: number;
    searchParams: URLSearchParamsInit;
    setSearchParams: (searchParams: URLSearchParamsInit) => void;
    isFirstPage: boolean;
    isLastPage: boolean;
};

const CustomPagination: React.FC<CustomPaginationProps> = ({currentPage, totalPage, searchParams, setSearchParams, isFirstPage, isLastPage}) => {
    const handleChangePage = (page: number) => {
        const updatedParams = new URLSearchParams(searchParams as any);
        updatedParams.set("page", page.toString());
        setSearchParams(updatedParams);
    };

    return (
        <Pagination className="w-100 d-flex justify-content-center">
            <Pagination.First
                onClick={() => handleChangePage(0)}
                disabled={isFirstPage}
            />
            <Pagination.Prev
                onClick={() => !isFirstPage && handleChangePage(currentPage - 1)}
                disabled={isFirstPage}
            />
            {Array.from({ length: totalPage }, (_, index) => (
                <Pagination.Item
                    key={index}
                    active={index === currentPage}
                    onClick={() => handleChangePage(index)}
                >
                    {index + 1}
                </Pagination.Item>
            ))}
            <Pagination.Next
                onClick={() => !isLastPage && handleChangePage(currentPage + 1)}
                disabled={isLastPage}
            />
            <Pagination.Last
                onClick={() => handleChangePage(totalPage - 1)}
                disabled={isLastPage}
            />
        </Pagination>
    );
};

export default CustomPagination;

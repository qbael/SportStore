import {Button, Col, Container, Form, Row} from "react-bootstrap";
import {useAdminAuth} from "../../hook/useAdminAuth.tsx";
import ChartThongKe from "../../components/chart/ChartThongKe.tsx";
import {useEffect, useState} from "react";
import {BASE_URL} from "../../util/Constant.tsx";

const QuanLyThongKe = () => {
    const {taiKhoanNV} = useAdminAuth();
    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [dataChart, setDataChart] = useState<any>(null);

    const fetchData = async () => {
        let url = `${BASE_URL}/thongke/doanhthu`;

        if (fromDate && toDate) {
            url += `?from=${fromDate}&to=${toDate}`;
        }

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Fetch failed");
            }

            const data = await response.json();

            const labels = data.map((item: any) => item.ngay);
            const doanhThu = data.map((item: any) => item.doanhThu);
            const loiNhuan = data.map((item: any) => item.loiNhuan);

            setDataChart({
                labels,
                datasets: [
                    {
                        label: "Doanh thu",
                        data: doanhThu,
                        borderColor: "green",
                        backgroundColor: "rgba(0,255,0,0.2)",
                        tension: 0.4
                    },
                    {
                        label: "Lợi nhuận",
                        data: loiNhuan,
                        borderColor: "orange",
                        backgroundColor: "rgba(255,165,0,0.2)",
                        tension: 0.4
                    }
                ]
            });
        } catch (error) {
            console.error("Lỗi khi fetch dữ liệu:", error);
            throw new Error("Không thể lấy dữ liệu thống kê.");
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <Container fluid className={"w-100 h-100 rounded-3"}
                   style={{background: "linear-gradient(to right, rgb(246, 247, 244), rgb(237, 243, 230), rgb(234, 245, 234), rgb(227, 245, 227))"}}
        >
            <Row className={"h-15"}>
                <Row>
                    <Col>
                        <Button className={"mx-2"} variant={'success'}>Thông kê sản phẩm</Button>
                        <Button className={"mx-2"} variant={'danger'}>Thống kê khách hàng</Button>
                        <Button className={"mx-2"} variant={'warning'}>Thống kê nhập hàng</Button>
                    </Col>
                </Row>
                <Row>
                    <Col md={4}>
                        <Form.Label>Từ ngày</Form.Label>
                        <Form.Control type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
                    </Col>
                    <Col md={4}>
                        <Form.Label>Đến ngày</Form.Label>
                        <Form.Control type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} />
                    </Col>
                    <Col md={4} className={"d-flex align-items-center"}>
                        <Button onClick={fetchData} variant="primary">Thống kê</Button>
                    </Col>
                </Row>
            </Row>
            <Row>
                <Col>
                    <ChartThongKe
                        dataChart={dataChart}
                    />
                </Col>
            </Row>
        </Container>
    )
}
export default QuanLyThongKe;
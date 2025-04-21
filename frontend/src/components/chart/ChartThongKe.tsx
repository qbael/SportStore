import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend
} from "chart.js";
import { Col, Container, Row } from "react-bootstrap";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

interface ChartThongKeProps {
    dataChart: any;
}

const ChartThongKe = ( { dataChart }: ChartThongKeProps ) => {

    return (
        <Container className="w-100 h-100">
            {dataChart && (<>
                    <Row className={"mt-2"}>
                        <Col>
                            <div className="d-flex justify-content-center">
                                <h5 className={"w-25"}>Tổng doanh thu: {dataChart.tongDoanhThu.toLocaleString()}đ</h5>
                                <h5 className={"w-25"}>Tổng lợi nhuận: {dataChart.tongLoiNhuan.toLocaleString()}đ</h5>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Line data={dataChart.data} />
                        </Col>
                    </Row>
                </>
            )}
        </Container>
    );
};

export default ChartThongKe;

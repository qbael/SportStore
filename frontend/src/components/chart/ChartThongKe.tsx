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
            <Row className="mt-4">
                <Col>
                    {dataChart ? <Line data={dataChart} /> : <p>Vui lòng chọn ngày và nhấn "Thống kê".</p>}
                </Col>
            </Row>
        </Container>
    );
};

export default ChartThongKe;

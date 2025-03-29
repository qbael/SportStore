import "../../css/Footer.css"
import fb from '../../assets/icon/facebook.svg'
import ig from '../../assets/icon/instagram.svg'

const Footer = () => {
    return (
        <footer>
            <div>
                {/*<img src={}></img>*/}
            </div>
            <div>
                <p>GIỚI THIỆU VỀ CÔNG TY</p>
                <p>CÂU HỎI THƯỜNG GẶP</p>
                <p>CHÍNH SÁCH BẢO MẬT</p>
                <p>QUY CHẾ HOẠT ĐỘNG</p>
            </div>
            <div>
                <p>KIỂM TRA HÓA ĐƠN ĐIỆN TỬ</p>
                <p>TRA CỨU THÔNG TIN BẢO HÀNH</p>
                <p>TIN TUYỂN DỤNG</p>
                <p>TIN KHUYẾN MÃI</p>
                <p>HƯỚNG DẪN ONLINE</p>
            </div>
            <div>
                <p>HỆ THỐNG CỬA HÀNG</p>
                <p>HỆ THỐNG BẢO HÀNH</p>
                <p>KIỂM TRA HÀNG APPLE CHÍNH HÃNG</p>
                <p>GIỚI THIỆU ĐỔI MÁY</p>
                <p>CHÍNH SÁCH ĐỔI TRẢ</p>
            </div>
            <div>
                <h3>SOCIAL MEDIA</h3>
                <div style={{display: 'flex', justifyContent: 'space-evenly'}}>
                    <img
                        src={fb}
                        style={{
                            width: '40px',
                            height: '40px',
                        }}
                    />
                    <img
                        src={ig}
                        style={{
                            width: '40px',
                            height: '40px',
                        }}
                    />
                </div>
            </div>
        </footer>
    )
}

export default Footer
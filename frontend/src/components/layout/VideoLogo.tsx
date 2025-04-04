import video from '../../assets/video/videologo.mp4';
import '../../css/Video.css';
import {Link} from "react-router-dom";

export default function VideoLogo() {
  return (
    <div className="container-fluid p-0">
      <div className="video-container position-relative overflow-hidden" style={{ height: '70vh' }}>
        <video
          autoPlay
          muted
          loop
          className="w-100 h-100 position-absolute top-50 start-50 translate-middle"
        >
          <source src={video} type="video/mp4" />
          Trình duyệt của bạn không hỗ trợ video.
        </video>
        <div className="overlay-text position-absolute top-50 start-50 translate-middle text-center text-white">
          <h1 className="display-4 fw-bold">Adidas Việt Nam</h1>
          <p className="lead">Khám phá đỉnh cao thể thao</p>
          <Link to={'/product'} className="btn btn-outline-light mt-3">Mua ngay</Link>
        </div>
      </div>
    </div>
  );
}
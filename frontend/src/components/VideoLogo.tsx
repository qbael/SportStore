import React from 'react';
import video from '../assets/video/videologo.mp4';

export default function VideoLogo() {
  return (
    <div className="container-fluid p-0">
      <div className="video-container position-relative overflow-hidden" style={{ height: '70vh' }}>
        <video autoPlay muted loop className="w-100 h-100 position-absolute top-50 start-50 translate-middle">
          <source src={video} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <div className="content-below text-center py-4">
        sss
      </div>
    </div>
  );
}
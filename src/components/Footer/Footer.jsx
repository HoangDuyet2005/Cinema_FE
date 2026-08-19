import React, { Component } from "react";
import "./Footer.scss";

export default class Footer extends Component {
  render() {
    return (
      <footer className="cgv-footer">
        <div className="cgv-footer__content">
          <div className="row footer-top">
            <div className="col-md-3 col-sm-6 col-xs-12 footer-col">
              <h4>WORLD CINEMA Việt Nam</h4>
              <ul>
                <li><a href="/#">Giới Thiệu</a></li>
                <li><a href="/#">Tiện Ích Online</a></li>
                <li><a href="/#">Thẻ Quà Tặng</a></li>
                <li><a href="/#">Tuyển Dụng</a></li>
                <li><a href="/#">Liên Hệ Quảng Cáo</a></li>
                <li><a href="/#">Dành cho đối tác</a></li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-6 col-xs-12 footer-col">
              <h4>Điều khoản sử dụng</h4>
              <ul>
                <li><a href="/#">Điều Khoản Chung</a></li>
                <li><a href="/#">Điều Khoản Giao Dịch</a></li>
                <li><a href="/#">Chính Sách Thanh Toán</a></li>
                <li><a href="/#">Chính Sách Bảo Mật</a></li>
                <li><a href="/#">Câu Hỏi Thường Gặp</a></li>
              </ul>
            </div>
            <div className="col-md-3 col-sm-6 col-xs-12 footer-col">
              <h4>Kết nối với chúng tôi</h4>
              <div className="social-icons">
                <a href="https://www.facebook.com/th.duyt.15" target="_blank" rel="noopener noreferrer">
                  <img src="https://img.icons8.com/color/48/000000/facebook-new.png" alt="Facebook" className="icon" />
                </a>
                <a href="/#">
                  <img src="https://img.icons8.com/color/48/000000/youtube-play.png" alt="Youtube" className="icon" />
                </a>
                <a href="/#">
                  <img src="https://img.icons8.com/color/48/000000/instagram-new--v1.png" alt="Instagram" className="icon" />
                </a>
                <a href="/#">
                  <img src="https://stc-zaloprofile.zdn.vn/pc/v1/images/zalo_sharelogo.png" alt="Zalo" className="icon" />
                </a>
              </div>
              
            </div>
            <div className="col-md-3 col-sm-6 col-xs-12 footer-col">
              <h4>Chăm sóc khách hàng</h4>
              <p>Hotline: 1900 6017</p>
              <p>Giờ làm việc: 8:00 - 22:00 (Tất cả các<br/>ngày bao gồm cả Lễ Tết)</p>
              <p>Email hỗ trợ: theduyethoang@gmail.com</p>
            </div>
          </div>
          
          <div className="footer-bottom">
            <div className="footer-logo">
              <img src="/img/world-cinema-logo.png" alt="WORLD CINEMA" />
            </div>
            <div className="footer-info">
              <h5>CÔNG TY TNHH WORLD CINEMA VIỆT NAM</h5>
              <p>Giấy Chứng nhận đăng ký doanh nghiệp: 0303675393 đăng ký lần đầu ngày 31/7/2008, được cấp bởi Sở Kế hoạch và Đầu tư Thành phố Hà Nội</p>
              <p>Địa chỉ: Tầng 4, Mê Linh Plaza Hà Đông, Đ. Tô Hiệu, P, Hà Đông, Hà Nội</p>
              <p>Đường dây nóng (Hotline): 1900 6017</p>
              <p>COPYRIGHT 2026 WORLD CINEMA VIETNAM CO., LTD. ALL RIGHTS RESERVED</p>
            </div>
          </div>
        </div>
      </footer>
    );
  }
}



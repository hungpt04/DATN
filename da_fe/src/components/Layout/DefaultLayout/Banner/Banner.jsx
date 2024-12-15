import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import banner1 from '../../../Assets/banner1.webp';
import banner2 from '../../../Assets/banner2.webp';
import banner3 from '../../../Assets/banner3.webp';
import banner4 from '../../../Assets/banner4.webp';

const Banner = () => {
    const settings = {
        infinite: true, // Vòng lặp vô hạn
        speed: 500, // Tốc độ chuyển cảnh (500ms)
        slidesToShow: 1, // Số lượng slide hiển thị cùng lúc
        slidesToScroll: 1, // Số lượng slide sẽ cuộn khi chuyển
        autoplay: true, // Tự động chạy
        autoplaySpeed: 2000, // Tốc độ tự động chuyển (2 giây)
    };

    return (
        <div
            style={{
                width: '100%', // Chiều rộng đúng bằng phần tử cha
                height: '100vh', // Chiều cao toàn màn hình
                overflow: 'hidden', // Ẩn phần thừa
                margin: 0, // Loại bỏ margin nếu có
                padding: 0, // Loại bỏ padding nếu có
            }}
        >
            <Slider {...settings}>
                <div>
                    <img
                        src={banner1}
                        alt="Banner 1"
                        style={{
                            width: '100%', // Chiều rộng toàn bộ container
                            height: '100%', // Chiều cao đầy đủ
                            objectFit: 'cover', // Cắt ảnh vừa khít
                        }}
                    />
                </div>
                <div>
                    <img
                        src={banner2}
                        alt="Banner 2"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                </div>
                <div>
                    <img
                        src={banner3}
                        alt="Banner 3"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                </div>
                <div>
                    <img
                        src={banner4}
                        alt="Banner 4"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />
                </div>
            </Slider>
        </div>

    );
};

export default Banner;

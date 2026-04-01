import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

export default function PromoSlider({ categories }) {
    return (
        <div className="sliderCard">
            <Swiper
                className="promoSlider"
                modules={[Pagination, Autoplay]}
                pagination={{ clickable: true }}
                autoplay={{ delay: 3500, disableOnInteraction: false }}
                loop
                slidesPerView={1}
                spaceBetween={12}
            >
                {categories.map((category) => (
                    <SwiperSlide key={category.title}>
                        <Link className="promoSlide" to={category.href}>
                            <img
                                className="promoSlide__img"
                                src={category.img}
                                alt={category.title}
                                loading="lazy"
                            />

                            <div className="promoSlide__overlay" />

                            <div className="promoSlide__content">
                                <div className="promoSlide__badge">ТОП</div>

                                <div className="promoSlide__txt">
                                    <div className="promoSlide__h">
                                        {category.title}
                                    </div>
                                    <div className="promoSlide__p">
                                        {category.subtitle}
                                    </div>
                                </div>

                                <div className="promoSlide__cta">
                                    Дивитись →
                                </div>
                            </div>
                        </Link>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
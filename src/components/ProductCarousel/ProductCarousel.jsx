import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import ProductCard from "../ProductCard/ProductCard";

import "swiper/css";
import "swiper/css/navigation";

export default function ProductCarousel({
    title,
    items,
    loading,
    error,
    emptyText,
}) {
    return (
        <section className="hp">
            <div className="container">
                {title && (
                    <div className="hp__head">
                        <h2 className="hp__title">{title}</h2>
                    </div>
                )}

                {loading && <div className="hp__skeleton">Завантаження…</div>}

                {!loading && error && <div className="hp__skeleton">{error}</div>}

                {!loading && !error && items.length === 0 && (
                    <div className="hp__skeleton">{emptyText}</div>
                )}

                {!loading && !error && items.length > 0 && (
                    <div className="hp__clip">
                        <Swiper
                            className="hp__slider"
                            modules={[Navigation]}
                            navigation
                            spaceBetween={16}
                            slidesPerView={1.2}
                            breakpoints={{
                                480: { slidesPerView: 2.1, spaceBetween: 8 },
                                768: { slidesPerView: 3.1, spaceBetween: 10 },
                                1200: { slidesPerView: 4.5, spaceBetween: 10 },
                            }}
                        >
                            {items.map((p) => (
                                <SwiperSlide key={p.id}>
                                    <Link to={`/product/${p.id}`} className="pCard pCard--expand">
                                        <ProductCard p={p} />
                                    </Link>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                )}
            </div>
        </section>
    );
}
import { Link } from "react-router-dom";
import PromoSlider from "../../components/PromoSlider/PromoSlider";
import { PROMO_CATEGORIES } from "../../constants/promoCategories";
import "swiper/css";
import "swiper/css/pagination";

const HERO_META = [
    { value: "100%", text: "ручна робота" },
    { value: "3–5", text: "днів на відправку" },
    { value: "Широкий", text: "асортимент товарів" },
];

export default function Promo() {
    return (
        <section className="promo">
            <div className="container">
                <div className="promo__grid">
                    <div className="heroCard">
                        <h1 className="heroCard__title">Унікальні товари ручної роботи</h1>

                        <p className="heroCard__text">
                            Не знаєш, з чого почати?
                            <br />
                            Переглянь найпопулярніші категорії або скористайся фільтрами в каталозі.
                        </p>

                        <p className="heroCard__text">
                            Широкий вибір шапок, светрів, іграшок та аксесуарів від майстрів з усієї України.
                        </p>

                        <div className="heroCard__meta">
                            {HERO_META.map((item) => (
                                <div className="metaItem" key={item.text}>
                                    <div className="metaItem__num">{item.value}</div>
                                    <div className="metaItem__txt">{item.text}</div>
                                </div>
                            ))}
                        </div>

                        <div className="heroCard__actions">
                            <Link to="/catalog" className="uiPrimaryBtn">
                                <i className="icon-th-large-1" /> Каталог товарів
                            </Link>
                        </div>
                    </div>
                    <PromoSlider categories={PROMO_CATEGORIES} />
                </div>
            </div>
        </section>
    );
}
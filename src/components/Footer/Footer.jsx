export default function Footer() {
    return (
        <footer className="footer">
            <div className="container footer__container">
                <div className="footer__top">
                    <div className="footer__brand">
                        <h3 className="footer__logo">Stitch</h3>
                        <p className="footer__text">
                            Унікальні товари ручної роботи від майстрів з усієї України.
                        </p>
                    </div>

                    <nav className="footer__nav">
                        <a href="/catalog" className="footer__link">Каталог</a>
                        <a href="/about" className="footer__link">Про нас</a>
                        <a href="/payment-delivery" className="footer__link">Оплата і доставка</a>
                        <a href="/returns" className="footer__link">Обмін та повернення</a>
                    </nav>

                    <div className="footer__contacts">
                        <a href="mailto:hello@stitch.ua" className="footer__link">
                            hello@stitch.ua
                        </a>
                        <a href="tel:+380000000000" className="footer__link">
                            +38 (000) 000 00 00
                        </a>
                    </div>
                </div>

                <div className="footer__bottom">
                    <p className="footer__copy">© 2026 Stitch. Усі права захищені.</p>

                    <div className="footer__bottom-links">
                        <a href="/privacy" className="footer__bottom-link">Політика конфіденційності</a>
                        <a href="/terms" className="footer__bottom-link">Умови користування</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
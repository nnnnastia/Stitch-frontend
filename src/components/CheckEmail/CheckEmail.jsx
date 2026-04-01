export default function CheckEmail() {
    return (
        <div className="checkEmail">
            <div className="checkEmail__card">
                <div className="checkEmail__icon">📩</div>

                <h1 className="checkEmail__title">Перевірте пошту</h1>

                <p className="checkEmail__text">
                    Ми надіслали лист для підтвердження електронної адреси.
                </p>

                <p className="checkEmail__hint">
                    Без підтвердження доступ до кабінету обмежений.
                </p>

                <button
                    className="checkEmail__btn"
                    onClick={() => window.location.href = "/login"}
                >
                    Повернутися до входу
                </button>
            </div>
        </div>
    );
}
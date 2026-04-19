import { useState } from "react";
import "./FAQSection.scss";

const FAQ_ITEMS = [
    {
        id: 1,
        question: "Які способи доставки доступні?",
        answer:
            "Наразі ми пропонуємо доставку лише Новою поштою. Інтеграція доставки Укрпоштою та Meest планується у майбутньому. Конкретні способи доставки залежать від продавця і вказуються в деталях товару.",
    },
    {
        id: 2,
        question: "Скільки часу триває доставка?",
        answer:
            "Термін доставки залежить від обраної служби та регіону. У середньому доставка по Україні займає від 1 до 5 робочих днів.",
    },
    {
        id: 3,
        question: "Які способи оплати ви приймаєте?",
        answer:
            "Оплата можлива онлайн під час оформлення замовлення або післяплатою, якщо така опція доступна у продавця.",
    },
    {
        id: 4,
        question: "Чи можна відстежити замовлення?",
        answer:
            "Так, після відправлення замовлення ви отримаєте номер ТТН або іншу інформацію для відстеження посилки.",
    },
    {
        id: 5,
        question: "Які умови повернення товару?",
        answer:
            "Умови повернення залежать від типу товару та продавця. Рекомендуємо ознайомитися з описом товару та умовами магазину перед оформленням замовлення.",
    },
    {
        id: 6,
        question: "Чи здійснюєте ви міжнародну доставку?",
        answer:
            "Деякі продавці можуть здійснювати міжнародну доставку, але це не підтримується умовами сайту. Краще уточнювати у продавця.",
    },
    {
        id: 7,
        question: "Як змінити або скасувати замовлення?",
        answer:
            "Щоб змінити або скасувати замовлення, зв’яжіться з продавцем або службою підтримки якомога швидше після оформлення.",
    },
    {
        id: 8,
        question: "Як зв’язатися зі службою підтримки?",
        answer:
            "Ви можете звернутися до служби підтримки через форму зворотного зв’язку, електронну пошту або контакти, зазначені на сайті.",
    },
];

export default function FAQSection() {
    const [openId, setOpenId] = useState(null);

    const toggleItem = (id) => {
        setOpenId((prev) => (prev === id ? null : id));
    };

    return (
        <section className="faq">
            <div className="container">
                <div className="faq__head">
                    <h2 className="faq__title">Поширені питання</h2>
                    <span className="faq__line"></span>
                </div>

                <div className="faq__list">
                    {FAQ_ITEMS.map((item) => {
                        const isOpen = openId === item.id;

                        return (
                            <div
                                key={item.id}
                                className={`faq__item ${isOpen ? "is-open" : ""}`}
                            >
                                <button
                                    type="button"
                                    className="faq__question"
                                    onClick={() => toggleItem(item.id)}
                                    aria-expanded={isOpen}
                                >
                                    <span>{item.question}</span>
                                    <span className="faq__icon">{isOpen ? "−" : "+"}</span>
                                </button>

                                <div className="faq__answer-wrap">
                                    <div className="faq__answer">
                                        {item.answer}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
import { useEffect, useState, useRef } from "react";

export default function LanguageDropdown() {
    const [open, setOpen] = useState(false);
    const [lang, setLang] = useState("uk");

    const ref = useRef(null);

    const currentLabel = lang === "uk" ? "Укр" : "Eng";
    const otherLang = lang === "uk" ? "en" : "uk";
    const otherLabel = otherLang === "uk" ? "Укр" : "Eng";

    useEffect(() => {
        const onDocClick = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setOpen(false);
            }
        };

        const onKey = (e) => {
            if (e.key === "Escape") setOpen(false);
        };

        document.addEventListener("mousedown", onDocClick);
        document.addEventListener("keydown", onKey);
        return () => {
            document.removeEventListener("mousedown", onDocClick);
            document.removeEventListener("keydown", onKey);
        };
    }, []);

    const toggle = () => setOpen((v) => !v);

    const select = (newLang) => {
        setLang(newLang);
        setOpen(false);
    };

    return (
        <div className="lang" ref={ref}>
            <button
                type="button"
                className="lang__btn"
                onClick={toggle}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-label="Language"
            >
                <span className="lang__label">{currentLabel}</span>

                {open ? (
                    <i className="icon-angle-up lang__chev" />
                ) : (
                    <i className="icon-angle-down lang__chev" />
                )}
            </button>

            {open && (
                <div className="lang__menu" role="menu">
                    <button
                        type="button"
                        className="lang__item"
                        role="menuitem"
                        onClick={() => select(otherLang)}
                    >
                        {otherLabel}
                    </button>
                </div>
            )}
        </div>
    );
}

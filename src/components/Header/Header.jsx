import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import LanguageDropdown from "../LanguageDropdown/LanguageDropdown";
import ProfileButton from "../ProfileButton/ProfileButton";
import logo from "../../logo/logo4.png";
import {
    MAIN_NAV,
    CATALOG_LINKS,
    INFO_LINKS,
} from "../../constants/navigation";

export default function Header() {
    const [menuOpen, setMenuOpen] = useState(false);
    const cartCount = 2;

    const openMenu = () => setMenuOpen(true);
    const closeMenu = () => setMenuOpen(false);

    useEffect(() => {
        document.body.style.overflow = menuOpen ? "hidden" : "";

        return () => {
            document.body.style.overflow = "";
        };
    }, [menuOpen]);

    useEffect(() => {
        if (!menuOpen) return;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                closeMenu();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [menuOpen]);

    return (
        <header className="header">
            <div className="container">
                <div className="header__bar">
                    <div className="header__left">
                        <button
                            className="uiIconBtn header__burger"
                            type="button"
                            onClick={openMenu}
                            aria-label="Open menu"
                        >
                            <i className="icon-menu" />
                        </button>

                        <div className="header__search">
                            <button
                                className="header__searchBtn uiIconBtn"
                                type="button"
                                aria-label="Search"
                            >
                                <i className="icon-search" />
                            </button>

                            <div className="header__searchField">
                                <i className="icon-search header__searchIcon" />
                                <input
                                    className="header__searchInput"
                                    placeholder="Пошук товарів…"
                                    type="text"
                                />
                            </div>
                        </div>
                    </div>

                    <Link to="/" aria-label="Home">
                        <img className="header__logo" src={logo} alt="Stitch" />
                    </Link>

                    <div className="header__right">
                        <LanguageDropdown />

                        <NavLink to="/favorites" className="uiIconBtn" aria-label="Favorites">
                            <i className="icon-heart-1" />
                        </NavLink>

                        <NavLink to="/cart" className="uiIconBtn uiIconBtn--cart" aria-label="Cart">
                            <i className="icon-basket" />
                            {cartCount > 0 && <span className="uiBadge">{cartCount}</span>}
                        </NavLink>

                        <ProfileButton />
                    </div>
                </div>

                <nav className="header__nav" aria-label="Primary navigation">
                    {MAIN_NAV.map((item) => (
                        <NavLink key={item.to} to={item.to} className="header__navLink">
                            {item.label}
                        </NavLink>
                    ))}
                </nav>
            </div>

            <div
                className={`uiOverlay ${menuOpen ? "uiOverlay--active" : ""}`}
                onClick={closeMenu}
                aria-hidden="true"
            />

            <aside
                className={`uiDrawer ${menuOpen ? "uiDrawer--active" : ""}`}
                aria-label="Menu"
            >
                <div className="uiDrawer__top">
                    <div className="uiDrawer__title">
                        <span className="uiDot" />
                        Меню
                    </div>

                    <button
                        className="uiIconBtn"
                        type="button"
                        aria-label="Close menu"
                        onClick={closeMenu}
                    >
                        <i className="icon-left-open" />
                    </button>
                </div>

                <div className="uiDrawer__content">
                    <div className="uiSection">
                        <div className="uiSection__title">Каталог</div>
                        <div className="uiGrid2">
                            {CATALOG_LINKS.map((item) => (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    className="uiChip"
                                    onClick={closeMenu}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="uiSection">
                        <div className="uiSection__title">Інформація</div>
                        <div className="uiStack">
                            {INFO_LINKS.map((item) => (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    className="uiLinkRow"
                                    onClick={closeMenu}
                                >
                                    {item.label}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="uiSection">
                        <div className="uiSection__title">Мова</div>
                        <div className="uiRow">
                            <button type="button" className="uiSegBtn uiSegBtn--active">
                                УКР
                            </button>
                            <button type="button" className="uiSegBtn">
                                ENG
                            </button>
                        </div>
                    </div>

                    <div className="uiSection">
                        <div className="uiSection__title">Соцмережі</div>
                        <div className="uiRow">
                            <a
                                className="uiIconBtn"
                                href="https://www.instagram.com/"
                                aria-label="Instagram"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <i className="icon-instagram" />
                            </a>

                            <a
                                className="uiIconBtn"
                                href="https://web.telegram.org/k/"
                                aria-label="Telegram"
                                target="_blank"
                                rel="noreferrer"
                            >
                                <i className="icon-telegram" />
                            </a>
                        </div>
                    </div>
                </div>
            </aside>
        </header>
    );
}
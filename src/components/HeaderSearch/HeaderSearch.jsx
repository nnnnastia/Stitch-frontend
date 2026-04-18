import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Camera } from "lucide-react";
import { searchByPhoto } from "../../services/search.service";
import { productsService } from "../../services/products.service";

export default function HeaderSearch() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [prediction, setPrediction] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const fileInputRef = useRef(null);
    const wrapperRef = useRef(null);

    const handleCameraClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setIsLoading(true);
            setPrediction(null);

            const data = await searchByPhoto(file);

            setPrediction(data.prediction || null);
            setResults(data.products || []);
            setIsOpen(true);
        } catch (error) {
            console.error("Photo search error:", error);
            setResults([]);
        } finally {
            setIsLoading(false);
            e.target.value = "";
        }
    };

    useEffect(() => {
        const timeout = setTimeout(async () => {
            const trimmed = query.trim();

            if (!trimmed) {
                setResults([]);
                setPrediction(null);
                return;
            }

            try {
                setIsLoading(true);
                const data = await productsService.getAll({
                    search: trimmed,
                    limit: 5,
                    page: 1,
                });

                setPrediction(null);
                setResults(data.products || []);
                setIsOpen(true);
            } catch (error) {
                console.error("Text search error:", error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 350);

        return () => clearTimeout(timeout);
    }, [query]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="headerSearch" ref={wrapperRef}>
            <button
                className="header__searchBtn uiIconBtn"
                type="button"
                aria-label="Search"
            >
                <i className="icon-search header__searchIcon" />
            </button>

            <div className="header__searchField">
                <i className="icon-search headerSearch__icon" />

                <input
                    className="header__searchInput"
                    placeholder="Пошук товарів…"
                    type="text"
                    value={query}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => {
                        if (results.length > 0) setIsOpen(true);
                    }}
                />

                <button
                    type="button"
                    className="headerSearch__cameraBtn"
                    onClick={handleCameraClick}
                    aria-label="Пошук по фото"
                >
                    <Camera size={18} />
                </button>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                />
            </div>

            {isOpen && (
                <div className="headerSearch__dropdown">
                    {isLoading && <p className="headerSearch__state">Пошук...</p>}

                    {!isLoading && prediction && (
                        <div className="headerSearch__prediction">
                            Схоже, це: <strong>{prediction.categoryUa}</strong>
                            {" "}
                            ({Math.round((prediction.confidence || 0) * 100)}%)
                        </div>
                    )}

                    {!isLoading && results.length === 0 && query.trim() && (
                        <p className="headerSearch__state">Нічого не знайдено</p>
                    )}

                    {!isLoading && results.length > 0 && (
                        <div className="headerSearch__list">
                            {results.map((product) => (
                                <Link
                                    key={product._id}
                                    to={`/products/${product._id}`}
                                    className="headerSearch__item"
                                    onClick={() => setIsOpen(false)}
                                >
                                    <img
                                        src={product.coverImage}
                                        alt={product.title}
                                        className="headerSearch__image"
                                    />

                                    <div className="headerSearch__meta">
                                        <div className="headerSearch__title">
                                            {product.title}
                                        </div>
                                        <div className="headerSearch__price">
                                            {product.price} {product.currency || "грн"}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
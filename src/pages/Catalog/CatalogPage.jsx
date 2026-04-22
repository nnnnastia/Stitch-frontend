import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./CatalogPage.scss";
import ProductCard from "../../components/ProductCard/ProductCard";
import { productsService } from "../../services/products.service";
import { categoriesService } from "../../services/categories.service";

export default function CatalogPage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loadingProducts, setLoadingProducts] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [selectedParentCategory, setSelectedParentCategory] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sort, setSort] = useState("");
    const [page, setPage] = useState(1);

    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        async function loadCategories() {
            try {
                setLoadingCategories(true);

                const data = await categoriesService.getAll();

                const rawCategories = Array.isArray(data)
                    ? data
                    : data.categories || data.items || data.data || [];

                const normalizedCategories = rawCategories.map((category) => ({
                    ...category,
                    id: category.id || category._id,
                    parent: category.parent?._id || category.parent || null,
                }));

                setCategories(normalizedCategories);
            } catch (err) {
                console.error("CATEGORIES ERROR:", err);
            } finally {
                setLoadingCategories(false);
            }
        }

        loadCategories();
    }, []);

    const parentCategories = categories
        .filter((category) => !category.parent)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

    const subcategories = categories
        .filter((category) => category.parent === selectedParentCategory)
        .sort((a, b) => (a.order || 0) - (b.order || 0));

    useEffect(() => {
        async function loadProducts() {
            try {
                setLoadingProducts(true);
                setError("");

                const params = {
                    page,
                    limit: 12,
                };

                if (search.trim()) params.search = search.trim();
                if (selectedSubcategory) {
                    params.category = selectedSubcategory;
                } else if (selectedParentCategory) {
                    params.category = selectedParentCategory;
                }
                if (minPrice !== "") params.minPrice = minPrice;
                if (maxPrice !== "") params.maxPrice = maxPrice;
                if (sort) params.sort = sort;

                const data = await productsService.getAll(params);

                const rawProducts = Array.isArray(data)
                    ? data
                    : data.products || data.items || data.data || [];

                setProducts(rawProducts);
                setTotalPages(data.totalPages || 1);
            } catch (err) {
                console.error("PRODUCTS ERROR:", err);
                setError("Не вдалося завантажити товари");
                setProducts([]);
                setTotalPages(1);
            } finally {
                setLoadingProducts(false);
            }
        }

        loadProducts();
    }, [search, selectedParentCategory, selectedSubcategory, minPrice, maxPrice, sort, page]);

    const handleResetFilters = () => {
        setSearch("");
        setSelectedParentCategory("");
        setSelectedSubcategory("");
        setMinPrice("");
        setMaxPrice("");
        setSort("");
        setPage(1);
    };

    return (
        <main className="catalog-page">
            <div className="catalog-page__container">
                <aside className="catalog-page__sidebar">
                    <div className="filters">
                        <h2 className="filters__title">Фільтри</h2>

                        <div className="filters__group">
                            <p className="filters__label">Категорія</p>

                            {loadingCategories ? (
                                <p>Завантаження категорій...</p>
                            ) : (
                                <>
                                    <select
                                        className="filters__select"
                                        value={selectedParentCategory}
                                        onChange={(e) => {
                                            setSelectedParentCategory(e.target.value);
                                            setSelectedSubcategory("");
                                            setPage(1);
                                        }}
                                    >
                                        <option value="">Усі категорії</option>

                                        {parentCategories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>

                                    <select
                                        className="filters__select"
                                        value={selectedSubcategory}
                                        onChange={(e) => {
                                            setSelectedSubcategory(e.target.value);
                                            setPage(1);
                                        }}
                                        disabled={!selectedParentCategory}
                                    >
                                        <option value="">Усі підкатегорії</option>

                                        {subcategories.map((category) => (
                                            <option key={category.id} value={category.id}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </>
                            )}
                        </div>

                        <div className="filters__group">
                            <p className="filters__label">Ціна</p>

                            <div className="filters__price">
                                <input
                                    type="number"
                                    placeholder="Від"
                                    value={minPrice}
                                    onChange={(e) => {
                                        setMinPrice(e.target.value);
                                        setPage(1);
                                    }}
                                />
                                <input
                                    type="number"
                                    placeholder="До"
                                    value={maxPrice}
                                    onChange={(e) => {
                                        setMaxPrice(e.target.value);
                                        setPage(1);
                                    }}
                                />
                            </div>
                        </div>

                        <button
                            className="filters__button"
                            onClick={handleResetFilters}
                        >
                            Скинути фільтри
                        </button>
                    </div>
                </aside>

                <section className="catalog-page__content">
                    <div className="catalog-toolbar">
                        <h1 className="catalog-toolbar__title">Каталог товарів</h1>

                        <div className="catalog-toolbar__actions">
                            <input
                                className="catalog-toolbar__search"
                                type="text"
                                placeholder="Пошук товарів..."
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    setPage(1);
                                }}
                            />

                            <select
                                className="catalog-toolbar__sort"
                                value={sort}
                                onChange={(e) => {
                                    setSort(e.target.value);
                                    setPage(1);
                                }}
                            >
                                <option value="">За замовчуванням</option>
                                <option value="price_asc">Спочатку дешевші</option>
                                <option value="price_desc">Спочатку дорожчі</option>
                                <option value="title_asc">За назвою А-Я</option>
                                <option value="title_desc">За назвою Я-А</option>
                            </select>
                        </div>
                    </div>

                    {error && <p>{error}</p>}

                    {loadingProducts ? (
                        <p>Завантаження товарів...</p>
                    ) : (
                        <div className="catalog-grid">
                            {products.length > 0 ? (
                                products.map((product) => (
                                    <Link
                                        key={product.id}
                                        to={`/product/${product.id}`}
                                        className="catalog-grid__link"
                                    >
                                        <article className="pCard pCard--expand">
                                            <ProductCard p={product} />
                                        </article>
                                    </Link>
                                ))
                            ) : (
                                <p>Товарів не знайдено</p>
                            )}
                        </div>
                    )}

                    <div className="catalog-pagination">
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((prev) => prev - 1)}
                        >
                            {"<"}
                        </button>

                        {Array.from({ length: totalPages }, (_, index) => {
                            const pageNumber = index + 1;

                            return (
                                <button
                                    key={pageNumber}
                                    className={page === pageNumber ? "active" : ""}
                                    onClick={() => setPage(pageNumber)}
                                >
                                    {pageNumber}
                                </button>
                            );
                        })}

                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage((prev) => prev + 1)}
                        >
                            {">"}
                        </button>
                    </div>
                </section>
            </div>
        </main>
    );
}
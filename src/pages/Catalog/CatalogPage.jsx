import './CatalogPage.scss';
import ProductCard from '../../components/ProductCard/ProductCard';
import { Link } from 'react-router-dom';
const products = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `Товар ${i + 1}`,
    price: 1200 + i * 150,
    image: 'https://via.placeholder.com/300x360',
}));

export default function CatalogPage() {
    return (
        <main className="catalog-page">
            <div className="catalog-page__container">
                <aside className="catalog-page__sidebar">
                    <div className="filters">
                        <h2 className="filters__title">Фільтри</h2>

                        <div className="filters__group">
                            <p className="filters__label">Категорія</p>
                            <label><input type="checkbox" /> Сукні</label>
                            <label><input type="checkbox" /> Светри</label>
                            <label><input type="checkbox" /> Джинси</label>
                        </div>

                        <div className="filters__group">
                            <p className="filters__label">Ціна</p>
                            <div className="filters__price">
                                <input type="number" placeholder="Від" />
                                <input type="number" placeholder="До" />
                            </div>
                        </div>

                        <button className="filters__button">Застосувати</button>
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
                            />

                            <select className="catalog-toolbar__sort">
                                <option>За замовчуванням</option>
                                <option>Спочатку дешевші</option>
                                <option>Спочатку дорожчі</option>
                                <option>За назвою</option>
                            </select>
                        </div>
                    </div>

                    <div className="catalog-grid">
                        {products.map((product) => (
                            <Link
                                key={product._id}
                                to={`/products/${product._id}`}
                                className="catalog-grid__link"
                            >
                                <article className="pCard">
                                    <ProductCard p={product} />
                                </article>
                            </Link>
                        ))}
                    </div>

                    <div className="catalog-pagination">
                        <button>{'<'}</button>
                        <button className="active">1</button>
                        <button>2</button>
                        <button>3</button>
                        <button>{'>'}</button>
                    </div>
                </section>
            </div>
        </main>
    );
}
import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import {
    GET_ADMIN_CATEGORIES,
    CREATE_CATEGORY,
    UPDATE_CATEGORY,
    DELETE_CATEGORY
} from "../../../graphql/categories.js";
import {
    Shirt,
    Baby,
    ToyBrick,
    ShoppingBag,
    Sofa,
    Gift,
    Package,
} from "lucide-react";
import Pagination from "../../../components/Pagination/Pagination.jsx";
const INITIAL_FORM = {
    name: "",
    slug: "",
    icon: "",
    description: "",
    isActive: true,
    parent: "",
    order: 0
};

const categoryIcons = {
    Shirt,
    Baby,
    ToyBrick,
    ShoppingBag,
    Sofa,
    Gift,
    Package,
};

export default function AdminCategoriesPage() {
    const [form, setForm] = useState(INITIAL_FORM);
    const [editingCategory, setEditingCategory] = useState(null);
    const [message, setMessage] = useState("");

    const [createCategory, { loading: isCreating }] = useMutation(CREATE_CATEGORY);
    const [updateCategory, { loading: isUpdating }] = useMutation(UPDATE_CATEGORY);
    const [deleteCategory, { loading: isDeleting }] = useMutation(DELETE_CATEGORY);

    const [page, setPage] = useState(1);
    const limit = 10;

    const { data, loading, error, refetch } = useQuery(GET_ADMIN_CATEGORIES, {
        variables: { page, limit },
        fetchPolicy: "network-only",
    });

    const categories = data?.categories?.items ?? [];
    const pagination = data?.categories?.pagination;

    const parentOptions = useMemo(() => {
        if (!editingCategory) return categories;
        return categories.filter((item) => item._id !== editingCategory._id);
    }, [categories, editingCategory]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]:
                type === "checkbox"
                    ? checked
                    : name === "order"
                        ? Number(value)
                        : value
        }));
    };

    const handleEdit = (category) => {
        setEditingCategory(category);
        setMessage("");

        setForm({
            name: category.name ?? "",
            slug: category.slug ?? "",
            icon: category.icon ?? "",
            description: category.description ?? "",
            isActive: category.isActive ?? true,
            parent: category.parent ?? "",
            order: category.order ?? 0
        });
    };

    const handleCancelEdit = () => {
        setEditingCategory(null);
        setForm(INITIAL_FORM);
        setMessage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");

        const input = {
            name: form.name.trim(),
            slug: form.slug.trim(),
            icon: form.icon.trim(),
            description: form.description.trim(),
            isActive: form.isActive,
            parent: form.parent || null,
            order: Number(form.order) || 0
        };

        try {
            if (editingCategory) {
                await updateCategory({
                    variables: {
                        id: editingCategory._id,
                        input
                    }
                });

                setMessage("Категорію оновлено");
            } else {
                await createCategory({
                    variables: {
                        input
                    }
                });

                setMessage("Категорію створено");
            }

            setForm(INITIAL_FORM);
            setEditingCategory(null);
            await refetch({ page, limit });
        } catch (err) {
            setMessage(err.message || "Сталася помилка");
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm("Видалити категорію?");
        if (!confirmed) return;

        setMessage("");

        try {
            await deleteCategory({
                variables: { id }
            });

            setMessage("Категорію видалено");
            if (editingCategory?._id === id) {
                handleCancelEdit();
            }
            await refetch({ page, limit });
        } catch (err) {
            setMessage(err.message || "Не вдалося видалити категорію");
        }
    };

    if (loading) {
        return <p>Завантаження категорій...</p>;
    }

    if (error) {
        return <p>Помилка завантаження: {error.message}</p>;
    }

    return (
        <section className="admin-categories">
            <div className="admin-categories__header">
                <div>
                    <h1 className="admin-categories__title">Категорії</h1>
                    <p className="admin-categories__subtitle">
                        Керування категоріями та сабкатегоріями
                    </p>
                </div>
            </div>

            {message ? (
                <div className="admin-categories__message">{message}</div>
            ) : null}

            <div className="admin-categories__layout">
                <div className="admin-categories__table-wrap">
                    <table className="admin-categories__table">
                        <thead>
                            <tr>
                                <th>Назва</th>
                                <th>Slug</th>
                                <th>Батьківська</th>
                                <th>Порядок</th>
                                <th>Статус</th>
                                <th>Дії</th>
                            </tr>
                        </thead>

                        <tbody>
                            {categories.length ? (
                                categories.map((category) => {
                                    const parent = categories.find(
                                        (item) => item._id === category.parent
                                    );

                                    return (
                                        <tr key={category._id}>
                                            <td>
                                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                                    {category.icon && (() => {
                                                        const Icon = categoryIcons[category.icon];
                                                        return Icon ? <Icon size={16} /> : null;
                                                    })()}
                                                    {category.name}
                                                </div>
                                            </td>
                                            <td>{category.slug}</td>
                                            <td>{parent?.name || "—"}</td>
                                            <td>{category.order}</td>
                                            <td>
                                                {category.isActive ? "Активна" : "Неактивна"}
                                            </td>
                                            <td>
                                                <div className="admin-categories__actions">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleEdit(category)}
                                                    >
                                                        Редагувати
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() => handleDelete(category._id)}
                                                        disabled={isDeleting}
                                                    >
                                                        Видалити
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6">Категорій поки немає</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <Pagination
                        page={pagination?.page}
                        totalPages={pagination?.totalPages}
                        hasNextPage={pagination?.hasNextPage}
                        hasPrevPage={pagination?.hasPrevPage}
                        onPageChange={setPage}
                    />
                </div>


                <div className="admin-categories__form-wrap">
                    <h2 className="admin-categories__form-title">
                        {editingCategory ? "Редагувати категорію" : "Нова категорія"}
                    </h2>

                    <form className="admin-categories-form" onSubmit={handleSubmit}>
                        <label>
                            <span>Назва</span>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label>
                            <span>Slug</span>
                            <input
                                type="text"
                                name="slug"
                                value={form.slug}
                                onChange={handleChange}
                                required
                            />
                        </label>

                        <label>
                            <span>Іконка</span>
                            <select
                                name="icon"
                                value={form.icon}
                                onChange={handleChange}
                            >
                                <option value="">Без іконки</option>
                                {Object.keys(categoryIcons).map((key) => (
                                    <option key={key} value={key}>
                                        {key}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label>
                            <span>Опис</span>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows="4"
                            />
                        </label>

                        <label>
                            <span>Батьківська категорія</span>
                            <select
                                name="parent"
                                value={form.parent}
                                onChange={handleChange}
                            >
                                <option value="">Без батьківської категорії</option>
                                {parentOptions.map((category) => (
                                    <option key={category._id} value={category._id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <label>
                            <span>Порядок</span>
                            <input
                                type="number"
                                name="order"
                                value={form.order}
                                onChange={handleChange}
                            />
                        </label>

                        <label className="admin-categories-form__checkbox">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={form.isActive}
                                onChange={handleChange}
                            />
                            <span>Активна</span>
                        </label>

                        <div className="admin-categories-form__buttons">
                            <button
                                type="submit"
                                disabled={isCreating || isUpdating}
                            >
                                {editingCategory ? "Зберегти" : "Створити"}
                            </button>

                            {editingCategory ? (
                                <button type="button" onClick={handleCancelEdit}>
                                    Скасувати
                                </button>
                            ) : null}
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
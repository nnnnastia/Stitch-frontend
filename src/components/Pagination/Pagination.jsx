export default function Pagination({
    page,
    totalPages,
    hasNextPage,
    hasPrevPage,
    onPageChange,
}) {
    if (!totalPages || totalPages <= 1) return null;

    return (
        <div className="pagination">
            <button
                type="button"
                className="pagination__btn"
                onClick={() => onPageChange(page - 1)}
                disabled={!hasPrevPage}
            >
                ← Назад
            </button>

            <span className="pagination__info">
                {page} / {totalPages}
            </span>

            <button
                type="button"
                className="pagination__btn"
                onClick={() => onPageChange(page + 1)}
                disabled={!hasNextPage}
            >
                Далі →
            </button>
        </div>
    );
}
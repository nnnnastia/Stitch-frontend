export default function Pagination({
    page,
    totalPages,
    onPageChange,
    className = "",
}) {
    if (totalPages <= 1) return null;

    const handlePrev = () => {
        if (page > 1) {
            onPageChange(page - 1);
        }
    };

    const handleNext = () => {
        if (page < totalPages) {
            onPageChange(page + 1);
        }
    };

    return (
        <div className={`pagination ${className}`}>
            <button
                className="pagination__btn"
                disabled={page === 1}
                onClick={handlePrev}
            >
                {"<"}
            </button>

            {Array.from({ length: totalPages }, (_, index) => {
                const pageNumber = index + 1;

                return (
                    <button
                        key={pageNumber}
                        className={`pagination__page ${page === pageNumber ? "is-active" : ""
                            }`}
                        onClick={() => onPageChange(pageNumber)}
                    >
                        {pageNumber}
                    </button>
                );
            })}

            <button
                className="pagination__btn"
                disabled={page === totalPages}
                onClick={handleNext}
            >
                {">"}
            </button>
        </div>
    );
}
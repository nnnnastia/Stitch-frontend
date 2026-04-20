import { useState } from "react";
import { reviewsService } from "../../services/reviews.service";
import { Star } from "lucide-react";

export default function ReviewForm({ productId, onSuccess, initialData = null }) {
    const [rating, setRating] = useState(initialData?.rating || 5);
    const [hover, setHover] = useState(0);
    const [text, setText] = useState(initialData?.text || "");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            if (initialData?.id) {
                await reviewsService.updateReview(initialData.id, { rating, text });
            } else {
                await reviewsService.createReview(productId, { rating, text });
            }

            setText("");
            setRating(5);
            onSuccess?.();
        } catch (err) {
            setError(err.message || "Помилка");
        } finally {
            setLoading(false);
        }
    }

    return (
        <form className="review-form" onSubmit={handleSubmit}>
            {error && <p className="review-form__error">{error}</p>}

            <div className="review-form__group">
                <label>Оцінка</label>

                <div className="review-form__stars">
                    {[1, 2, 3, 4, 5].map((star) => {
                        const isActive = star <= (hover || rating);

                        return (
                            <Star
                                key={star}
                                size={22}
                                className={`review-form__star ${isActive ? "is-active" : ""}`}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                            />
                        );
                    })}
                </div>
            </div>

            <div className="review-form__group">
                <label>Відгук</label>
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={4}
                    placeholder="Напишіть свій відгук"
                />
            </div>

            <button type="submit" disabled={loading}>
                {loading ? "Збереження..." : initialData ? "Оновити відгук" : "Залишити відгук"}
            </button>
        </form>
    );
}
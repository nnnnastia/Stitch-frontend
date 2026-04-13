import { useCart } from "../../hooks/useCart";
import { ShoppingCart } from "lucide-react";

export function AddToCartButton({ productId }) {
    const { addToCart, isAdding } = useCart();

    const handleAdd = async (e) => {
        e.preventDefault();
        e.stopPropagation();


        try {
            await addToCart({ productId, quantity: 1 });
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    return (
        <button type="button" className="pCard__buy" onClick={handleAdd} disabled={isAdding}>
            <ShoppingCart size={16} />
            {/* {isAdding ? "Додавання..." : "Додати в кошик"} */}
        </button>
    );
}
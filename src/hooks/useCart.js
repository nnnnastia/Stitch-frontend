import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { cartService } from "../services/cartService";

export function useCart(isAuthenticated = false) {
    const queryClient = useQueryClient();

    const cartQuery = useQuery({
        queryKey: ["cart"],
        queryFn: cartService.getCart,
        enabled: isAuthenticated,
        retry: false,
        refetchOnWindowFocus: false,
        staleTime: 0,
    });

    const addToCartMutation = useMutation({
        mutationFn: ({ productId, quantity }) =>
            cartService.addToCart(productId, quantity),
        onSuccess: (data) => {
            queryClient.setQueryData(["cart"], data);
        },
    });

    const updateQuantityMutation = useMutation({
        mutationFn: ({ productId, quantity }) =>
            cartService.updateQuantity(productId, quantity),
        onSuccess: (data) => {
            queryClient.setQueryData(["cart"], data);
        },
    });

    const removeFromCartMutation = useMutation({
        mutationFn: (productId) => cartService.removeFromCart(productId),
        onSuccess: (data) => {
            queryClient.setQueryData(["cart"], data);
        },
    });

    const clearCartMutation = useMutation({
        mutationFn: cartService.clearCart,
        onSuccess: (data) => {
            queryClient.setQueryData(["cart"], data);
        },
    });

    return {
        cart: cartQuery.data,
        isLoading: cartQuery.isLoading,
        error: cartQuery.error,
        refetchCart: cartQuery.refetch,

        addToCart: addToCartMutation.mutateAsync,
        isAdding: addToCartMutation.isPending,

        updateQuantity: updateQuantityMutation.mutateAsync,
        isUpdating: updateQuantityMutation.isPending,

        removeFromCart: removeFromCartMutation.mutateAsync,
        isRemoving: removeFromCartMutation.isPending,

        clearCart: clearCartMutation.mutateAsync,
        isClearing: clearCartMutation.isPending,
    };
}
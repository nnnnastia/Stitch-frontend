import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { wishlistService } from "../services/wishlist.service";

export function useWishlist() {
    const queryClient = useQueryClient();

    const wishlistQuery = useQuery({
        queryKey: ["wishlist"],
        queryFn: wishlistService.getMyWishlist,
    });

    const toggleMutation = useMutation({
        mutationFn: wishlistService.toggleWishlist,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["wishlist"] });
        },
    });

    return {
        wishlist: wishlistQuery.data?.wishlist || null,
        items: wishlistQuery.data?.wishlist?.items || [],
        isLoading: wishlistQuery.isLoading,
        toggleWishlist: toggleMutation.mutateAsync,
        isToggling: toggleMutation.isPending,
    };
}
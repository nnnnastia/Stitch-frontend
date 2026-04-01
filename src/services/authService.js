const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const authService = {
    logout: async () => {
        try {
            const response = await fetch(`${API}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            });

            if (!response.ok) {
                console.error('Failed to logout on server');
            }

            return response.ok;
        } catch (error) {
            console.error('Logout error:', error);
            return false;
        }
    },
};
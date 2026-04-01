import { useQueryClient } from '@tanstack/react-query';
import { authService } from '../services/authService';

export const useAuth = () => {
    const queryClient = useQueryClient();

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            console.error('Error during server logout:', error);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('user');

            queryClient.removeQueries({ queryKey: ['me'] });
        }
    };

    return { logout };
};
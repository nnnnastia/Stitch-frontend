import { apiClient } from './api';

export const usersService = {
    getMe: () => {
        return apiClient.get('/users/me');
    },

    updateMe: (data) => {
        return apiClient.patch('/users/me', data);
    },

    changePassword: (data) => {
        return apiClient.patch('/users/me/password', data);
    },

    uploadAvatar: (file) => {
        const formData = new FormData();
        formData.append('file', file);

        return apiClient.patchFormData('/users/me/avatar', formData);
    },
};
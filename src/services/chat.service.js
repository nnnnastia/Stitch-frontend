import { http } from "../api/http";

export const chatService = {
    async createOrOpenConversation(payload) {
        return http("/api/chat/conversations", {
            method: "POST",
            body: JSON.stringify(payload),
        });
    },

    async getMyConversations() {
        return http("/api/chat/conversations", {
            method: "GET",
        });
    },

    async getConversation(conversationId) {
        return http(`/api/chat/conversations/${conversationId}`, {
            method: "GET",
        });
    },

    async getMessages(conversationId, page = 1, limit = 20) {
        return http(`/api/chat/conversations/${conversationId}/messages?page=${page}&limit=${limit}`, {
            method: "GET",
        });
    },

    async sendMessage(conversationId, { text, images = [] }) {
        const formData = new FormData();

        if (text) {
            formData.append("text", text);
        }

        for (const image of images) {
            formData.append("images", image);
        }

        return http(`/api/chat/conversations/${conversationId}/messages`, {
            method: "POST",
            body: formData,
        });
    },

    async markAsRead(conversationId) {
        return http(`/api/chat/conversations/${conversationId}/read`, {
            method: "POST",
        });
    },

    async getUnreadCount() {
        return http("/api/chat/unread-count", {
            method: "GET",
        });
    },
};
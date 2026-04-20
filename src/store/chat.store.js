import { create } from "zustand";
import { chatService } from "../services/chat.service";

function normalizeConversation(conversation) {
    if (!conversation) return null;

    return {
        ...conversation,
        id: conversation.id || conversation._id,
    };
}

export const useChatStore = create((set) => ({
    isOpen: false,
    activeConversation: null,

    openChat: () => set({ isOpen: true }),

    closeChat: () => set({ isOpen: false }),

    openConversation: (conversation) =>
        set({
            activeConversation: normalizeConversation(conversation),
            isOpen: true,
        }),

    backToList: () =>
        set({
            activeConversation: null,
        }),

    startChat: async (payload) => {
        const conversation = await chatService.createOrOpenConversation(payload);
        const normalizedConversation = normalizeConversation(conversation);

        set({
            activeConversation: normalizedConversation,
            isOpen: true,
        });

        return normalizedConversation;
    },
}));
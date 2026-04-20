import { useEffect, useState } from "react";
import ConversationsList from "../ConversationsList/ConversationsList";
import MessageList from "../MessageList/MessageList";
import MessageInput from "../MessageInput/MessageInput";
import { useChatStore } from "../../store/chat.store";
import { usersService } from "../../services/users.service";

export default function ChatWindow({ onClose }) {
    const [refreshKey, setRefreshKey] = useState(0);
    const [currentUser, setCurrentUser] = useState(null);

    const activeConversation = useChatStore((state) => state.activeConversation);
    const openConversation = useChatStore((state) => state.openConversation);
    const backToList = useChatStore((state) => state.backToList);

    useEffect(() => {
        loadCurrentUser();
    }, []);

    async function loadCurrentUser() {
        try {
            const res = await usersService.getMe();
            setCurrentUser(res?.user || res || null);
        } catch {
            setCurrentUser(null);
        }
    }

    function handleMessageSent() {
        setRefreshKey((prev) => prev + 1);
    }

    return (
        <div className="chat-window">
            <div className="chat-window__header">
                <div className="chat-window__left">
                    {activeConversation && (
                        <button
                            type="button"
                            className="chat-window__back"
                            onClick={backToList}
                            aria-label="Назад до списку чатів"
                        >
                            ←
                        </button>
                    )}

                    <span className="chat-window__title">
                        {activeConversation ? "Чат" : "Повідомлення"}
                    </span>
                </div>

                <button
                    type="button"
                    className="chat-window__close"
                    onClick={onClose}
                    aria-label="Закрити чат"
                >
                    ✕
                </button>
            </div>

            <div className="chat-window__body">
                {!activeConversation ? (
                    <ConversationsList onSelect={openConversation} />
                ) : (
                    <div className="chat-window__conversation">
                        <MessageList
                            conversation={activeConversation}
                            currentUserId={currentUser?.id || currentUser?._id}
                            refreshKey={refreshKey}
                        />
                        <MessageInput
                            conversation={activeConversation}
                            onMessageSent={handleMessageSent}
                        />
                        {activeConversation?.sourceType === "system" && (
                            <div className="chat-window__systemNote">
                                Це системний чат. Відповісти неможливо.
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
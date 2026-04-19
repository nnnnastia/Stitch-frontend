import { useState } from "react";
import ConversationsList from "../ConversationsList/ConversationsList";
import MessageList from "../MessageList/MessageList";
import MessageInput from "../MessageInput/MessageInput";

export default function ChatWindow({ onClose }) {
    const [activeConversation, setActiveConversation] = useState(null);

    return (
        <div className="chat-window">
            <div className="chat-window__header">
                <span className="chat-window__title">
                    {activeConversation ? "Чат" : "Повідомлення"}
                </span>

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
                    <ConversationsList onSelect={setActiveConversation} />
                ) : (
                    <div className="chat-window__conversation">
                        <MessageList conversation={activeConversation} />
                        <MessageInput conversation={activeConversation} />
                    </div>
                )}
            </div>
        </div>
    );
}
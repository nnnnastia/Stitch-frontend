import { useState } from "react";
import { chatService } from "../../services/chat.service";

export default function MessageInput({ conversation }) {
    const [text, setText] = useState("");

    async function send() {
        if (!text.trim()) return;

        await chatService.sendMessage(conversation.id, { text });
        setText("");
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            send();
        }
    }

    return (
        <div className="chat-input">
            <input
                value={text}
                onChange={(e) => setText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Написати повідомлення..."
            />

            <button onClick={send} type="button">
                ➤
            </button>
        </div>
    );
}
import { useState, useEffect } from "react";
import ChatButton from "../ChatButton/ChatButton";
import ChatWindow from "../ChatWindow/ChatWindow";
import { chatService } from "../../services/chat.service";
import { usersService } from "../../services/users.service";
import { useChatStore } from "../../store/chat.store";

export default function ChatWidget() {
    const [unreadCount, setUnreadCount] = useState(0);
    const [user, setUser] = useState(null);
    const [authChecked, setAuthChecked] = useState(false);

    const isOpen = useChatStore((state) => state.isOpen);
    const openChat = useChatStore((state) => state.openChat);
    const closeChat = useChatStore((state) => state.closeChat);
    const backToList = useChatStore((state) => state.backToList);

    useEffect(() => {
        loadMe();
    }, []);

    useEffect(() => {
        if (!user) {
            setUnreadCount(0);
            return;
        }

        loadUnread();

        const interval = setInterval(loadUnread, 10000);
        return () => clearInterval(interval);
    }, [user?.id]);

    useEffect(() => {
        function handleClick(e) {
            if (!e.target.closest(".chat-widget")) {
                closeChat();
                backToList();
            }
        }

        if (isOpen) {
            document.addEventListener("mousedown", handleClick);
        }

        return () => document.removeEventListener("mousedown", handleClick);
    }, [isOpen, closeChat, backToList]);

    async function loadMe() {
        try {
            const me = await usersService.getMe();
            setUser(me?.user || me || null);
        } catch (e) {
            if (e?.status === 401) {
                setUser(null);
            } else {
                console.error("loadMe failed:", e);
                setUser(null);
            }
        } finally {
            setAuthChecked(true);
        }
    }

    async function loadUnread() {
        try {
            const res = await chatService.getUnreadCount();
            console.log("getUnreadCount:", res);
            setUnreadCount(res.count || 0);
        } catch (e) {
            if (e?.status !== 401) {
                console.error("loadUnread failed:", e);
            }
        }
    }

    function handleToggle() {
        if (isOpen) {
            closeChat();
            backToList();
        } else {
            openChat();
        }
    }

    if (!authChecked || !user) {
        return null;
    }

    return (
        <div className="chat-widget">
            {!isOpen && (
                <ChatButton onClick={handleToggle} unreadCount={unreadCount} />
            )}

            <div className={`chat-widget__window ${isOpen ? "open" : ""}`}>
                {isOpen && <ChatWindow onClose={handleToggle} />}
            </div>
        </div>
    );
}
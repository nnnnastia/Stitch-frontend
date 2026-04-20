import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { chatService } from "../../services/chat.service";

export default function MessageInput({ conversation, onMessageSent }) {
    const [text, setText] = useState("");
    const [images, setImages] = useState([]);
    const [previews, setPreviews] = useState([]);
    const [sending, setSending] = useState(false);

    const fileInputRef = useRef(null);

    function handlePickImages() {
        fileInputRef.current?.click();
    }

    function handleFilesChange(e) {
        const selectedFiles = Array.from(e.target.files || []);

        if (!selectedFiles.length) return;

        const onlyImages = selectedFiles.filter((file) =>
            file.type.startsWith("image/")
        );

        const nextImages = [...images, ...onlyImages].slice(0, 3);

        setImages(nextImages);

        const nextPreviews = nextImages.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));

        previews.forEach((item) => URL.revokeObjectURL(item.url));
        setPreviews(nextPreviews);

        e.target.value = "";
    }

    function removeImage(indexToRemove) {
        const nextImages = images.filter((_, index) => index !== indexToRemove);

        previews.forEach((item) => URL.revokeObjectURL(item.url));

        const nextPreviews = nextImages.map((file) => ({
            file,
            url: URL.createObjectURL(file),
        }));

        setImages(nextImages);
        setPreviews(nextPreviews);
    }

    async function send() {
        if ((!text || !text.trim()) && images.length === 0) return;
        if (!conversation?.id || sending) return;

        try {
            setSending(true);

            const message = await chatService.sendMessage(conversation.id, {
                text: text.trim(),
                images,
            });

            setText("");
            setImages([]);
            previews.forEach((item) => URL.revokeObjectURL(item.url));
            setPreviews([]);

            if (onMessageSent) {
                onMessageSent(message);
            }
        } catch (error) {
            console.error(error);
            alert(error?.message || "Не вдалося надіслати повідомлення");
        } finally {
            setSending(false);
        }
    }

    function handleKeyDown(e) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
        }
    }

    return (
        <div className="chat-input-wrap">
            {!!previews.length && (
                <div className="chat-input__previews">
                    {previews.map((item, index) => (
                        <div key={item.url} className="chat-input__previewItem">
                            <img
                                src={item.url}
                                alt="Попередній перегляд"
                                className="chat-input__previewImage"
                            />
                            <button
                                type="button"
                                className="chat-input__previewRemove"
                                onClick={() => removeImage(index)}
                                aria-label="Видалити фото"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="chat-input">
                <button
                    type="button"
                    className="chat-input__attach"
                    onClick={handlePickImages}
                    aria-label="Додати фото"
                    disabled={sending || images.length >= 3}
                >
                    <ImagePlus size={18} />
                </button>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleFilesChange}
                    style={{ display: "none" }}
                />

                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Написати повідомлення..."
                    disabled={sending}
                />

                <button onClick={send} type="button" disabled={sending}>
                    {sending ? "..." : "➤"}
                </button>
            </div>
        </div>
    );
}
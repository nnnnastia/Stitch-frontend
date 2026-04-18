export async function searchByPhoto(file) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:5000/api/search/by-photo", {
        method: "POST",
        body: formData,
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
        console.error("Search by photo error:", data);
        throw new Error(data?.message || data?.detail || "Помилка пошуку по фото");
    }

    return data;
}
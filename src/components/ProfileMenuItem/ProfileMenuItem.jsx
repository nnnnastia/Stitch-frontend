export default function ProfileMenuItem({ label, onClick, danger = false }) {
    return (
        <button
            type="button"
            className={`profile__menu-item ${danger ? "profile__menu-item--danger" : ""}`}
            onClick={onClick}
        >
            <span className="profile__menu-label">{label}</span>
            <span className="profile__chevron">›</span>
        </button>
    );
}
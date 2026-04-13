export default function ProfileMenuItem({ label, onClick, danger = false }) {
    return (
        <button
            type="button"
            className={`navItem ${danger ? "navItem--danger" : ""}`}
            onClick={onClick}
        >
            <span className="profile__menu-label">{label}</span>
        </button>
    );
}
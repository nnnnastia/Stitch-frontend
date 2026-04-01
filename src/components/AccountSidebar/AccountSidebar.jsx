import { useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Camera, User as UserIcon } from 'lucide-react';

import { ROUTES } from '../../constants/index.js';

const SIDEBAR_LINKS = [
    { to: ROUTES.PROFILE, end: true, label: 'Account' },
    { to: ROUTES.MYORDERS, label: 'Orders' },
];

export function AccountSidebar({
    user,
    onAvatarClick,
    onLogout,
    isAvatarUploading = false,
}) {
    const fullName = `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim();
    const displayName = fullName || 'User';

    const fileInputRef = useRef(null);

    const handleOpenFilePicker = () => {
        if (isAvatarUploading) return;
        fileInputRef.current?.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        if (onAvatarClick) {
            onAvatarClick(file);
        }

        event.target.value = '';
    };

    const navItemClass = 'account-sidebar__link';

    return (
        <aside className="account-sidebar">
            <div className="account-sidebar__user">
                <div className="account-sidebar__avatar-wrapper">
                    {user?.avatarUrl ? (
                        <img
                            src={user.avatarUrl}
                            alt="avatar"
                            className="account-sidebar__avatar"
                        />
                    ) : (
                        <div className="account-sidebar__avatar-placeholder">
                            <UserIcon size={32} />
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={handleOpenFilePicker}
                        disabled={isAvatarUploading}
                        className="account-sidebar__avatar-btn"
                    >
                        <Camera size={16} />
                    </button>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        className="account-sidebar__file-input"
                        onChange={handleFileChange}
                    />
                </div>

                <h3 className="account-sidebar__name">{displayName}</h3>
            </div>

            <nav className="account-sidebar__nav">
                <ul className="account-sidebar__list">
                    {SIDEBAR_LINKS.map(({ to, label }) => (
                        <li key={to}>
                            <NavLink
                                to={to}
                                end={to === ROUTES.PROFILE}
                                className={({ isActive }) =>
                                    `${navItemClass} ${isActive
                                        ? 'account-sidebar__link--active'
                                        : ''
                                    }`
                                }
                            >
                                {label}
                            </NavLink>
                        </li>
                    ))}

                    <li>
                        <span className="account-sidebar__link account-sidebar__link--disabled">
                            Wishlist
                        </span>
                    </li>

                    <li>
                        <button
                            type="button"
                            onClick={onLogout}
                            className="account-sidebar__logout"
                        >
                            Log Out
                        </button>
                    </li>
                </ul>
            </nav>
        </aside>
    );
}
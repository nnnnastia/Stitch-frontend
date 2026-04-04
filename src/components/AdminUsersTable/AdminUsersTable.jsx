import { fileUrl } from "../../utils/fileUrl";
function formatDate(dateString) {
    if (!dateString) return "—";

    const date = new Date(dateString);

    return date.toLocaleDateString("uk-UA", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
}

export function AdminUsersTable({
    users,
    onRoleChange,
    onToggleStatus,
    isActionLoading,
}) {
    if (!users.length) {
        return <div className="admin-users-table__empty">No users found.</div>;
    }

    return (
        <div className="admin-users-table">
            <table className="admin-users-table__table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Email status</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((user) => {
                        const fullName =
                            `${user.userName || ""} ${user.userSurname || ""}`.trim() ||
                            "Unnamed user";

                        return (
                            <tr key={user._id}>
                                <td>
                                    <div className="admin-users-table__user">
                                        {user?.avatarUrl ? (
                                            <img
                                                src={fileUrl(user.avatarUrl)}
                                                alt="avatar"
                                                className="admin-users-table__avatar"
                                            />
                                        ) : (
                                            <div className="admin-users-table__avatar-placeholder">
                                                {fullName.charAt(0).toUpperCase()}
                                            </div>
                                        )}

                                        <div>
                                            <div className="admin-users-table__name">
                                                {fullName}
                                            </div>
                                            <div className="admin-users-table__id">
                                                {user._id}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td>{user.email}</td>
                                <td>{user.phoneNumber || "—"}</td>

                                <td>
                                    <select
                                        className="admin-users-table__select"
                                        value={user.role}
                                        disabled={isActionLoading}
                                        onChange={(event) =>
                                            onRoleChange(user._id, event.target.value)
                                        }
                                    >
                                        <option value="user">user</option>
                                        <option value="seller">seller</option>
                                        <option value="admin">admin</option>
                                    </select>
                                </td>

                                <td>
                                    <span
                                        className={`admin-users-table__badge ${user.isActive
                                            ? "admin-users-table__badge--active"
                                            : "admin-users-table__badge--blocked"
                                            }`}
                                    >
                                        {user.isActive ? "Active" : "Blocked"}
                                    </span>
                                </td>

                                <td>
                                    <span
                                        className={`admin-users-table__badge ${user.emailVerified
                                            ? "admin-users-table__badge--verified"
                                            : "admin-users-table__badge--not-verified"
                                            }`}
                                    >
                                        {user.emailVerified
                                            ? "Verified"
                                            : "Not verified"}
                                    </span>
                                </td>

                                <td>{formatDate(user.createdAt)}</td>

                                <td>
                                    <button
                                        type="button"
                                        className="admin-users-table__action-btn"
                                        disabled={isActionLoading}
                                        onClick={() =>
                                            onToggleStatus(user._id, !user.isActive)
                                        }
                                    >
                                        {user.isActive ? "Block" : "Unblock"}
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
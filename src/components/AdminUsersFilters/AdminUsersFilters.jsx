import { useEffect, useState } from "react";

export function AdminUsersFilters({ filters, onChange }) {
    const [localFilters, setLocalFilters] = useState(filters);

    useEffect(() => {
        setLocalFilters(filters);
    }, [filters]);

    const handleFieldChange = (field, value) => {
        setLocalFilters((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        onChange(localFilters);
    };

    const handleReset = () => {
        const clearedFilters = {
            search: "",
            role: "",
            isActive: "",
            emailVerified: "",
        };

        setLocalFilters(clearedFilters);
        onChange(clearedFilters);
    };

    return (
        <form className="admin-users-filters" onSubmit={handleSubmit}>
            <div className="admin-users-filters__grid">
                <input
                    className="admin-users-filters__input"
                    type="text"
                    placeholder="Search users"
                    value={localFilters.search}
                    onChange={(event) =>
                        handleFieldChange("search", event.target.value)
                    }
                />

                <select
                    className="admin-users-filters__select"
                    value={localFilters.role}
                    onChange={(event) =>
                        handleFieldChange("role", event.target.value)
                    }
                >
                    <option value="">All roles</option>
                    <option value="user">User</option>
                    <option value="seller">Seller</option>
                    <option value="admin">Admin</option>
                </select>

                <select
                    className="admin-users-filters__select"
                    value={localFilters.isActive}
                    onChange={(event) =>
                        handleFieldChange("isActive", event.target.value)
                    }
                >
                    <option value="">All statuses</option>
                    <option value="true">Active</option>
                    <option value="false">Blocked</option>
                </select>

                <select
                    className="admin-users-filters__select"
                    value={localFilters.emailVerified}
                    onChange={(event) =>
                        handleFieldChange("emailVerified", event.target.value)
                    }
                >
                    <option value="">All emails</option>
                    <option value="true">Verified</option>
                    <option value="false">Not verified</option>
                </select>
            </div>

            <div className="admin-users-filters__actions">
                <button type="submit" className="admin-users-filters__button">
                    Apply
                </button>

                <button
                    type="button"
                    className="admin-users-filters__button admin-users-filters__button--secondary"
                    onClick={handleReset}
                >
                    Reset
                </button>
            </div>
        </form>
    );
}
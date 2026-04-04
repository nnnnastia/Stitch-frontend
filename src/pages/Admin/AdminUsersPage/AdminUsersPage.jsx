import { useMemo, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";

import { GET_ADMIN_USERS, ADMIN_TOGGLE_USER_STATUS, ADMIN_UPDATE_USER_ROLE } from "../../../graphql/users";

import { AdminUsersFilters } from "../../../components/AdminUsersFilters/AdminUsersFilters";
import { AdminUsersTable } from "../../../components/AdminUsersTable/AdminUsersTable";
import Pagination from "../../../components/Pagination/Pagination";

export default function AdminUsersPage() {
    const [page, setPage] = useState(1);
    const [limit] = useState(10);

    const [filters, setFilters] = useState({
        search: "",
        role: "",
        isActive: "",
        emailVerified: "",
    });

    const queryVariables = useMemo(() => {
        return {
            filter: {
                page,
                limit,
                search: filters.search || undefined,
                role: filters.role || undefined,
                isActive:
                    filters.isActive === ""
                        ? undefined
                        : filters.isActive === "true",
                emailVerified:
                    filters.emailVerified === ""
                        ? undefined
                        : filters.emailVerified === "true",
            },
        };
    }, [filters, page, limit]);

    const { data, loading, error, refetch } = useQuery(GET_ADMIN_USERS, {
        variables: queryVariables,
        fetchPolicy: "network-only",
    });

    const [updateUserRole, { loading: roleLoading }] = useMutation(
        ADMIN_UPDATE_USER_ROLE
    );

    const [toggleUserStatus, { loading: statusLoading }] = useMutation(
        ADMIN_TOGGLE_USER_STATUS
    );

    const users = data?.adminUsers?.items || [];
    const pagination = data?.adminUsers?.pagination || null;

    const handleFiltersChange = (nextFilters) => {
        setPage(1);
        setFilters(nextFilters);
    };

    const handleRoleChange = async (userId, nextRole) => {
        try {
            await updateUserRole({
                variables: {
                    id: userId,
                    role: nextRole,
                },
            });

            await refetch();
        } catch (mutationError) {
            console.error("Failed to update user role:", mutationError);
        }
    };

    const handleToggleStatus = async (userId, nextIsActive) => {
        try {
            await toggleUserStatus({
                variables: {
                    id: userId,
                    isActive: nextIsActive,
                },
            });

            await refetch();
        } catch (mutationError) {
            console.error("Failed to toggle user status:", mutationError);
        }
    };

    return (
        <section className="admin-users-page">
            <div className="admin-users-page__header">
                <h1 className="admin-users-page__title">Users Management</h1>
                <p className="admin-users-page__subtitle">
                    Manage users, roles and account status
                </p>
            </div>

            <AdminUsersFilters
                filters={filters}
                onChange={handleFiltersChange}
            />

            {loading ? (
                <div className="admin-users-page__state">Loading users...</div>
            ) : null}

            {error ? (
                <div className="admin-users-page__state admin-users-page__state--error">
                    {error.message}
                </div>
            ) : null}

            {!loading && !error ? (
                <>
                    <AdminUsersTable
                        users={users}
                        onRoleChange={handleRoleChange}
                        onToggleStatus={handleToggleStatus}
                        isActionLoading={roleLoading || statusLoading}
                    />

                    <Pagination
                        pagination={pagination}
                        onPageChange={setPage}
                    />
                </>
            ) : null}
        </section>
    );
}
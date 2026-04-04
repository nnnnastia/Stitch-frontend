import { gql } from "@apollo/client";

export const GET_ADMIN_USERS = gql`
    query AdminUsers($filter: AdminUsersFilterInput) {
        adminUsers(filter: $filter) {
            items {
                _id
                userName
                userSurname
                email
                phoneNumber
                role
                isActive
                avatarUrl
                emailVerified
                verificationAttempts
                createdAt
                updatedAt
            }
            pagination {
                total
                page
                limit
                totalPages
                hasNextPage
                hasPrevPage
            }
        }
    }
`;

export const GET_ADMIN_USER = gql`
    query AdminUser($id: ID!) {
        adminUser(id: $id) {
            _id
            userName
            userSurname
            email
            phoneNumber
            role
            isActive
            avatarUrl
            emailVerified
            verificationAttempts
            createdAt
            updatedAt
        }
    }
`;

export const ADMIN_UPDATE_USER = gql`
    mutation AdminUpdateUser($id: ID!, $input: AdminUpdateUserInput!) {
        adminUpdateUser(id: $id, input: $input) {
            _id
            userName
            userSurname
            email
            phoneNumber
            role
            isActive
            avatarUrl
            emailVerified
            verificationAttempts
            createdAt
            updatedAt
        }
    }
`;

export const ADMIN_UPDATE_USER_ROLE = gql`
    mutation AdminUpdateUserRole($id: ID!, $role: String!) {
        adminUpdateUserRole(id: $id, role: $role) {
            _id
            role
            updatedAt
        }
    }
`;

export const ADMIN_TOGGLE_USER_STATUS = gql`
    mutation AdminToggleUserStatus($id: ID!, $isActive: Boolean!) {
        adminToggleUserStatus(id: $id, isActive: $isActive) {
            _id
            isActive
            updatedAt
        }
    }
`;
import { gql } from "@apollo/client";

export const GET_ADMIN_CATEGORIES = gql`
    query GetAdminCategories($page: Int!, $limit: Int!) {
        categories(page: $page, limit: $limit) {
            items {
                _id
                name
                slug
                icon
                description
                isActive
                parent
                order
                createdAt
                updatedAt
            }
            pagination {
                page
                limit
                totalItems
                totalPages
                hasNextPage
                hasPrevPage
            }
        }
    }
`;

export const CREATE_CATEGORY = gql`
    mutation CreateCategory($input: CreateCategoryInput!) {
        createCategory(input: $input) {
            _id
            name
            slug
            icon
            description
            isActive
            parent
            order
        }
    }
`;

export const UPDATE_CATEGORY = gql`
    mutation UpdateCategory($id: ID!, $input: UpdateCategoryInput!) {
        updateCategory(id: $id, input: $input) {
            _id
            name
            slug
            icon
            description
            isActive
            parent
            order
        }
    }
`;

export const DELETE_CATEGORY = gql`
    mutation DeleteCategory($id: ID!) {
        deleteCategory(id: $id)
    }
`;
import { gql } from '@apollo/client';

export const GET_ADMIN_ORDERS = gql`
    query AdminOrders($page: Int!, $limit: Int!, $status: OrderStatus, $search: String) {
        adminOrders(page: $page, limit: $limit, status: $status, search: $search) {
            total
            items {
                _id
                total
                subtotal
                deliveryCost
                status
                paymentMethod
                createdAt
                customer {
                    _id
                    firstName
                    lastName
                    email
                }
            }
        }
    }
`;

export const GET_ADMIN_ORDER = gql`
    query AdminOrder($id: ID!) {
        adminOrder(id: $id) {
            _id
            subtotal
            deliveryCost
            total
            status
            paymentMethod
            createdAt
            customer {
                _id
                firstName
                lastName
                email
            }
            delivery {
                provider
                cityName
                warehouseName
                recipientFullName
                recipientPhone
            }
            items {
                product
                title
                price
                quantity
                coverImage
                seller
            }
        }
    }
`;

export const ADMIN_UPDATE_ORDER_STATUS = gql`
    mutation AdminUpdateOrderStatus($id: ID!, $status: OrderStatus!) {
        adminUpdateOrderStatus(id: $id, status: $status) {
            _id
            status
            updatedAt
        }
    }
`;
import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { Observable } from "@apollo/client/utilities";
import { clearAuthStorage } from "../utils/auth-storage";
const httpLink = new HttpLink({
    uri: "http://localhost:5000/graphql",
    credentials: "include",
});

let refreshPromise = null;

async function tryRefresh() {
    if (!refreshPromise) {
        refreshPromise = fetch("http://localhost:5000/api/auth/refresh", {
            method: "POST",
            credentials: "include",
        })
            .then(async (res) => {
                if (!res.ok) throw new Error("Refresh failed");
                return res.json().catch(() => null);
            })
            .finally(() => {
                refreshPromise = null;
            });
    }

    return refreshPromise;
}

const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
    const unauthorized =
        graphQLErrors?.some((err) => err.message === "Unauthorized") ||
        networkError?.statusCode === 401;

    if (!unauthorized) return;

    return new Observable((observer) => {
        tryRefresh()
            .then(() => {
                forward(operation).subscribe(observer);
            })
            .catch(() => {
                clearAuthStorage();
                window.location.href = "/login";
            });
    });
});

export const apolloClient = new ApolloClient({
    link: from([errorLink, httpLink]),
    cache: new InMemoryCache(),
});
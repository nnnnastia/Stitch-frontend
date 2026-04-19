let isLoggingOut = false;
let hasAuthSession = false;

export function setIsLoggingOut(value) {
    isLoggingOut = value;
}

export function getIsLoggingOut() {
    return isLoggingOut;
}

export function markAuthSession() {
    hasAuthSession = true;
}

export function clearAuthSession() {
    hasAuthSession = false;
}

export function hasSession() {
    return hasAuthSession;
}
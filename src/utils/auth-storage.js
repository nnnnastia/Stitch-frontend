export const clearAuthStorage = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expires');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
};
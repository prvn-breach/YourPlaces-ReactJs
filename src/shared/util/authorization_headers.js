export const getAuthHeaders = (token) => {
    const headers = {
        Authorization : 'Bearer ' + token
    };
    return headers;
}
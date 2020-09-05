export const setFileURL = (path) => {
    const url = process.env.REACT_APP_ASSET_URL + path;
    return url;
};
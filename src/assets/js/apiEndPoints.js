const apiBaseUrl = process.env.REACT_APP_BACKEND_URL;

export const login = apiBaseUrl + '/users/login';
export const signup = apiBaseUrl + '/users/signup';
export const get_users = apiBaseUrl + '/users';
export const create_place = apiBaseUrl + '/places';
export const get_user_places = apiBaseUrl + '/places/find-by-user';
export const get_place_by_id = apiBaseUrl + '/places/find-by-id';
export const update_place = apiBaseUrl + '/places/update';
export const delete_place = apiBaseUrl + '/places/delete';

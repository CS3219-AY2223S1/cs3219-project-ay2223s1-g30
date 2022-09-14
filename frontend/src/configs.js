export const URI_USER_SVC = process.env.URI_USER_SVC || "http://localhost:8000";

const PREFIX_USER_SVC = "/api/user";
const PREFIX_USER_SVC_LOGIN = "/login";
const PREFIX_USER_SVC_DASHBOARD = "/dashboard";
const PREFIX_USER_SVC_LOGOUT = "/logout";

export const URL_USER_SVC = URI_USER_SVC + PREFIX_USER_SVC;
export const URL_USER_SVC_LOGIN = URL_USER_SVC + PREFIX_USER_SVC_LOGIN;
export const URL_USER_SVC_DASHBOARD = URL_USER_SVC + PREFIX_USER_SVC_DASHBOARD;
export const URL_USER_SVC_LOGOUT = URL_USER_SVC + PREFIX_USER_SVC_LOGOUT;

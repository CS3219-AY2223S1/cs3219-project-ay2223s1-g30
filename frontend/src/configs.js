export const URI_USER_SVC = process.env.URI_USER_SVC || "http://localhost:8000";
export const URI_MATCHING_SVC =
	process.env.URI_MATCHING_SVC || "http://localhost:8001";
export const URI_QUESTION_SVC =
	process.env.URI_QUESTION_SVC || "http://localhost:8002";

const PREFIX_MATCHING_SVC = "/api/match";
const PREFIX_QUESTION_SVC = "/api/question";
const PREFIX_USER_SVC = "/api/user";
const PREFIX_USER_SVC_LOGIN = "/login";
const PREFIX_USER_SVC_DASHBOARD = "/dashboard";
const PREFIX_USER_SVC_LOGOUT = "/logout";
const PREFIX_HISTORY_SVC = "/history";

export const URL_MATCHING_SERVICE = URI_MATCHING_SVC + PREFIX_MATCHING_SVC;
export const URL_QUESTION_SVC = URI_QUESTION_SVC + PREFIX_QUESTION_SVC;
export const URL_USER_SVC = URI_USER_SVC + PREFIX_USER_SVC;
export const URL_USER_SVC_LOGIN = URL_USER_SVC + PREFIX_USER_SVC_LOGIN;
export const URL_USER_SVC_DASHBOARD = URL_USER_SVC + PREFIX_USER_SVC_DASHBOARD;
export const URL_USER_SVC_LOGOUT = URL_USER_SVC + PREFIX_USER_SVC_LOGOUT;
export const URL_HISTORY_SVC = URL_USER_SVC + PREFIX_HISTORY_SVC;

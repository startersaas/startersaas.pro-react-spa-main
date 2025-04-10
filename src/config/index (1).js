// config/index.js
export const API_HOST = process.env.REACT_APP_API_HOST;
export const API_PATH = process.env.REACT_APP_API_PATH;
//export const API_URL = `${API_HOST}${API_PATH}`;
export const API_URL = '/api/v1';
export const JWT_TOKEN = process.env.REACT_APP_JWT_TOKEN_NAME;

export const SIGNUP_WITH_ACTIVATE =
  process.env.REACT_APP_SIGNUP_WITH_ACTIVATE === "true";
export const ENABLE_CUSTOMER_PORTAL =
  process.env.REACT_APP_ENABLE_CUSTOMER_PORTAL === "true";
export const ACCOUNT_STATUSES = {
  subscriptionTrial: "trial",
  subscriptionPaymentFailed: "payment_failed",
  subscriptionDeactivated: "deactivated",
  subscriptionActive: "active",
};

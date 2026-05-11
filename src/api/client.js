import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://assignmentsss-chg0cjejhtg8gwb3.polandcentral-01.azurewebsites.net/api";

const client = axios.create({
  baseURL: API_BASE_URL,
  timeout: 60000,
});

function isValidToken(token) {
  return (
    typeof token === "string" &&
    token.trim() !== "" &&
    token !== "undefined" &&
    token !== "null"
  );
}

client.interceptors.request.use((config) => {
  const requestUrl = config?.url || "";
  const isAuthRequest =
    requestUrl.includes("/auth/login") || requestUrl.includes("/auth/signup");
  const token = localStorage.getItem("token");
  if (!isAuthRequest && isValidToken(token)) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }
  config.headers.Accept = "application/json";
  return config;
});

export default client;

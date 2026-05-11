import client from "./client";

export async function loginUser(credentials) {
  const response = await client.post("/auth/login", credentials);
  return response.data;
}

export async function signupUser(payload) {
  const response = await client.post("/auth/signup", payload);
  return response.data;
}

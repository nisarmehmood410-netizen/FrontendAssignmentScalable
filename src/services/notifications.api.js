import httpClient from "./httpClient";

export async function fetchNotifications(page = 1, limit = 20) {
  const response = await httpClient.get("/notifications", {
    params: { page, limit },
  });

  return response.data.data || [];
}

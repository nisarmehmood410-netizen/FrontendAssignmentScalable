import client from "./client";

export async function fetchNotifications(page = 1, limit = 20) {
  const response = await client.get("/notifications", {
    params: { page, limit },
  });

  return response.data.data || [];
}

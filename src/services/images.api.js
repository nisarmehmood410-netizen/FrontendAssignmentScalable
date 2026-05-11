import httpClient from "./httpClient";
import { mockGalleryFallback } from "../fixtures/mockGallery.fallback";

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const ALLOW_MOCK_FALLBACK = import.meta.env.VITE_ENABLE_MOCK_FALLBACK === "true";

function getListFromResponse(responseData) {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.data)) return responseData.data;
  if (Array.isArray(responseData?.images)) return responseData.images;
  return [];
}

export async function fetchImages(searchTerm = "", page = 1, limit = 10) {
  try {
    if (searchTerm && searchTerm.trim()) {
      const res = await httpClient.get("/search", {
        skipAuth: true,
        params: {
          q: searchTerm,
          page,
          limit,
        },
      });
      return getListFromResponse(res.data);
    }

    const res = await httpClient.get("/images", {
      skipAuth: true,
      params: {
        page,
        limit,
      },
    });
    return getListFromResponse(res.data);
  } catch (error) {
    if (ALLOW_MOCK_FALLBACK) {
      await pause(200);
      const normalizedQuery = searchTerm.trim().toLowerCase();
      return normalizedQuery
        ? mockGalleryFallback.filter(
            (image) =>
              image.title.toLowerCase().includes(normalizedQuery) ||
              image.caption.toLowerCase().includes(normalizedQuery)
          )
        : mockGalleryFallback;
    }

    throw error;
  }
}

export async function createImage(payload) {
  const response = await httpClient.post("/images/upload", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

export async function addComment(imageId, comment) {
  const response = await httpClient.post(`/images/${imageId}/comments`, {
    text: comment.text,
  });
  return response.data?.data || response.data;
}

export async function submitRating(imageId, rating) {
  const response = await httpClient.post(`/images/${imageId}/rate`, {
    rating,
  });
  return response.data?.data || response.data;
}

export async function fetchImageById(imageId) {
  const response = await httpClient.get(`/images/${imageId}`, {
    skipAuth: true,
  });
  return response.data?.data || response.data;
}

export async function searchImages(query) {
  const response = await httpClient.get("/search", {
    skipAuth: true,
    params: { q: query },
  });
  return response.data.data;
}

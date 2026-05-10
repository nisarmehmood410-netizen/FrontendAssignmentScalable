import apiClient from './api/client';
import { mockImages } from '../data/mockImages';

const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const ALLOW_MOCK_FALLBACK = import.meta.env.VITE_ENABLE_MOCK_FALLBACK === 'true';

function getListFromResponse(responseData) {
  if (Array.isArray(responseData)) return responseData;
  if (Array.isArray(responseData?.data)) return responseData.data;
  if (Array.isArray(responseData?.images)) return responseData.images;
  return [];
}

// export async function fetchImages(searchTerm = '') {
//   try {
//     const response = await apiClient.get('/images', {
//       params: searchTerm ? { search: searchTerm } : {}
//     });
//     return response.data;
//   } catch (error) {
//     await pause(250);

//     const normalizedQuery = searchTerm.trim().toLowerCase();
//     const fallback = normalizedQuery
//       ? mockImages.filter(
//           (image) =>
//             image.title.toLowerCase().includes(normalizedQuery) ||
//             image.caption.toLowerCase().includes(normalizedQuery)
//         )
//       : mockImages;

//     return fallback;
//   }
// }


// ✅ NORMAL + SEARCH handled here
export async function fetchImages(searchTerm = '', page = 1, limit = 10) {
  try {
    if (searchTerm && searchTerm.trim()) {
      const res = await apiClient.get('/search', {
        skipAuth: true,
        params: {
          q: searchTerm,
          page,
          limit
        }
      });
      return getListFromResponse(res.data);
    }

    const res = await apiClient.get('/images', {
      skipAuth: true,
      params: {
        page,
        limit
      }
    });
    return getListFromResponse(res.data);
  } catch (error) {
    if (ALLOW_MOCK_FALLBACK) {
      await pause(200);
      const normalizedQuery = searchTerm.trim().toLowerCase();
      return normalizedQuery
        ? mockImages.filter(
            (image) =>
              image.title.toLowerCase().includes(normalizedQuery) ||
              image.caption.toLowerCase().includes(normalizedQuery)
          )
        : mockImages;
    }

    throw error;
  }
}
export async function createImage(payload) {
  try {
    const response = await apiClient.post('/images/upload', payload, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error; // ❗ remove fallback for real API
  }
}
export async function addComment(imageId, comment) {
  const response = await apiClient.post(`/images/${imageId}/comments`, {
    text: comment.text
  });
  return response.data?.data || response.data;
}

export async function submitRating(imageId, rating) {
  const response = await apiClient.post(`/images/${imageId}/rate`, { rating });
  return response.data?.data || response.data;
}
export async function fetchImageById(imageId) {
  const response = await apiClient.get(`/images/${imageId}`, { skipAuth: true });
  return response.data?.data || response.data;
}
export async function searchImages(query) {
  const response = await apiClient.get('/search', {
    skipAuth: true,
    params: { q: query }
  });

  // API returns { query, count, data }
  return response.data.data;
}
import { useEffect, useState } from 'react';
import { fetchImages } from '../services/imageService';
import useDebouncedValue from './useDebouncedValue';
import { resolveImageAuthor } from '../utils/helperFunctions';

function normalizePeople(people) {
  if (!people) return [];
  if (Array.isArray(people)) {
    const joined = people.join(',').trim();
    if (joined.startsWith('[') && joined.endsWith(']')) {
      try {
        const parsed = JSON.parse(joined);
        return Array.isArray(parsed) ? parsed.filter(Boolean) : people.filter(Boolean);
      } catch {
        return people
          .map((person) => String(person).replace(/^\s*"|"\s*$/g, '').replace(/^\[|\]$/g, '').trim())
          .filter(Boolean);
      }
    }
    return people
      .map((person) => String(person).replace(/^\s*"|"\s*$/g, '').replace(/^\[|\]$/g, '').trim())
      .filter(Boolean);
  }
  if (typeof people === 'string') {
    const trimmed = people.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed) ? parsed.filter(Boolean) : [trimmed];
      } catch {
        return trimmed.split(',').map((person) => person.trim()).filter(Boolean);
      }
    }
    return trimmed.split(',').map((person) => person.trim()).filter(Boolean);
  }
  return [];
}

function useImageFeed(searchTerm) {
  const debouncedSearch = useDebouncedValue(searchTerm, 300);

  const [images, setImages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let active = true;

    async function loadImages() {
      setIsLoading(true);
      setErrorMessage('');

      try {
        const data = await fetchImages(debouncedSearch);

        if (!active) return;

        // ✅ normalize backend → frontend format
        const formatted = data.map((img) => ({
          id: img._id || img.id,
          title: img.title,
          caption: img.caption,
          location: img.location,
          imageUrl: img.imageUrl || img.url || '',
          url: img.url || img.imageUrl || '',
          people: normalizePeople(img.people),
          author: resolveImageAuthor(img) || 'Unknown',
          rating: img.averageRating ?? img.rating ?? 0,
          comments: Array(img.commentCount || img.commentsCount || 0).fill({})
        }));

        setImages(formatted);
      } catch (err) {
        if (active) {
          setErrorMessage('Failed to load images.');
        }
      } finally {
        if (active) setIsLoading(false);
      }
    }

    loadImages();

    return () => {
      active = false;
    };
  }, [debouncedSearch]);

  return { images, isLoading, errorMessage };
}

export default useImageFeed;
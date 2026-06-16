import { useCallback, useEffect, useRef, useState } from 'react';
import { googleMapsClient } from '../client/googleMapsClient';
import type { PickedLocation, PlaceSuggestion } from '../types';

export interface UsePlacesAutocompleteOptions {
  debounceMs?: number;
  /** e.g. "country:in" */
  components?: string;
}

export interface UsePlacesAutocompleteResult {
  query: string;
  setQuery: (value: string) => void;
  suggestions: PlaceSuggestion[];
  loading: boolean;
  error: Error | null;
  selectSuggestion: (placeId: string) => Promise<PickedLocation | null>;
  clear: () => void;
}

function generateSessionToken(): string {
  return Math.random().toString(36).slice(2);
}

export function usePlacesAutocomplete(
  options: UsePlacesAutocompleteOptions = {},
): UsePlacesAutocompleteResult {
  const { debounceMs = 300, components } = options;

  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<PlaceSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const sessionTokenRef = useRef(generateSessionToken());

  useEffect(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clear suggestions when the query is emptied
      setSuggestions([]);
      return;
    }

    let cancelled = false;
    const timeout = setTimeout(() => {
      setLoading(true);
      setError(null);
      googleMapsClient
        .autocomplete(trimmed, { components, sessionToken: sessionTokenRef.current })
        .then((results) => {
          if (!cancelled) setSuggestions(results);
        })
        .catch((err) => {
          if (!cancelled) setError(err instanceof Error ? err : new Error('Autocomplete failed'));
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    }, debounceMs);

    return () => {
      cancelled = true;
      clearTimeout(timeout);
    };
  }, [query, debounceMs, components]);

  const selectSuggestion = useCallback(async (placeId: string) => {
    const result = await googleMapsClient.placeDetails(placeId, sessionTokenRef.current);
    sessionTokenRef.current = generateSessionToken();
    return result;
  }, []);

  const clear = useCallback(() => {
    setQuery('');
    setSuggestions([]);
  }, []);

  return { query, setQuery, suggestions, loading, error, selectSuggestion, clear };
}

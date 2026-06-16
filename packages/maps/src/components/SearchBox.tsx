import { useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { usePlacesAutocomplete } from '../hooks/usePlacesAutocomplete';
import type { PickedLocation, PlaceSuggestion } from '../types';

export interface SearchBoxProps {
  placeholder?: string;
  onSelect: (location: PickedLocation, suggestion: PlaceSuggestion) => void;
}

export function SearchBox({ placeholder = 'Search for a place', onSelect }: SearchBoxProps) {
  const { query, setQuery, suggestions, loading, selectSuggestion, clear } = usePlacesAutocomplete();
  const [resolving, setResolving] = useState(false);

  const handleSelect = async (suggestion: PlaceSuggestion) => {
    setResolving(true);
    const location = await selectSuggestion(suggestion.placeId);
    setResolving(false);
    if (location) {
      onSelect(location, suggestion);
    }
    clear();
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <TextInput value={query} onChangeText={setQuery} placeholder={placeholder} style={styles.input} />
        {(loading || resolving) && <ActivityIndicator size="small" />}
      </View>
      {suggestions.length > 0 && (
        <FlatList
          data={suggestions}
          keyExtractor={(item) => item.placeId}
          keyboardShouldPersistTaps="handled"
          style={styles.suggestions}
          renderItem={({ item }) => (
            <Pressable style={styles.suggestionRow} onPress={() => handleSelect(item)}>
              <Text style={styles.suggestionMain}>{item.mainText ?? item.description}</Text>
              {item.secondaryText && <Text style={styles.suggestionSecondary}>{item.secondaryText}</Text>}
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    zIndex: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  suggestions: {
    marginTop: 4,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    maxHeight: 220,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  suggestionRow: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomColor: '#F0F0F0',
    borderBottomWidth: 1,
  },
  suggestionMain: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1A1A1A',
  },
  suggestionSecondary: {
    fontSize: 12,
    color: '#777777',
    marginTop: 2,
  },
});

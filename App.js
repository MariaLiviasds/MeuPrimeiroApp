import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const App = () => {
  const [posts, setPosts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar posts da API
  const fetchPosts = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
      setPosts(response.data);
      setLoading(false);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os posts.');
      setLoading(false);
    }
  };

  // Função para carregar favoritos do AsyncStorage
  const loadFavorites = async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem('favorites');
      if (storedFavorites) {
        setFavorites(JSON.parse(storedFavorites));
      }
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os favoritos.');
    }
  };

  // Função para salvar favoritos no AsyncStorage
  const saveFavorites = async (newFavorites) => {
    try {
      await AsyncStorage.setItem('favorites', JSON.stringify(newFavorites));
      setFavorites(newFavorites);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível salvar o favorito.');
    }
  };

  // Função para adicionar/remover favorito
  const toggleFavorite = (postId) => {
    const isFavorite = favorites.includes(postId);
    const newFavorites = isFavorite
      ? favorites.filter((id) => id !== postId)
      : [...favorites, postId];
    saveFavorites(newFavorites);
  };

  // Carregar dados iniciais
  useEffect(() => {
    fetchPosts();
    loadFavorites();
  }, []);

  // Renderizar cada item da lista
  const renderItem = ({ item }) => {
    const isFavorite = favorites.includes(item.id);
    return (
      <View style={styles.postContainer}>
        <Text style={styles.postTitle}>{item.title}</Text>
        <Text style={styles.postBody}>{item.body}</Text>
        <TouchableOpacity
          style={[styles.favoriteButton, isFavorite ? styles.favoriteButtonActive : null]}
          onPress={() => toggleFavorite(item.id)}
        >
          <Text style={styles.favoriteButtonText}>
            {isFavorite ? 'Remover Favorito' : 'Adicionar Favorito'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lista de Posts</Text>
      <FlatList
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    paddingTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#6200EE',
  },
  list: {
    paddingHorizontal: 16,
  },
  postContainer: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  postBody: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  favoriteButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignItems: 'center',
  },
  favoriteButtonActive: {
    backgroundColor: '#B39DDB',
  },
  favoriteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default App;

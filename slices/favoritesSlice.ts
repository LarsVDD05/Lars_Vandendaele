import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, FavoritesState } from '../data/types';

const initialState: FavoritesState = {
  items: [],
};

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    toggleFavorite: (state, action: PayloadAction<Product>) => {
      const index = state.items.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.items.splice(index, 1);
      } else {
        state.items.push(action.payload);
      }
    },
    
    addFavorite: (state, action: PayloadAction<Product>) => {
      if (!state.items.find(item => item.id === action.payload.id)) {
        state.items.push(action.payload);
      }
    },
    
    removeFavorite: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
    
    clearFavorites: (state) => {
      state.items = [];
    },
  },
});

export const { 
  toggleFavorite, 
  addFavorite, 
  removeFavorite, 
  clearFavorites 
} = favoritesSlice.actions;

export const selectFavorites = (state: { favorites: FavoritesState }) => state.favorites.items;
export const selectIsFavorite = (id: number) => (state: { favorites: FavoritesState }) =>
  state.favorites.items.some(item => item.id === id);

export default favoritesSlice.reducer;
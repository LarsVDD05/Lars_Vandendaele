import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import themeReducer from './slices/themeSlice';
import favoritesReducer from './slices/favoritesSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    theme: themeReducer,
    favorites: favoritesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
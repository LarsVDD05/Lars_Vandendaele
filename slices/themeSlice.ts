import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ThemeMode, ThemeState } from '../data/types';

const initialState: ThemeState = {
  mode: 'light',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
    },
    
    loadTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.mode = action.payload;
    },
  },
});

export const { toggleTheme, setTheme, loadTheme } = themeSlice.actions;
export const selectThemeMode = (state: { theme: ThemeState }) => state.theme.mode;
export default themeSlice.reducer;
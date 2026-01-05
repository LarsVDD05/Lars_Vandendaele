import { useMemo, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectThemeMode, toggleTheme, setTheme } from '../slices/themeSlice';
import { colors } from '../data/types/colors';
import { ThemeMode } from '../data/types';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useTheme = () => {
  const dispatch = useDispatch();
  const mode = useSelector(selectThemeMode);
  
  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        console.log('Loaded saved theme:', savedTheme);
        if (savedTheme === 'light' || savedTheme === 'dark') {
          dispatch(setTheme(savedTheme));
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };
    
    loadSavedTheme();
  }, [dispatch]);
  
  const themeColors = useMemo(() => colors[mode], [mode]);
  
  const handleToggleTheme = useCallback(async () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    
    dispatch(toggleTheme());
    
    try {
      await AsyncStorage.setItem('theme', newMode);
      console.log('Saved theme to AsyncStorage:', newMode);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }, [dispatch, mode]);
  
  const handleSetTheme = useCallback(async (theme: ThemeMode) => {
    dispatch(setTheme(theme));
    
    try {
      await AsyncStorage.setItem('theme', theme);
      console.log('Saved theme to AsyncStorage:', theme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }, [dispatch]);
  
  return {
    mode,
    colors: themeColors,
    toggleTheme: handleToggleTheme,
    setTheme: handleSetTheme,
  };
};
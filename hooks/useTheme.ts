import { useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectThemeMode, toggleTheme, setTheme } from '../slices/themeSlice';
import { colors } from '../data/types/colors';
import { ThemeMode } from '../data/types';

export const useTheme = () => {
  const dispatch = useDispatch();
  const mode = useSelector(selectThemeMode);
  
  const themeColors = useMemo(() => colors[mode], [mode]);
  
  const handleToggleTheme = useCallback(() => {
    dispatch(toggleTheme());
  }, [dispatch]);
  
  const handleSetTheme = useCallback((theme: ThemeMode) => {
    dispatch(setTheme(theme));
  }, [dispatch]);
  
  return {
    mode,
    colors: themeColors,
    toggleTheme: handleToggleTheme,
    setTheme: handleSetTheme,
  };
};
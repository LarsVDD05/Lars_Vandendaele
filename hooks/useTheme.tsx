import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectThemeMode, toggleTheme, setTheme } from '../slices/themeSlice';
import { colors } from '../data/types/colors';
import { ThemeMode } from '../data/types';

export const useTheme = () => {
  const dispatch = useDispatch();
  const mode = useSelector(selectThemeMode);
  
  const themeColors = useMemo(() => colors[mode], [mode]);
  
  return {
    mode,
    colors: themeColors,
    toggleTheme: () => dispatch(toggleTheme()),
    setTheme: (theme: ThemeMode) => dispatch(setTheme(theme)),
  };
};
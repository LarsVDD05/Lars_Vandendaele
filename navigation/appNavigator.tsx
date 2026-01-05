import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setTheme } from '../slices/themeSlice';
import TabNavigator from './tabNavigator';
import { useTheme } from '../hooks/useTheme';
import { ThemeMode } from '../data/types';

const AppNavigator: React.FC = () => {
  const dispatch = useDispatch();
  const { colors } = useTheme();

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('theme');
        if (savedTheme === 'light' || savedTheme === 'dark') {
          dispatch(setTheme(savedTheme as ThemeMode));
        }
      } catch (error) {
        console.error('Error loading theme:', error);
      }
    };

    loadTheme();
  }, [dispatch]);

  return (
    <NavigationContainer
      theme={{
        dark: false,
        colors: {
          primary: colors.primary,
          background: colors.background,
          card: colors.card,
          text: colors.text,
          border: colors.border,
          notification: colors.primary,
        },
        fonts: {
          regular: {
            fontFamily: 'System',
            fontWeight: '400',
          },
          medium: {
            fontFamily: 'System',
            fontWeight: '500',
          },
          bold: {
            fontFamily: 'System',
            fontWeight: '700',
          },
          heavy: {
            fontFamily: 'System',
            fontWeight: '900',
          },
        },
      }}
    >
      <TabNavigator />
    </NavigationContainer>
  );
};

export default AppNavigator;
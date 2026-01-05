import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ProductListScreen from '../screens/productListScreen';
import ProductDetailScreen from '../screens/productDetailScreen';
import { useTheme } from '../hooks/useTheme';
import { HomeStackParamList } from '../data/types/navigation';

const Stack = createNativeStackNavigator<HomeStackParamList>();

const HomeStack: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.card,
        },
        headerTintColor: colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen 
        name="ProductList" 
        component={ProductListScreen}
        options={{ title: 'Producten' }}
      />
      <Stack.Screen 
        name="ProductDetail" 
        component={ProductDetailScreen}
        options={{ title: 'Product Details' }}
      />
    </Stack.Navigator>
  );
};

export default HomeStack;
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useTheme } from '../hooks/useTheme';
import { HomeStackParamList } from '../data/types/navigation';

type DetailScreenRouteProp = RouteProp<HomeStackParamList, 'ProductDetail'>;

const ProductDetailScreen: React.FC = () => {
  const route = useRoute<DetailScreenRouteProp>();
  const { productId } = route.params;
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={{ color: colors.text }}>Product Detail Screen</Text>
      <Text style={{ color: colors.textSecondary }}>
        Product ID: {productId}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductDetailScreen;
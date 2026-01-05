import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { toggleFavorite, selectIsFavorite } from '../slices/favoritesSlice';
import { addToCart } from '../slices/cartSlice';
import { useTheme } from '../hooks/useTheme';
import { Product } from '../data/types';
import { HomeStackParamList } from '../data/types/navigation';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2;

interface ProductCardProps {
  product: Product;
}

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useDispatch();
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();
  const isFavorite = useSelector(selectIsFavorite(product.id));

  const handlePress = () => {
    navigation.navigate('ProductDetail', { productId: product.id });
  };

  const handleFavoritePress = () => {
    dispatch(toggleFavorite(product));
  };

  const handleAddToCart = () => {
    dispatch(addToCart(product));
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.card }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.thumbnail }}
          style={styles.image}
          resizeMode="cover"
        />
        
        <TouchableOpacity
          style={[styles.favoriteButton, { backgroundColor: colors.background }]}
          onPress={handleFavoritePress}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={20}
            color={isFavorite ? colors.error : colors.textSecondary}
          />
        </TouchableOpacity>
        
        {product.discountPercentage > 0 && (
          <View style={[styles.discountBadge, { backgroundColor: colors.success }]}>
            <Text style={styles.discountText}>
              -{Math.round(product.discountPercentage)}%
            </Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text 
          style={[styles.title, { color: colors.text }]} 
          numberOfLines={2}
        >
          {product.title}
        </Text>
        
        <Text 
          style={[styles.category, { color: colors.textSecondary }]} 
          numberOfLines={1}
        >
          {product.category}
        </Text>
        
        <View style={styles.ratingContainer}>
          <Ionicons name="star" size={14} color={colors.rating} />
          <Text style={[styles.rating, { color: colors.text }]}>
            {product.rating.toFixed(1)}
          </Text>
          <Text style={[styles.stock, { color: colors.textSecondary }]}>
            • {product.stock} left
          </Text>
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color: colors.text }]}>
            €{product.price.toFixed(2)}
          </Text>
          
          {product.discountPercentage > 0 && (
            <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>
              €{(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
            </Text>
          )}
        </View>
        
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: colors.primary }]}
          onPress={handleAddToCart}
          hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
        >
          <Ionicons name="cart-outline" size={16} color="#FFFFFF" />
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    height: CARD_WIDTH,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    lineHeight: 18,
    height: 36,
  },
  category: {
    fontSize: 12,
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 12,
    marginLeft: 4,
    marginRight: 8,
  },
  stock: {
    fontSize: 11,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 6,
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default ProductCard;
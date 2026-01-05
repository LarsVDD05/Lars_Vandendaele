import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';

import { useProduct } from '../hooks/useProducts';
import { useTheme } from '../hooks/useTheme';
import { addToCart } from '../slices/cartSlice';
import { toggleFavorite, selectIsFavorite } from '../slices/favoritesSlice';
import { HomeStackParamList } from '../data/types/navigation';

type DetailScreenRouteProp = RouteProp<HomeStackParamList, 'ProductDetail'>;

const { width } = Dimensions.get('window');
const IMAGE_HEIGHT = width * 0.4;

const ProductDetailScreen: React.FC = () => {
  const route = useRoute<DetailScreenRouteProp>();
  const { productId } = route.params;
  const dispatch = useDispatch();
  const { colors } = useTheme();

  const { data: product, isLoading, error } = useProduct(productId);
  const isFavorite = useSelector(selectIsFavorite(productId));

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart(product));
    }
  };

  const handleToggleFavorite = () => {
    if (product) {
      dispatch(toggleFavorite(product));
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Loading product details...
        </Text>
      </View>
    );
  }

  if (error || !product) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle" size={64} color={colors.error} />
        <Text style={[styles.errorText, { color: colors.error }]}>
          Failed to load product
        </Text>
        <Text style={[styles.errorSubtext, { color: colors.textSecondary }]}>
          Please try again later
        </Text>
      </View>
    );
  }

  const originalPrice = product.discountPercentage > 0
    ? product.price / (1 - product.discountPercentage / 100)
    : null;

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={styles.imageCarousel}
      >
        {product.images.map((image, index) => (
          <Image
            key={index}
            source={{ uri: image }}
            style={styles.productImage}
            resizeMode="cover"
          />
        ))}
      </ScrollView>

      <View style={[styles.infoCard, { backgroundColor: colors.card }]}>
        <View style={styles.headerRow}>
          <Text style={[styles.title, { color: colors.text }]}>
            {product.title}
          </Text>
          <TouchableOpacity
            onPress={handleToggleFavorite}
            style={styles.favoriteButton}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={28}
              color={isFavorite ? colors.error : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.brandRow}>
          <Text style={[styles.brand, { color: colors.text }]}>
            {product.brand}
          </Text>
          <Text style={[styles.category, { color: colors.textSecondary }]}>
            • {product.category}
          </Text>
        </View>

        <View style={styles.ratingRow}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color={colors.rating} />
            <Text style={[styles.ratingText, { color: colors.text }]}>
              {product.rating.toFixed(1)}
            </Text>
          </View>
          <Text style={[styles.stockText, { color: colors.textSecondary }]}>
            {product.stock} items in stock
          </Text>
        </View>

        <View style={styles.priceSection}>
          <View style={styles.priceContainer}>
            <Text style={[styles.price, { color: colors.text }]}>
              €{product.price.toFixed(2)}
            </Text>
            
            {originalPrice && (
              <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>
                €{originalPrice.toFixed(2)}
              </Text>
            )}
          </View>
          
          {product.discountPercentage > 0 && (
            <View style={[styles.discountBadge, { backgroundColor: colors.success }]}>
              <Text style={styles.discountText}>
                Save {Math.round(product.discountPercentage)}%
              </Text>
            </View>
          )}
        </View>

        <View style={styles.descriptionSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Description
          </Text>
          <Text style={[styles.description, { color: colors.text }]}>
            {product.description}
          </Text>
        </View>

        <View style={styles.detailsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Product Details
          </Text>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
              Brand:
            </Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {product.brand}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
              Category:
            </Text>
            <Text style={[styles.detailValue, { color: colors.text }]}>
              {product.category}
            </Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>
              Stock:
            </Text>
            <Text style={[
              styles.detailValue, 
              { color: product.stock > 0 ? colors.success : colors.error }
            ]}>
              {product.stock > 0 ? `${product.stock} available` : 'Out of stock'}
            </Text>
          </View>
        </View>
      </View>

      <View style={[styles.actionContainer, { backgroundColor: colors.card }]}>
        <TouchableOpacity
          style={[styles.addToCartButton, { 
            backgroundColor: product.stock > 0 ? colors.primary : colors.textSecondary 
          }]}
          onPress={handleAddToCart}
          disabled={product.stock === 0}
        >
          <Ionicons name="cart" size={22} color="#FFFFFF" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>
            {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  errorSubtext: {
    fontSize: 14,
    marginTop: 8,
  },
  imageCarousel: {
    height: IMAGE_HEIGHT,
    marginTop: 10,
  },
  productImage: {
    width: width,
    height: IMAGE_HEIGHT,
  },
  infoCard: {
    marginTop: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 16,
    lineHeight: 26,
  },
  favoriteButton: {
    padding: 4,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  brand: {
    fontSize: 15,
    fontWeight: '600',
  },
  category: {
    fontSize: 15,
    marginLeft: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 15,
    marginLeft: 6,
  },
  stockText: {
    fontSize: 14,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 28,
    fontWeight: 'bold',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 18,
    textDecorationLine: 'line-through',
  },
  discountBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  discountText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  descriptionSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
  },
  detailsSection: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 15,
    width: 70,
  },
  detailValue: {
    fontSize: 15,
    flex: 1,
    fontWeight: '500',
  },
  actionContainer: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
    padding: 16,
    borderRadius: 12,
  },
  addToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 10,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '600',
  },
});

export default ProductDetailScreen;
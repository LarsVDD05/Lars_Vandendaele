import React, { useState } from 'react';
import {
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useProducts } from '../hooks/useProducts';
import { useDebounce } from '../hooks/useDebounce';
import { useTheme } from '../hooks/useTheme';
import { selectCartItemCount } from '../slices/cartSlice';
import { addToCart } from '../slices/cartSlice';
import { toggleFavorite } from '../slices/favoritesSlice';
import { Product } from '../data/types';
import { HomeStackParamList, TabParamList } from '../data/types/navigation';

type NavigationProp = NativeStackNavigationProp<HomeStackParamList>;

const ProductListScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebounce(searchQuery, 500);
  const navigation = useNavigation<NavigationProp>();
  const tabNavigation = useNavigation<NativeStackNavigationProp<TabParamList>>();
  const dispatch = useDispatch();
  const { colors } = useTheme();
  
  const cartItemCount = useSelector(selectCartItemCount);
  const favorites = useSelector((state: any) => state.favorites.items);
  
  const isFavorite = (id: number) => {
    return favorites.some((item: Product) => item.id === id);
  };

  const {
    data,
    isLoading,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useProducts(debouncedSearch);

  const products = data?.pages.flatMap(page => page.products) || [];

  const handleCartPress = () => {
    tabNavigation.navigate('Cart');
  };

  const renderProductCard = ({ item }: { item: Product }) => {
    const favorite = isFavorite(item.id);
    
    return (
      <TouchableOpacity
        style={[styles.productCard, { backgroundColor: colors.card }]}
        onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
        activeOpacity={0.7}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.thumbnail }}
            style={styles.productImage}
            resizeMode="cover"
          />
          
          <TouchableOpacity
            style={[styles.favoriteButton, { backgroundColor: colors.background }]}
            onPress={() => dispatch(toggleFavorite(item))}
          >
            <Ionicons
              name={favorite ? 'heart' : 'heart-outline'}
              size={18}
              color={favorite ? colors.error : colors.text}
            />
          </TouchableOpacity>
          
          {item.discountPercentage > 0 && (
            <View style={[styles.discountBadge, { backgroundColor: colors.success }]}>
              <Text style={styles.discountText}>
                -{Math.round(item.discountPercentage)}%
              </Text>
            </View>
          )}
        </View>

        <View style={styles.productInfo}>
          <Text style={[styles.productTitle, { color: colors.text }]} numberOfLines={2}>
            {item.title}
          </Text>
          
          <Text style={[styles.productCategory, { color: colors.textSecondary }]}>
            {item.category}
          </Text>
          
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={12} color={colors.rating} />
            <Text style={[styles.rating, { color: colors.text }]}>
              {item.rating.toFixed(1)}
            </Text>
            <Text style={[styles.stock, { color: colors.textSecondary }]}>
              • {item.stock} left
            </Text>
          </View>
          
          <View style={styles.priceContainer}>
            <View>
              <Text style={[styles.price, { color: colors.text }]}>
                €{item.price.toFixed(2)}
              </Text>
              {item.discountPercentage > 0 && (
                <Text style={[styles.originalPrice, { color: colors.textSecondary }]}>
                  €{(item.price / (1 - item.discountPercentage / 100)).toFixed(2)}
                </Text>
              )}
            </View>
            
            <TouchableOpacity
              style={[styles.cartButton, { backgroundColor: colors.primary }]}
              onPress={() => dispatch(addToCart(item))}
            >
              <Ionicons name="cart-outline" size={16} color="#FFFFFF" />
              <Text style={styles.cartButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading && !isRefetching) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.text }]}>
          Loading products...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centerContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="alert-circle" size={64} color={colors.error} />
        <Text style={[styles.errorText, { color: colors.error }]}>
          Failed to load products
        </Text>
        <Text style={[styles.errorSubtext, { color: colors.textSecondary }]}>
          Please check your internet connection
        </Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: colors.primary }]}
          onPress={() => refetch()}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>
          <Ionicons 
            name="search" 
            size={20} 
            color={colors.textSecondary} 
            style={styles.searchIcon}
          />
          <TextInput
            style={[styles.searchInput, { color: colors.text }]}
            placeholder="Search products..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            returnKeyType="search"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.cartContainer}
          onPress={handleCartPress}
        >
          <Ionicons name="cart" size={24} color={colors.primary} />
          {cartItemCount > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.error }]}>
              <Text style={styles.badgeText}>
                {cartItemCount > 99 ? '99+' : cartItemCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        renderItem={renderProductCard}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={colors.primary}
            colors={[colors.primary]}
          />
        }
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={
          <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
            <Ionicons 
              name="search-outline" 
              size={48} 
              color={colors.textSecondary} 
            />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              {searchQuery 
                ? `No products found for "${searchQuery}"`
                : 'No products available'
              }
            </Text>
            <TouchableOpacity
              style={[styles.retryButton, { backgroundColor: colors.primary }]}
              onPress={() => refetch()}
            >
              <Text style={styles.retryButtonText}>Refresh</Text>
            </TouchableOpacity>
          </View>
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <View style={styles.footer}>
              <ActivityIndicator size="small" color={colors.primary} />
              <Text style={[styles.footerText, { color: colors.textSecondary }]}>
                Loading more products...
              </Text>
            </View>
          ) : null
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    padding: 0,
  },
  cartContainer: {
    position: 'relative',
    padding: 8,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  productCard: {
    width: '48%',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
  },
  imageContainer: {
    position: 'relative',
    height: 150,
  },
  productImage: {
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
  productInfo: {
    padding: 12,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    height: 36,
  },
  productCategory: {
    fontSize: 12,
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  originalPrice: {
    fontSize: 12,
    textDecorationLine: 'line-through',
    marginTop: 2,
  },
  cartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  cartButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 12,
    marginBottom: 24,
    textAlign: 'center',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    marginTop: 8,
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProductListScreen;
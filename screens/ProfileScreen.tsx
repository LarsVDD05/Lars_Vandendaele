import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTheme } from '../hooks/useTheme';
import { Product } from '../data/types';
import { TabParamList, HomeStackParamList } from '../data/types/navigation';

type NavigationProp = NativeStackNavigationProp<TabParamList>;

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();
  const { colors, mode } = useTheme();

  const cartItems = useSelector((state: any) => state.cart.items);
  const itemCount = useSelector((state: any) => 
    state.cart.items.reduce((total: number, item: any) => total + item.quantity, 0)
  );
  const subtotal = useSelector((state: any) =>
    state.cart.items.reduce((total: number, item: any) => total + (item.price * item.quantity), 0)
  );

  const favorites = useSelector((state: any) => state.favorites.items);

  const handleGoToCart = () => {
    navigation.navigate('Cart');
  };

  const handleToggleTheme = () => {
    dispatch({ type: 'theme/toggleTheme' });
  };

  const handleClearFavorites = () => {
    if (favorites.length === 0) return;
    
    if (window.confirm('Are you sure you want to clear all favorites?')) {
      dispatch({ type: 'favorites/clearFavorites' });
    }
  };

  const handleProductPress = (productId: number) => {
    navigation.navigate('Home');
    
    setTimeout(() => {
      (navigation as any)?.navigate('HomeStack', { 
        screen: 'ProductDetail', 
        params: { productId } 
      });
    }, 100);
  };

  const renderCartItem = ({ item }: { item: any }) => {
    const itemTotal = item.price * item.quantity;
    
    return (
      <View style={[styles.cartItem, { backgroundColor: colors.card }]}>
        <Image
          source={{ uri: item.thumbnail }}
          style={styles.cartItemImage}
          resizeMode="cover"
        />
        
        <View style={styles.cartItemInfo}>
          <Text style={[styles.cartItemTitle, { color: colors.text }]} numberOfLines={1}>
            {item.title}
          </Text>
          <Text style={[styles.cartItemPrice, { color: colors.text }]}>
            €{item.price.toFixed(2)} × {item.quantity}
          </Text>
        </View>
        
        <View style={styles.cartItemTotalContainer}>
          <Text style={[styles.cartItemTotal, { color: colors.primary }]}>
            €{itemTotal.toFixed(2)}
          </Text>
        </View>
      </View>
    );
  };

  const renderFavoriteItem = ({ item }: { item: Product }) => {
    return (
      <TouchableOpacity
        style={[styles.favoriteItem, { backgroundColor: colors.card }]}
        onPress={() => handleProductPress(item.id)}
      >
        <Image
          source={{ uri: item.thumbnail }}
          style={styles.favoriteImage}
          resizeMode="cover"
        />
        
        <View style={styles.favoriteInfo}>
          <Text style={[styles.favoriteTitle, { color: colors.text }]} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={[styles.favoritePrice, { color: colors.text }]}>
            €{item.price.toFixed(2)}
          </Text>
          <Text style={[styles.favoriteCategory, { color: colors.textSecondary }]}>
            {item.category}
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.removeFavoriteButton}
          onPress={() => dispatch({ type: 'favorites/toggleFavorite', payload: item })}
        >
          <Ionicons name="heart" size={20} color={colors.error} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <View style={styles.profileInfo}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Ionicons name="person" size={40} color="#FFFFFF" />
          </View>
          <View style={styles.profileText}>
            <Text style={[styles.profileName, { color: colors.text }]}>
              Welcome to MiniShop!
            </Text>
            <Text style={[styles.profileEmail, { color: colors.textSecondary }]}>
              Lars Vandendaele
            </Text>
          </View>
        </View>
        
        <TouchableOpacity
          style={[styles.themeButton, { backgroundColor: colors.background }]}
          onPress={handleToggleTheme}
        >
          <Ionicons
            name={mode === 'dark' ? 'sunny' : 'moon'}
            size={24}
            color={mode === 'dark' ? colors.warning : colors.text}
          />
          <Text style={[styles.themeButtonText, { color: colors.text }]}>
            {mode === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Cart Summary
          </Text>
          <Text style={[styles.itemCount, { color: colors.textSecondary }]}>
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </Text>
        </View>
        
        {cartItems.length === 0 ? (
          <View style={styles.emptyCart}>
            <Ionicons name="cart-outline" size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              Your cart is empty
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Add products to see them here
            </Text>
          </View>
        ) : (
          <>
            <FlatList
              data={cartItems}
              renderItem={renderCartItem}
              keyExtractor={(item) => item.id.toString()}
              scrollEnabled={false}
              contentContainerStyle={styles.cartItemsList}
            />
            
            <View style={styles.totalContainer}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>
                total:
              </Text>
              <Text style={[styles.totalValue, { color: colors.text }]}>
                €{subtotal.toFixed(2)}
              </Text>
            </View>
          </>
        )}
        
        <TouchableOpacity
          style={[
            styles.goToCartButton, 
            { backgroundColor: cartItems.length > 0 ? colors.primary : colors.background }
          ]}
          onPress={handleGoToCart}
          disabled={cartItems.length === 0}
        >
          <Ionicons name="cart" size={22} color="#FFFFFF" />
          <Text style={styles.goToCartButtonText}>
            {cartItems.length > 0 ? 'Go to Cart' : 'Cart is Empty'}
          </Text>
          {cartItems.length > 0 && (
            <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
          )}
        </TouchableOpacity>
      </View>

      <View style={[styles.section, { backgroundColor: colors.card }]}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            My Favorites
          </Text>
          
          {favorites.length > 0 && (
            <TouchableOpacity
              style={styles.clearFavoritesButton}
              onPress={handleClearFavorites}
            >
              <Ionicons name="trash-outline" size={18} color={colors.error} />
              <Text style={[styles.clearFavoritesText, { color: colors.error }]}>
                Clear All
              </Text>
            </TouchableOpacity>
          )}
        </View>
        
        {favorites.length === 0 ? (
          <View style={styles.emptyFavorites}>
            <Ionicons name="heart-outline" size={48} color={colors.textSecondary} />
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
              No favorites yet
            </Text>
            <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>
              Tap the heart icon on products to add them here
            </Text>
          </View>
        ) : (
          <FlatList
            data={favorites}
            renderItem={renderFavoriteItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            contentContainerStyle={styles.favoritesList}
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    borderBottomWidth: 1,
  },
  profileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileText: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
  },
  themeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 10,
  },
  themeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    margin: 16,
    padding: 20,
    borderRadius: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemCount: {
    fontSize: 14,
  },
  emptyCart: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  cartItemsList: {
    gap: 12,
    marginBottom: 20,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  cartItemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 12,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  cartItemPrice: {
    fontSize: 13,
    color: '#666',
  },
  cartItemTotalContainer: {
    alignItems: 'flex-end',
  },
  cartItemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  goToCartButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 12,
    marginTop: 20,
  },
  goToCartButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
  },
  clearFavoritesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
  },
  clearFavoritesText: {
    fontSize: 14,
    fontWeight: '600',
  },
  emptyFavorites: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  favoritesList: {
    gap: 12,
  },
  favoriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
  },
  favoriteImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  favoriteInfo: {
    flex: 1,
  },
  favoriteTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  favoritePrice: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  favoriteCategory: {
    fontSize: 12,
  },
  removeFavoriteButton: {
    padding: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  infoText: {
    fontSize: 14,
    flex: 1,
  },
});

export default ProfileScreen;
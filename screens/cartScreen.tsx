import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { useTheme } from '../hooks/useTheme';
import { CartItem } from '../data/types';
import { TabParamList } from '../data/types/navigation';

type NavigationProp = NativeStackNavigationProp<TabParamList>;

const CartScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();
  const { colors } = useTheme();

  const cartItems = useSelector((state: any) => state.cart.items);
  const itemCount = useSelector((state: any) => 
    state.cart.items.reduce((total: number, item: CartItem) => total + item.quantity, 0)
  );
  const subtotal = useSelector((state: any) =>
    state.cart.items.reduce((total: number, item: CartItem) => total + (item.price * item.quantity), 0)
  );

  const handleIncrease = (id: number) => {
    dispatch({ type: 'cart/increaseQuantity', payload: id });
  };

  const handleDecrease = (id: number) => {
    dispatch({ type: 'cart/decreaseQuantity', payload: id });
  };

  const handleRemove = (id: number) => {
    if (window.confirm('Are you sure you want to remove this item from your cart?')) {
      dispatch({ type: 'cart/removeFromCart', payload: id });
    }
  };

  const handleClearCart = () => {
    if (cartItems.length === 0) return;
    
    if (window.confirm('Are you sure you want to remove all items from your cart?')) {
      dispatch({ type: 'cart/clearCart' });
    }
  };

  const handleContinueShopping = () => {
    navigation.navigate('Home');
  };

  const handleCheckout = () => {
    const confirmed = window.confirm(
      `Proceed to checkout with ${itemCount} items (Total: €${subtotal.toFixed(2)})?`
    );
    
    if (confirmed) {
      alert('Success\nThank you for your purchase!');
      dispatch({ type: 'cart/clearCart' });
    }
  };

  const renderCartItem = ({ item }: { item: CartItem }) => {
    const itemTotal = item.price * item.quantity;
    
    return (
      <View style={[styles.cartItem, { backgroundColor: colors.card }]}>
        <Image
          source={{ uri: item.thumbnail }}
          style={styles.itemImage}
          resizeMode="cover"
        />

        <View style={styles.itemInfo}>
          <Text style={[styles.itemTitle, { color: colors.text }]} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={[styles.itemBrand, { color: colors.textSecondary }]}>
            {item.brand}
          </Text>
          
          <Text style={[styles.itemPrice, { color: colors.text }]}>
            €{item.price.toFixed(2)} each
          </Text>
          <Text style={[styles.itemTotal, { color: colors.primary }]}>
            Total: €{itemTotal.toFixed(2)}
          </Text>
        </View>

        <View style={styles.quantityControls}>
          <TouchableOpacity
            style={[styles.quantityButton, { borderColor: colors.border }]}
            onPress={() => handleDecrease(item.id)}
          >
            <Ionicons name="remove" size={20} color={colors.text} />
          </TouchableOpacity>
          
          <Text style={[styles.quantityText, { color: colors.text }]}>
            {item.quantity}
          </Text>
          
          <TouchableOpacity
            style={[styles.quantityButton, { borderColor: colors.border }]}
            onPress={() => handleIncrease(item.id)}
          >
            <Ionicons name="add" size={20} color={colors.text} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemove(item.id)}
          >
            <Ionicons name="trash-outline" size={22} color={colors.error} />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (cartItems.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="cart-outline" size={96} color={colors.textSecondary} />
        <Text style={[styles.emptyTitle, { color: colors.text }]}>
          Your cart is empty
        </Text>
        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
          Add some products to get started!
        </Text>
        
        <TouchableOpacity
          style={[styles.continueButton, { backgroundColor: colors.primary }]}
          onPress={handleContinueShopping}
        >
          <Ionicons name="storefront-outline" size={20} color="#FFFFFF" />
          <Text style={styles.continueButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { backgroundColor: colors.card }]}>
        <View style={styles.headerContent}>
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            Your Cart
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            {itemCount} {itemCount === 1 ? 'item' : 'items'}
          </Text>
        </View>
        
        {cartItems.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={handleClearCart}
          >
            <Ionicons name="trash-outline" size={22} color={colors.error} />
            <Text style={[styles.clearButtonText, { color: colors.error }]}>
              Clear All
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={cartItems}
        renderItem={renderCartItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={[styles.summary, { backgroundColor: colors.card }]}>
        <Text style={[styles.summaryTitle, { color: colors.text }]}>
          Order Summary
        </Text>
        
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
            Items ({itemCount})
          </Text>
          <Text style={[styles.summaryValue, { color: colors.text }]}>
            €{subtotal.toFixed(2)}
          </Text>
        </View>
        
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.textSecondary }]}>
            Shipping
          </Text>
          <Text style={[styles.summaryValue, { color: colors.success }]}>
            Free
          </Text>
        </View>
        
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        
        <View style={styles.summaryRow}>
          <Text style={[styles.totalLabel, { color: colors.text }]}>
            Total
          </Text>
          <Text style={[styles.totalValue, { color: colors.text }]}>
            €{subtotal.toFixed(2)}
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.checkoutButton, { backgroundColor: colors.primary }]}
          onPress={handleCheckout}
        >
          <Ionicons name="card-outline" size={22} color="#FFFFFF" />
          <Text style={styles.checkoutButtonText}>
            Proceed to Checkout
          </Text>
          <Text style={styles.checkoutAmount}>
            €{subtotal.toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
  },
  continueButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 10,
    gap: 10,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
  },
  clearButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemBrand: {
    fontSize: 14,
    marginBottom: 8,
  },
  itemPrice: {
    fontSize: 14,
    marginBottom: 4,
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quantityControls: {
    alignItems: 'center',
    marginLeft: 12,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  removeButton: {
    padding: 6,
  },
  summary: {
    padding: 20,
    borderTopWidth: 1,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 20,
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginLeft: 12,
  },
  checkoutAmount: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default CartScreen;
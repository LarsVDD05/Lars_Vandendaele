import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Provider } from 'react-redux';
import { QueryProvider } from './components/queryProvider';
import { useTheme } from './hooks/useTheme';
import { useProducts } from './hooks/useProducts';
import { store } from './store';

function TestComponent() {
  const { mode, colors, toggleTheme } = useTheme();
  const { data, isLoading, error, refetch } = useProducts();

  const productCount = data?.pages[0]?.products?.length || 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={{ color: colors.text }}>MiniShop - React Native App</Text>
      <Text style={{ color: colors.text }}>Theme: {mode}</Text>
      
      <Button 
        title="Toggle Theme" 
        onPress={toggleTheme}
        color={colors.primary}
      />
      
      <View style={styles.testSection}>
        <Text style={{ color: colors.text, fontWeight: 'bold' }}>
          API Test (jouw fetch API):
        </Text>
        
        {isLoading && (
          <Text style={{ color: colors.textSecondary }}>Loading products...</Text>
        )}
        
        {error && (
          <Text style={{ color: colors.error }}>
            Error: {(error as Error).message}
          </Text>
        )}
        
        {data && (
          <>
            <Text style={{ color: colors.text }}>
              Products loaded: {productCount}
            </Text>
            {productCount > 0 && (
              <Text style={{ color: colors.textSecondary }}>
                First product: {data.pages[0].products[0].title}
              </Text>
            )}
          </>
        )}
        
        <Button 
          title="Refetch Products" 
          onPress={() => refetch()}
          color={colors.secondary}
        />
      </View>
      
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
    </View>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <QueryProvider>
        <TestComponent />
      </QueryProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  testSection: {
    marginTop: 30,
    alignItems: 'center',
    gap: 10,
  },
});
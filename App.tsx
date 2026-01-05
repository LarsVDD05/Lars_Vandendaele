import React from 'react';
import { Provider } from 'react-redux';
import { QueryProvider } from './components/queryProvider';
import AppNavigator from './navigation/appNavigator';
import { store } from './store';

export default function App() {
  return (
    <Provider store={store}>
      <QueryProvider>
        <AppNavigator />
      </QueryProvider>
    </Provider>
  );
}
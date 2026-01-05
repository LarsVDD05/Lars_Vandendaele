import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type RootStackParamList = {
  Tabs: undefined;
  ProductDetail: { productId: number };
};

export type TabParamList = {
  Home: undefined;
  Cart: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  ProductList: undefined;
  ProductDetail: { productId: number };
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = 
  NativeStackScreenProps<RootStackParamList, T>;

export type TabScreenProps<T extends keyof TabParamList> = 
  NativeStackScreenProps<TabParamList, T>;

export type HomeStackScreenProps<T extends keyof HomeStackParamList> = 
  NativeStackScreenProps<HomeStackParamList, T>;
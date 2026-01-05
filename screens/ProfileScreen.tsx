import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useTheme } from '../hooks/useTheme';

const ProfileScreen: React.FC = () => {
  const { mode, colors, toggleTheme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={{ color: colors.text }}>Profile Screen</Text>
      <Text style={{ color: colors.textSecondary }}>Theme: {mode}</Text>
      
      <View style={styles.section}>
        <Button 
          title="Toggle Theme" 
          onPress={toggleTheme}
          color={colors.primary}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginTop: 20,
  },
});

export default ProfileScreen;
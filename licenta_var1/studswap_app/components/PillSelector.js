import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';

export default function PillSelector({ label, options, selectedValue, onSelect }) {
  const { colors } = useTheme();
  const styles = getStyles(colors);

  return (
    <View>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <View style={styles.pillsContainer}>
        {options.map(option => {
          const isActive = selectedValue === option;
          return (
            <TouchableOpacity
              key={option}
              style={[styles.pill, isActive && styles.pillActive]}
              onPress={() => onSelect(option)}
            >
              <Text style={[styles.pillText, isActive && styles.pillTextActive]}>
                {option}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const getStyles = (colors) => StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: 10,
    marginTop: 5,
  },
  pillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 20,
  },
  pill: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    backgroundColor: colors.surface,
  },
  pillActive: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  pillText: {
    color: colors.textDark,
    fontSize: 14,
  },
  pillTextActive: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});
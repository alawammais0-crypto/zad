import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, typography, spacing } from '../../theme';
import { fastFoodCategories, FastFoodCategory } from '../../data/fastfoodData';

interface CategorySectionProps {
  onCategoryPress?: (category: FastFoodCategory) => void;
  selectedCategoryId?: string;
}

export function CategorySection({ onCategoryPress, selectedCategoryId }: CategorySectionProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: spacing.lg, paddingVertical: spacing.xs }}
    >
      {fastFoodCategories.map((cat) => {
        const isSelected = selectedCategoryId === cat.id;
        const isGold = cat.color === 'gold';
        const borderColor = isSelected
          ? colors.primary
          : isGold
          ? colors['secondary-container']
          : colors['primary-container'];

        return (
          <TouchableOpacity
            key={cat.id}
            onPress={() => onCategoryPress?.(cat)}
            activeOpacity={0.7}
            style={{ alignItems: 'center', gap: spacing.xs }}
          >
            <View
              style={{
                width: 76,
                height: 76,
                borderRadius: 38,
                backgroundColor: isSelected ? colors.primary : colors['surface-container-lowest'],
                borderWidth: isSelected ? 3 : 2,
                borderColor: borderColor,
                padding: spacing.xs,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: isSelected ? 0.2 : 0.04,
                shadowRadius: 6,
                elevation: isSelected ? 3 : 1,
              }}
            >
              <View
                style={{
                  flex: 1,
                  borderRadius: 34,
                  backgroundColor: isSelected
                    ? 'rgba(255,255,255,0.15)'
                    : colors['surface-container-low'],
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MaterialCommunityIcons
                  name={cat.iconName}
                  size={32}
                  color={
                    isSelected
                      ? colors['on-primary']
                      : isGold
                      ? colors.secondary
                      : colors.primary
                  }
                />
              </View>
            </View>
            <Text
              style={[
                typography['label-md'],
                {
                  color: isSelected ? colors.primary : colors['on-surface'],
                  fontWeight: isSelected ? '800' : '700',
                },
              ]}
            >
              {cat.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}


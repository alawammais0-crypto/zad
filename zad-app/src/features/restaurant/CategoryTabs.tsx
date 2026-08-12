import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { colors, typography, spacing } from '../../theme';

interface CategoryTabsProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryTabs({ categories, activeCategory, onCategoryChange }: CategoryTabsProps) {
  return (
    <View style={{ borderBottomWidth: 1, borderBottomColor: colors['surface-variant'] }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing['container-margin'], gap: spacing.lg }}
      >
        {categories.map((cat) => {
          const isActive = cat === activeCategory;
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => onCategoryChange(cat)}
              style={{ paddingVertical: spacing.base, position: 'relative' }}
            >
              <Text
                style={[
                  typography['label-md'],
                  { color: isActive ? colors.primary : colors['on-surface-variant'], fontWeight: isActive ? '700' : '500' },
                ]}
              >
                {cat}
              </Text>
              {isActive && (
                <View
                  style={{
                    position: 'absolute',
                    bottom: -1,
                    left: 0,
                    right: 0,
                    height: 3,
                    backgroundColor: colors.primary,
                    borderRadius: 9999,
                  }}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

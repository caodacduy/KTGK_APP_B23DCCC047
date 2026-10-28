import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { colors } from '../theme/colors';
import { borderRadius, spacing, typography } from '../theme/spacing';
import { BookCategory, CATEGORIES } from '../types';

export type CategoryFilterType = 'Tất cả' | BookCategory;

interface CategoryFilterProps {
  selectedCategory: CategoryFilterType;
  onSelectCategory: (category: CategoryFilterType) => void;
}

const ALL_FILTER_OPTIONS: CategoryFilterType[] = ['Tất cả', ...CATEGORIES];

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}>
        {ALL_FILTER_OPTIONS.map(category => {
          const isSelected = selectedCategory === category;
          return (
            <TouchableOpacity
              key={category}
              activeOpacity={0.7}
              onPress={() => onSelectCategory(category)}
              style={[
                styles.filterButton,
                isSelected ? styles.filterButtonActive : styles.filterButtonInactive,
              ]}>
              <Text
                style={[
                  styles.filterText,
                  isSelected ? styles.filterTextActive : styles.filterTextInactive,
                ]}>
                {category}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: spacing.sm,
  },
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    gap: spacing.sm,
    flexDirection: 'row',
  },
  filterButton: {
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md + 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterButtonInactive: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  filterText: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
  filterTextActive: {
    color: colors.textInverse,
    fontWeight: '700',
  },
  filterTextInactive: {
    color: colors.textSecondary,
  },
});

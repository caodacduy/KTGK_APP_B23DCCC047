import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { colors } from '../theme/colors';
import { borderRadius, shadows, spacing, typography } from '../theme/spacing';
import { Book } from '../types';

interface BookCardProps {
  book: Book;
  onPress: () => void;
  onLongPress: () => void;
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  onPress,
  onLongPress,
}) => {
  const remaining = book.quantity - book.borrowed;
  const isOutOfStock = remaining <= 0;
  const categoryStyle = colors.categories[book.category] || {
    bg: '#E2E8F0',
    text: '#475569',
    border: '#CBD5E1',
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      onLongPress={onLongPress}
      style={[styles.card, shadows.card]}>
      {/* Category badge & Year */}
      <View style={styles.topRow}>
        <View
          style={[
            styles.categoryBadge,
            { backgroundColor: categoryStyle.bg, borderColor: categoryStyle.border },
          ]}>
          <Text style={[styles.categoryText, { color: categoryStyle.text }]}>
            {book.category}
          </Text>
        </View>

        <Text style={styles.yearText}>Năm {book.year}</Text>
      </View>

      {/* Main Title */}
      <Text style={styles.title} numberOfLines={2}>
        {book.title}
      </Text>

      {/* Author */}
      <Text style={styles.author} numberOfLines={1}>
        ✍️ {book.author}
      </Text>

      {/* Divider */}
      <View style={styles.divider} />

      {/* Footer Info: Remaining & Status */}
      <View style={styles.footerRow}>
        <View style={styles.stockInfo}>
          {isOutOfStock ? (
            <View style={styles.outOfStockBadge}>
              <Text style={styles.outOfStockText}>🔴 Hết sách (0 cuốn)</Text>
            </View>
          ) : (
            <View style={styles.inStockBadge}>
              <Text style={styles.inStockText}>
                🟢 Còn lại: <Text style={styles.boldNumber}>{remaining}</Text> / {book.quantity} cuốn
              </Text>
            </View>
          )}

          {book.borrowed > 0 && (
            <Text style={styles.borrowedText}>
              (Đang mượn: {book.borrowed})
            </Text>
          )}
        </View>

        <Text style={styles.arrowIcon}>›</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs + 2,
    borderWidth: 1,
    borderColor: colors.border,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs + 2,
  },
  categoryBadge: {
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
  categoryText: {
    ...typography.bodySmall,
    fontWeight: '700',
    fontSize: 11,
  },
  yearText: {
    ...typography.bodySmall,
    color: colors.textMuted,
  },
  title: {
    ...typography.headingSmall,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  author: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceSubtle,
    marginVertical: spacing.xs,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  stockInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  outOfStockBadge: {
    backgroundColor: colors.dangerLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  outOfStockText: {
    ...typography.labelBold,
    color: colors.danger,
    fontSize: 12,
  },
  inStockBadge: {
    backgroundColor: colors.successLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  inStockText: {
    ...typography.bodySmall,
    color: colors.success,
    fontWeight: '600',
    fontSize: 12,
  },
  boldNumber: {
    fontWeight: '800',
  },
  borrowedText: {
    ...typography.bodySmall,
    color: colors.warning,
    fontSize: 12,
    fontWeight: '500',
  },
  arrowIcon: {
    fontSize: 22,
    color: colors.textMuted,
    fontWeight: '300',
  },
});

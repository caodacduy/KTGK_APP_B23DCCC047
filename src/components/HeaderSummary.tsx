import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme/colors';
import { borderRadius, shadows, spacing, typography } from '../theme/spacing';

interface HeaderSummaryProps {
  totalTitles: number;
  totalBorrowed: number;
  totalRemaining: number;
}

export const HeaderSummary: React.FC<HeaderSummaryProps> = ({
  totalTitles,
  totalBorrowed,
  totalRemaining,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerTitleRow}>
        <Text style={styles.appTitle}>📚 Quản Lý Thư Viện</Text>
        <Text style={styles.appSubtitle}>Hệ thống theo dõi mượn trả sách</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, styles.statCardTitles]}>
          <Text style={styles.statIcon}>📖</Text>
          <Text style={styles.statValue}>{totalTitles}</Text>
          <Text style={styles.statLabel}>Đầu sách</Text>
        </View>

        <View style={[styles.statCard, styles.statCardBorrowed]}>
          <Text style={styles.statIcon}>📤</Text>
          <Text style={[styles.statValue, { color: colors.warning }]}>
            {totalBorrowed}
          </Text>
          <Text style={styles.statLabel}>Đang mượn</Text>
        </View>

        <View style={[styles.statCard, styles.statCardRemaining]}>
          <Text style={styles.statIcon}>📥</Text>
          <Text style={[styles.statValue, { color: colors.success }]}>
            {totalRemaining}
          </Text>
          <Text style={styles.statLabel}>Có thể mượn</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitleRow: {
    marginBottom: spacing.md,
  },
  appTitle: {
    ...typography.headingLarge,
    color: colors.primaryDark,
  },
  appSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.subtle,
  },
  statCardTitles: {
    backgroundColor: '#F0F9FF',
    borderColor: '#BAE6FD',
  },
  statCardBorrowed: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  statCardRemaining: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
  },
  statIcon: {
    fontSize: 16,
    marginBottom: 2,
  },
  statValue: {
    ...typography.statValue,
    color: colors.primaryDark,
  },
  statLabel: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '500',
    marginTop: 2,
  },
});

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useBooks } from '../context/BookContext';
import { RootStackParamList } from '../types';
import { colors } from '../theme/colors';
import { borderRadius, shadows, spacing, typography } from '../theme/spacing';
import { CustomButton } from '../components/CustomButton';

type RouteProps = RouteProp<RootStackParamList, 'BookDetail'>;
type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'BookDetail'>;

export const BookDetailScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProps>();
  const { bookId } = route.params;
  const { getBookById, borrowBook, returnBook, deleteBook } = useBooks();

  const book = getBookById(bookId);

  if (!book) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundIcon}>❌</Text>
          <Text style={styles.notFoundTitle}>Không tìm thấy sách</Text>
          <Text style={styles.notFoundSub}>
            Cuốn sách này có thể đã bị xoá khỏi hệ thống.
          </Text>
          <CustomButton
            title="Quay lại danh sách"
            onPress={() => navigation.goBack()}
            variant="primary"
            style={styles.backBtn}
          />
        </View>
      </SafeAreaView>
    );
  }

  const remaining = book.quantity - book.borrowed;
  const canBorrow = remaining > 0;
  const canReturn = book.borrowed > 0;

  // Thao tác cho mượn sách (Câu 4)
  const handleBorrow = async () => {
    if (!canBorrow) {
      Alert.alert('Không thể cho mượn', 'Sách này hiện đã hết trong kho!');
      return;
    }
    const result = await borrowBook(book.id);
    if (result.success) {
      Alert.alert('Thành công', result.message);
    } else {
      Alert.alert('Thông báo', result.message);
    }
  };

  // Thao tác nhận trả sách (Câu 4)
  const handleReturn = async () => {
    if (!canReturn) {
      Alert.alert(
        'Không thể nhận trả',
        'Hiện không có độc giả nào đang mượn cuốn sách này!',
      );
      return;
    }
    const result = await returnBook(book.id);
    if (result.success) {
      Alert.alert('Thành công', result.message);
    } else {
      Alert.alert('Thông báo', result.message);
    }
  };

  // Thao tác xoá sách (Câu 3)
  const handleDelete = () => {
    if (book.borrowed > 0) {
      Alert.alert(
        'Không thể xoá',
        `Sách đang có ${book.borrowed} người mượn. Vui lòng nhận trả hết sách trước khi xoá!`,
      );
      return;
    }

    Alert.alert(
      'Xác nhận xoá sách',
      `Bạn có chắc chắn muốn xoá cuốn "${book.title}" khỏi thư viện?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: async () => {
            const res = await deleteBook(book.id);
            if (res.success) {
              Alert.alert('Thành công', `Đã xoá sách "${book.title}"!`, [
                { text: 'OK', onPress: () => navigation.goBack() },
              ]);
            } else if (res.message) {
              Alert.alert('Lỗi', res.message);
            }
          },
        },
      ],
    );
  };

  const categoryStyle = colors.categories[book.category] || {
    bg: '#E2E8F0',
    text: '#475569',
    border: '#CBD5E1',
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Main Card with Book Information */}
        <View style={[styles.mainCard, shadows.card]}>
          <View style={styles.badgeRow}>
            <View
              style={[
                styles.categoryBadge,
                {
                  backgroundColor: categoryStyle.bg,
                  borderColor: categoryStyle.border,
                },
              ]}>
              <Text style={[styles.categoryText, { color: categoryStyle.text }]}>
                {book.category}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                canBorrow ? styles.statusInStock : styles.statusOutOfStock,
              ]}>
              <Text
                style={[
                  styles.statusText,
                  canBorrow ? styles.statusInStockText : styles.statusOutOfStockText,
                ]}>
                {canBorrow ? '🟢 Còn sách' : '🔴 Hết sách'}
              </Text>
            </View>
          </View>

          <Text style={styles.title}>{book.title}</Text>
          <Text style={styles.author}>✍️ Tác giả: {book.author}</Text>

          <View style={styles.divider} />

          {/* Details Table */}
          <View style={styles.infoGrid}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Mã định danh (ID):</Text>
              <Text style={styles.infoValue}>{book.id}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Năm xuất bản:</Text>
              <Text style={styles.infoValue}>{book.year}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Tổng số cuốn trong kho:</Text>
              <Text style={[styles.infoValue, styles.highlightValue]}>
                {book.quantity} cuốn
              </Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Số cuốn đang mượn:</Text>
              <Text
                style={[
                  styles.infoValue,
                  { color: book.borrowed > 0 ? colors.warning : colors.textPrimary },
                ]}>
                {book.borrowed} cuốn
              </Text>
            </View>

            <View style={[styles.infoRow, styles.remainingRow]}>
              <Text style={styles.remainingLabel}>Số cuốn còn lại:</Text>
              <Text
                style={[
                  styles.remainingValue,
                  { color: canBorrow ? colors.success : colors.danger },
                ]}>
                {remaining} cuốn
              </Text>
            </View>
          </View>
        </View>

        {/* Action Panel: Cho mượn & Nhận trả (Câu 4) */}
        <View style={[styles.actionsCard, shadows.card]}>
          <Text style={styles.actionsTitle}>⚡ Nghiệp Vụ Mượn / Trả</Text>
          <Text style={styles.actionsSubtitle}>
            Thực hiện thao tác tăng hoặc giảm số lượng sách mượn
          </Text>

          <View style={styles.actionsRow}>
            {/* Nút Cho mượn (disabled khi hết sách) */}
            <View style={styles.actionCol}>
              <CustomButton
                title="Cho mượn"
                icon="📤"
                variant="primary"
                disabled={!canBorrow}
                onPress={handleBorrow}
                style={styles.actionButton}
              />
              {!canBorrow && (
                <Text style={styles.disabledHintText}>
                  Không thể mượn vì đã hết sách
                </Text>
              )}
            </View>

            {/* Nút Nhận trả (disabled khi borrowed = 0) */}
            <View style={styles.actionCol}>
              <CustomButton
                title="Nhận trả"
                icon="📥"
                variant="success"
                disabled={!canReturn}
                onPress={handleReturn}
                style={styles.actionButton}
              />
              {!canReturn && (
                <Text style={styles.disabledHintText}>
                  Không có cuốn nào đang mượn
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Secondary Management Actions: Chỉnh sửa & Xoá */}
        <View style={styles.managementButtons}>
          <CustomButton
            title="Chỉnh sửa thông tin sách"
            icon="✏️"
            variant="outline"
            onPress={() => navigation.navigate('BookForm', { bookId: book.id })}
            style={styles.editBtn}
          />

          <CustomButton
            title="Xoá sách này"
            icon="🗑️"
            variant="danger"
            onPress={handleDelete}
            style={styles.deleteBtn}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  notFoundIcon: {
    fontSize: 48,
    marginBottom: spacing.md,
  },
  notFoundTitle: {
    ...typography.headingMedium,
    color: colors.textPrimary,
  },
  notFoundSub: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginTop: spacing.xs,
    marginBottom: spacing.lg,
  },
  backBtn: {
    minWidth: 180,
  },
  mainCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  categoryBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
  categoryText: {
    ...typography.bodySmall,
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  statusInStock: {
    backgroundColor: colors.successLight,
  },
  statusOutOfStock: {
    backgroundColor: colors.dangerLight,
  },
  statusText: {
    ...typography.bodySmall,
    fontWeight: '700',
  },
  statusInStockText: {
    color: colors.success,
  },
  statusOutOfStockText: {
    color: colors.danger,
  },
  title: {
    ...typography.headingLarge,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  author: {
    ...typography.bodyLarge,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  infoGrid: {
    gap: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  infoLabel: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
  },
  infoValue: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
    fontWeight: '600',
  },
  highlightValue: {
    fontWeight: '700',
    color: colors.primaryDark,
  },
  remainingRow: {
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginTop: spacing.xs,
  },
  remainingLabel: {
    ...typography.labelBold,
    color: colors.textPrimary,
  },
  remainingValue: {
    ...typography.labelBold,
    fontSize: 16,
  },
  actionsCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.lg,
  },
  actionsTitle: {
    ...typography.headingSmall,
    color: colors.primaryDark,
  },
  actionsSubtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: spacing.lg,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionCol: {
    flex: 1,
  },
  actionButton: {
    width: '100%',
  },
  disabledHintText: {
    ...typography.bodySmall,
    fontSize: 11,
    color: colors.danger,
    marginTop: 4,
    textAlign: 'center',
  },
  managementButtons: {
    gap: spacing.md,
  },
  editBtn: {
    width: '100%',
  },
  deleteBtn: {
    width: '100%',
  },
});

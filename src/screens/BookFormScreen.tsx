import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useBooks } from '../context/BookContext';
import { BookCategory, CATEGORIES, FormErrors, RootStackParamList } from '../types';
import { colors } from '../theme/colors';
import { borderRadius, shadows, spacing, typography } from '../theme/spacing';
import { CustomInput } from '../components/CustomInput';
import { CustomButton } from '../components/CustomButton';

type RouteProps = RouteProp<RootStackParamList, 'BookForm'>;
type NavigationProps = NativeStackNavigationProp<RootStackParamList, 'BookForm'>;

export const BookFormScreen: React.FC = () => {
  const route = useRoute<RouteProps>();
  const navigation = useNavigation<NavigationProps>();
  const { addBook, updateBook, getBookById } = useBooks();

  const editingBookId = route.params?.bookId;
  const isEditing = Boolean(editingBookId);
  const existingBook = editingBookId ? getBookById(editingBookId) : undefined;

  // Form states
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState<BookCategory>('Giáo trình');
  const [year, setYear] = useState('');
  const [quantity, setQuantity] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Điền sẵn dữ liệu cũ khi ở chế độ Sửa (Câu 2)
  useEffect(() => {
    if (existingBook) {
      setTitle(existingBook.title);
      setAuthor(existingBook.author);
      setCategory(existingBook.category);
      setYear(existingBook.year.toString());
      setQuantity(existingBook.quantity.toString());
    }
  }, [existingBook]);

  // Kiểm tra tính hợp lệ của dữ liệu (Câu 2)
  const validate = (): boolean => {
    const newErrors: FormErrors = {};
    const currentYear = new Date().getFullYear();

    // 1. Không để trống tên
    if (!title.trim()) {
      newErrors.title = 'Tên sách không được để trống.';
    }

    // 2. Không để trống tác giả
    if (!author.trim()) {
      newErrors.author = 'Tác giả không được để trống.';
    }

    // 3. Năm xuất bản hợp lệ từ 1900 đến năm hiện tại
    const parsedYear = parseInt(year.trim(), 10);
    if (!year.trim() || isNaN(parsedYear) || parsedYear < 1900 || parsedYear > currentYear) {
      newErrors.year = `Năm xuất bản phải là số nguyên từ 1900 đến ${currentYear}.`;
    }

    // 4. Số lượng là số hợp lệ > 0
    const parsedQuantity = parseInt(quantity.trim(), 10);
    if (!quantity.trim() || isNaN(parsedQuantity) || parsedQuantity <= 0) {
      newErrors.quantity = 'Tổng số lượng sách phải là số nguyên lớn hơn 0.';
    } else if (isEditing && existingBook && parsedQuantity < existingBook.borrowed) {
      // Khi sửa, số lượng không được nhỏ hơn số cuốn đang mượn
      newErrors.quantity = `Số lượng không thể nhỏ hơn số cuốn đang mượn (${existingBook.borrowed} cuốn).`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      Alert.alert('Dữ liệu chưa hợp lệ', 'Vui lòng kiểm tra lại các trường báo lỗi màu đỏ.');
      return;
    }

    setIsSubmitting(true);
    const parsedYear = parseInt(year.trim(), 10);
    const parsedQuantity = parseInt(quantity.trim(), 10);

    try {
      if (isEditing && existingBook) {
        // Cập nhật sách
        const success = await updateBook({
          ...existingBook,
          title: title.trim(),
          author: author.trim(),
          category,
          year: parsedYear,
          quantity: parsedQuantity,
        });

        if (success) {
          Alert.alert('Thành công', 'Đã cập nhật thông tin sách thành công!', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        } else {
          Alert.alert('Lỗi', 'Không thể cập nhật sách, vui lòng thử lại.');
        }
      } else {
        // Thêm sách mới
        const success = await addBook({
          title: title.trim(),
          author: author.trim(),
          category,
          year: parsedYear,
          quantity: parsedQuantity,
          borrowed: 0,
        });

        if (success) {
          Alert.alert('Thành công', 'Đã thêm sách mới vào thư viện!', [
            { text: 'OK', onPress: () => navigation.goBack() },
          ]);
        } else {
          Alert.alert('Lỗi', 'Không thể thêm sách, vui lòng thử lại.');
        }
      }
    } catch {
      Alert.alert('Lỗi', 'Đã có sự cố xảy ra khi lưu sách.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom', 'left', 'right']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled">
          {/* Header Banner */}
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>
              {isEditing ? '✏️ Chỉnh Sửa Thông Tin Sách' : '📖 Thêm Sách Mới'}
            </Text>
            <Text style={styles.formSubtitle}>
              {isEditing
                ? 'Cập nhật lại thông tin sách trong cơ sở dữ liệu'
                : 'Nhập đầy đủ thông tin bên dưới để lưu vào thư viện'}
            </Text>

            {isEditing && existingBook && (
              <View style={styles.borrowNoticeBox}>
                <Text style={styles.borrowNoticeText}>
                  ℹ️ Cuốn sách này hiện đang có{' '}
                  <Text style={styles.boldText}>{existingBook.borrowed}</Text> cuốn
                  được mượn. Số lượng tối thiểu phải là{' '}
                  <Text style={styles.boldText}>{existingBook.borrowed}</Text>.
                </Text>
              </View>
            )}
          </View>

          {/* Form Fields */}
          <View style={[styles.card, shadows.card]}>
            {/* Tên sách */}
            <CustomInput
              label="Tên sách"
              required
              placeholder="Ví dụ: Lập trình di động React Native"
              value={title}
              onChangeText={text => {
                setTitle(text);
                if (errors.title) {
                  setErrors(prev => ({ ...prev, title: undefined }));
                }
              }}
              error={errors.title}
              autoCapitalize="sentences"
            />

            {/* Tác giả */}
            <CustomInput
              label="Tác giả"
              required
              placeholder="Ví dụ: Nguyễn Văn A"
              value={author}
              onChangeText={text => {
                setAuthor(text);
                if (errors.author) {
                  setErrors(prev => ({ ...prev, author: undefined }));
                }
              }}
              error={errors.author}
              autoCapitalize="words"
            />

            {/* Thể loại (Chọn chip category) */}
            <View style={styles.categoryContainer}>
              <Text style={styles.categoryLabel}>
                Thể loại <Text style={styles.requiredAsterisk}>*</Text>
              </Text>
              <View style={styles.chipRow}>
                {CATEGORIES.map(cat => {
                  const isSelected = category === cat;
                  return (
                    <TouchableOpacity
                      key={cat}
                      activeOpacity={0.7}
                      onPress={() => setCategory(cat)}
                      style={[
                        styles.chip,
                        isSelected ? styles.chipSelected : styles.chipUnselected,
                      ]}>
                      <Text
                        style={[
                          styles.chipText,
                          isSelected ? styles.chipTextSelected : styles.chipTextUnselected,
                        ]}>
                        {cat}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Năm xuất bản */}
            <CustomInput
              label="Năm xuất bản"
              required
              placeholder={`1900 - ${new Date().getFullYear()}`}
              value={year}
              onChangeText={text => {
                setYear(text);
                if (errors.year) {
                  setErrors(prev => ({ ...prev, year: undefined }));
                }
              }}
              error={errors.year}
              keyboardType="numeric"
              maxLength={4}
            />

            {/* Số lượng */}
            <CustomInput
              label="Tổng số lượng cuốn"
              required
              placeholder="Nhập số lượng > 0"
              value={quantity}
              onChangeText={text => {
                setQuantity(text);
                if (errors.quantity) {
                  setErrors(prev => ({ ...prev, quantity: undefined }));
                }
              }}
              error={errors.quantity}
              keyboardType="numeric"
            />

            {/* Action buttons */}
            <View style={styles.buttonGroup}>
              <CustomButton
                title={isEditing ? 'Lưu thay đổi' : 'Thêm sách vào kho'}
                onPress={handleSubmit}
                variant="primary"
                disabled={isSubmitting}
                style={styles.submitBtn}
              />

              <CustomButton
                title="Huỷ bỏ"
                onPress={() => navigation.goBack()}
                variant="secondary"
                style={styles.cancelBtn}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  formHeader: {
    marginBottom: spacing.md,
  },
  formTitle: {
    ...typography.headingMedium,
    color: colors.primaryDark,
  },
  formSubtitle: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginTop: 4,
  },
  borrowNoticeBox: {
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: '#FEF3C7',
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  borrowNoticeText: {
    ...typography.bodySmall,
    color: '#92400E',
    lineHeight: 18,
  },
  boldText: {
    fontWeight: '700',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryContainer: {
    marginBottom: spacing.lg,
  },
  categoryLabel: {
    ...typography.labelBold,
    color: colors.textPrimary,
    marginBottom: spacing.xs + 2,
  },
  requiredAsterisk: {
    color: colors.danger,
    fontWeight: '700',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  chip: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
  },
  chipSelected: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  chipUnselected: {
    backgroundColor: colors.surfaceSubtle,
    borderColor: colors.border,
  },
  chipText: {
    ...typography.bodySmall,
    fontWeight: '600',
  },
  chipTextSelected: {
    color: colors.primary,
    fontWeight: '700',
  },
  chipTextUnselected: {
    color: colors.textSecondary,
  },
  buttonGroup: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  submitBtn: {
    width: '100%',
  },
  cancelBtn: {
    width: '100%',
  },
});

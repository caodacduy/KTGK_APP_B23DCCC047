import React, { useState, useMemo } from 'react';
import {
  View,
  FlatList,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useBooks } from '../context/BookContext';
import { Book, RootStackParamList } from '../types';
import { colors } from '../theme/colors';
import { borderRadius, shadows, spacing, typography } from '../theme/spacing';
import { HeaderSummary } from '../components/HeaderSummary';
import { SearchBar } from '../components/SearchBar';
import {
  CategoryFilter,
  CategoryFilterType,
} from '../components/CategoryFilter';
import { BookCard } from '../components/BookCard';
import { EmptyState } from '../components/EmptyState';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'BookList'>;

export const BookListScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const { books, isLoading, deleteBook } = useBooks();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilterType>('Tất cả');

  // Tính toán thống kê theo toàn bộ danh mục sách
  const totalTitles = books.length;
  const totalBorrowed = useMemo(
    () => books.reduce((sum, b) => sum + b.borrowed, 0),
    [books],
  );
  const totalRemaining = useMemo(
    () => books.reduce((sum, b) => sum + Math.max(0, b.quantity - b.borrowed), 0),
    [books],
  );

  // Lọc và tìm kiếm hoạt động đồng thời (Câu 5)
  const filteredBooks = useMemo(() => {
    return books.filter(book => {
      // Lọc theo thể loại
      const matchesCategory =
        selectedCategory === 'Tất cả' || book.category === selectedCategory;

      // Tìm kiếm theo tên hoặc tác giả (không phân biệt hoa thường)
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        query === '' ||
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [books, searchQuery, selectedCategory]);

  // Xoá sách có hỏi xác nhận bằng Alert (Câu 3)
  const handleConfirmDelete = (book: Book) => {
    // Không cho xoá sách đang có người mượn (borrowed > 0)
    if (book.borrowed > 0) {
      Alert.alert(
        'Không thể xoá',
        `Sách "${book.title}" đang có ${book.borrowed} cuốn được mượn. Vui lòng nhận trả hết sách trước khi xoá!`,
        [{ text: 'Đã hiểu', style: 'default' }],
      );
      return;
    }

    Alert.alert(
      'Xác nhận xoá sách',
      `Bạn có chắc chắn muốn xoá cuốn sách "${book.title}"?`,
      [
        { text: 'Huỷ', style: 'cancel' },
        {
          text: 'Xoá',
          style: 'destructive',
          onPress: async () => {
            const res = await deleteBook(book.id);
            if (res.success) {
              Alert.alert('Thành công', `Đã xoá sách "${book.title}" thành công!`);
            } else if (res.message) {
              Alert.alert('Lỗi', res.message);
            }
          },
        },
      ],
    );
  };

  const renderBookItem = ({ item }: { item: Book }) => (
    <BookCard
      book={item}
      onPress={() => navigation.navigate('BookDetail', { bookId: item.id })}
      onLongPress={() => handleConfirmDelete(item)}
    />
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        {/* Header với tổng số đầu sách và số cuốn đang mượn (Câu 1) */}
        <HeaderSummary
          totalTitles={totalTitles}
          totalBorrowed={totalBorrowed}
          totalRemaining={totalRemaining}
        />

        {/* Tìm kiếm và lọc thể loại (Câu 5) */}
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          onClear={() => setSearchQuery('')}
        />

        <CategoryFilter
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* Danh sách sách (Câu 1) */}
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Đang tải dữ liệu thư viện...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredBooks}
            keyExtractor={item => item.id}
            renderItem={renderBookItem}
            contentContainerStyle={styles.listContent}
            ListEmptyComponent={
              <EmptyState
                title={
                  books.length === 0
                    ? 'Chưa có cuốn sách nào'
                    : 'Không tìm thấy kết quả'
                }
                message={
                  books.length === 0
                    ? 'Nhấn "+ Thêm sách" bên dưới để thêm sách đầu tiên.'
                    : 'Thử kiểm tra lại từ khoá tìm kiếm hoặc chọn danh mục khác.'
                }
                actionText={
                  searchQuery || selectedCategory !== 'Tất cả'
                    ? 'Xoá bộ lọc'
                    : '+ Thêm sách ngay'
                }
                onAction={() => {
                  if (searchQuery || selectedCategory !== 'Tất cả') {
                    setSearchQuery('');
                    setSelectedCategory('Tất cả');
                  } else {
                    navigation.navigate('BookForm');
                  }
                }}
              />
            }
          />
        )}

        {/* Nút nổi "+ Thêm sách" (Câu 2) */}
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.fabButton, shadows.floating]}
          onPress={() => navigation.navigate('BookForm')}>
          <Text style={styles.fabIcon}>＋</Text>
          <Text style={styles.fabText}>Thêm sách</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  listContent: {
    paddingBottom: 90, // Để không bị FAB che mất dòng cuối
  },
  fabButton: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.full,
  },
  fabIcon: {
    color: colors.textInverse,
    fontSize: 18,
    fontWeight: '700',
    marginRight: 6,
  },
  fabText: {
    ...typography.labelBold,
    color: colors.textInverse,
    fontSize: 14,
  },
});

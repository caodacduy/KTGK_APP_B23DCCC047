import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Book } from '../types';
import { INITIAL_BOOKS } from '../constants/sampleBooks';

const STORAGE_KEY = '@library_books_v1';

interface BookContextType {
  books: Book[];
  isLoading: boolean;
  addBook: (bookData: Omit<Book, 'id'>) => Promise<boolean>;
  updateBook: (updatedBook: Book) => Promise<boolean>;
  deleteBook: (id: string) => Promise<{ success: boolean; message?: string }>;
  borrowBook: (id: string) => Promise<{ success: boolean; message: string }>;
  returnBook: (id: string) => Promise<{ success: boolean; message: string }>;
  getBookById: (id: string) => Book | undefined;
  reloadBooks: () => Promise<void>;
}

const BookContext = createContext<BookContextType | undefined>(undefined);

export const BookProvider = ({ children }: { children: ReactNode }) => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Lưu sách vào AsyncStorage và đồng bộ state
  const persistBooks = async (newBooks: Book[]) => {
    try {
      setBooks(newBooks);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newBooks));
    } catch (error) {
      console.error('Lỗi khi lưu dữ liệu vào AsyncStorage:', error);
    }
  };

  // Khởi tạo dữ liệu khi mở ứng dụng
  const loadBooks = useCallback(async () => {
    try {
      setIsLoading(true);
      const rawData = await AsyncStorage.getItem(STORAGE_KEY);
      if (rawData) {
        const parsed = JSON.parse(rawData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setBooks(parsed);
          return;
        }
      }
      // Lần chạy đầu tiên hoặc chưa có dữ liệu: khởi tạo sẵn ít nhất 5 cuốn mẫu
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_BOOKS));
      setBooks(INITIAL_BOOKS);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu từ AsyncStorage:', error);
      setBooks(INITIAL_BOOKS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  // Thêm sách mới
  const addBook = async (bookData: Omit<Book, 'id'>): Promise<boolean> => {
    try {
      const newBook: Book = {
        ...bookData,
        id: Date.now().toString(),
      };
      const updated = [newBook, ...books];
      await persistBooks(updated);
      return true;
    } catch (error) {
      console.error('Lỗi khi thêm sách:', error);
      return false;
    }
  };

  // Sửa sách
  const updateBook = async (updatedBook: Book): Promise<boolean> => {
    try {
      const updated = books.map(b => (b.id === updatedBook.id ? updatedBook : b));
      await persistBooks(updated);
      return true;
    } catch (error) {
      console.error('Lỗi khi cập nhật sách:', error);
      return false;
    }
  };

  // Xoá sách (Yêu cầu: Không cho xoá sách đang có người mượn borrowed > 0)
  const deleteBook = async (
    id: string,
  ): Promise<{ success: boolean; message?: string }> => {
    const bookToDelete = books.find(b => b.id === id);
    if (!bookToDelete) {
      return { success: false, message: 'Không tìm thấy sách cần xoá!' };
    }

    if (bookToDelete.borrowed > 0) {
      return {
        success: false,
        message: `Sách "${bookToDelete.title}" đang có ${bookToDelete.borrowed} cuốn được mượn. Không thể xoá!`,
      };
    }

    const updated = books.filter(b => b.id !== id);
    await persistBooks(updated);
    return { success: true };
  };

  // Cho mượn sách (tăng borrowed)
  const borrowBook = async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    const book = books.find(b => b.id === id);
    if (!book) {
      return { success: false, message: 'Không tìm thấy sách!' };
    }

    const remaining = book.quantity - book.borrowed;
    if (remaining <= 0) {
      return { success: false, message: 'Sách đã hết, không thể cho mượn thêm!' };
    }

    const updated = books.map(b =>
      b.id === id ? { ...b, borrowed: b.borrowed + 1 } : b,
    );
    await persistBooks(updated);
    return { success: true, message: `Đã cho mượn 1 cuốn "${book.title}" thành công!` };
  };

  // Nhận trả sách (giảm borrowed)
  const returnBook = async (
    id: string,
  ): Promise<{ success: boolean; message: string }> => {
    const book = books.find(b => b.id === id);
    if (!book) {
      return { success: false, message: 'Không tìm thấy sách!' };
    }

    if (book.borrowed <= 0) {
      return { success: false, message: 'Hiện không có cuốn nào đang được mượn!' };
    }

    const updated = books.map(b =>
      b.id === id ? { ...b, borrowed: b.borrowed - 1 } : b,
    );
    await persistBooks(updated);
    return { success: true, message: `Đã nhận trả 1 cuốn "${book.title}" thành công!` };
  };

  const getBookById = (id: string): Book | undefined => {
    return books.find(b => b.id === id);
  };

  return (
    <BookContext.Provider
      value={{
        books,
        isLoading,
        addBook,
        updateBook,
        deleteBook,
        borrowBook,
        returnBook,
        getBookById,
        reloadBooks: loadBooks,
      }}>
      {children}
    </BookContext.Provider>
  );
};

export const useBooks = (): BookContextType => {
  const context = useContext(BookContext);
  if (!context) {
    throw new Error('useBooks phải được dùng bên trong BookProvider');
  }
  return context;
};

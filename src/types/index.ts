export type BookCategory = 'Giáo trình' | 'Tiểu thuyết' | 'Khoa học' | 'Thiếu nhi';

export const CATEGORIES: BookCategory[] = [
  'Giáo trình',
  'Tiểu thuyết',
  'Khoa học',
  'Thiếu nhi',
];

export interface Book {
  id: string;
  title: string;
  author: string;
  category: BookCategory;
  year: number;
  quantity: number;
  borrowed: number;
}

export type RootStackParamList = {
  BookList: undefined;
  BookDetail: { bookId: string };
  BookForm: { bookId?: string } | undefined;
};

export interface FormErrors {
  title?: string;
  author?: string;
  year?: string;
  quantity?: string;
}

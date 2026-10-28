import { Book } from '../types';

export const INITIAL_BOOKS: Book[] = [
  {
    id: '1',
    title: 'Lập trình di động với React Native',
    author: 'Nguyễn Văn A',
    category: 'Giáo trình',
    year: 2023,
    quantity: 10,
    borrowed: 4,
  },
  {
    id: '2',
    title: 'Cấu trúc dữ liệu và Giải thuật',
    author: 'Trần Thị B',
    category: 'Giáo trình',
    year: 2021,
    quantity: 5,
    borrowed: 5, // Còn lại = 0 -> Kiểm tra nhãn 'Hết sách' màu đỏ & disable Cho mượn
  },
  {
    id: '3',
    title: 'Tôi thấy hoa vàng trên cỏ xanh',
    author: 'Nguyễn Nhật Ánh',
    category: 'Tiểu thuyết',
    year: 2010,
    quantity: 8,
    borrowed: 3,
  },
  {
    id: '4',
    title: 'Vũ trụ trong vỏ hạt dẻ',
    author: 'Stephen Hawking',
    category: 'Khoa học',
    year: 2001,
    quantity: 4,
    borrowed: 1,
  },
  {
    id: '5',
    title: 'Dế Mèn phiêu lưu ký',
    author: 'Tô Hoài',
    category: 'Thiếu nhi',
    year: 1941,
    quantity: 12,
    borrowed: 0, // borrowed = 0 -> Kiểm tra disable Nhận trả
  },
  {
    id: '6',
    title: 'Lược sử loài người (Sapiens)',
    author: 'Yuval Noah Harari',
    category: 'Khoa học',
    year: 2014,
    quantity: 6,
    borrowed: 2,
  },
];

/* eslint-disable no-undef */
const mockStorage = {};

const mockAsyncStorage = {
  setItem: jest.fn(async (key, value) => {
    mockStorage[key] = value;
  }),
  getItem: jest.fn(async key => {
    return mockStorage[key] || null;
  }),
  removeItem: jest.fn(async key => {
    delete mockStorage[key];
  }),
  clear: jest.fn(async () => {
    Object.keys(mockStorage).forEach(k => delete mockStorage[k]);
  }),
  getAllKeys: jest.fn(async () => {
    return Object.keys(mockStorage);
  }),
};

jest.mock('@react-native-async-storage/async-storage', () => ({
  __esModule: true,
  default: mockAsyncStorage,
  ...mockAsyncStorage,
}));

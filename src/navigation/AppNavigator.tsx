import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { BookListScreen } from '../screens/BookListScreen';
import { BookDetailScreen } from '../screens/BookDetailScreen';
import { BookFormScreen } from '../screens/BookFormScreen';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="BookList"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.primaryDark,
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 18,
          },
          headerShadowVisible: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}>
        <Stack.Screen
          name="BookList"
          component={BookListScreen}
          options={{
            headerShown: false, // Sử dụng custom header banner tích hợp thống kê
          }}
        />
        <Stack.Screen
          name="BookDetail"
          component={BookDetailScreen}
          options={{
            title: 'Chi Tiết Sách',
            headerBackTitle: 'Quay lại',
          }}
        />
        <Stack.Screen
          name="BookForm"
          component={BookFormScreen}
          options={({ route }) => ({
            title: route.params?.bookId ? 'Sửa Thông Tin Sách' : 'Thêm Sách Mới',
            headerBackTitle: 'Huỷ',
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

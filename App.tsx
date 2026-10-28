import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BookProvider } from './src/context/BookContext';
import { AppNavigator } from './src/navigation/AppNavigator';

function App(): React.JSX.Element {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <BookProvider>
        <AppNavigator />
      </BookProvider>
    </SafeAreaProvider>
  );
}

export default App;

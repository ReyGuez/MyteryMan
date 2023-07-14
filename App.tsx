import React, {useEffect} from 'react';
import Container from './src/Screens/Container';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {StatusBar} from 'react-native';
import {palette} from './assets/color';
import SystemNavigationBar from 'react-native-system-navigation-bar';

const App = () => {
  useEffect(() => {
    SystemNavigationBar.fullScreen(true);
    SystemNavigationBar.navigationHide();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar hidden={true} backgroundColor={palette.white_1} />
      <Container />
    </SafeAreaProvider>
  );
};

export default App;

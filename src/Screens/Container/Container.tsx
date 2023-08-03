import {
  Animated,
  AppState,
  Image,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import Home from '../Home';
import moment from 'moment';
import Options from '../Options';
import RNFS from 'react-native-fs';
import {getToken} from '../../Network';
import {RNFFmpeg} from 'react-native-ffmpeg';
import ScreenMessage from '../ScreenMessage';
import {useTranslation} from 'react-i18next';
import {palette} from '../../../assets/color';
import {MtyMan} from '../../../assets/images';
import VideoRecording from '../VideoRecording';
import {Camera} from 'react-native-vision-camera';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import React, {useEffect, useRef, useState} from 'react';
import {VideoInfo} from '../VideoRecording/VideoRecording';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useOrientation} from '../../Templates/Orientation.tsx';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import SystemNavigationBar from 'react-native-system-navigation-bar';
import LanguageScreen from '../LanguageScreen';

const Container = () => {
  const {t} = useTranslation();
  const appState = useRef(AppState.currentState);
  const ssMode = useOrientation();
  const canceled = useRef(false);
  const [, setOrientation] = useState(ssMode);
  const [currentPath, setCurrentPath] = useState('');
  const [currentScreen, setCurrentScreen] = useState(0);
  const startValue = useRef(new Animated.Value(1)).current;
  const translateY = startValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 30],
  });
  const opacity = startValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  const [finalVideo, setFinalVideo] = useState<VideoInfo>({
    name: '',
    type: '',
    uri: '',
  });

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        if (Platform.OS === 'android') {
          SystemNavigationBar.fullScreen(true);
          SystemNavigationBar.navigationHide();
        }
      }
      appState.current = nextAppState;
    });
    return () => {
      subscription.remove();
    };
  }, []);

  // LIFECYCLE TO REFRESH TOKEN ACCESS FETCH
  useEffect(() => {
    const onGetToken = async () => {
      try {
        await getToken();
      } catch (error) {
        console.log(error);
      }
    };
    onGetToken();
    onAnimation(0, 0);
  }, []);

  // LIFECYCLE TO SCREEN ORIENTATION LISTENER
  useEffect(() => {
    lor(setOrientation);
    return () => rol();
  }, []);

  // LIFECYCLE TO GET PERMISSIONS BY PLATFORM
  useEffect(() => {
    if (Platform.OS === 'android') {
      SystemNavigationBar.fullScreen(true);
      SystemNavigationBar.navigationHide();
      requestPermission();
    } else {
      cameraPermissions();
    }
  }, []);

  // FUNCTION TO ASK PERMISSION (ONLY ANDROID)
  const requestPermission = async () => {
    try {
      const permissions = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
      ]);
      if (
        permissions['android.permission.CAMERA'] === 'granted' &&
        permissions['android.permission.READ_EXTERNAL_STORAGE'] === 'granted' &&
        permissions['android.permission.RECORD_AUDIO'] === 'granted' &&
        permissions['android.permission.WRITE_EXTERNAL_STORAGE'] === 'granted'
      ) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      return false;
    }
  };

  const onAnimation = (toValue: number, screen: number) => {
    Animated.timing(startValue, {
      toValue,
      duration: 600,
      useNativeDriver: false,
    }).start(({finished}) => {
      setCurrentScreen(screen);
      if (finished && toValue === 1) {
        Animated.timing(startValue, {
          toValue: toValue === 1 ? 0 : 1,
          duration: 600,
          useNativeDriver: false,
        }).start();
      }
    });
  };

  // FUNCTION TO ASK PERMISSION (ONLY IOS)
  const cameraPermissions = async () => {
    await Camera.requestCameraPermission();
    await Camera.requestMicrophonePermission();
    await CameraRoll.getPhotos({first: 1});
  };

  useEffect(() => {
    if (canceled.current) {
      setFinalVideo({
        name: '',
        type: '',
        uri: '',
      });
    }
  }, [currentPath]);

  /* FUNCTION TO PROCESS THE VIDEO */
  async function videoProcess(videoPath: string) {
    try {
      const outputPath =
        RNFS.TemporaryDirectoryPath + `/${moment().format('HHmmss')}.mp4`;
      const command = `-i ${videoPath} -vf "scale=trunc(iw/4)*2:trunc(ih/4)*2" -c:v libx265 -crf 28 -preset ultrafast ${outputPath}`;
      await RNFFmpeg.execute(command);
      if (canceled.current) {
        return;
      }
      const video = {
        name: outputPath?.replace(/^.*[\\\/]/, ''),
        type: 'video/mp4',
        uri: 'file://' + outputPath,
      };
      setFinalVideo(video);
      // await CameraRoll.save(outputPath, {type: 'video', album: 'Bewor'});
      return video;
    } catch (error) {
      console.log('Error al procesar', error);
      return;
    }
  }

  // FUNCTION TO RETURN THE CURRENT SCREEN
  const returnScreen = () => {
    switch (currentScreen) {
      case 1:
        return (
          <Options
            onSave={() => {
              onAnimation(1, 4);
            }}
            onCancelAndRepeat={() => {
              canceled.current = true;
              onAnimation(1, 5);
              setCurrentPath('');
              RNFFmpeg.cancel();
            }}
            onVideoPlay={() => {
              onAnimation(1, 2);
            }}
          />
        );
      case 2:
        return (
          <VideoPlayer
            path={currentPath}
            onBack={() => {
              onAnimation(1, 1);
            }}
          />
        );
      case 3:
        return (
          <VideoRecording
            onGetPathVideo={path => {
              setCurrentPath(path);
              const video = {
                name: path?.replace(/^.*[\\\/]/, ''),
                type: 'video/mp4',
                uri: path,
              };
              videoProcess(video.uri);
              // setFinalVideo(video);
            }}
            onBack={() => onAnimation(1, 1)}
          />
        );
      case 4:
        return (
          <ScreenMessage
            pathFinal={finalVideo}
            onBack={() => {
              onAnimation(1, 0);
              setCurrentPath('');
              setFinalVideo({
                name: '',
                type: '',
                uri: '',
              });
            }}
          />
        );
      case 5:
        return (
          <Home
            onRecord={() => {
              canceled.current = false;
              onAnimation(1, 3);
            }}
          />
        );
      default:
        return (
          <LanguageScreen
            onChooseLanguage={() => {
              onAnimation(1, 5);
            }}
          />
        );
    }
  };

  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.root}>
      <View style={[styles.root, {backgroundColor: palette.white_1}]}>
        <View
          style={[
            styles.headerContainer,
            {
              marginHorizontal: ssMode === 'portrait' ? hp('2%') : wp('2%'),
            },
          ]}>
          <View style={styles.iconContainer}>
            <Image source={MtyMan} resizeMode="contain" style={styles.icon} />
          </View>
          <View style={styles.titleContainer}>
            <Text
              style={[
                styles.title,
                {
                  fontSize: ssMode === 'portrait' ? hp('3%') : wp('3%'),
                },
              ]}>
              {t('The Mistery Man Exhibition')}
            </Text>
          </View>
        </View>
        <View
          style={[
            styles.mainContainer,
            {
              marginTop: ssMode === 'portrait' ? hp('1%') : wp('1%'),
              marginHorizontal: ssMode === 'portrait' ? hp('2%') : wp('2%'),
              marginBottom: ssMode === 'portrait' ? hp('3%') : wp('2.5%'),
            },
          ]}>
          <Animated.View
            style={[
              styles.root,
              {
                opacity,
                transform: [{translateY}],
                marginTop: ssMode === 'portrait' ? hp('4%') : wp('3%'),
                marginHorizontal: ssMode === 'portrait' ? hp('3%') : wp('3%'),
              },
            ]}>
            {returnScreen()}
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Container;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  iconContainer: {
    flex: 0.4,
  },
  icon: {
    flex: 1,
    height: undefined,
    width: undefined,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  title: {
    fontFamily: 'ArchivoBlack-Regular',
    color: palette.black_1,
  },
  headerContainer: {
    height: '10%',
    flexDirection: 'row',
  },
  mainContainer: {
    flex: 1,
    backgroundColor: palette.gray_1,
  },
});

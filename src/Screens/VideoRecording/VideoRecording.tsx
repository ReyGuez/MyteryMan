import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
  listenOrientationChange as lor,
  removeOrientationListener as rol,
} from 'react-native-responsive-screen';
import moment from 'moment';
import RNFS from 'react-native-fs';
import useClock from '../../Templates/Clock';
import {RNFFmpeg} from 'react-native-ffmpeg';
import {useTranslation} from 'react-i18next';
import {palette} from '../../../assets/color';
import DeviceInfo from 'react-native-device-info';
import React, {useEffect, useRef, useState} from 'react';
import {useOrientation} from '../../Templates/Orientation.tsx';
import {CameraRoll} from '@react-native-camera-roll/camera-roll';
import {Camera, useCameraDevices} from 'react-native-vision-camera';
import {
  Animated,
  Modal,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {sendLogs} from '../../Network';

export interface VideoInfo {
  name: string;
  type: string;
  uri: string;
}

interface VideoRecordingProps {
  onBack: () => void;
  onGetPathVideo: (path: string) => void;
  onDeny: () => void;
}

const VideoRecording: React.FC<VideoRecordingProps> = ({
  onBack,
  onGetPathVideo,
  onDeny,
}) => {
  const {t} = useTranslation();
  const ssMode = useOrientation();
  const camera = useRef<Camera>(null);
  const [, setOrientation] = useState(ssMode);
  const devices = useCameraDevices();
  const [showModal, setShowModal] = useState(false);
  const startValue = useRef(new Animated.Value(1)).current;
  const opacity = startValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0.2, 1],
  });
  const device = devices.front;
  const [recordTime, startRecordTime, pauseRecordTime, resetRecordTime] =
    useClock({
      from: 0,
      to: 30,
    });

  /* LIFECYCLE TO SCREEN ORIENTATION LISTENER */
  useEffect(() => {
    lor(setOrientation);
    return () => rol();
  }, []);

  /* LIFECYCLE RECORD COUNTER 30s */
  useEffect(() => {
    if (recordTime === 30) {
      onStopRecording();
      resetRecordTime();
      onBack();
    }
  }, [recordTime]);

  /* START RECORDING FUNCTION */
  const onStartRecording = () => {
    camera.current?.startRecording({
      flash: 'off',
      fileType: 'mp4',
      onRecordingFinished: video => {
        console.log('video', video);
        onGetPathVideo(video.path);
        // onSave(video.path);
      },
      onRecordingError: () => {},
    });
    startRecordTime();
    animatedRec();
  };

  /* STOP RECORDING EVENT */
  const onStopRecording = async () => {
    await camera.current?.stopRecording();
  };

  /* SAVE THE CURRENT VIDEO TO GALLERY */
  const onSave = async (path: string) => {
    await CameraRoll.save(path, {type: 'video', album: 'Bewor'});
  };

  /* FUNCTION TO PROCESS THE VIDEO */
  const videoProcess = (videoPath: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const outputPath =
          RNFS.TemporaryDirectoryPath + `/${moment().format('HHmmss')}.mp4`;
        // const command = `-i ${videoPath} -vcodec libx265 -crf 28 -preset ultrafast ${outputPath}`;
        const command = `-i ${videoPath} -vf "scale=trunc(iw/4)*2:trunc(ih/4)*2" -c:v libx265 -crf 28 -preset ultrafast ${outputPath}`;
        await RNFFmpeg.execute(command);
        const video = {
          name: outputPath?.replace(/^.*[\\\/]/, ''),
          type: 'video/mp4',
          uri: 'file://' + outputPath,
        };
        // onVideoProcess(video);
        await CameraRoll.save(outputPath, {type: 'video', album: 'Bewor'});
        resolve(true);
      } catch (error) {
        console.log('Error al procesar');
        reject();
      }
    });
  };

  /* FORMAT MM SS */
  const pad = (num: number) => {
    return ('0' + num).slice(-2);
  };

  /* CREATE MM:SS STRING */
  const hhmmss = (secs: number) => {
    let minutes = Math.floor(secs / 60);
    secs = secs % 60;
    // let hours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    return `${pad(minutes)}:${pad(secs)}`;
  };

  /* START RECORDING DOT ANIMATION */
  const animatedRec = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(startValue, {
          toValue: 0,
          duration: 600,
          useNativeDriver: false,
        }),
        Animated.timing(startValue, {
          toValue: 1,
          duration: 600,
          useNativeDriver: false,
        }),
      ]),
      {
        iterations: 1000,
      },
    ).start();
  };

  /* SEND LOGS TO ENDPOINT */
  const onSendLogs = async (type: string, message: string) => {
    try {
      await sendLogs(type, message);
    } catch (error) {}
  };

  return (
    <View style={styles.root}>
      <View
        style={[
          styles.root,
          {
            backgroundColor: palette.gray_2,
            // marginBottom: ssMode === 'portrait' ? hp('4%') : wp('3%'),
          },
        ]}>
        <View style={styles.root}>
          {device && (
            <Camera
              ref={camera}
              video={true}
              audio={true}
              photo={true}
              isActive={true}
              device={device}
              focusable
              style={styles.root}
              onInitialized={() => {
                setShowModal(true);
                onSendLogs('Camera Ready', 'Camera ready to record');
              }}
              onError={error => {
                onSendLogs('Camera Error', JSON.stringify(error));
              }}
            />
          )}
          <View style={[styles.recBox]}>
            <View style={styles.dotContainer}>
              <Animated.View style={[styles.dot, {opacity}]} />
            </View>
            <View style={styles.recLabelContainer}>
              <Text style={styles.recLabel}>
                {`${hhmmss(recordTime)} / 00:30`}
              </Text>
            </View>
          </View>
        </View>
        <View
          style={[
            styles.center,
            {
              height: ssMode === 'portrait' ? hp('13%') : wp('10%'),
              backgroundColor: palette.gray_1,
            },
          ]}>
          <TouchableOpacity
            onPress={() => {
              onStopRecording();
              resetRecordTime();
              onBack();
            }}
            style={{
              backgroundColor: palette.black_2,
              paddingHorizontal: ssMode === 'portrait' ? hp('5%') : wp('5%'),
              paddingVertical: ssMode === 'portrait' ? hp('2%') : wp('1.5%'),
            }}>
            <Text
              style={[
                styles.btnLabel,
                {
                  fontSize: ssMode === 'portrait' ? hp('1.8%') : wp('1.8%'),
                },
              ]}>
              {t('end recording')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Modal
        supportedOrientations={[
          'landscape',
          'portrait',
          'landscape-left',
          'landscape-right',
          'portrait-upside-down',
        ]}
        transparent
        visible={showModal}
        style={styles.root}>
        <View style={styles.modalContainer}>
          <SafeAreaView>
            <View style={styles.boxContainer}>
              <View>
                <Text
                  style={{
                    ...styles.titleModal,
                    fontSize: ssMode === 'portrait' ? hp('3%') : wp('3%'),
                  }}>
                  {t('Advertisement')}
                </Text>
                <Text
                  style={{
                    ...styles.label,
                    marginTop: ssMode === 'portrait' ? '5%' : '2%',
                    fontSize: ssMode === 'portrait' ? hp('2%') : wp('2%'),
                  }}>
                  {t(
                    'I am over 18 years of age and I give my express consent so that the testimonial video that is going to be recorded can be used, disseminated and shared on the social networks and website of The Mystery Man.',
                  )}
                </Text>
                <View
                  style={{
                    marginTop: '5%',
                    flexDirection: 'row',
                    justifyContent: DeviceInfo.isTablet()
                      ? 'flex-end'
                      : ssMode === 'portrait'
                      ? 'space-between'
                      : 'flex-end',
                  }}>
                  <TouchableOpacity
                    onPress={() => {
                      setShowModal(false);
                      onDeny();
                    }}
                    style={{
                      backgroundColor: palette.black_2,
                      paddingHorizontal:
                        ssMode === 'portrait' ? hp('5%') : wp('5%'),
                      paddingVertical:
                        ssMode === 'portrait' ? hp('2%') : wp('1.5%'),
                    }}>
                    <Text
                      style={[
                        styles.btnLabel,
                        {
                          fontSize:
                            ssMode === 'portrait' ? hp('1.8%') : wp('1.8%'),
                        },
                      ]}>
                      {t('Deny')}
                    </Text>
                  </TouchableOpacity>
                  <View style={{width: 10}} />
                  <TouchableOpacity
                    onPress={() => {
                      setShowModal(false);
                      onStartRecording();
                    }}
                    style={{
                      backgroundColor: palette.black_2,
                      paddingHorizontal:
                        ssMode === 'portrait' ? hp('5%') : wp('5%'),
                      paddingVertical:
                        ssMode === 'portrait' ? hp('2%') : wp('1.5%'),
                    }}>
                    <Text
                      style={[
                        styles.btnLabel,
                        {
                          fontSize:
                            ssMode === 'portrait' ? hp('1.8%') : wp('1.8%'),
                        },
                      ]}>
                      {t('Accept')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
};

export default VideoRecording;

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  recBox: {
    position: 'absolute',
    top: 5,
    right: 5,
    height: 35,
    width: 120,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#d52c37',
    backgroundColor: '#fcdbdb',
    flexDirection: 'row',
  },
  dotContainer: {
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  dot: {
    height: 20,
    width: 20,
    borderRadius: 100,
    backgroundColor: '#d52c37',
  },
  recLabelContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  recLabel: {
    fontFamily: 'Montserrat-Regular',
    fontSize: 10,
    color: '#d52c37',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnLabel: {
    color: palette.white_1,
    fontFamily: 'Montserrat-Bold',
    textTransform: 'uppercase',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  boxContainer: {
    borderRadius: 10,
    backgroundColor: '#FFFF',
    marginHorizontal: '10%',
    paddingHorizontal: 24,
    paddingVertical: 24,
  },
  titleModal: {
    lineHeight: 34,
    textAlign: 'center',
    fontFamily: 'Montserrat-SemiBold',
  },
  label: {
    textAlign: 'justify',
    fontFamily: 'Montserrat-Regular',
  },
});
